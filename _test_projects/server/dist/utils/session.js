"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../models/entities/index");
const bcrypt = require("bcrypt");
var errors = require('./errors');
var config = require('./config');
var jwt = require('jsonwebtoken');
const deferred = require('deferred');
class Session {
    constructor() {
        this.readonly = config.session.readonly;
    }
    static initiate(email, password, res) {
        const defer = deferred();
        index_1.models.User.findOne({
            where: {
                email: email
            }
        }).then(function (user) {
            if (!user) {
                throw errors.types.invalidParams({
                    path: 'email', message: 'Invalid email and/or password'
                });
            }
            bcrypt.compare(password, user.password).then(function (isEqual) {
                if (isEqual) {
                    var duration = config.session.duration;
                    var expires = new Date(Date.now() + duration * 1000);
                    var token = jwt.sign({ u_id: user.id }, config.jwtSecret, { expiresIn: duration });
                    defer.resolve({
                        user: user,
                        token: token,
                        expires: expires
                    });
                }
                defer.reject(null);
            });
        });
        return defer.promise;
    }
    static verify(request) {
        return new Promise(function (resolve, reject) {
            // https://jwt.io/introduction/#how-do-json-web-tokens-work-
            var header = request.headers && request.headers.authorization;
            var matches = header ? /^Bearer (\S+)$/.exec(header) : null;
            var token = matches && matches[1];
            if (!token) {
                return reject(errors.types.unauthorized('No authorization token was found'));
            }
            jwt.verify(token, config.jwtSecret, function (err, decoded) {
                if (err) {
                    return reject(errors.fromJwtError(err));
                }
                index_1.models.User.scope('nested').findOne({
                    where: {
                        id: decoded.u_id
                    }
                }).then(function (user) {
                    if (!user) {
                        throw errors.types.authTokenInvalid();
                    }
                    resolve({
                        user: user,
                        token: token,
                        expires: new Date(decoded.exp)
                    });
                }).catch(function (err) {
                    reject(err);
                });
            });
        });
    }
}
exports.Session = Session;
