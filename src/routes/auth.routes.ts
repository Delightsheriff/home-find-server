import { Router } from "express";
import { register } from "../controllers/auth/register";
import { verifyEmail } from "../controllers/auth/verifyEmail";
import { success } from "../controllers/auth/sucess";
import { resendVerificationEmail } from "../controllers/auth/resendVerificationEmail";
import { login } from "../controllers/auth/login";
import { refreshToken } from "../controllers/auth/refreshToken";
import { logout } from "../controllers/auth/signout";
import { authToken } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.get("/verify-email", verifyEmail);
router.get("/email-verified-success", success);
router.post("/resend-verification-email", resendVerificationEmail);
// @ts-ignore
router.post("/login", login);
// @ts-ignore
router.post("/refresh-token", refreshToken);
// @ts-ignore
router.post("/logout", authToken, logout);

export default router;
