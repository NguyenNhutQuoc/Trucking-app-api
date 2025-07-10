// src/interface/routes/multiTenantSoxeRoutes.ts
import { Router } from "express";
import { MultiTenantSoxeController } from "../controllers/MultiTenantSoxeController";
import { authMiddleware } from "./multiTenantAuthRoutes";

const router = Router();
const multiTenantSoxeController = new MultiTenantSoxeController();

function asyncMiddleware(handler: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

// Tất cả routes đều require authentication với database setup
router.use(authMiddleware.authenticate as import("express").RequestHandler);

// Basic CRUD routes
router.get("/", asyncMiddleware(multiTenantSoxeController.getAllSoxes));
router.get("/:id", asyncMiddleware(multiTenantSoxeController.getSoxeById));
router.post("/", asyncMiddleware(multiTenantSoxeController.createSoxe));
router.put("/:id", asyncMiddleware(multiTenantSoxeController.updateSoxe));
router.delete("/:id", asyncMiddleware(multiTenantSoxeController.deleteSoxe));

// Search by license plate number
router.get(
  "/number/:soxe",
  asyncMiddleware(multiTenantSoxeController.getSoxeBySoxe)
);

export default router;
