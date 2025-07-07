// src/interface/routes/multiTenantAuthRoutes.ts
import { Router } from "express";
import { MultiTenantAuthController } from "../controllers/MultiTenantAuthController";
import { MultiTenantAuthService } from "../../application/use-cases/MultiTenantAuthService";
import { KhachHangTenantRepository } from "../../infrastructure/repositories/KhachHangTenantRepository";
import { TramCanRepository } from "../../infrastructure/repositories/TramCanRepository";
import { UserSessionRepository } from "../../infrastructure/repositories/UserSessionRepository";
import { createMultiTenantAuthMiddleware } from "../middlewares/multiTenantAuthMiddleware";

const router = Router();

// Setup repositories and services
const khachHangTenantRepository = new KhachHangTenantRepository();
const tramCanRepository = new TramCanRepository();
const userSessionRepository = new UserSessionRepository();

const multiTenantAuthService = new MultiTenantAuthService(
  khachHangTenantRepository,
  tramCanRepository,
  userSessionRepository
);

const multiTenantAuthController = new MultiTenantAuthController(
  multiTenantAuthService
);
const authMiddleware = createMultiTenantAuthMiddleware(multiTenantAuthService);

function asyncMiddleware(handler: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

// Public routes
router.post(
  "/tenant-login",
  asyncMiddleware(multiTenantAuthController.tenantLogin)
);
router.post(
  "/select-station",
  asyncMiddleware(multiTenantAuthController.selectStation)
);

// Protected routes (require session validation only)
router.post(
  "/validate-session",
  asyncMiddleware(multiTenantAuthController.validateSession)
);
router.post("/logout", asyncMiddleware(multiTenantAuthController.logout));
router.post(
  "/refresh-session",
  asyncMiddleware(multiTenantAuthController.refreshSession)
);

export { multiTenantAuthService, authMiddleware };
export default router;
