"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = require("express-validator/check");
const index_1 = require("../../models/entities/index");
exports.userRules = {
    register: [
        check_1.check('email').isEmail().withMessage('Invalid email format')
            .custom(email => index_1.models.User.find({ where: { email } }).then(u => !!!u)).withMessage('Email exists'),
        check_1.check('firstName').isEmpty().withMessage('Please provide first name'),
        check_1.check('lastName').isEmpty().withMessage('Please provide last name')
    ],
    activate: [
        check_1.check('password').isLength({ min: 6 }).withMessage('Password length should be greater then 6'),
        check_1.check('confirmPassword').custom((confirmPassword, { req }) => req.body.password === confirmPassword).withMessage('Passwords are different')
    ]
};
