import { Router } from "express";
import { KhachhangController } from "../controllers/KhachhangController";
import { KhachhangService } from "../../application/use-cases/KhachhangService";
import { KhachhangRepository } from "../../infrastructure/repositories/KhachhangRepository";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();
const khachhangRepository = new KhachhangRepository();
const khachhangService = new KhachhangService(khachhangRepository);
const khachhangController = new KhachhangController(khachhangService);

function asyncMiddleware(handler: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

// Public routes (if any)

// Protected routes
router.use(authenticate);

// Get all khachhangs
router.get("/", asyncMiddleware(khachhangController.getAllKhachhangs));

// Search khachhangs by name
router.get(
  "/search",
  asyncMiddleware(khachhangController.searchKhachhangByName)
);

// Get khachhang by ID
router.get("/:id", asyncMiddleware(khachhangController.getKhachhangById));

// Get khachhang by code
router.get("/code/:ma", asyncMiddleware(khachhangController.getKhachhangByMa));

// Create new khachhang
router.post("/", asyncMiddleware(khachhangController.createKhachhang));

// Update khachhang
router.put("/:id", asyncMiddleware(khachhangController.updateKhachhang));

// Delete khachhang
router.delete("/:id", asyncMiddleware(khachhangController.deleteKhachhang));

export default router;
