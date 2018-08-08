"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LocalFileUploader_1 = require("./LocalFileUploader");
const GoogleFileUploader_1 = require("./GoogleFileUploader");
var EnvType;
(function (EnvType) {
    EnvType[EnvType["Local"] = 0] = "Local";
    EnvType[EnvType["Google"] = 1] = "Google";
})(EnvType || (EnvType = {}));
class FileUploaderFactory {
    static getFileUploader(env) {
        switch (env) {
            case EnvType.Google:
                return new GoogleFileUploader_1.GoogleFileUploader(EnvType.Google);
            case EnvType.Local:
                return new LocalFileUploader_1.LocalFileUploader(EnvType.Local);
        }
    }
}
exports.FileUploaderFactory = FileUploaderFactory;
