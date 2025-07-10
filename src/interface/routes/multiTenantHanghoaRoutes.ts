// src/interface/routes/multiTenantHanghoaRoutes.ts
import { Router } from "express";
import { MultiTenantHanghoaController } from "../controllers/MultiTenantHanghoaController";
import { authMiddleware } from "./multiTenantAuthRoutes";

const router = Router();
const multiTenantHanghoaController = new MultiTenantHanghoaController();

function asyncMiddleware(handler: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

// Tất cả routes đều require authentication với database setup
router.use(authMiddleware.authenticate as import("express").RequestHandler);

// Basic CRUD routes
router.get("/", asyncMiddleware(multiTenantHanghoaController.getAllHanghoas));
router.get(
  "/:id",
  asyncMiddleware(multiTenantHanghoaController.getHanghoaById)
);
router.post("/", asyncMiddleware(multiTenantHanghoaController.createHanghoa));
router.put("/:id", asyncMiddleware(multiTenantHanghoaController.updateHanghoa));
router.delete(
  "/:id",
  asyncMiddleware(multiTenantHanghoaController.deleteHanghoa)
);

// Search routes
router.get(
  "/search",
  asyncMiddleware(multiTenantHanghoaController.searchHanghoaByName)
);
router.get(
  "/code/:ma",
  asyncMiddleware(multiTenantHanghoaController.getHanghoaByMa)
);

export default router;
