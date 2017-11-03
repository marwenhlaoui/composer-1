import * as magnetLinkProxy from "../../open-external-file-proxy";

const filePaths: string [] = [];
let callbackRegistered = false;

module.exports = {
    register: (callback) => {
        magnetLinkProxy.onFilePathOpen((url) => {
            callback(null, url);
        });

        if (filePaths.length) {
            filePaths.forEach((l) => {
                callback(null, l);
            });

            filePaths.length = 0;
        }

        callbackRegistered = true;
    },

    setLocalFilePath: (path: string) => {
        if (!callbackRegistered) {
            filePaths.push(path);
        }

        return path;
    },
};
