import * as magnetLinkProxy from "../../open-external-file-proxy";

let deepLinkingURL;

module.exports = {
    register: (callback) => {
        magnetLinkProxy.onMagnetLinkOpen( (url) => {
            callback(null, url);
        });

        if (deepLinkingURL) {
            callback(null, deepLinkingURL);
        }
    },

    setMagnetLinkData: (encoded: string) => {
        const decoded = (new Buffer(encoded, "base64")).toString();

        try {
            deepLinkingURL = JSON.parse(decoded);
        } catch (e) {
            deepLinkingURL = null;
        }

        return deepLinkingURL;
    }
};
