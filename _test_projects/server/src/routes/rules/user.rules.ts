import { check } from 'express-validator/check'
import { models } from "../../models/entities/index";

export const userRules = {
  register: [
    check('email').isEmail().withMessage('Invalid email format')
      .custom(email => models.User.find({ where: { email } }).then(u => !!!u)).withMessage('Email exists'),
    check('firstName').isEmpty().withMessage('Please provide first name'),
    check('lastName').isEmpty().withMessage('Please provide last name')
  ],
  activate: [
    check('password').isLength({ min: 6 }).withMessage('Password length should be greater then 6'),
    check('confirmPassword').custom((confirmPassword, { req }) => req.body.password === confirmPassword).withMessage('Passwords are different')
  ]
}