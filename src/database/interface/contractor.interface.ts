import { Document, Types, ObjectId } from "mongoose";

export interface IContractorReg extends Document {
  _id: ObjectId;
  
  email: string;
  password: string;
  firstName: string;
  dateOfBirth: string;
  lastName: string;

  passwordOtp: {
    otp: string;
    createdTime: Date;
    verified: boolean;
  };
  emailOtp: {
    otp: string;
    createdTime: Date;
    verified: boolean;
  };
  phoneNumberOtp: {
    otp: string;
    createdTime: Date;
    verified: boolean;
  };
}
