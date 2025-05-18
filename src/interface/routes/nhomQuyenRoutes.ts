import { Router } from "express";
import { NhomQuyenController } from "../controllers/NhomQuyenController";
import { NhomQuyenService } from "../../application/use-cases/NhomQuyenService";
import { NhomQuyenRepository } from "../../infrastructure/repositories/NhomQuyenRepository";
import { QuyenRepository } from "../../infrastructure/repositories/QuyenRepository";
import { authenticate } from "../middlewares/authMiddleware";
import { adminOnly } from "../middlewares/adminMiddleware";

const router = Router();
const nhomQuyenRepository = new NhomQuyenRepository();
const quyenRepository = new QuyenRepository();
const nhomQuyenService = new NhomQuyenService(
  nhomQuyenRepository,
  quyenRepository
);
const nhomQuyenController = new NhomQuyenController(nhomQuyenService);

function asyncMiddleware(handler: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
// Public routes (if any)

// Protected routes
router.use(authenticate);

// Admin only routes - for managing permissions
router.use(adminOnly);

// Get all nhom quyens
router.get("/", asyncMiddleware(nhomQuyenController.getAllNhomQuyens));

// Get nhom quyen by ID
router.get("/:id", asyncMiddleware(nhomQuyenController.getNhomQuyenById));

// Get nhom quyen with permissions
router.get(
  "/:id/permissions",
  asyncMiddleware(nhomQuyenController.getNhomQuyenWithPermissions)
);

export default router;
