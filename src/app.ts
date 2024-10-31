import express, { Application, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
// import xss from "xss-clean";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";

const app: Application = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:3000"],
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
// app.use(xss());
app.use(hpp());
app.use(
  rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    limit: 1000, // Limit each IP to 1000 requests per window
    message: "Rate limit exceeded. Please try again later.",
  }),
);
app.use(morgan("dev"));
/**
 * API welcome route
 * @route GET /api/v1
 * @returns {Object} 200 - Success response
 */
app.get("/api/v1", (req: Request, res: Response) => {
  res.status(200).json({
    statusText: "success",
    message: "Welcome to Home-finder API",
  });
});

/**
 * API Auth routes
 * @route POST /api/v1/auth
 * @group Auth - Authentication Management
 */
app.use("/api/v1/auth", authRoutes);

/**
 * Catch-all route handler function
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
const catchAllHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    statusText: "fail",
    message: "The requested resource could not be found",
  });
  next();
};

/**
 * Catch-all route for undefined routes
 * @route GET *
 * @returns {Object} 404 - Not Found response
 */
app.all("*", catchAllHandler);

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    statusText: "fail",
    message: "An unexpected error occurred. Please try again later.",
  });
});

export default app;
