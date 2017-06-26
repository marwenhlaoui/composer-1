import {Injectable} from "@angular/core";
import * as YAML from "js-yaml";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {RecentAppTab} from "../../../../electron/src/storage/types/recent-app-tab";
import {LocalRepositoryService} from "../../repository/local-repository.service";
import {PlatformRepositoryService} from "../../repository/platform-repository.service";
import {UserPreferencesService} from "../../services/storage/user-preferences.service";
import {DataGatewayService} from "../data-gateway/data-gateway.service";
import {AppTabData} from "./app-tab-data";
import {TabData} from "./tab-data.interface";


@Injectable()
export class WorkboxService {

    public tabs = new BehaviorSubject<TabData<any>[]>([]);

    public activeTab = new BehaviorSubject(undefined);

    public tabCreation = new Subject<TabData<any>>();

    constructor(private dataGateway: DataGatewayService,
                private localRepository: LocalRepositoryService,
                private platformRepository: PlatformRepositoryService,
                private preferences: UserPreferencesService) {

        this.tabs.skip(2).subscribe(tabs => {
            const t = tabs.map(tab => {
                const {id, label, type} = tab;
                return {id, label, type};
            });

            this.preferences.put("openTabs", t);
        });

        this.activeTab.filter(t => t !== undefined).subscribe(tab => {
            this.preferences.put("activeTab", tab.id);
        });
    }

    public openTab(tab, persistToRecentApps: boolean = true) {

        const {tabs} = this.extractValues();

        // When opening an app, we use id with revision number because we can have cases when we can open the same app
        // different revisions (when we publish a local file with existing id, new tab is open ...)
        const foundTab = tabs.find(existingTab => existingTab.id === tab.id);

        if (foundTab) {
            this.activateTab(foundTab);
            return;
        }

        this.tabs.next(tabs.concat(tab));
        this.tabCreation.next(tab);
        this.activateTab(tab);

        if (!persistToRecentApps) {
            return;
        }

        const isLocal = tab.id.startsWith("/");



        const recentTabData = {
            id: tab.id,
            label: tab.label,
            type: tab.type,
            isWritable: tab.isWritable,
            language: tab.language,
            description: tab.id,
            time: Date.now()
        } as RecentAppTab;

        if (tab.id.startsWith("/")) {
            this.localRepository.pushRecentApp(recentTabData);
        } else {
            this.platformRepository.pushRecentApp(recentTabData);
        }
    }

    openSettingsTab() {
        this.openTab({
            id: "?settings",
            label: "Settings",
            type: "Settings"
        }, false);
    }

    public closeTab(tab?) {
        if (!tab) {
            tab = this.extractValues().activeTab;
        }

        if (tab.data && tab.data.id && !tab.data.id.startsWith("?")) {
            console.log("Patching swap for", tab.data.id);
            this.dataGateway.updateSwap(tab.data.id, null);
        }

        const currentlyOpenTabs = this.tabs.getValue();
        const tabToRemove       = currentlyOpenTabs.find(t => t.id === tab.id);
        const newTabList        = currentlyOpenTabs.filter(t => t !== tabToRemove);


        this.tabs.next(newTabList);
        this.ensureActiveTab();
    }

    public closeOtherTabs(tab) {
        this.tabs.next([tab]);
        this.activateTab(tab);
    }

    public closeAllTabs() {
        this.tabs.next([]);
    }

    public activateNext() {
        const {tabs, activeTab} = this.extractValues();
        const index             = tabs.indexOf(activeTab);
        const newActiveTab      = index === (tabs.length - 1) ? tabs[0] : tabs[index + 1];

        this.activateTab(newActiveTab);
    }

    public activatePrevious() {
        const {tabs, activeTab} = this.extractValues();
        const index             = tabs.indexOf(activeTab);
        const newActiveTab      = index ? tabs[index - 1] : tabs[tabs.length - 1];

        this.activateTab(newActiveTab);
    }

    private ensureActiveTab() {
        const {tabs, activeTab} = this.extractValues();
        if (!tabs.find(t => t === activeTab)) {
            this.activateTab(tabs[tabs.length - 1]);
        }
    }

    private extractValues() {
        return {
            activeTab: this.activeTab.getValue(),
            tabs: this.tabs.getValue()
        };
    }

    private activateTab(tab) {
        if (this.activeTab.getValue() === tab) {
            return;
        }

        this.activeTab.next(tab);
    }

    /**
     * @deprecated Do this same thing with {@link getOrCreateAppTab}
     * @param fileID
     */
    public getOrCreateFileTabAndOpenIt(fileID) {
        this.getOrCreateFileTab(fileID).take(1).subscribe((tab) => this.openTab(tab));
    }

    getOrCreateAppTab<T>(data: {
        id: string;
        data?: any;
        type: string;
        label?: string;
        isWritable?: boolean;
        language?: string;

    }): TabData<T> {
        const currentTab = this.tabs.getValue().find(existingTab => existingTab.id === data.id);

        if (currentTab) {
            return currentTab;
        }


        const dataSource = DataGatewayService.getFileSource(data.id);

        const id         = data.id;
        const label      = data.id.split("/").pop();
        const isWritable = data.isWritable === undefined ? dataSource !== "public" : data.isWritable;

        const fileContent = Observable.empty().concat(this.dataGateway.fetchFileContent(id));
        const resolve     = (fcontent: string) => this.dataGateway.resolveContent(fcontent, id);

        const tab = Object.assign({
            label,
            isWritable,
            data: {
                id,
                isWritable,
                dataSource,
                language: data.language || "yaml",
                fileContent,
                resolve
            }
        }, data);

        if (id.endsWith(".json")) {
            tab.data.language = "json";
        }

        return tab;

    }

    /**
     * @deprecated Use {@link getOrCreateAppTab} for synchronous tab opening version
     */
    public getOrCreateFileTab(fileID): Observable<TabData<AppTabData>> {

        const currentTab = this.tabs.getValue().find(tab => tab.id === fileID);

        if (currentTab) {
            return Observable.of(currentTab);
        }


        return this.dataGateway.fetchFileContent(fileID).map(content => {

            const dataSource = DataGatewayService.getFileSource(fileID);

            const tab = {
                id: fileID,
                label: fileID,
                type: "Code",
                isWritable: dataSource !== "public",
                data: {
                    id: fileID,
                    isWritable: dataSource !== "public",
                    dataSource,
                    language: "yaml",
                    parsedContent: {},
                    fileContent: content,
                    resolve: (fcontent: string) => this.dataGateway.resolveContent(fcontent, fileID)
                }
            };

            if (fileID.endsWith(".json")) {
                tab.data.language = "json";
            }

            try {

                const parsed = YAML.safeLoad(content, {json: true} as any);

                tab.data.parsedContent = parsed;

                if (dataSource === "public") {
                    tab.id = parsed.id;
                }

                if (dataSource !== "local") {
                    tab.data.fileContent = JSON.stringify(parsed, null, 4);
                }

                tab.label = parsed.label || fileID;

                if (["CommandLineTool", "Workflow"].indexOf(parsed.class) !== -1) {
                    tab.type = parsed.class;
                }
            } catch (ex) {
                console.warn("Could not parse app", ex);
            }

            if (dataSource === "local") {
                tab.label = fileID.split("/").pop();
            }

            return tab as any;

        });
    }
}


