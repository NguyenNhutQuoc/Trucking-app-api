import { Router } from "express";
import { HanghoaController } from "../controllers/HanghoaController";
import { HanghoaService } from "../../application/use-cases/HanghoaService";
import { HanghoaRepository } from "../../infrastructure/repositories/HanghoaRepository";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();
const hanghoaRepository = new HanghoaRepository();
const hanghoaService = new HanghoaService(hanghoaRepository);
const hanghoaController = new HanghoaController(hanghoaService);

function asyncMiddleware(handler: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

// Public routes (if any)

// Protected routes
router.use(authenticate);

// Get all hanghoas
router.get("/", asyncMiddleware(hanghoaController.getAllHanghoas));

// Search hanghoas by name
router.get("/search", asyncMiddleware(hanghoaController.searchHanghoaByName));

// Get hanghoa by ID
router.get("/:id", asyncMiddleware(hanghoaController.getHanghoaById));

// Get hanghoa by code
router.get("/code/:ma", asyncMiddleware(hanghoaController.getHanghoaByMa));

// Create new hanghoa
router.post("/", asyncMiddleware(hanghoaController.createHanghoa));

// Update hanghoa
router.put("/:id", asyncMiddleware(hanghoaController.updateHanghoa));

// Delete hanghoa
router.delete("/:id", asyncMiddleware(hanghoaController.deleteHanghoa));

export default router;
