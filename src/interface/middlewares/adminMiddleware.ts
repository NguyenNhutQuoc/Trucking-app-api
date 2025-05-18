import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../../utils/errors/AppError";

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if user is admin (type = 1)
    if (req.userType !== 1) {
      throw new UnauthorizedError("Quyền truy cập bị từ chối");
    }

    next();
  } catch (error) {
    next(new UnauthorizedError("Quyền truy cập bị từ chối"));
  }
};
