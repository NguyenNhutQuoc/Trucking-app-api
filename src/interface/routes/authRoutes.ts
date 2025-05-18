import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthService } from "../../application/use-cases/AuthService";
import { NhanvienRepository } from "../../infrastructure/repositories/NhanvienRepository";
import { QuyenRepository } from "../../infrastructure/repositories/QuyenRepository";
import { NhomQuyenRepository } from "../../infrastructure/repositories/NhomQuyenRepository";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();
const nhanvienRepository = new NhanvienRepository();
const quyenRepository = new QuyenRepository();
const nhomQuyenRepository = new NhomQuyenRepository();
const authService = new AuthService(
  nhanvienRepository,
  quyenRepository,
  nhomQuyenRepository
);
const authController = new AuthController(authService);

function asyncMiddleware(handler: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

// Public routes
router.post("/login", asyncMiddleware(authController.login));
router.post("/validate-token", asyncMiddleware(authController.validateToken));

// Protected routes
router.use(authenticate);
router.post("/change-password", asyncMiddleware(authController.changePassword));
router.get("/permissions", asyncMiddleware(authController.getUserPermissions));

export default router;
