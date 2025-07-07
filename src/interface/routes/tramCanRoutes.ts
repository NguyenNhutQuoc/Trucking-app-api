// src/interface/routes/tramCanRoutes.ts
import { Router } from "express";
import { TramCanController } from "../controllers/TramCanController";
import { TramCanService } from "../../application/use-cases/TramCanService";
import { TramCanRepository } from "../../infrastructure/repositories/TramCanRepository";
import { UserSessionRepository } from "../../infrastructure/repositories/UserSessionRepository";
import { multiTenantAuthService } from "./multiTenantAuthRoutes";
import { createMultiTenantAuthMiddleware } from "../middlewares/multiTenantAuthMiddleware";

const router = Router();

// Setup repositories and services
const tramCanRepository = new TramCanRepository();
const userSessionRepository = new UserSessionRepository();

const tramCanService = new TramCanService(
  tramCanRepository,
  userSessionRepository,
  multiTenantAuthService
);

const tramCanController = new TramCanController(tramCanService);
const authMiddleware = createMultiTenantAuthMiddleware(multiTenantAuthService);

function asyncMiddleware(handler: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

// Public routes - none

// Protected routes (require session validation)
router.use(asyncMiddleware(authMiddleware.validateSessionOnly));

// Get my stations (available to authenticated users)
router.get("/my-stations", asyncMiddleware(tramCanController.getMyStations));

// Switch station (available to authenticated users)
router.post(
  "/switch-station",
  asyncMiddleware(tramCanController.switchStation)
);

// Get station details
router.get("/:id", asyncMiddleware(tramCanController.getTramCanById));

// Admin routes (require admin permissions)
router.get("/", asyncMiddleware(tramCanController.getAllTramCans));
router.post("/", asyncMiddleware(tramCanController.createTramCan));
router.put("/:id", asyncMiddleware(tramCanController.updateTramCan));
router.delete("/:id", asyncMiddleware(tramCanController.deleteTramCan));

export default router;
