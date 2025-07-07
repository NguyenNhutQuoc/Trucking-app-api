// src/interface/routes/multiTenantPhieucanRoutes.ts
import { Router } from "express";
import { MultiTenantPhieucanController } from "../controllers/MultiTenantPhieucanController";
import { authMiddleware } from "./multiTenantAuthRoutes";

const router = Router();
const multiTenantPhieucanController = new MultiTenantPhieucanController();

function asyncMiddleware(handler: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

// Tất cả routes đều require authentication với database setup
router.use(authMiddleware.authenticate as import("express").RequestHandler);

// Phieucan routes
router.get("/", asyncMiddleware(multiTenantPhieucanController.getAllPhieucans));
router.get(
  "/:id",
  asyncMiddleware(multiTenantPhieucanController.getPhieucanById)
);
router.post("/", asyncMiddleware(multiTenantPhieucanController.createPhieucan));
router.put(
  "/:id",
  asyncMiddleware(multiTenantPhieucanController.updatePhieucan)
);
router.delete(
  "/:id",
  asyncMiddleware(multiTenantPhieucanController.deletePhieucan)
);

// Statistics
router.get(
  "/statistics/today",
  asyncMiddleware(multiTenantPhieucanController.getTodayStatistics)
);

export default router;
