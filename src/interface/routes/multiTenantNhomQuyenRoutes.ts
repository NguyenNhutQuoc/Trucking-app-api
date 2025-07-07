// src/interface/routes/multiTenantNhomQuyenRoutes.ts
import { Router } from "express";
import { MultiTenantNhomQuyenController } from "../controllers/MultiTenantNhomQuyenController";
import { authMiddleware } from "./multiTenantAuthRoutes";

const router = Router();
const multiTenantNhomQuyenController = new MultiTenantNhomQuyenController();

function asyncMiddleware(handler: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

// Tất cả routes đều require authentication với database setup
router.use(authMiddleware.authenticate as import("express").RequestHandler);

// NhomQuyen routes
router.get(
  "/",
  asyncMiddleware(multiTenantNhomQuyenController.getAllNhomQuyens)
);
router.get(
  "/:id",
  asyncMiddleware(multiTenantNhomQuyenController.getNhomQuyenById)
);
router.post(
  "/",
  asyncMiddleware(multiTenantNhomQuyenController.createNhomQuyen)
);
router.put(
  "/:id",
  asyncMiddleware(multiTenantNhomQuyenController.updateNhomQuyen)
);
router.delete(
  "/:id",
  asyncMiddleware(multiTenantNhomQuyenController.deleteNhomQuyen)
);

export default router;
