// import * as Storage from "@google-cloud/storage";
// import * as PubSub from "@google-cloud/pubsub";
// const config = require('../utils/config');
// const chalk = require('chalk');
//
// export class GoogleService {
//     private bucket_prefix: string = config.google.bucket_prefix;
//     private gcstore = new Storage(config.google.credentials);
//     private pubsub = new PubSub(config.google.credentials);
//
//     public addBucket(name: string) {
//         console.log(`adding bucket: ${name}`);
//         const metadata = {
//             location: 'US-CENTRAL1',
//             regional: true
//         };
//         return this.gcstore
//             .createBucket(name, metadata)
//             .catch((error: Error) => error);
//     }
//
//     public delBucket(name: string) {
//         return this.gcstore
//             .bucket(name)
//             .delete()
//             .catch((error: Error) => error);
//     }
//
//     public async addBucketByOrganizationId(id: string) {
//         let name = this.bucket_prefix + id.trim();
//         const newBucket = await this.addBucket(name);
//         await this.setBucketAcl(name);
//         await this.setBucketNotifications(name, id);
//         return newBucket;
//     }
//
//     public async delBucketByOrganizationId(id: string) {
//         let name = this.bucket_prefix + id.trim();
//         await this.delBucket(name);
//         // return await this.deleteNotification(name);
//     }
//
//     public listNotifications(bucketName: string) {
//         return this.gcstore
//             .bucket(bucketName)
//             .getNotifications()
//             .then(results => results[0])
//             .catch(err => err);
//     }
//
//     public async setBucketAcl(bucketName: string) {
//         try {
//             const currentBucket = this.gcstore.bucket(bucketName);
//             const options = {
//                 entity: 'allUsers',
//                 role: this.gcstore.acl.READER_ROLE
//             };
//             return currentBucket.acl.default.add(options, function(err, aclObject) {
//                 if(err) return err;
//                 return aclObject;
//             });
//         } catch (e) {
//             console.error(e);
//             return e;
//         }
//     }
//
//     public createNotification(bucketName: string, options: object, topic: string) {
//         console.log(`Creating notification for bucket ${bucketName}, topic: ${topic}, options: ${JSON.stringify(options)}`);
//         return this.gcstore
//             .bucket(bucketName)
//             .createNotification(topic, options)
//             .then((val) => {
//                 console.log(val);
//                 return 'Notification subscription created.'
//             })
//             .catch(err => err);
//     }
//
//     public deleteNotification(bucketName: string, notificationId: string) {
//         return this.gcstore
//             .bucket(bucketName)
//             .notification(notificationId)
//             .delete()
//             .catch(err => err);
//     }
//
//     private async setBucketNotifications(name: string, id: string) {
//         try{
//             const list = await this.listNotifications(name);
//             // await googleStorage.deleteNotification(config.google.storage.bucketNamePrefix+ORGANIZATION_ID_TEMP, 83);
//             // console.info(JSON.stringify(list));
//             console.info("list: ",list);
//             let notificationDirPrefixes = list.map(n => n.metadata.object_name_prefix);
//             console.info("notificationDirPrefixes: ",notificationDirPrefixes);
//             if(notificationDirPrefixes.indexOf(config.google.bucketUploadDirectoryPrefix) < 0) {
//                 let options = {
//                     objectNamePrefix: config.google.bucketUploadDirectoryPrefix,
//                     eventTypes: ['OBJECT_FINALIZE'],
//                     customAttributes: {
//                         orgId: id
//                     }
//                 };
//                 const createNotification = await this.createNotification(name, options, config.google.topic);
//                 console.info("createNotification: ",createNotification);
//
//                 const list1 = await this.listNotifications(name);
//                 console.info(createNotification);
//                 console.info(JSON.stringify(list1));
//                 console.info(`There is new ${list1.length} notification/s ot the bucket: ${name}`);
//                 return list1;
//             } else {
//                 console.log(`Notification exists for ${name}`);
//             }
//         } catch(err) {
//             console.error('create bucket -> ', err);
//             return err;
//         }
//     }
//
//     public async publishMessage(topicName: string, data: any) {
//         console.log(chalk.bold(`publishing...`));
//         console.log(data);
//         // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
//         const dataBuffer = Buffer.from(data);
//         return this.pubsub
//             .topic(topicName)
//             .publisher()
//             .publish(dataBuffer)
//             .then(messageId => console.log(chalk.green(`Message ${messageId} published.`)))
//             .catch(err => console.error('ERROR:', err));
//     }
// }
//
// export default new GoogleService();