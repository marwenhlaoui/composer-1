import * as magnetLinkProxy from "../../open-external-file-proxy";

const localFiles: string [] = [];
let registered = false;

module.exports = {
    register: (callback) => {
        magnetLinkProxy.onLocalFileOpen((url) => {
            callback(null, url);
        });

        if (localFiles.length) {
            localFiles.forEach((l) => {
                callback(null, l);
            });

            localFiles.length = 0;
        }
    },

    setLocalFile: (paths: string) => {
        if (!registered) {
            localFiles.push(paths);
        }

        return paths;
    },
};
