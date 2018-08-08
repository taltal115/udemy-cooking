import * as bcrypt from 'bcrypt'
import { check } from 'express-validator/check'
import { models } from "../../models/entities/index";

export const authRules = {
  login: [
    check('email')
      .isEmail().withMessage('Invalid email format')
      .custom(email => models.User.findOne({ where: { email: email } }).then(u => !!u)).withMessage('Invalid email or password'),
    check('password')
      .custom((password, { req }) => {
        return models.User.findOne({ where: { email: req.body.email } })
          .then(u => bcrypt.compare(password, u!.password))
      }).withMessage('Invalid email or password')
  ],
  resetpassword: [
    check('email')
      .isEmail().withMessage('Invalid email format')
      .custom(email => models.User.findOne({ where: { email: email } }).then(u => !!u)).withMessage('Invalid email or password'),
    check('password').isLength({ min: 6 }).withMessage('Password length should be greater then 6'),
    check('confirmPassword').custom((confirmPassword, { req }) => req.body.password === confirmPassword).withMessage('Passwords are different')
  ],
  authorized: [
    // Add here authorized rules
  ]
}