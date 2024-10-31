import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateAccessToken } from "../../common/utils/helpers";
import { ENVIRONMENT } from "../../common/config/environment";

interface RefreshTokenPayload extends JwtPayload {
  userId: string;
}

export const refreshToken = (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  console.log(req.body);

  if (!refreshToken)
    return res.status(401).json({
      statusText: "fail",
      message: "No refresh token provided.",
    });

  jwt.verify(
    refreshToken,
    ENVIRONMENT.JWT.REFRESH_KEY,
    (err: Error | null, decoded: JwtPayload | string | undefined) => {
      if (err || !decoded || typeof decoded === "string")
        return res.sendStatus(403);
      const user = decoded as RefreshTokenPayload;
      console.log(user);
      const userId = user.userId;
      const accessToken = generateAccessToken(userId);
      // Send success message with the access token
      res.json({
        statusText: "success",
        message: "Access token refreshed successfully.",
        accessToken,
      });
    },
  );
};
