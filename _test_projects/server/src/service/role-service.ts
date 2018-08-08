
import { sequelize } from "../models/entities/index";
import { Transaction } from "sequelize";

import { QueryService } from ".";
//import { Roles } from "../models/enums/";
import { Auth } from "../models/general";

// const deferred = require('deferred');
// const uuidv4 = require('uuid/v4');
// const config = require('../utils/config');

export class RoleService extends Auth {

    // public retrieve(): Promise<Array<IOrganizationInstance>> {
    //     let promise = new Promise<Array<IOrganizationInstance>>((resolve: Function, reject: Function) => {
    //         if (this.is('Super')) {
    //             models.Organization.findAll().then((orgs: Array<IOrganizationInstance>) => {
    //                 resolve(orgs);
    //             }).catch((error: Error) => {
    //                 reject(error);
    //             });
    //         }
    //         else if (this.is('Admin')) {
    //             models.UserOrganization.findAll({
    //                 where: {
    //                     org_id: this.auth.org_id,
    //                     role: {
    //                         [Op.gt]: this.auth.role
    //                     }
    //                 },
    //                 attributes: ['user_id', 'role']
    //             }).then((users) => {
    //                 let u_ids = users.map(user => user.user_id);
    //                 models.Organization.findOne({
    //                     where: {
    //                         id: this.auth.org_id
    //                     },
    //                     include: [
    //                         {
    //                             model: models.User,
    //                             as: 'users',
    //                             required: false
    //                         }
    //                     ]
    //                 }).then((org: any) => {
    //                     if (org.users && org.users instanceof Array) {
    //                         org.users = org.users.filter(user => {
    //                             return u_ids.indexOf(user.id) != -1;
    //                         })
    //                     }
    //                     resolve(org);
    //                 }).catch((error: Error) => {
    //                     reject(error);
    //                 });
    //             });
    //         }
    //     });
    //     return promise;
    // }

    // public get(id: string): Promise<IOrganizationInstance> {
    //     let promise = new Promise<IOrganizationInstance>((resolve: Function, reject: Function) => {
    //         sequelize.transaction((t: Transaction) => {
    //             return models.Organization.findById(id).then((org: IOrganizationInstance) => {
    //                 resolve(org);
    //             }).catch((error: Error) => {
    //                 reject(error);
    //             });
    //         });
    //     });
    //     return promise;
    // }

    // private addUser(organization: IOrganizationInstance, user: IUserInstance, role: Roles) {
    //     QueryService.query(`INSERT INTO user_organizations (org_id, user_id, role) VALUES ('${organization.id}', '${user.id}', ${role})`);
    // }

    // public add(orgRequest: IOrganizationRequest): Promise<IOrganizationInstance> {
    //     const defer = deferred();
    //     var _self = this;
    //     sequelize.transaction(async (t: Transaction) => {

    //         let orgAttributes: IOrganizationAttributes = orgRequest;

    //         models.Organization.create(orgAttributes as IOrganizationInstance).then((organization: IOrganizationInstance) => {

    //             if (orgRequest.admin_email != '') {
    //                 UserService.find(orgRequest.admin_email).then((user) => {

    //                     let mailActivation: boolean = orgRequest && orgRequest.mailActivation == 'true';

    //                     if (user === null) {
    //                         let userService = new UserService();
    //                         let user: any = {
    //                             firstName: 'Admin-' + organization.name,
    //                             lastName: 'Admin-' + organization.name,
    //                             picture: '/resources/images/user-profile/no-image.png',
    //                             email: orgRequest.admin_email,
    //                             mailActivation: mailActivation
    //                         } as IUserRequest;

    //                         userService.add(user).then((user) => {
    //                             _self.addUser(organization, user, Roles.Admin);
    //                         });
    //                     }
    //                     else {
    //                         _self.addUser(organization, user, Roles.Admin);
    //                         if (mailActivation == true) {
    //                             user.securityStamp = uuidv4();

    //                             var options: IMailOptions = {};
    //                             options.to = user.email;
    //                             options.from = config.adminMail
    //                             options.subject = 'DiTVe MAM System - Mail Activation'
    //                             options.template = 'mail-activate';
    //                             options.context = {
    //                                 name: {
    //                                     first: user.firstName,
    //                                     last: user.lastName,
    //                                 },
    //                                 domain: config.host,
    //                                 token: user.securityStamp
    //                             }
    //                             EmailService.send(options).then(() => {
    //                                 user.save();
    //                                 debugger;
    //                             });
    //                         }
    //                     }
    //                 });
    //                 // models.User.findOne({
    //                 //     where: { email: orgRequest.admin_email }
    //                 // })


