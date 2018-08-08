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
const _1 = require("../models/general/");
const _2 = require(".");
const enums_1 = require("../models/enums");
const deferred = require('deferred');
const uuidv4 = require('uuid/v4');
const config = require('../utils/config');
class UserService extends _1.Auth {
    retrieve() {
        let promise = new Promise((resolve, reject) => {
            if (this.is(enums_1.Roles.Super)) {
                index_1.models.User.findAll({}).then((users) => {
                    resolve(users);
                }).catch((error) => {
                    reject(error);
                });
            }
            else if (this.is(enums_1.Roles.Admin)) {
                index_1.models.UserOrganization.findAll({
                    where: {
                        org_id: this.auth.org_id,
                        role: {
                            [sequelize_1.Op.gt]: this.auth.role
                        }
                    },
                    attributes: ['user_id', 'role']
                }).then((org_users) => {
                    let u_ids = org_users.map(user => user.user_id);
                    index_1.models.User.findAll({
                        where: { id: { [sequelize_1.Op.in]: u_ids } }
                    }).then((users) => {
                        resolve(users);
                    }).catch((error) => {
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
    get(id) {
        let promise = new Promise((resolve, reject) => {
            index_1.sequelize.transaction((t) => {
                return index_1.models.User.findById(id).then((user) => {
                    resolve(user);
                }).catch((error) => {
                    reject(error);
                });
            });
        });
        return promise;
    }
    sendMailActivation(user, token) {
        let options = {};
        options.to = user.email;
        options.from = config.adminMail;
        options.subject = 'DiTVe MAM System - Mail Activation';
        options.template = 'mail-activate';
        options.context = {
            name: {
                first: user.firstName,
                last: user.lastName,
            },
            token: token
        };
        return _2.EmailService.send(options);
    }
    add(userRequest) {
        const defer = deferred();
        let _self = this;
        index_1.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
            let userAttributes = userRequest;
            if (userRequest.mailActivation) {
                userAttributes.securityStamp = uuidv4();
            }
            index_1.models.User.create(userAttributes).then((user) => {
                if (userRequest.mailActivation == true) {
                    _self.sendMailActivation(user, userAttributes.securityStamp);
                }
                if (_self.is(enums_1.Roles.Admin)) {
                    let org_id = "" + _self.auth.org_id;
                    _self.addOrg(org_id, user.id, enums_1.Roles.User);
                }
                let userPreference = new documents_1.UserPreference({
                    userId: user.id,
                    orgId: _self.auth.org_id
                });
                documents_1.UserPreference.create(userPreference, function (err, doc) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            console.log('Error', err.message);
                        }
                        console.log('User Preference was created');
                    });
                });
                defer.resolve(user);
            }).catch((error) => {
                defer.reject(error);
            });
        }));
        return defer.promise;
    }
    update(id, requestData) {
        var _self = this;
        let p1 = new Promise((resolve, reject) => {
            index_1.models.User.findById(id).then((user) => __awaiter(this, void 0, void 0, function* () {
                if (user == null) {
                    reject({
                        path: 'id', message: `User with id '${id}' not found`
                    });
                }
                if (requestData.mailActivation) {
                    var token = uuidv4();
                    yield _self.sendMailActivation(user, token).then(() => {
                        requestData.emailConfirmed = true;
                        requestData.securityStamp = token;
                    })
                        .catch(e => {
                        return e;
                    });
                }
                yield user.update(requestData).then(() => true)
                    .catch(e => {
                    return e;
                });
                resolve(user);
            })).catch(e => {
                reject(e);
            });
        });
        let p2 = new Promise((resolve, reject) => {
            var permissions = requestData.permissions;
            if (permissions instanceof Array) {
                _self.clearOrgs(id);
                permissions.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                    yield _self.addOrg(item.organization, id, item.role);
                }));
            }
            resolve(true);
        });
        const defer = deferred();
        Promise.all([p1, p2]).then((data) => {
            defer.resolve(data);
        });
        return defer.promise;
    }
    delete(id) {
        const defer = deferred();
        index_1.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
            yield index_1.models.User.destroy({ where: { id: id } }).then((afffectedRows) => __awaiter(this, void 0, void 0, function* () {
                // TODO: notify
                if (afffectedRows > 0) {
                    yield documents_1.UserPreference.deleteOne({ userId: id }, (err) => {
                        // TODO: notify
                    });
                }
                defer.resolve(null);
            })).catch((error) => {
                defer.reject(error);
            });
        }));
        return defer.promise;
    }
    clearOrgs(user_id) {
        return _2.QueryService.query(`DELETE FROM user_organizations WHERE user_id = '${user_id}'`);
    }
    addOrg(org_id, user_id, role) {
        _2.QueryService.query(`INSERT INTO user_organizations (org_id, user_id, role) VALUES ('${org_id}', '${user_id}', ${role})`);
    }
    static find(query) {
        if (typeof query === "string") {
            query = { email: query };
        }
        return new Promise((resolve, reject) => {
            index_1.models.User.findOne({ where: query }).then((user) => {
                return resolve(user);
            }).catch((error) => {
                return reject(error);
            });
        });
    }
    static restorePassword(email) {
        const defer = deferred();
        index_1.models.User.findOne({ where: { email: email } }).then((user) => __awaiter(this, void 0, void 0, function* () {
            if (user == null) {
                defer.reject({
                    path: 'email', message: "The email address you provided doesn't recognized"
                });
            }
            else {
                user.securityStamp = uuidv4();
                user.emailConfirmed = false;
                user.password = '';
                yield user.save().then(() => {
                    var options = {};
                    options.to = user.email;
                    options.from = 'DiTve MAM <admin@ditve.tv>';
                    options.template = 'restore-password';
                    options.subject = 'DiTVe - Restore Password';
                    options.context = {
                        name: {
                            first: user.firstName,
                            last: user.lastName,
                        },
                        token: user.securityStamp
                    };
                    _2.EmailService.send(options).then(() => {
                        defer.resolve(user);
                    });
                }).catch((error) => {
                    defer.reject(error.message);
                });
            }
        })).catch((error) => {
            defer.reject(error.message);
        });
        return defer.promise;
    }
    static resetPassword(token, password) {
        const defer = deferred();
        index_1.models.User.findOne({ where: { securityStamp: token } }).then((user) => {
            if (user == null) {
                defer.reject({
                    path: 'token', message: "The token you provided doesn't recognized"
                });
            }
            else {
                user.password = password;
                user.isLocked = false;
                user.securityStamp = '';
                user.save().then(() => {
                    defer.resolve(user);
                });
            }
        }).catch((error) => {
            defer.reject(error);
        });
        return defer.promise;
    }
}
exports.UserService = UserService;
