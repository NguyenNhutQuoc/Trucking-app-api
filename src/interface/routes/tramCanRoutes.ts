// src/interface/routes/tramCanRoutes.ts
import { Router } from "express";
import { TramCanController } from "../controllers/TramCanController";
import { TramCanService } from "../../application/use-cases/TramCanService";
import { TramCanRepository } from "../../infrastructure/repositories/TramCanRepository";
import { UserSessionRepository } from "../../infrastructure/repositories/UserSessionRepository";
import { multiTenantAuthService } from "./multiTenantAuthRoutes";
import { createMultiTenantAuthMiddleware } from "../middlewares/multiTenantAuthMiddleware";

const tramCanRoute = Router();

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
// Get my stations (available to authenticated users)
tramCanRoute.get(
  "/my-stations",
  asyncMiddleware(authMiddleware.validateAnySession),
  asyncMiddleware(tramCanController.getMyStations)
);

// Protected routes (require session validation)
tramCanRoute.use(asyncMiddleware(authMiddleware.validateSessionOnly));

// Switch station (available to authenticated users)
tramCanRoute.post(
  "/switch-station",
  asyncMiddleware(tramCanController.switchStation)
);

// Get station details
tramCanRoute.get("/:id", asyncMiddleware(tramCanController.getTramCanById));

// Admin routes (require admin permissions)
tramCanRoute.get("/", asyncMiddleware(tramCanController.getAllTramCans));
tramCanRoute.post("/", asyncMiddleware(tramCanController.createTramCan));
tramCanRoute.put("/:id", asyncMiddleware(tramCanController.updateTramCan));
tramCanRoute.delete("/:id", asyncMiddleware(tramCanController.deleteTramCan));

export default tramCanRoute;
