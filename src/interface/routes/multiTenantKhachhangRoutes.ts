// src/interface/routes/multiTenantKhachhangRoutes.ts
import { Router } from "express";
import { MultiTenantKhachhangController } from "../controllers/MultiTenantKhachhangController";
import { authMiddleware } from "./multiTenantAuthRoutes";

const router = Router();
const multiTenantKhachhangController = new MultiTenantKhachhangController();

function asyncMiddleware(handler: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

// Tất cả routes đều require authentication với database setup
router.use(authMiddleware.authenticate as import("express").RequestHandler);

// Khachhang routes
router.get(
  "/",
  asyncMiddleware(multiTenantKhachhangController.getAllKhachhangs)
);
router.get(
  "/:id",
  asyncMiddleware(multiTenantKhachhangController.getKhachhangById)
);
router.post(
  "/",
  asyncMiddleware(multiTenantKhachhangController.createKhachhang)
);
router.put(
  "/:id",
  asyncMiddleware(multiTenantKhachhangController.updateKhachhang)
);
router.delete(
  "/:id",
  asyncMiddleware(multiTenantKhachhangController.deleteKhachhang)
);
router.get(
  "/search",
  asyncMiddleware(multiTenantKhachhangController.searchKhachhangByName)
);

export default router;
