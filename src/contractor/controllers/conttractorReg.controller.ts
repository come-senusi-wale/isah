import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import ContractorRegModel from "../../database/models/contractor.model";
import { OTP_EXPIRY_TIME, generateOTP } from "../../utils/otpGenerator";
import { sendEmail } from "../../utils/send_email_utility";


//contractor signup /////////////
export const contractorSignUpController = async (
    req: Request,
    res: Response,
) => {

  try {
    const {
      email,
      password,
      firstName,
      dateOfBirth,
      lastName,

    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // try find user with the same email
    const userEmailExists = await ContractorRegModel.findOne({ email });
    
     // check if user exists
     if (userEmailExists) {
      return res
        .status(401)
        .json({ message: "Email or Mobile Number exists already" });
    }

    const otp = generateOTP()

        const createdTime = new Date();

        const emailOtp = {
            otp,
            createdTime,
            verified : false
        }

        let emailData = {
            emailTo: email,
            subject: "email verification",
            otp,
            firstName: firstName,
        };

        sendEmail(emailData);



    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    const contractor = new ContractorRegModel({
      email: email,
      firstName: firstName,
      dateOfBirth: dateOfBirth,
      lastName: lastName,
      password: hashedPassword,
      emailOtp
    });
    
    let contractorSaved = await contractor.save();

    res.json({
      message: "Signup successful",
      user: {
        id: contractorSaved._id,
        firstName: contractorSaved.firstName,
        lastName: contractorSaved.lastName,
        email: contractorSaved.email,
        dateOfbirth: contractorSaved.dateOfBirth,
       
      },

    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


//contractor verified email /////////////
export const contractorVerifiedEmailController = async (
    req: Request,
    res: Response,
) => {

  try {
    const {
        email,
        otp
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // try find contractor with the same email
    const contractor = await ContractorRegModel.findOne({ email });
    
    // check if contractor exists
    if (!contractor) {
     return res
       .status(401)
       .json({ message: "invalid email" });
   }

   if (contractor.emailOtp.otp != otp) {
       return res
       .status(401)
       .json({ message: "invalid otp" });
   }

   if (contractor.emailOtp.verified) {
       return res
       .status(401)
       .json({ message: "email already verified" });
   }

   const timeDiff = new Date().getTime() - contractor.emailOtp.createdTime.getTime();
   if (timeDiff > OTP_EXPIRY_TIME) {
       return res.status(400).json({ message: "otp expired" });
   }

   contractor.emailOtp.verified = true;

   await contractor.save();

    
   return res.json({ message: "email verified successfully" });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}
