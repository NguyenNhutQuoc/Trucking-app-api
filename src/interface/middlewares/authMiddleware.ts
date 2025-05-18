import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { config } from "../../config/env";
import { UnauthorizedError } from "../../utils/errors/AppError";

// Extend Request interface to include user data
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userType: number;
      nhomId: number;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token không hợp lệ hoặc thiếu");
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded: any = verify(token, config.jwtSecret);

    // Add user data to request object
    req.userId = decoded.id;
    req.userType = decoded.isAdmin ? 1 : 0;
    req.nhomId = decoded.nhomId;

    next();
  } catch (error) {
    next(new UnauthorizedError("Token không hợp lệ hoặc đã hết hạn"));
  }
};
