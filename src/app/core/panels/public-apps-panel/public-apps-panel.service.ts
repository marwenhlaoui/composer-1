import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {App} from "../../../../../electron/src/sbg-api-client/interfaces/app";
import {PlatformRepositoryService} from "../../../repository/platform-repository.service";
import {TreeNode} from "../../../ui/tree-view/tree-node";

@Injectable()
export class PublicAppsPanelService {

    private apps: Observable<App[]>;

    constructor(private platformRepository: PlatformRepositoryService) {

        this.apps = platformRepository.getPublicApps();
    }

    getAppsGroupedByToolkit(): Observable<TreeNode<any>[]> {
        return this.apps.map(apps => {

            const toolkits = apps.reduce((acc, app) => {
                const tk        = (app.raw && app.raw["sbg:toolkit"]) || "";
                const tkVersion = (app.raw && app.raw["sbg:toolkitVersion"]) || "";

                const fullToolkitName = `${tk} ${tkVersion}`.trim();

                if (!acc[fullToolkitName]) {
                    acc[fullToolkitName] = [];
                }

                acc[fullToolkitName].push(app);

                return acc;
            }, {});

            const folderNodes  = [];
            const freeAppNodes = [];

            Object.keys(toolkits)
                .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
                .forEach(toolkit => {

                    const appNodes = toolkits[toolkit]
                        .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                        .map(app => this.makeAppTreeNode(app));

                    if (toolkit === "") {
                        freeAppNodes.push(...appNodes);
                        return;
                    }

                    folderNodes.push({
                        id: `__toolkit/${toolkit}`,
                        type: "toolkit",
                        label: toolkit,
                        isExpanded: false,
                        isExpandable: true,
                        icon: "fa-folder",
                        children: Observable.of(appNodes)
                    });
                });

            return [...folderNodes, ...freeAppNodes];
        });
    }

    getAppsGroupedByCategory(): Observable<TreeNode<any>[]> {
        return this.apps.map(apps => {


            const categories = apps.reduce((acc, app) => {
                const appCategories = (app.raw && app.raw["sbg:categories"]) || ["__uncategorized__"];

                appCategories.forEach(category => {
                    if (!acc[category]) {
                        acc[category] = [];
                    }

                    acc[category].push(app);
                });

                return acc;

            }, {});

            const folderNodes           = [];
            const uncategorizedAppNodes = [];

            Object.keys(categories)
                .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
                .forEach(category => {

                    const appNodes = categories[category]
                        .map(app => this.makeAppTreeNode(app))
                        .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));

                    if (category === "__uncategorized__") {
                        uncategorizedAppNodes.push(...appNodes);
                        return;
                    }
                    folderNodes.push({
                        id: `__category/${category}`,
                        type: "category",
                        label: category,
                        isExpanded: false,
                        isExpandable: true,
                        children: Observable.of(appNodes),
                        icon: "fa-folder"
                    });
                });

            return [...folderNodes, ...uncategorizedAppNodes];
        });
    }

    private makeAppTreeNode(app: App): TreeNode<App> {

        let appType    = null;
        let icon       = "fa-question";
        let imageClass = "";

        if (app.raw && app.raw.class) {
            appType = app.raw.class;
        }

        if (appType === "CommandLineTool") {
            icon       = "fa-terminal";
            imageClass = "icon-command-line-tool";
        }

        if (appType === "Workflow") {
            icon       = "fa-share-alt";
            imageClass = "icon-workflow";
        }

        return {
            id: app.id,
            data: app,
            type: "app",
            label: app.name,
            dragEnabled: true,
            dragLabel: app.name,
            dragDropZones: ["zone1"],
            dragTransferData: app.id,
            icon: icon,
            dragImageClass: imageClass,
        }
    }


}