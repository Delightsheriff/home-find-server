import { Router } from "express";
import { updateUser } from "../controllers/user/updateUser";
import { updatePhoto } from "../controllers/user/updatePhoto";
import { authToken } from "../middleware/auth";
import { upload } from "../common/utils/upload";
const router = Router();

//@ts-ignore
router.put("/update-user", authToken, updateUser);
//@ts-ignore
router.post("/update-photo", authToken, upload.single("file"), updatePhoto);

export default router;
