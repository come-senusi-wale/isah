import { contractorSignUpController, contractorVerifiedEmailController } from "../controllers/conttractorReg.controller";
import { validateEmailVerificatioParams, validateSignupParams } from "../middleware/requestValidate.middleware";

const express = require("express");
const router = express.Router();


router.post("/contractor_signup", validateSignupParams, contractorSignUpController ); // contractor signup
router.post("/contractor_email_verification", validateEmailVerificatioParams, contractorVerifiedEmailController ); // contractor signup

export default router;