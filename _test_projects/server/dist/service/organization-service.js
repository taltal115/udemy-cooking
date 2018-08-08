"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../models/entities/index");
const sequelize_1 = require("sequelize");
const documents_1 = require("../models/documents");
const _1 = require(".");
const _2 = require("../models/enums/");
const general_1 = require("../models/general");
const deferred = require('deferred');
const uuidv4 = require('uuid/v4');
const config = require('../utils/config');
class OrganizationService extends general_1.Auth {
    retrieve() {
        let promise = new Promise((resolve, reject) => {
            if (this.is(_2.Roles.Super)) {
                index_1.models.Organization.findAll().then((orgs) => {
                    resolve(orgs);
                }).catch((error) => {
                    reject(error);
                });
            }
            else if (this.is(_2.Roles.Admin)) {
                index_1.models.UserOrganization.findAll({
                    where: {
                        org_id: this.auth.org_id,
                        role: {
                            [sequelize_1.Op.gt]: this.auth.role
                        }
                    },
                    attributes: ['user_id', 'role']
                }).then((users) => {
                    let u_ids = users.map(user => user.user_id);
                    index_1.models.Organization.findOne({
                        where: {
                            id: this.auth.org_id
                        },
                        include: [
                            {
                                model: index_1.models.User,
                                as: 'users',
                                required: false
                            }
                        ]
                    }).then((org) => {
                        if (org.users && org.users instanceof Array) {
                            org.users = org.users.filter(user => {
                                return u_ids.indexOf(user.id) != -1;
                            });
                        }
                        resolve(org);
                    }).catch((error) => {
                        reject(error);
                    });
                });
            }
        });
        return promise;
    }
    get(id) {
        let promise = new Promise((resolve, reject) => {
            index_1.sequelize.transaction((t) => {
                return index_1.models.Organization.findById(id).then((org) => {
                    resolve(org);
                }).catch((error) => {
                    reject(error);
                });
            });
        });
        return promise;
    }
    addUser(organization, user, role) {
        return _1.QueryService.query(`INSERT INTO user_organizations (org_id, user_id, role) VALUES ('${organization.id}', '${user.id}', ${role})`);
    }
    add(orgRequest) {
        const defer = deferred();
        var _self = this;
        index_1.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
            let orgAttributes = orgRequest;
            let organization = yield index_1.models.Organization.create(orgAttributes).then((organization) => {
                // Organization admin handling
                if (orgRequest.admin_email != '') {
                    _1.UserService.find(orgRequest.admin_email).then((user) => __awaiter(this, void 0, void 0, function* () {
                        let mailActivation = orgRequest && orgRequest.mailActivation == 'true';
                        if (user === null) {
                            let userService = new _1.UserService();
                            let user = {
                                firstName: 'Admin-' + organization.name,
                                lastName: 'Admin-' + organization.name,
                                picture: '/resources/images/user-profile/no-image.png',
                                email: orgRequest.admin_email,
                                mailActivation: mailActivation
                            };
                            userService.add(user).then((user) => {
                                _self.addUser(organization, user, _2.Roles.Admin);
                            });
                        }
                        else {
                            if (mailActivation == true) {
                                user.securityStamp = uuidv4();
                                var options = {};
                                options.to = user.email;
                                options.from = config.adminMail;
                                options.subject = 'DiTVe MAM System - Mail Activation';
                                options.template = 'mail-activate';
                                options.context = {
                                    name: {
                                        first: user.firstName,
                                        last: user.lastName,
                                    },
                                    domain: config.host,
                                    token: user.securityStamp
                                };
                                // only if 
                                yield _1.EmailService.send(options).then(() => {
                                    console.log(`An email was sent to ${user.email}`);
                                }).catch((error) => {
                                    user.isEmailBroken = true;
                                });
                                user.save();
                            }
                            _self.addUser(organization, user, _2.Roles.Admin);
                        }
                        return user;
                    }));
                }
                // Organization customer maping handle
                if (orgRequest.customer_id != '') {
                    _1.QueryService.query(`INSERT INTO customer_map (org_id, customer_id) VALUES ('${organization.id.trim()}', '${orgRequest.customer_id.trim()}')`);
                }
                // Organization preference handling
                documents_1.OrganizationPreference.create({
                    organizationId: organization.id.trim()
                }, function (err, doc) {
                    if (err) {
                        console.log('Organization preference error', err.message);
                    }
                    console.log(`Organization preference created for: ${organization.id}`);
                });
                return organization;
            });
            defer.resolve(organization);
        })).catch((error) => {
            defer.reject(error);
        });
        return defer.promise;
    }
    update(id, orgAttributes) {
        const defer = deferred();
        index_1.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
            let result = yield index_1.models.Organization.update(orgAttributes, { where: { id: id } })
                .then((results) => {
                if (results.length > 0) {
                    console.log(`Updated user with name ${id}.`);
                }
                else {
                    console.log(`User with name ${id} does not exist.`);
                }
                return true;
            }).catch((error) => {
                return error;
            });
            defer.resolve(result);
        }));
        return defer.promise;
    }
    delete(id) {
        const defer = deferred();
        index_1.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
            yield index_1.models.Organization.destroy({ where: { id: id } }).then((afffectedRows) => {
                if (afffectedRows > 0) {
                    documents_1.OrganizationPreference.deleteOne({ organizationId: id }, (err) => {
                        if (err) {
                            console.log('Error', err.message);
                        }
                    }).then(() => {
                        console.log('Delete Organization Preference', id);
                    });
                    _1.QueryService.query(`DELETE FROM user_organizations WHERE org_id='${id}'`);
                    _1.QueryService.query(`DELETE FROM customer_map WHERE org_id='${id}'`);
                }
                return true;
            }).catch((error) => {
                defer.reject(error);
            });
            defer.resolve(true);
        }));
        return defer.promise;
    }
    static find(query) {
        if (typeof query === "string") {
            query = { email: query };
        }
        let promise = new Promise((resolve, reject) => {
            index_1.sequelize.transaction((t) => {
                return index_1.models.Organization.findOne({ where: query }).then((organization) => {
                    resolve(organization);
                }).catch((error) => {
                    reject(error);
                });
            });
        });
        return promise;
    }
    static lookup(user_id) {
        const query = `SELECT DISTINCT(T1.id) AS value, T1.name, T2.org_id AS 'selected', T2.role
                            FROM ditve_db.organizations AS T1
                        LEFT JOIN ditve_db.user_organizations AS T2
                        ON T1.id=T2.org_id
                        AND T2.user_id='${user_id}'`;
        let promise = new Promise((resolve, reject) => {
            index_1.sequelize.transaction((t) => {
                return _1.QueryService.query(query).then((organizations) => {
                    resolve(organizations.results.map((organization) => {
                        return {
                            group: 'organizations',
                            text: organization.name,
                            value: organization.value,
                            selected: organization.selected,
                            role: organization.role
                        };
                    }));
                }).catch((error) => {
                    reject(error);
                });
            });
        });
        return promise;
    }
}
exports.OrganizationService = OrganizationService;
