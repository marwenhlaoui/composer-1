import {Observable, BehaviorSubject} from "rxjs";
import {Component} from "@angular/core";
import {EventHubService} from "../../services/event-hub/event-hub.service";
import {PlatformAPI} from "../../services/api/platforms/platform-api.service";
import {PlatformAppEntry} from "../../services/api/platforms/platform-api.types";
import {SettingsService} from "../../services/settings/settings.service";
import {OpenTabAction} from "../../action-events/index";
import {OpenTabAction} from "../../action-events/index";
import {PublicAppService} from "../../platform-providers/public-apps/public-app.service";
import {MenuItem} from "../../core/ui/menu/menu-item"
@Component({
    selector: "ct-sb-public-apps-panel",
    host: {class: "block"},
    template: `
        <ct-panel-toolbar>
            <span class="tc-name">Public Apps</span>
        </ct-panel-toolbar>
        
        <div *ngIf="isLoading">
             <div class="text-xs-center"><small>Fetching Public Apps&hellip;</small></div>
            <progress class="progress progress-striped progress-animated" value="100" max="100"></progress>
        </div>
        <ct-tree-view [nodes]="nodes" [preferenceKey]="'public-apps'"></ct-tree-view>
    `
})
export class SBPublicAppsPanelComponent {

    private nodes = [];

    private isLoading = false;

    constructor(private platform: PlatformAPI,
                private eventHub: EventHubService,
                private settings: SettingsService,
                private contextMenu: PublicAppService) {
    }

    ngOnInit() {

        const sortingMethod = (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase());

        this.settings.platformConfiguration
            .do(_ => this.isLoading = true)
            .flatMap(_ => this.platform.getPublicApps().map(apps => {
                const categorized = apps.map(app => {
                    const content = Observable.of(1).switchMap(_ => this.platform.getAppCWL(app))
                        .switchMap(cwl => new BehaviorSubject(cwl)).share();
                    return {
                        name: app.label,
                        icon: app.class || "file",
                        isExpandable: false,
                        toolkit: app["sbg:toolkit"],
                        content,
                        contextMenu: this.contextMenu.getContextMenu(app.label, content),
                        openHandler: _ => {
                            this.eventHub.publish(new OpenTabAction({
                                id: app.id,
                                title: Observable.of(app.label),
                                contentType: Observable.of(app.class),
                                contentData: {
                                    data: app,
                                    isWritable: false,
                                    content,
                                    language: Observable.of("json")
                                }
                            }));
                        }
                    };

                }).reduce((acc, app: PlatformAppEntry) => {
                    //noinspection TypeScriptUnresolvedVariable
                    acc[app.toolkit] = [].concat.apply(acc[app.toolkit] || [], [app]);
                    return acc;
                }, {});

                const noToolkits = (categorized["undefined"] || []).sort(sortingMethod);
                delete categorized["undefined"];


                return Object.keys(categorized).map(key => ({
                    id: key,
                    name: key,
                    icon: "angle",
                    isExpandable: true,
                    childrenProvider: _ => Observable.of(categorized[key])
                })).sort(sortingMethod).concat(noToolkits.sort(sortingMethod));

            })).subscribe(categories => {
            this.isLoading = false;
            this.nodes = categories;
        }, err => {
            this.isLoading = false;
        });
    }
}
