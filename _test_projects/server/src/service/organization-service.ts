
import { models, sequelize } from "../models/entities/index";
import { Transaction, Op } from "sequelize";
import { IOrganizationRequest, IOrganizationInstance, IOrganizationAttributes, IUserInstance, IUserRequest, IMailOptions } from "../models";
import { OrganizationPreference } from "../models/documents";
import { QueryService, UserService, EmailService } from ".";
import { Roles } from "../models/enums/";
import { Auth } from "../models/general";

const deferred = require('deferred');
const uuidv4 = require('uuid/v4');
const config = require('../utils/config');

export class OrganizationService extends Auth {

    public retrieve(): Promise<Array<IOrganizationInstance>> {
        let promise = new Promise<Array<IOrganizationInstance>>((resolve: Function, reject: Function) => {
            if (this.is(Roles.Super)) {
                models.Organization.findAll().then((orgs: Array<IOrganizationInstance>) => {
                    resolve(orgs);
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
                }).then((users) => {
                    let u_ids = users.map(user => user.user_id);
                    models.Organization.findOne({
                        where: {
                            id: this.auth.org_id
                        },
                        include: [
                            {
                                model: models.User,
                                as: 'users',
                                required: false
                            }
                        ]
                    }).then((org: any) => {
                        if (org.users && org.users instanceof Array) {
                            org.users = org.users.filter(user => {
                                return u_ids.indexOf(user.id) != -1;
                            })
                        }
                        resolve(org);
                    }).catch((error: Error) => {
                        reject(error);
                    });
                });
            }
        });
        return promise;
    }

    public get(id: string): Promise<IOrganizationInstance> {
        let promise = new Promise<IOrganizationInstance>((resolve: Function, reject: Function) => {
            sequelize.transaction((t: Transaction) => {
                return models.Organization.findById(id).then((org: IOrganizationInstance) => {
                    resolve(org);
                }).catch((error: Error) => {
                    reject(error);
                });
            });
        });
        return promise;
    }

    private addUser(organization: IOrganizationInstance, user: IUserInstance, role: Roles) {
        return QueryService.query(`INSERT INTO user_organizations (org_id, user_id, role) VALUES ('${organization.id}', '${user.id}', ${role})`);
    }

    public add(orgRequest: IOrganizationRequest): Promise<IOrganizationInstance> {
        const defer = deferred();
        var _self = this;
        sequelize.transaction(async (t: Transaction) => {
            let orgAttributes: IOrganizationAttributes = orgRequest;
            let organization = await models.Organization.create(orgAttributes as IOrganizationInstance).then((organization: IOrganizationInstance) => {
                // Organization admin handling
                if (orgRequest.admin_email != '') {
                    UserService.find(orgRequest.admin_email).then(async (user) => {
                        let mailActivation: boolean = orgRequest && orgRequest.mailActivation == 'true';
                        if (user === null) {
                            let userService = new UserService();
                            let user: any = {
                                firstName: 'Admin-' + organization.name,
                                lastName: 'Admin-' + organization.name,
                                picture: '/resources/images/user-profile/no-image.png',
                                email: orgRequest.admin_email,
                                mailActivation: mailActivation
                            } as IUserRequest;

                            userService.add(user).then((user) => {
                                _self.addUser(organization, user, Roles.Admin);
                            });
                        }
                        else {
                            if (mailActivation == true) {
                                user.securityStamp = uuidv4();

                                var options: IMailOptions = {};
                                options.to = user.email;
                                options.from = config.adminMail
                                options.subject = 'DiTVe MAM System - Mail Activation'
                                options.template = 'mail-activate';
                                options.context = {
                                    name: {
                                        first: user.firstName,
                                        last: user.lastName,
                                    },
                                    domain: config.host,
                                    token: user.securityStamp
                                }
                                // only if 
                                await EmailService.send(options).then(() => {
                                    console.log(`An email was sent to ${user.email}`);
                                }).catch((error: Error) => {
                                    user.isEmailBroken = true;
                                });
                                user.save();
                            }
                            _self.addUser(organization, user, Roles.Admin);
                        }

                        return user
                    });
                }

                // Organization customer maping handle
                if (orgRequest.customer_id != '') {
                    QueryService.query(`INSERT INTO customer_map (org_id, customer_id) VALUES ('${organization.id.trim()}', '${orgRequest.customer_id.trim()}')`);
                }

                // Organization preference handling
                OrganizationPreference.create({
                    organizationId: organization.id.trim()
                }, function (err, doc) {
                    if (err) {
                        console.log('Organization preference error', err.message)
                    }
                    console.log(`Organization preference created for: ${organization.id}`);

                });

                return organization;
            });
            defer.resolve(organization);
        }).catch((error: Error) => {
            defer.reject(error);
        });
        return defer.promise;
    }

    public update(id: string, orgAttributes: any): Promise<void> {
        const defer = deferred();
        sequelize.transaction(async (t: Transaction) => {
            let result = await models.Organization.update(orgAttributes, { where: { id: id } })
                .then((results: [number, Array<IOrganizationInstance>]) => {
                    if (results.length > 0) {
                        console.log(`Updated user with name ${id}.`);
                    } else {
                        console.log(`User with name ${id} does not exist.`);
                    }
                    return true;
                }).catch((error: Error) => {
                    return error;
                });
            defer.resolve(result);
        });
        return defer.promise;
    }

    public delete(id: string): Promise<void> {
        const defer = deferred();
        sequelize.transaction(async (t: Transaction) => {
            await models.Organization.destroy({ where: { id: id } }).then((afffectedRows: number) => {
                if (afffectedRows > 0) {
                    OrganizationPreference.deleteOne({ organizationId: id }, (err) => {
                        if (err) {
                            console.log('Error', err.message)
                        }
                    }).then(() => {
                        console.log('Delete Organization Preference', id);
                    });



                    QueryService.query(`DELETE FROM user_organizations WHERE org_id='${id}'`);

                    QueryService.query(`DELETE FROM customer_map WHERE org_id='${id}'`);
                }
                return true;
            }).catch((error: Error) => {
                defer.reject(error);
            });
            defer.resolve(true);
        });
        return defer.promise;
    }

    public static find(query: any): Promise<IOrganizationInstance> {
        if (typeof query === "string") {
            query = { email: query };
        }

        let promise = new Promise<IOrganizationInstance>((resolve: Function, reject: Function) => {
            sequelize.transaction((t: Transaction) => {
                return models.Organization.findOne({ where: query }).then((organization: IOrganizationInstance) => {
                    resolve(organization);
                }).catch((error: Error) => {
                    reject(error);
                });
            });
        });

        return promise;
    }


    public static lookup(user_id: any): Promise<any> {
        const query = `SELECT DISTINCT(T1.id) AS value, T1.name, T2.org_id AS 'selected', T2.role
                            FROM ditve_db.organizations AS T1
                        LEFT JOIN ditve_db.user_organizations AS T2
                        ON T1.id=T2.org_id
                        AND T2.user_id='${user_id}'`;

        let promise = new Promise<IOrganizationInstance>((resolve: Function, reject: Function) => {
            sequelize.transaction((t: Transaction) => {
                return QueryService.query(query).then((organizations: any) => {
                    resolve(organizations.results.map((organization: any) => {
                        return {
                            group: 'organizations',
                            text: organization.name,
                            value: organization.value,
                            selected: organization.selected,
                            role: organization.role
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