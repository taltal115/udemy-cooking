"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const auth_rules_1 = require("./rules/auth.rules");
const check_1 = require("express-validator/check");
const service_1 = require("../service");
const auth_1 = require("../utils/auth");
// import * as opn from "opn";
class AuthRoute {
    static init(router) {
        const service = new service_1.AuthService();
        router.get("/auth/:action", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let user;
            let action = req.params && req.params.action;
            switch (action) {
                case "activate":
                case "restore":
                    var token = req.query['token'];
                    user = yield service.getUser({ security_stamp: token });
                    if (user != null) {
                        user.emailConfirmed = true;
                        user.save();
                        return res.status(301).redirect('/#' + action + '/' + user.securityStamp);
                    }
                    return res.status(301).redirect('/#error/403001');
                case "get-user":
                    var token = req.query['token'];
                    user = yield service.getUser({ security_stamp: token });
                    if (user != null) {
                        return res.status(200).json({ "success": true, user: user });
                    }
                    break;
                case "session":
                    yield auth_1.VerifyToken(req).then(function (session) {
                        return res.status(200).json({ success: true, view: 'main', session: session });
                    }).catch(function (err) {
                        return res.status(403).json({ success: false, view: 'auth', session: null, error: err });
                    });
                    break;
                case "logout":
                    yield auth_1.VerifyToken(req).then(function (session) {
                        return res.status(200).json({ success: true, view: 'auth', session: null });
                    }).catch(function (err) {
                        return res.status(403).json({ success: false, view: 'auth', session: null, error: err });
                    });
                    break;
                default:
                    res.status(500).redirect('/#unknown');
                    break;
            }
        }));
        router.post("/auth/reset-password", auth_rules_1.authRules['resetpassword'], (req, res) => {
            const errors = check_1.validationResult(req.body);
            if (!errors.isEmpty()) {
                return res.status(422).json(errors.array());
            }
            let token = req.body && req.body.reset_token;
            let password = req.body && req.body.password;
            service_1.UserService.resetPassword(token, password).then((user) => {
                res.status(200).json({ "success": true, user: user });
            });
        });
        router.post("/auth/restore-password", (req, res) => {
            let email = req.body && req.body.email;
            service_1.UserService.restorePassword(email).then((user) => {
                res.status(200).json({ "success": true, user: user });
            }).catch((error) => {
                res.status(403).json({ success: false, session: null, error: error });
            });
        });
        router.post("/auth/login", (req, res, next) => {
            // authRules['login'],
            // const errors = validationResult(req.body);
            // if (!errors.isEmpty()) {
            //     return res.status(422).json(errors.array())
            // }
            var body = req.body;
            service.login(body.email, body.password)
                .then((user) => {
                if (body.orgnization) {
                    service.role(user.id, body.orgnization).then((role) => {
                        var _role = role.getDataValue('role');
                        var session = auth_1.SignToken(user, body.orgnization, _role);
                        res.json({ "success": true, view: 'main', session: session });
                    });
                }
                else {
                    if (user.organizations && user.organizations.length > 1) {
                        var session = auth_1.SignToken(user, '', -1);
                        res.json({ "success": true, view: 'auth', organizations: user.organizations, session: session });
                    }
                    else {
                        var organization = user.organizations[0];
                        // in a case user didn't attached to organization yet
                        if (organization === undefined) {
                            var session = auth_1.SignToken(user, '', -1);
                            res.json({ "success": true, view: 'auth', session: session });
                        }
                        else {
                            service.role(user.id, organization.id).then((role) => {
                                var _role = role.getDataValue('role');
                                var session = auth_1.SignToken(user, organization.id, _role);
                                res.json({ "success": true, view: 'main', session: session });
                            });
                        }
                    }
                }
            })
                .catch((error) => {
                res.status(403).json({ success: false, view: 'auth', session: null, error: error });
            });
        });
    }
}
module.exports = AuthRoute;
