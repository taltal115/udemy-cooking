import * as bcrypt from 'bcrypt';
import { models } from "../models/entities/index";
import { IUserInstance } from "../models";
import { UserService } from "../service";

const deferred = require('deferred');
//const auth = require("../utils/auth").default;

export class AuthService {
    login(email: string, password: string): Promise<IUserInstance> {
        const defer = deferred();
        models.User.findOne({
            where: {
                email: email
            },
            include: [
                {
                    model: models.Organization,
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
                        var instance: IUserInstance = (user as IUserInstance);

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


    role(user_id: string, org_id: string): Promise<any> {
        const defer = deferred();

        models.UserOrganization.findOne({
            where: {
                user_id: user_id, org_id: org_id
            },
            attributes: ['role']
        }).then((role) => {
            defer.resolve(role);
        });

        return defer.promise;
    }

    async getUser(query: any): Promise<IUserInstance> {
        return await UserService.find(query);
    }
}