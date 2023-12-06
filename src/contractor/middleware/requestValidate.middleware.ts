import { body } from "express-validator";

export const validateSignupParams = [
  body("email").isEmail(),
  body("firstName").notEmpty(),
  body("dateOfBirth").notEmpty(),
  body("lastName").notEmpty(),
  body("password").notEmpty(),
];

export const validateEmailVerificatioParams = [
    body("email").isEmail(),
    body("otp").notEmpty(),
  ];