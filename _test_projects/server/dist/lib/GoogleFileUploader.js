"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asset_model_1 = require("../models/documents/asset-model");
const uuidv4 = require("uuid/v4");
const config = require('./../utils/config');
var EnvType;
(function (EnvType) {
    EnvType[EnvType["Local"] = 0] = "Local";
    EnvType[EnvType["Google"] = 1] = "Google";
})(EnvType || (EnvType = {}));
const googleAuth = require("google-auto-auth");
class GoogleFileUploader {
    constructor(Type) {
        this.env = Type;
    }
    upload(req, res) {
        return {};
    }
    createNativeSessionUri(req, res) {
        let authConfig = {
            keyFilename: config.google.credentials.keyFilename,
            projectId: config.google.credentials.projectId,
            scopes: ['https://www.googleapis.com/auth/devstorage.full_control']
        };
        // Create a client
        let auth = googleAuth(authConfig);
        // auth.authorizeRequest({/*...*/}, function (err, authorizedReqOpts) {});
        auth.getToken(function (err, token) {
            if (err)
                res.status(500).send(err);
            else
                res.status(200).send(token);
        });
    }
    createAssetUuid(req, res) {
        const fileUuid = uuidv4();
        res.status(200).send(fileUuid);
    }
    saveInitialAssetDoc(req, res) {
        console.log("req.body - save_initial_doc: ", req.body);
        let fileName = req.body.fileName.indexOf('.') > 0 ? req.body.fileName.substring(0, req.body.fileName.indexOf('.')) : req.body.fileName;
        const asset = new asset_model_1.Asset({
            name: fileName,
            originalFileName: req.body.originalFileName,
            fileUuid: req.body.fileUuid,
            orgId: req.body.orgId,
            userId: req.body.userId,
            status: "uploaded",
            created_by: "BishBash567",
            version_no: "1",
            description: req.body.description,
            categories: req.body.categories,
            genres: req.body.genres,
            tags: req.body.tags
        });
        delete asset.__v;
        console.log("asset: ", asset);
        asset.save((err) => {
            if (err)
                res.status(500).send({ error: err });
            else {
                res.status(201).send({ status: "Created", asset: asset });
                console.log('file saved to db!');
            }
        });
    }
}
exports.GoogleFileUploader = GoogleFileUploader;
