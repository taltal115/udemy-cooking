
import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { models } from "../models/entities";
import { ISession } from "../models/";
//IUserAttributes, 

const deferred = require('deferred');
var config = require("./config.js");
var errors = require("./errors.js");

function verify(request: Request): Promise<any> {
    let defer = deferred();
    var header = request.headers && request.headers['authorization'];
    var token = header && header.replace(/^Bearer (\S+)$/, "$1");

    if (!token) {
        defer.reject('No authorization token was found');
    }
    else {
        jwt.verify(token, config.jwtSecret, function (err, decoded) {
            if (err) {
                defer.reject(err);
            }
            else {
                defer.resolve(decoded);
            }
        });
    }
    return defer.promise;
}

export function Authorized(request: Request, res: Response, next: NextFunction) {
    verify(request).then((token => {
        request.session = token
        //console.log('Authorized: ', token, request)
        next();
    })).catch((err) => {
        res.status(401).json({ message: "Invalid credentials", view: 'auth', errors: errors.fromJwtError(err) });
    });
}

export function SignToken(user: any, orgId: string, role: number): ISession {
    var duration = config.session.duration;
    var expires = new Date(Date.now() + duration * 1000);
    var token = jwt.sign({ 
        u_id: user.id,
        o_id: orgId,
        role: role
    }, config.jwtSecret, { expiresIn: duration });

    user.setDataValue('role', role);

    return {
        user: user,
        token: token,
        expires: expires
    };
}

export function VerifyToken(request: Request): Promise<ISession> {
    const defer = deferred();
    verify(request).then((token => {
        models.User.findOne({
            where: {
                id: token.u_id
            },
            attributes: ['id', 'email', 'first_name', 'last_name', 'picture']
        }).then(function (user) {
            if (!user) {
                defer.reject(errors.types.authTokenInvalid());
            }

            var duration = config.session.duration;
            var expires = new Date(Date.now() + duration * 1000);

            defer.resolve({
                user: user,
                token: token,
                expires: expires
            });

        }).catch(function (err) {
            defer.reject(err);
        });
    })).catch((err) => {
        defer.reject(err);
    })
    return defer.promise;
}





//export default new Auth();




// class Auth {

//     public initialize = () => {
//         console.log('Auth initialize', this)
//         passport.use("jwt", this.getStrategy());
//         return passport.initialize();
//     }

//     public authenticate = (callback) => passport.authenticate("jwt", { session: false, failWithError: true }, callback);

//     public genToken = (user: any): Object => {
//         let expires = moment().utc().add({ days: 7 }).unix();
//         // let token = jwt.encode({
//         //     exp: expires,
//         //     username: user.username
//         // }, config.jwtSecret);

//         var token = jwt.sign({
//             u_id: user.id,
//             exp: expires,
//         }, config.jwtSecret);

//         return token;
//         // {
//         //     token: "JWT " + token,
//         //     expires: moment.unix(expires).format(),
//         //     user: user._id
//         // };
//     }

//     public verify(req: any): Promise<any> {
//         const defer = deferred();
//         let request: Request = req as Request;

//         var header = request.headers && request.headers['authorization'];
//         var token = header && header.replace(/^Bearer (\S+)$/, "$1");

//         if (!token) {
//             defer.reject('No authorization token was found');
//         }
//         else {
//             jwt.verify(token, config.jwtSecret, function (err, decoded) {
//                 if (err) {
//                     defer.reject(err);
//                 }
//                 else {
//                     defer.resolve(decoded);
//                 }
//             });
//         }
//         return defer.promise;
//     }

//     // public login = async (req, res) => {
//     //     try {
//     //         req.checkBody("username", "Invalid username").notEmpty();
//     //         req.checkBody("password", "Invalid password").notEmpty();

//     //         let errors = req.validationErrors();
//     //         if (errors) throw errors;

//     //         let user = await User.findOne({ "username": req.body.username }).exec();

//     //         if (user === null) throw "User not found";

//     //         let success = await user.comparePassword(req.body.password);
//     //         if (success === false) throw "";

//     //         res.status(200).json(this.genToken(user));
//     //     } catch (err) {
//     //         res.status(401).json({ "message": "Invalid credentials", "errors": err });
//     //     }
//     // }

//     private getStrategy = (): Strategy => {
//         const params = {
//             secretOrKey: config.jwtSecret,
//             //jwtFromRequest: ExtractJwt.fromAuthHeader(),
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             passReqToCallback: true
//         };

