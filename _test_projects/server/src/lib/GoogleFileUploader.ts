import { IFileUploader } from "./IFileUploader";
import { Request, Response } from "express";
import { Asset } from "../models/documents/asset-model";
import * as uuidv4 from "uuid/v4";
const config = require('./../utils/config');
enum EnvType { Local, Google }
const googleAuth = require("google-auto-auth");

export class GoogleFileUploader implements IFileUploader {
    // TODO:remove
    env: EnvType;

    constructor(Type: EnvType) {
        this.env = Type;
    }

    upload(req: Request, res: Response) {
        return {}
    }

    public createNativeSessionUri(req: Request, res: Response) : void{
        let authConfig = {
            keyFilename:config.google.credentials.keyFilename,
            projectId:config.google.credentials.projectId,
            scopes: ['https://www.googleapis.com/auth/devstorage.full_control']
        };

        // Create a client
        let auth = googleAuth(authConfig);

        // auth.authorizeRequest({/*...*/}, function (err, authorizedReqOpts) {});
        auth.getToken(function (err: any, token: any) {
            if(err) res.status(500).send(err);
            else res.status(200).send(token);
        });
    }

    public createAssetUuid(req: Request, res: Response): void {
        const fileUuid = uuidv4();
        res.status(200).send(fileUuid);
    }

    public saveInitialAssetDoc(req: Request, res: Response): void {
        console.log("req.body - save_initial_doc: ",req.body);
        let fileName = req.body.fileName.indexOf('.') > 0 ? req.body.fileName.substring(0, req.body.fileName.indexOf('.')) : req.body.fileName;
        const asset = new Asset({
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
        asset.save((err: any) => {
            if (err) res.status(500).send({error: err});
            else {
                res.status(201).send({status: "Created", asset: asset});
                console.log('file saved to db!');
            }
        });
    }
}