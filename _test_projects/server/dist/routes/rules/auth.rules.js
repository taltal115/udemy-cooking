"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const check_1 = require("express-validator/check");
const index_1 = require("../../models/entities/index");
exports.authRules = {
    login: [
        check_1.check('email')
            .isEmail().withMessage('Invalid email format')
            .custom(email => index_1.models.User.findOne({ where: { email: email } }).then(u => !!u)).withMessage('Invalid email or password'),
        check_1.check('password')
            .custom((password, { req }) => {
            return index_1.models.User.findOne({ where: { email: req.body.email } })
                .then(u => bcrypt.compare(password, u.password));
        }).withMessage('Invalid email or password')
    ],
    resetpassword: [
        check_1.check('email')
            .isEmail().withMessage('Invalid email format')
            .custom(email => index_1.models.User.findOne({ where: { email: email } }).then(u => !!u)).withMessage('Invalid email or password'),
        check_1.check('password').isLength({ min: 6 }).withMessage('Password length should be greater then 6'),
        check_1.check('confirmPassword').custom((confirmPassword, { req }) => req.body.password === confirmPassword).withMessage('Passwords are different')
    ],
    authorized: [
    // Add here authorized rules
    ]
};
