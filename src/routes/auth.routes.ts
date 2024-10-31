import { Router } from "express";
import { register } from "../controllers/auth/register";
import { verifyEmail } from "../controllers/auth/verifyEmail";
import { success } from "../controllers/auth/sucess";
import { resendVerificationEmail } from "../controllers/auth/resendVerificationEmail";
import { login } from "../controllers/auth/login";

const router = Router();

router.post("/register", register);
router.get("/verify-email", verifyEmail);
router.get("/email-verified-success", success);
router.post("/resend-verification-email", resendVerificationEmail);
// @ts-ignore
router.post("/login", login);

export default router;
