// // Middleware to verify access token
// import { NextFunction, Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import { ENVIRONMENT } from "../common/config/environment";
// import { IUserDocument } from "../models/userModel";
// import { AuthenticatedRequest } from "./AuthenticatedRequest";

// export const authToken = (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) {
//     return res
//       .status(401)
//       .json({ statusText: "fail", message: "Access token required" });
//   }

//   jwt.verify(
//     token,
//     ENVIRONMENT.JWT.ACCESS_KEY,
//     // @ts-ignore
//     (err: jwt.VerifyErrors | null, user: IUserDocument) => {
//       if (err) {
//         return res.status(403).json({
//           statusText: "fail",
//           message: "Invalid or expired token, Please Login again",
//         });
//       }
//       req.user = user;
//       next();
//     },
//   );
// };

import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { ENVIRONMENT } from "../common/config/environment";
import { IUserDocument } from "../models/userModel";
import { AuthenticatedRequest } from "./AuthenticatedRequest";

interface JWTPayload {
  id: string;
  iat?: number;
  exp?: number;
}

export const authToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        statusText: "fail",
        message: "Access token required",
      });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, ENVIRONMENT.JWT.ACCESS_KEY) as JWTPayload;
    // console.log(decoded);

    if (!decoded.id) {
      return res.status(403).json({
        statusText: "fail",
        message: "Invalid token payload",
      });
    }

    // Set just the user ID in the request
    req.user = {
      id: decoded.id,
    } as unknown as IUserDocument;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        statusText: "fail",
        message: "Token has expired, please login again",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({
        statusText: "fail",
        message: "Invalid token, please login again",
      });
    }

    return res.status(500).json({
      statusText: "error",
      message: "Internal server error",
    });
  }
};
