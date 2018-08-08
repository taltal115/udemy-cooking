"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EnvType;
(function (EnvType) {
    EnvType[EnvType["Local"] = 0] = "Local";
    EnvType[EnvType["Google"] = 1] = "Google";
})(EnvType || (EnvType = {}));
class LocalFileUploader {
    constructor(Type) {
        this.env = Type;
    }
    upload(req, res) {
        return {};
    }
}
exports.LocalFileUploader = LocalFileUploader;
