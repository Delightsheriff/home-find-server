import jwt from "jsonwebtoken";
import { ENVIRONMENT } from "../config/environment";
// Interface for token payload
interface TokenPayload {
  id: string;
  [key: string]: any; // Allow for additional properties
}
/**
 * Generates a JWT token
 * @param payload - Data to be encoded in the token
 * @param secret - Secret key to sign the token
 * @param expiresIn - Token expiration time
 * @returns The generated token
 */
export const generateToken = (
  payload: TokenPayload,
  secret: string,
  expiresIn: string,
): string => {
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Generates an access token
 * @param userId - ID of the user
 * @returns The generated access token
 */
export const generateAccessToken = (userId: string): string => {
  return generateToken(
    { id: userId },
    ENVIRONMENT.JWT.ACCESS_KEY,
    ENVIRONMENT.JWT_EXPIRES_IN.ACCESS,
  );
};

/**
 * Generates a refresh token
 * @param userId - ID of the user
 * @returns The generated refresh token
 */
export const generateRefreshToken = (userId: string): string => {
  return generateToken(
    { id: userId },
    ENVIRONMENT.JWT.REFRESH_KEY,
    ENVIRONMENT.JWT_EXPIRES_IN.REFRESH,
  );
};

// EMAIL
interface ITokenData {
  id: string;
}

export const generateEmailVerificationToken = (
  userId: string,
  expiresIn: string = "24h",
) => {
  const token = jwt.sign({ id: userId }, ENVIRONMENT.JWT.ACCESS_KEY, {
    expiresIn,
  });

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
  // console.log("Generated token:", token);
  return { token, expiresAt };
};

export const verifyEmailToken = (token: string): ITokenData | null => {
  try {
    // console.log("Token for verification:", token);
    const decoded = jwt.verify(token, ENVIRONMENT.JWT.ACCESS_KEY) as ITokenData;
    // console.log("Decoded token:", decoded);
    return decoded;
  } catch (error) {
    console.error("Error verifying email token:", error);
    return null;
  }
};

export const isTokenExpired = (expirationDate: Date): boolean => {
  return expirationDate < new Date();
};
