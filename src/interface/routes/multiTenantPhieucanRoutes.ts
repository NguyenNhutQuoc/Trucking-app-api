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

// Basic CRUD routes
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

// Weighing operations
router.post(
  "/:id/complete",
  asyncMiddleware(multiTenantPhieucanController.completeWeighing)
);
router.post(
  "/:id/cancel",
  asyncMiddleware(multiTenantPhieucanController.cancelPhieucan)
);

// Status-based queries
router.get(
  "/status/completed",
  asyncMiddleware(multiTenantPhieucanController.getCompletedWeighings)
);
router.get(
  "/status/pending",
  asyncMiddleware(multiTenantPhieucanController.getPendingWeighings)
);
router.get(
  "/status/canceled",
  asyncMiddleware(multiTenantPhieucanController.getCanceledWeighings)
);

// Search and filter routes
router.get(
  "/date-range/search",
  asyncMiddleware(multiTenantPhieucanController.getPhieucansByDateRange)
);
router.get(
  "/vehicle/:soxe",
  asyncMiddleware(multiTenantPhieucanController.getPhieucansBySoxe)
);
router.get(
  "/product/:mahang",
  asyncMiddleware(multiTenantPhieucanController.getPhieucansByProduct)
);
router.get(
  "/customer/:makh",
  asyncMiddleware(multiTenantPhieucanController.getPhieucansByCustomer)
);

// Statistics routes
router.get(
  "/statistics/today",
  asyncMiddleware(multiTenantPhieucanController.getTodayStatistics)
);
router.get(
  "/statistics/weight",
  asyncMiddleware(multiTenantPhieucanController.getWeightStatistics)
);

export default router;
