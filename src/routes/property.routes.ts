import { Router } from "express";
import { allProperties } from "../controllers/properties/allProperties";
import { getProperty } from "../controllers/properties/getProperty";
import { deleteProperty } from "../controllers/properties/deleteProperty";
import { authToken } from "../middleware/auth";
import { getOwnerProperties } from "../controllers/properties/myProperties";
import { postProperty } from "../controllers/properties/postProperty";
import { upload } from "../common/utils/upload";

const router = Router();

//@ts-ignore
router.get("/all-properties", allProperties);
//@ts-ignore
router.get("/get-property/:id", getProperty);
router.post(
  "/post-property",
  //@ts-ignore
  authToken,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "ownershipDocument", maxCount: 1 },
    // { name: "video", maxCount: 1 },
  ]),
  postProperty,
);
//@ts-ignore
router.get("/my-property", authToken, getOwnerProperties);
//@ts-ignore
router.delete("/delete-property", authToken, deleteProperty);

export default router;