//         return new Strategy(params, (req, payload: any, done) => {
//             // User.findOne({ "username": payload.username }, (err, user) => {
//             //     /* istanbul ignore next: passport response */
//             //     if (err) {
//             //         return done(err);
//             //     }
//             //     /* istanbul ignore next: passport response */
//             //     if (user === null) {
//             //         return done(null, false, { message: "The user in the token was not found" });
//             //     }

//             //     return done(null, { _id: user._id, username: user.username });
//             // });
//         });
//     }



// }







// const passport = require('passport');
// const passportJWT = require("passport-jwt");

// const ExtractJWT = passportJWT.ExtractJwt;

// //const LocalStrategy = require('passport-local').Strategy;
// const JWTStrategy = passportJWT.Strategy;

// var config = require("./config.js");
// // var ExtractJwt = passportJWT.ExtractJwt;  
// // var Strategy = passportJWT.Strategy;  
// // var params = {  
// //     secretOrKey: config.jwtSecret,
// //     jwtFromRequest: ExtractJwt.fromAuthHeader()
// // };

// module.exports = function () {
//     // passport.use(new LocalStrategy({
//     //     usernameField: 'email',
//     //     passwordField: 'password'
//     // },
//     //     function (email, password, cb) {

//     //         // //Assume there is a DB module pproviding a global UserModel
//     //         // return UserModel.findOne({ email, password })
//     //         //     .then(user => {
//     //         //         if (!user) {
//     //         //             return cb(null, false, { message: 'Incorrect email or password.' });
//     //         //         }

//     //         //         return cb(null, user, {
//     //         //             message: 'Logged In Successfully'
//     //         //         });
//     //         //     })
//     //         //     .catch(err => {
//     //         //         return cb(err);
//     //         //     });
//     //     }
//     // ));

//     // var strategy = new Strategy(params, function(payload, done) {
//     //     console.log('payload', payload)
//     //     // var user = users[payload.id] || null;
//     //     // if (user) {
//     //     //     return done(null, {
//     //     //         id: user.id
//     //     //     });
//     //     // } else {
//     //     //     return done(new Error("User not found"), null);
//     //     // }
//     // });
//     // passport.use(strategy);
//     passport.use(new JWTStrategy({
//         //jwtFromRequest: ExtractJwt.fromAuthHeader()
//         jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//         secretOrKey: config.jwtSecret
//     },
//         function (payload, cb) {

//             //find the user in db if needed
//             // return UserModel.findOneById(jwtPayload.id)
//             //     .then(user => {
//             //         return cb(null, user);
//             //     })
//             //     .catch(err => {
//             //         return cb(err);
//             //     });
//         }
//     ));
//     return {
//         initialize: function () {
//             console.log('Auth initialize')
//             return passport.initialize();
//         },
//         authenticate: function () {

//             return passport.authenticate("jwt", {
//                 session: false
//             });
//         }
//     };
// };




// const passport = require('passport');
// const passportJWT = require("passport-jwt");

// const ExtractJWT = passportJWT.ExtractJwt;
// const JWTStrategy = passportJWT.Strategy;
// const config = require('./config');

// var ExtractJwt = passportJWT.ExtractJwt;  
// var Strategy = passportJWT.Strategy;

// var params = {  
//     secretOrKey: config.jwtSecret,
//     jwtFromRequest: ExtractJwt.fromAuthHeader()
// };

// module.exports = function() {  
//     var strategy = new Strategy(params, function(payload, done) {
//         var user = users[payload.id] || null;
//         if (user) {
//             return done(null, {
//                 id: user.id
//             });
//         } else {
//             return done(new Error("User not found"), null);
//         }
//     });
//     passport.use(strategy);
//     return {
//         initialize: function() {
//             return passport.initialize();
//         },
//         authenticate: function() {
//             return passport.authenticate("jwt", cfg.jwtSession);
//         }
//     };
// };

// //const LocalStrategy = require('passport-local').Strategy;

// // passport.use(new LocalStrategy({
// //     usernameField: 'email',
// //     passwordField: 'password'
// // },
// //     function (email, password, cb) {

// //         // //Assume there is a DB module pproviding a global UserModel
// //         // return UserModel.findOne({ email, password })
// //         //     .then(user => {
// //         //         if (!user) {
// //         //             return cb(null, false, { message: 'Incorrect email or password.' });
// //         //         }

// //         //         return cb(null, user, {
// //         //             message: 'Logged In Successfully'
// //         //         });
// //         //     })
// //         //     .catch(err => {
// //         //         return cb(err);
// //         //     });
// //     }
// // ));


