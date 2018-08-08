import { models, sequelize } from "../models/entities/index";
import { Transaction, Op } from "sequelize";
import { UserPreference, IUserPreference } from "../models/documents";
import { IUserRequest, IUserAttributes, IUserInstance, IMailOptions } from "../models";
import { Auth } from "../models/general/";
import { EmailService, QueryService } from ".";
import { Roles } from "../models/enums";

const deferred = require('deferred');
const uuidv4 = require('uuid/v4');
const config = require('../utils/config');

export class UserService extends Auth {
    public retrieve(): Promise<Array<IUserInstance>> {
        let promise = new Promise<Array<IUserInstance>>((resolve: Function, reject: Function) => {

            if (this.is(Roles.Super)) {
                models.User.findAll({}).then((users: Array<IUserInstance>) => {
                    resolve(users);
                }).catch((error: Error) => {
                    reject(error);
                });
            }

            else if (this.is(Roles.Admin)) {
                models.UserOrganization.findAll({
                    where: {
                        org_id: this.auth.org_id,
                        role: {
                            [Op.gt]: this.auth.role
                        }
                    },
                    attributes: ['user_id', 'role']
                }).then((org_users) => {
                    let u_ids = org_users.map(user => user.user_id);
                    models.User.findAll({
                        where: { id: { [Op.in]: u_ids } }
                    }).then((users: any) => {
                        resolve(users);
                    }).catch((error: Error) => {
                        reject(error);
                    });
                });
            }
            else {
                reject('ERROR: You are not autenticate to view this');
            }
        });
        return promise;
    }

    public get(id: string): Promise<IUserInstance> {
        let promise = new Promise<IUserInstance>((resolve: Function, reject: Function) => {
            sequelize.transaction((t: Transaction) => {
                return models.User.findById(id).then((user: IUserInstance) => {
                    resolve(user);
                }).catch((error: Error) => {
                    reject(error);
                });
            });
        });
        return promise;
    }

    private sendMailActivation(user: any, token: string) {
        let options: IMailOptions = {};
        options.to = user.email;
        options.from = config.adminMail
        options.subject = 'DiTVe MAM System - Mail Activation'
        options.template = 'mail-activate';
        options.context = {
            name: {
                first: user.firstName,
                last: user.lastName,
            },
            token: token
        }
        return EmailService.send(options);
    }

    public add(userRequest: IUserRequest): Promise<IUserInstance> {
        const defer = deferred();
        let _self = this;

        sequelize.transaction(async (t: Transaction) => {
            let userAttributes: IUserAttributes = userRequest;

            if (userRequest.mailActivation) {
                userAttributes.securityStamp = uuidv4();
            }

            models.User.create(userAttributes as IUserInstance).then((user: any) => {

                if (userRequest.mailActivation == true) {
                    _self.sendMailActivation(user, userAttributes.securityStamp);
                }

                if (_self.is(Roles.Admin)) {
                    let org_id = "" + _self.auth.org_id;
                    _self.addOrg(org_id, user.id, Roles.User);
                }

                let userPreference: IUserPreference = new UserPreference({
                    userId: user.id,
                    orgId: _self.auth.org_id
                });

                UserPreference.create(userPreference, async function (err, doc) {
                    if (err) {
                        console.log('Error', err.message)
                    }
                    console.log('User Preference was created');
                });

                defer.resolve(user);
            }).catch((error: Error) => {
                defer.reject(error);
            });
        });
        return defer.promise;
    }

    public update(id: string, requestData: any): Promise<void> {
        var _self = this;
        let p1 = new Promise<void>((resolve: Function, reject: Function) => {
            models.User.findById(id).then(async (user: IUserInstance) => {
                if (user == null) {
                    reject({
                        path: 'id', message: `User with id '${id}' not found`
                    });
                }

                if (requestData.mailActivation) {
                    var token = uuidv4();
                    await _self.sendMailActivation(user, token).then(() => {
                        requestData.emailConfirmed = true;
                        requestData.securityStamp = token;
                    })
                    .catch(e => {
                        return e;
                    });
                }

                await user.update(requestData).then(() => true)
                    .catch(e => {
                        return e;
                    });

                resolve(user);
            }).catch(e => {
                reject(e);
            });
        });

        let p2 = new Promise<void>((resolve: Function, reject: Function) => {
            var permissions = requestData.permissions;
            if (permissions instanceof Array) {
                _self.clearOrgs(id);
                permissions.forEach(async (item) => {
                    await _self.addOrg(item.organization, id, item.role);
                });
            }
            resolve(true);
        });

        const defer = deferred();

        Promise.all([p1, p2]).then((data) => {
            defer.resolve(data);
        });

        return defer.promise;
    }

    public delete(id: string): Promise<void> {
        const defer = deferred();
        sequelize.transaction(async (t: Transaction) => {
            await models.User.destroy({ where: { id: id } }).then(async (afffectedRows: number) => {
                // TODO: notify
                if (afffectedRows > 0) {
                    await UserPreference.deleteOne({ userId: id }, (err) => {
                        // TODO: notify
                    });
                }

                defer.resolve(null);
            }).catch((error: Error) => {
                defer.reject(error);
            });
        });
        return defer.promise;
    }

    private clearOrgs(user_id: string) {
        return QueryService.query(`DELETE FROM user_organizations WHERE user_id = '${user_id}'`);
    }

    private addOrg(org_id: string, user_id: string, role: Roles) {
        QueryService.query(`INSERT INTO user_organizations (org_id, user_id, role) VALUES ('${org_id}', '${user_id}', ${role})`);
    }

    public static find(query: any): Promise<IUserInstance> {
        if (typeof query === "string") {
            query = { email: query };
        }
        return new Promise<IUserInstance>((resolve: Function, reject: Function) => {
            models.User.findOne({ where: query }).then((user: IUserInstance) => {
                return resolve(user);
            }).catch((error: Error) => {
                return reject(error);
            })
        });
    }

    public static restorePassword(email: any): Promise<IUserInstance> {
        const defer = deferred();
        models.User.findOne({ where: { email: email } }).then(async (user: IUserInstance) => {
            if (user == null) {
                defer.reject({
                    path: 'email', message: "The email address you provided doesn't recognized"
                })
            }
            else {
                user.securityStamp = uuidv4();
                user.emailConfirmed = false;
                user.password = '';
                await user.save().then(() => {
                    var options: IMailOptions = {};
                    options.to = user.email;
                    options.from = 'DiTve MAM <admin@ditve.tv>'
                    options.template = 'restore-password';
                    options.subject = 'DiTVe - Restore Password'
                    options.context = {
                        name: {
                            first: user.firstName,
                            last: user.lastName,
                        },
                        token: user.securityStamp
                    }
                    EmailService.send(options).then(() => {
                        defer.resolve(user)
                    });
                }).catch((error: Error) => {
                    defer.reject(error.message);
                });
            }
        }).catch((error: Error) => {
            defer.reject(error.message);
        });
        return defer.promise;
    }

    public static resetPassword(token: string, password: string): Promise<IUserInstance> {
        const defer = deferred();
        models.User.findOne({ where: { securityStamp: token } }).then((user: IUserInstance) => {
            if (user == null) {
                defer.reject({
                    path: 'token', message: "The token you provided doesn't recognized"
                })
            }
            else {
                user.password = password;
                user.isLocked = false;
                user.securityStamp = '';

                user.save().then(() => {
                    defer.resolve(user);
                });
            }
        }).catch((error: Error) => {
            defer.reject(error);
        });
        return defer.promise;
    }
}