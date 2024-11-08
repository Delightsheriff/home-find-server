import { Router } from "express";
import { updateUser } from "../controllers/user/updateUser";
import { authToken } from "../middleware/auth";
const router = Router();

//@ts-ignore
router.put("/update-user", authToken, updateUser);

export default router;
