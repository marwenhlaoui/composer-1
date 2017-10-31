import * as magnetLinkProxy from "../magnet-link-proxy";

let magnetLinkData;
let localPath;

module.exports = {
    register: (callback) => {
        magnetLinkProxy.on((url) => {
            callback(null, url);
        });

        if (magnetLinkData) {
            callback(null, magnetLinkData);
        }


        if (localPath) {
            callback(null, localPath);
        }
    },

    setMagnetLinkData: (encoded: string) => {
        return new Promise((resolve, reject) => {
            const decoded = (new Buffer(encoded, "base64")).toString();

            try {
                magnetLinkData = JSON.parse(decoded);
                resolve(magnetLinkData);
            } catch (e) {
                magnetLinkData = null;
                reject();
            }
        });
    },

    setLocalFile: (path: string) => {
        localPath = path;
        return localPath;
    }
};
