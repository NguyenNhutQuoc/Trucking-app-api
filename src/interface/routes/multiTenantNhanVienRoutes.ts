// src/interface/routes/multiTenantNhanvienRoutes.ts
import { Router } from "express";
import { MultiTenantNhanvienController } from "../controllers/MultiTenantNhanvienController";
import { authMiddleware } from "./multiTenantAuthRoutes";

const router = Router();
const multiTenantNhanvienController = new MultiTenantNhanvienController();

function asyncMiddleware(handler: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

// Tất cả routes đều require authentication với database setup
router.use(authMiddleware.authenticate as import("express").RequestHandler);

// Basic CRUD routes
router.get("/", asyncMiddleware(multiTenantNhanvienController.getAllNhanviens));
router.get(
  "/:nvId",
  asyncMiddleware(multiTenantNhanvienController.getNhanvienById)
);
router.post("/", asyncMiddleware(multiTenantNhanvienController.createNhanvien));
router.put(
  "/:nvId",
  asyncMiddleware(multiTenantNhanvienController.updateNhanvien)
);
router.delete(
  "/:nvId",
  asyncMiddleware(multiTenantNhanvienController.deleteNhanvien)
);

export const multitenantNhanvien = router;
