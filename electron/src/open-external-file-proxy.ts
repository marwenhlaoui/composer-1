const registryMagnetLink: Function[] = [];
const registryLocalFile: Function[] = [];

export function onMagnetLinkOpen(callback) {
    registryMagnetLink.push(callback);
}

export function onLocalFileOpen(callback) {
    registryLocalFile.push(callback);
}

export function passMagnetLink(url) {
    registryMagnetLink.forEach(callback => {
        if (typeof callback === "function") {
            callback(url);
        }
    });
}

export function passLocalFile(path) {
    registryLocalFile.forEach(callback => {
        if (typeof callback === "function") {
            callback(path);
        }
    });
}