    //                 // let u: any = {
    //                 //     firstName: 'Admin-' + organization.name,
    //                 //     lastName: 'Admin-' + organization.name,
    //                 //     picture: '/resources/images/user-profile/no-image.png',
    //                 //     email: orgRequest.admin_email,
    //                 //     emailConfirmed: false,
    //                 //     skipActivation: orgRequest && orgRequest.activation === undefined
    //                 // }
    //                 // models.User.findOrCreate(
    //                 //     {
    //                 //         where: { email: orgRequest.admin_email },
    //                 //         defaults: u
    //                 //     }
    //                 // )
    //                 //     .spread((user, created) => {
    //                 //         QueryService.query(`INSERT INTO user_organizations (org_id, user_id, user_role) VALUES ('${organization.id}', '${(user as IUserInstance).id}', ${Roles.Admin})`);
    //                 //     });
    //             }

    //             if (orgRequest.customer_id != '') {
    //                 QueryService.query(`INSERT INTO customer_map (org_id, customer_id) VALUES ('${organization.id}', '${orgRequest.customer_id}')`);
    //             }

    //             defer.resolve(organization);
    //         }).catch((error: Error) => {
    //             defer.reject(error);
    //         });
    //     });
    //     return defer.promise;
    // }

    // public update(id: string, orgAttributes: any): Promise<void> {
    //     let promise = new Promise<void>((resolve: Function, reject: Function) => {
    //         sequelize.transaction((t: Transaction) => {

    //             return models.Organization.update(orgAttributes, { where: { id: id } })

    //                 .then((results: [number, Array<IOrganizationInstance>]) => {
    //                     if (results.length > 0) {
    //                         console.log(`Updated user with name ${id}.`);
    //                     } else {
    //                         console.log(`User with name ${id} does not exist.`);
    //                     }
    //                     resolve(null);
    //                 }).catch((error: Error) => {
    //                     console.error(error.message);
    //                     reject(error);
    //                 });
    //         });
    //     });

    //     return promise;
    // }

    // public delete(id: string): Promise<void> {
    //     const defer = deferred();
    //     sequelize.transaction(async (t: Transaction) => {
    //         await models.Organization.destroy({ where: { id: id } }).then(async (afffectedRows: number) => {
    //             defer.resolve(true);
    //         }).catch((error: Error) => {
    //             defer.reject(error);
    //         });
    //     });
    //     return defer.promise;
    // }

    // public static find(query: any): Promise<IOrganizationInstance> {
    //     if (typeof query === "string") {
    //         query = { email: query };
    //     }

    //     let promise = new Promise<IOrganizationInstance>((resolve: Function, reject: Function) => {
    //         sequelize.transaction((t: Transaction) => {
    //             return models.Organization.findOne({ where: query }).then((organization: IOrganizationInstance) => {
    //                 resolve(organization);
    //             }).catch((error: Error) => {
    //                 reject(error);
    //             });
    //         });
    //     });

    //     return promise;
    // }


    public static lookup(user_id: any): Promise<any> {
        // const query = `SELECT DISTINCT(T1.value), T1.name, T2.user_id AS 'selected', T2.org_id
        //                     FROM ditve_db.roles AS T1
        //                 LEFT JOIN ditve_db.user_organizations AS T2 
        //                     ON T1.value=T2.role
        //                         AND T2.user_id='${user_id}'`;

        const query = `SELECT T1.value, T1.name
                            FROM ditve_db.roles AS T1`;
        //AND T2.org_id='${org_id}', org_id: any
        let promise = new Promise<any>((resolve: Function, reject: Function) => {
            sequelize.transaction((t: Transaction) => {
                return QueryService.query(query).then((roles: any) => {
                    resolve(roles.results.map((role: any) => {
                        return {
                            group: 'roles',
                            text: role.name,
                            value: role.value
                        }
                    }));
                }).catch((error: Error) => {
                    reject(error);
                });
            });
        });

        return promise;
    }
}