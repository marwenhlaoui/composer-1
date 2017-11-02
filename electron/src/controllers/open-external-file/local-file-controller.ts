import * as magnetLinkProxy from "../../open-external-file-proxy";

let localFiles: string [] = [];

module.exports = {
    register: (callback) => {
        magnetLinkProxy.onLocalFileOpen( (url) => {
            callback(null, url);
        });

        if (localFiles) {
            callback(null, localFiles);
        }
    },

    setLocalFile: (paths: string) => {

        localFiles.push(paths);

        return paths;
    }
};
