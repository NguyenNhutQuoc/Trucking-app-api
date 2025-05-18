import { Router } from "express";
import { SoxeController } from "../controllers/SoxeController";
import { SoxeService } from "../../application/use-cases/SoxeService";
import { SoxeRepository } from "../../infrastructure/repositories/SoxeRepository";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();
const soxeRepository = new SoxeRepository();
const soxeService = new SoxeService(soxeRepository);
const soxeController = new SoxeController(soxeService);

function asyncMiddleware(handler: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
// Public routes (if any)

// Protected routes
router.use(authenticate);

// Get all soxes
router.get("/", asyncMiddleware(soxeController.getAllSoxes));

// Get soxe by ID
router.get("/:id", asyncMiddleware(soxeController.getSoxeById));

// Get soxe by soxe
router.get("/number/:soxe", asyncMiddleware(soxeController.getSoxeBySoxe));

// Create new soxe
router.post("/", asyncMiddleware(soxeController.createSoxe));

// Update soxe
router.put("/:id", asyncMiddleware(soxeController.updateSoxe));

// Delete soxe
router.delete("/:id", asyncMiddleware(soxeController.deleteSoxe));

export default router;
