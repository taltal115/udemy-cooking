// import { NextFunction, Request, Response, Router } from "express";
// import { AssetsService } from "../service";
// import { Authorized } from "../utils/auth";
// import { Auth } from "../models/"
// import { FileUploaderFactory } from "../lib/FileUploaderFactory";
//
// const config = require('../utils/config');
// const { google } = require('googleapis');
// const OAuth2 = google.auth.OAuth2;
//
// class AssetRoute extends Auth {
//
//     public static init(router: Router) {
//         const service: any = new AssetsService();
//         enum EnvType { Local, Google }
//
//         router.get("/assets", Authorized, async (req: Request, res: Response, next: NextFunction) => {
//             service.session = req.session;
//             const data = await service.retrieve(req.query);
//             res.json(data);
//         });
//
//         router.get("/assets/:id", Authorized, async (req: Request, res: Response, next: NextFunction) => {
//             if (isNaN(req.params.id)) {
//                 next();
//             }
//             service.session = req.session;
//             const data = await service.getPage(req.params.id, req.query);
//             res.json(data);
//         });
//
//         /**
//          * Path for the youtube export feature
//          * It meant to check if an asset is from an external type witch dos not have an original asset in the bucket
//          * we need to decide if we exporting thows as well.
//          */
//         router.post("/assets/validate", Authorized, async (req: Request, res: Response, next: NextFunction) => {
//             try {
//                 let data = await service.validateExternalAssets(req.body.assets);
//                 if(data) {
//                     return res.status(200).send(true);
//                 } else {
//                     return res.status(200).send(false);
//                 }
//             } catch (e) {
//                 return res.status(400).send(e);
//             }
//         });
//
//         router.get("/assets/:action", Authorized, async (req: Request, res: Response, next: NextFunction) => {
//             let action = req.params.action,
//                 data;
//
//             service.session = req.session;
//             switch (action) {
//                 case "privates":
//                     data = await service.getPrivates();
//                     res.json(data);
//                     break;
//             }
//         });
//
//         router.post("/assets/:action", Authorized, async (req: Request, res: Response, next: NextFunction) => {
//             let model = req.body;
//             let params = req.params;
//             let result = {};
//             service.session = req.session;
//
//             if (params && params.action) {
//                 switch (params.action) {
//                     case "edit":
//                         result = await service.edit(model._id);
//                         break;
//                     case "metadata":
//                         delete model.autoplay;
//                         //result = await service.updatePrivate(model._id, model);
//                         result = await service.update(model._id, model);
//                         break;
//                     default:
//                         next();
//                 }
//             }
//             else {
//                 console.log("action didn't provided")
//             }
//             res.json(result);
//         });
//
//         // single
//         router.get("/private/:id", Authorized, async (req: Request, res: Response, next: NextFunction) => {
//             service.session = req.session;
//             var result = await service.getPrivate(req.params.id);
//             res.send(result);
//         });
//
//         router.get("/asset/:id", Authorized, async (req: Request, res: Response, next: NextFunction) => {
//             service.session = req.session;
//             var result = await service.get(req.params.id);
//             res.json(result);
//         });
//
//         const uploader: any = FileUploaderFactory.getFileUploader(EnvType.Google);
//
//         router.get("/api/upload/get_session_uri/native", async (req: Request, res: Response, next: NextFunction) => {
//             if(uploader) {
//                 await uploader.createNativeSessionUri(req, res);
//             }
//         });
//         router.get("/api/upload/create_asset_uuid", async (req: Request, res: Response, next: NextFunction) => {
//             if(uploader) {
//                 await uploader.createAssetUuid(req, res);
//             }
//         });
//         router.post("/api/upload/save_initial_doc", async (req: Request, res: Response, next: NextFunction) => {
//             if(uploader) {
//                 await uploader.saveInitialAssetDoc(req, res);
//             }
//         });
//
//         const oauth2Client = new OAuth2(
//             config.google.youtube.client_id,
//             config.google.youtube.client_secret,
//             config.google.youtube.redirect_url
//         );
//
//         // send to google to do the authentication
//         router.post('/auth/google/youtube', Authorized, (req: Request, res: Response) => {
//             console.log("send to google to do the authentication");
//             let stateObject: any=[];
//             const data = JSON.parse(req.body.data);
//             for (let asset of data) {
//                 stateObject.push({
//                     fileUuid: asset.fileUuid,
//                     orgId: asset.orgId,
//                     name: asset.name,
//                     fileSize: asset.format.size,
//                     resolution: `${asset.streams[0].width}x${asset.streams[0].height}`,
//                     frameRate: asset.streams[0].r_frame_rate,
//                     totalFrames: asset.streams[0].nb_frames,
//                     codecName: asset.streams[0].codec_name,
//                     bitRate: asset.streams[0].bit_rate,
//                     aspectRatio: asset.streams[0].display_aspect_ratio,
//                     description: asset.description
//                 })
//             }
//
//             const authUrl = oauth2Client.generateAuthUrl({
//                 access_type: 'offline',
//                 scope: ["https://www.googleapis.com/auth/youtube"],
//                 state: JSON.stringify(stateObject)
//             });
//             console.log("url: ",authUrl);
//             // res.status(200).json({});
//             res.status(200).json({
//                 url: authUrl,
//                 body: req.body
//             }).end()
//         });
//
//         router.get('/auth/google/callback', (req, res) => {
//             console.log("getting google callback");
//             let returnTo = '/#assets';
//             console.log("req: ",(req.query.state));
//             console.log("code: ",(req.query.code));
//             oauth2Client.getToken(req.query.code, async(err, token) => {
//                 if (err) {
//                     console.log('Error while trying to retrieve access token', err);
//                     return;
//                 }
//                 console.log("getNewToken: ",token);
//                 oauth2Client.credentials = token;
//                 try {
//                     if(req.query.state) {
//                         await service.addYouTubeTokenToUser(token);
//                         returnTo += '?token='+JSON.stringify(token);
//                         await service.publishYouTubeExportMessage(token, JSON.parse(req.query.state));
//                         console.log("[callback] token: ",token);
//                         console.log("[callback] state: ",req.query.state);
//                     }
//
//                     return res.redirect(returnTo);
//                 } catch (e){
//                     return res.status(500).send(e);
//                 }
//                 // storeToken(token);
//                 // callback(oauth2Client, requestData);
//             });
//         });
//
//         router.post('/youtube/publish', Authorized, async(req: Request, res: Response) => {
//             console.log("body: ",req.body);
//             let token = req.body.session;
//             let assets = req.body.assets;
//             try {
//                 if(!token) throw new Error('Token is missing or invalid!');
//                 if(!assets) throw new Error('States Params is missing or invalid!');
//
//                 token = JSON.parse(token);
//                 assets = JSON.parse(assets);
//                 let stateParams: any = [];
//                 for (let asset of assets) {
//                     stateParams.push({
//                         fileUuid: asset.fileUuid,
//                         orgId: asset.orgId,
//                         name: asset.name,
//                         fileSize: asset.format.size,
//                         resolution: `${asset.streams[0].width}x${asset.streams[0].height}`,
//                         frameRate: asset.streams[0].r_frame_rate,
//                         totalFrames: asset.streams[0].nb_frames,
//                         codecName: asset.streams[0].codec_name,
//                         bitRate: asset.streams[0].bit_rate,
//                         aspectRatio: asset.streams[0].display_aspect_ratio,
//                         description: asset.description
//                     })
//                 }
//
//                 console.log("[publish] token: ",token);
//                 console.log("[publish] state: ",stateParams);
//
//                 await service.publishYouTubeExportMessage(token, stateParams);
//                 res.status(200).json({
//                     status: "ok"
//                 }).end()
//             } catch (e) {
//                 res.status(500).json({
//                     status: "error",
//                     data: e
//                 }).end()
//             }
//         });
//     }
// }
// export = AssetRoute;