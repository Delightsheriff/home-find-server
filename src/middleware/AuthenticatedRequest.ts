import { Request } from "express";
import { IUserDocument } from "../models/userModel";

export interface AuthenticatedRequest extends Request {
  user?: IUserDocument;
  files?:
    | Express.Multer.File[]
    | { [fieldname: string]: Express.Multer.File[] };
}
