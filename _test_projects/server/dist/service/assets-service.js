// import { Asset, UserPreference as User, IPager } from "../models/documents";
// import { Helper } from "../utils/helper";
// import * as path from "path";
// import * as fs from "fs";
// import { Auth } from "../models/"
// import * as _ from "lodash"
//
// const config = require('../utils/config');
//
// const deferred = require('deferred');
// const mongoose = require('mongoose');
// // const ObjectId = mongoose.Types.ObjectId;
//
// export interface IExportObject {
//     fileUuid: string,
//     name: string,
//     bucketName: string,
//     fromPath: string,
//     youTubeToken: any,
//     fileSize: string,
//     resolution: string,
//     frameRate: string,
//     totalFrames: string,
//     codecName: string,
//     bitRate: string,
//     aspectRatio: string,
//     description: string
// };
//
// export class AssetsService extends Auth {
//
//     public metadata(id: string, model: any) {
//         Asset.findOneAndUpdate({ _id: id }, model, { upsert: false }, function (err: any, doc: any) {
//             if (err) throw err;
//             if (doc) {
//                 doc.on('es-indexed', function (err: any, es_res: any) {
//                     if (err) {
//                         console.error('Elasticsearch indexing failed', err)
//                     };
//                 });
//             }
//             return { success: true };
//         });
//     }
//
//     public retrieve(model: any) {
//         let query = Helper.toPager(model);
//         const defer = deferred();
//         var self = this;
//         try {
//             User.aggregate([
//                 {
//                     $match: { userId: this.auth.user_id  }
//                 },
//                 {
//                     "$project": {
//                         "excludes": {
//                             "$setUnion": "$favorites.assets"
//                         },
//                         "edited": {
//                             "$setUnion": "$privates._sourceId"
//                         }
//                     }
//                 },
//                 { "$limit": 1 }
//             ], function (err: any, project: any) {
//                 let excludes;
//                 let edited;
//                 let filter: any = {};
//
//                 if (project.length > 0) {
//                     excludes = project[0].excludes || [];
//                     if (excludes && excludes.length > 0) {
//                         excludes = excludes.map(item => item).reduce((a, b) => {
//                             return a.concat(b);
//                         });
//                         filter._id = { "$nin": excludes };
//                     }
//
//                     edited = project[0].edited || [];
//                     if (edited && edited.length > 0) {
//                         edited = edited.map(item => item.toString());
//                     }
//                 }
//                 filter.status = 'done';
//                 filter.orgId = self.auth.org_id;
//
//                 // TODO: add org_id filter
//                 Asset.paginate(
//                     filter,
//                     {
//                         select: {
//                             "format.format_long_name": 1,
//                             "format.format_name": 1,
//                             "format.filename": 1,
//                             "format.size": 1,
//                             "description": 1,
//                             "poster": 1,
//                             "name": 1,
//                             "fileUuid": 1,
//                             "orgId": 1,
//                             "genres": 1,
//                             "categories": 1,
//                             "tags": 1,
//                             "format.duration": 1,
//                             "streams": { $elemMatch: { "codec_type": "video" } }
//                         },
//                         lean: false,
//                         page: query.page,
//                         limit: query.limit
//                     }, function (err: any, result: any) {
//
//                         result.docs = result.docs.map(item => {
//                             //let doc = item._doc;
//                             let asset = Object.assign({}, item._doc);
//
//                             if (edited && edited.length > 0) {
//                                 if (edited && edited.indexOf(asset._id.toString()) > 0) {
//                                     asset.isEdit = true;
//                                 }
//                             }
//                             return asset;
//                         });
//
//                         defer.resolve(result);
//                     });
//             });
//         } catch (e) {
//             defer.resolve([]);
//         }
//
//         return defer.promise;
//     }
//
//     public getPage(id: number, model: IPager) {
//         let query = Helper.toPager(model);
//         const defer = deferred();
//         try {
//             if (!isNaN(id)) {
//                 // TODO: replace with using $lookup
//                 User.findOne({ userId: this.auth.user_id }, {
//                     favorites: 1,
//                     "privates._sourceId": 1
//                 }, (err: any, data: any) => {
//                     if (err) {
//                         defer.resolve([]);
//                     }
//                     else {
//                         if (data) {
//                             var favorites = data.getValue('favorites');
//                             var edited = data.getValue('privates');
//                             if (edited && edited.length > 0) {
//                                 edited = edited.map(item => item._sourceId.toString());
//                             }
//                             if (favorites.length > 0) {
//                                 var favorite = favorites.find(item => item.id == id)
//                                 if (favorite) {
//                                     var ids = favorite.assets;
//                                     Asset.paginate({ _id: { $in: ids } },
//                                         {
//                                             select: {
//                                                 "format.format_long_name": 1,
//                                                 "format.format_name": 1,
//                                                 "format.filename": 1,
//                                                 "format.size": 1,
//                                                 "description": 1,
//                                                 "poster": 1,
//                                                 "name": 1,
//                                                 "fileUuid": 1,
//                                                 "orgId": 1,
//                                                 "genres": 1,
//                                                 "categories": 1,
//                                                 "tags": 1,
//                                                 "format.duration": 1,
//                                                 "streams": { $elemMatch: { "codec_type": "video" } }
//                                             },
//                                             lean: false,
//                                             page: query.page,
//                                             limit: query.limit
//                                         }, function (err: any, result: any) {
//
//                                             result.docs = result.docs.map(item => {
//                                                 let asset = Object.assign({}, item._doc);
//                                                 if (edited && edited.length > 0) {
//                                                     if (edited && edited.indexOf(asset._id.toString()) > 0) {
//                                                         asset.isEdit = true;
//                                                     }
//                                                 }
//                                                 return asset;
//                                             });
//
//                                             defer.resolve(result);
//                                         });
//                                 }
//                                 else {
//                                     defer.resolve({});
//                                 }
//                             }
//                             else {
//                                 defer.resolve({});
//                             }
//                         }
//                     }
//                 });
//             }
//         } catch (e) {
//             defer.resolve([]);
//         }
//         return defer.promise;
//     }
//
//     public update(id: string, model: any) {
//         Asset.findOneAndUpdate({ _id: id }, model, { upsert: false }, function (err: any, doc: any) {
//             if (err) throw err;
//             if (doc) {
//                 doc.on('es-indexed', function (err: any, es_res: any) {
//                     if (err) {
//                         console.error('Elasticsearch indexing failed', err)
//                     };
//                 });
//             }
//             return { success: true };
//         });
//     }
//
//     public get(id: string) {
//         const defer = deferred();
//
//         Asset.findById(id, function (err: any, doc: any) {
//             if (err) {
//                 return null;
//             }
//
//             let thumbnails = doc.get('thumbnails');
//             if (thumbnails instanceof Array && thumbnails.length > 0) {
//                 let dir: string = doc.get('thumbnails_dir');
//
//                 var promises = thumbnails.map((item: any) => {
//                     const def = deferred();
//
//                     let file_path = path.resolve(path.join('../resources/', dir, item.src));
//
//                     fs.readFile(file_path, function (err: any, buffer: any) {
//                         if (err) {
//                             item.src = path.join('/resources/', dir, item.src);
//                         } else {
//                             var data = new Buffer(buffer, 'binary').toString('base64');
//                             item.src = `data:jpg;base64,${data}`;
//                         }
//                         def.resolve(item);
//                     });
//                     return def.promise;
//                 });
//
//                 Promise.all(promises).then(function (thumbnails) {
//                     doc.thumbnails = thumbnails
//                     defer.resolve(doc);
//                 });
//             }
//             else {
//                 defer.resolve(doc);
//             }
//         });
//         return defer.promise;
//     }
//
//     public edit(id: string) {
//         const defer = deferred();
//
//         Asset.findById(id, function (err: any, doc: any) {
//             if (err) {
//                 return null;
//             }
//
//             let asset = Object.assign({}, doc._doc);;
//
//             asset._sourceId = asset._id;
//             asset._id = mongoose.Types.ObjectId();
//
//             User.findOneAndUpdate(
//                 { userId: this.auth.user_id },
//                 { $push: { privates: asset } },
//                 { upsert: true },
//                 function (err: any, doc: any) {
//                     if (err) {
//                         defer.reject(err);
//                     }
//                     defer.resolve(asset);
//                 }
//             );
//
//             // let thumbnails = doc.get('thumbnails');
//             // if (thumbnails instanceof Array && thumbnails.length > 0) {
//             //     let dir: string = doc.get('thumbnails_dir');
//
//             //     var promises = thumbnails.map((item: any) => {
//             //         const def = deferred();
//
//             //         let file_path = path.resolve(path.join('../resources/', dir, item.src));
//
//             //         fs.readFile(file_path, function (err: any, buffer: any) {
//             //             if (err) {
//             //                 item.src = path.join('/resources/', dir, item.src);
//             //             } else {
//             //                 var data = new Buffer(buffer, 'binary').toString('base64');
//             //                 item.src = `data:jpg;base64,${data}`;
//             //             }
//             //             def.resolve(item);
//             //         });
//             //         return def.promise;
//             //     });
//
//             //     Promise.all(promises).then(function (thumbnails) {
//             //         doc.thumbnails = thumbnails
//             //         defer.resolve(JSON.stringify(doc));
//             //     });
//             // }
//             // else {
//             //     defer.resolve(JSON.stringify(doc));
//             // }
//         });
//         return defer.promise;
//     }
//
//     public getPrivates(query) {
//         const defer = deferred();
//         try {
//             User.findOne({ userId: this.auth.user_id }, {
//                 privates: []
//             }, (err: any, doc: any) => {
//                 if (err) {
//                     defer.resolve('tree');
//                 }
//                 defer.resolve(doc.getValue('privates'));
//             });
//         } catch (e) {
//             defer.resolve([]);
//         }
//         return defer.promise;
//     }
//
//     public getPrivate(id) {
//         const defer = deferred();
//         try {
//             var _id = id;
//             User.findOne({ userId: this.auth.user_id },
//                 {
//                     "privates": 1
//                 },
//                 //.select({ "privates": { $elemMatch: { "_id": id } } }).exec(
//                 (err: any, doc: any) => {
//                     if (err) {
//                         defer.resolve('tree');
//                     }
//
//                     var asset = doc.get('privates').find(item => item._id == _id);
//                     if (asset.thumbnails instanceof Array && asset.thumbnails.length > 0) {
//                         let dir: string = asset.thumbnails_dir;
//                         asset.thumbnails = asset.thumbnails.map(item => {
//                             item.src = path.resolve('/resources/', dir, item.src);
//                             return item;
//                         });
//                     }
//                     defer.resolve(asset);
//                 });
//         } catch (e) {
//             defer.resolve([]);
//         }
//         return defer.promise;
//     }
//
//     public updatePrivate(id: string, asset) {
//         const defer = deferred();
//
//         User.findOneAndUpdate(
//             { userId: this.auth.user_id, "privates.id": id },
//             asset,
//             { upsert: false },
//             function (err: any, doc: any) {
//                 if (err) {
//                     defer.reject(err);
//                 }
//                 defer.resolve(asset);
//             }
//         );
//         return defer.promise;
//     }
//
//     public async validateExternalAssets(assets: any) {
//         try {
//             const results = await Asset.find(
//                 { externalUpload: true},
//                 {fileUuid: 1});
//             assets = JSON.parse(assets);
//             assets = assets.map((asset: any) => asset.fileUuid);
//             let data = results.map((asset: any) => asset.fileUuid);
//             const condition = assets.length + data.length === _.union(data, assets).length;
//             console.log("validateExternalAssets condition: ",condition);
//             return condition;
//         } catch (e) {
//             return e;
//         }
//     }
//
//     public addYouTubeTokenToUser(token: any) {
//         console.log('addYouTubeTokenToUser');
//         if(!this.auth) throw 'user not connected!';
//         console.log('this.auth.user_id: ',this.auth.user_id);
//         try {
//             if(token.refresh_token) {
//                 console.log('Saving refresh token!: ',token);
//                 return User.findOneAndUpdate(
//                     { userId: this.auth.user_id},
//                     { youtubeToken: token },
//                     { upsert: false });
//             } else {
//                 console.log('Updating token!: ',token);
//                 return User.findOneAndUpdate(
//                     { userId: this.auth.user_id},
//                     {
//                         'youtubeToken.access_token': token.access_token,
//                         'youtubeToken.expiry_date': token.expiry_date
//                     },
//                     { upsert: false });
//             }
//
//         } catch (e) {
//             return e;
//         }
//     }
//
//     public async publishYouTubeExportMessage(youTubeToken: any, stateParams: any) {
//         console.log('publishYouTubeExportMessage');
//         // if(!this.auth) throw 'user not connected!';
//         // console.log('this.auth.user_id: ',this.auth.user_id);
//         try {
//             console.log("youTubeToken: ",youTubeToken);
//             console.log("stateParams: ",stateParams);
//             console.log("stateParams typeof: ",typeof stateParams);
//
//             return await Promise.all(stateParams.map(async (stateParam) => {
//                 let exportObject: IExportObject = {
//                     fileUuid: stateParam.fileUuid,
//                     name: stateParam.name,
//                     bucketName: config.google.bucket_prefix+stateParam.orgId,
//                     fromPath: `/assets/${stateParam.fileUuid}`,
//                     youTubeToken: youTubeToken,
//                     fileSize: stateParam.fileSize,
//                     resolution: stateParam.resolution,
//                     frameRate: stateParam.frameRate,
//                     totalFrames: stateParam.totalFrames,
//                     codecName: stateParam.codecName,
//                     bitRate: stateParam.bitRate,
//                     aspectRatio: stateParam.aspectRatio,
//                     description: stateParam.description
//                 };
//                 console.log('publishing: ',exportObject);
//                 if(stateParam.fileUuid) {
//                     // download video by this orgid and the givin fileuuid
//                 }
//             }));
//         } catch (e) {
//             return e;
//         }
//     }
// }
