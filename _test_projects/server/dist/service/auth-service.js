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
const bcrypt = require("bcrypt");
const index_1 = require("../models/entities/index");
const service_1 = require("../service");
const deferred = require('deferred');
//const auth = require("../utils/auth").default;
class AuthService {
    login(email, password) {
        const defer = deferred();
        index_1.models.User.findOne({
            where: {
                email: email
            },
            include: [
                {
                    model: index_1.models.Organization,
                    as: 'organizations',
                    required: false,
                    attributes: ['id', 'name']
                }
            ]
        }).then((user) => {
            if (!user) {
                defer.reject({
                    path: 'email', message: "The email address you provided doesn't recognized"
                });
            }
            else if (user.emailConfirmed == false) {
                defer.reject({
                    path: 'email confirmation', message: "You need to activate your account first"
                });
            }
            else if (user.isLocked == true) {
                defer.reject({
                    path: 'loack', message: "Your accont is locked, Please contact to the administrator"
                });
            }
            else if (user.password == "") {
                defer.reject({
                    path: 'password', message: "You didn't set your password"
                });
            }
            else if (user.loginFailedCount >= 5) {
                defer.reject({
                    path: 'password', message: "You didn't set your password"
                });
            }
            else {
                bcrypt.compare(password, user.password).then(function (isEqual) {
                    if (isEqual) {
                        defer.resolve(user);
                    }
                    else {
                        var instance = user;
                        instance.loginFailedCount = user.loginFailedCount + 1;
                        if (instance.loginFailedCount >= 5) {
                            instance.isLocked = true;
                        }
                        instance.save().then(function () {
                            defer.reject({
                                path: 'login', message: "Login failed"
                            });
                        });
                    }
                });
            }
        });
        return defer.promise;
    }
    role(user_id, org_id) {
        const defer = deferred();
        index_1.models.UserOrganization.findOne({
            where: {
                user_id: user_id, org_id: org_id
            },
            attributes: ['role']
        }).then((role) => {
            defer.resolve(role);
        });
        return defer.promise;
    }
    getUser(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield service_1.UserService.find(query);
        });
    }
}
exports.AuthService = AuthService;
