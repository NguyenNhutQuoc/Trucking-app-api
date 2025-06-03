import { Router } from "express";
import { PhieucanController } from "../controllers/PhieucanController";
import { PhieucanService } from "../../application/use-cases/PhieucanService";
import { PhieucanRepository } from "../../infrastructure/repositories/PhieucanRepository";
import { authenticate } from "../middlewares/authMiddleware";
import { HanghoaRepository } from "../../infrastructure/repositories/HanghoaRepository";

const router = Router();
const phieucanRepository = new PhieucanRepository();
const hanghoaRepository = new HanghoaRepository();
const phieucanService = new PhieucanService(
  phieucanRepository,
  hanghoaRepository
);
const phieucanController = new PhieucanController(phieucanService);

// Public routes (if any)

function asyncMiddleware(handler: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

// Bằng dòng này:
router.use(authenticate);

// Nếu muốn bọc các controller async:
router.get("/", asyncMiddleware(phieucanController.getAllPhieucans));
router.get("/:id", asyncMiddleware(phieucanController.getPhieucanById));
router.post("/", asyncMiddleware(phieucanController.createPhieucan));
router.put("/:id", asyncMiddleware(phieucanController.updatePhieucan));
router.delete("/:id", asyncMiddleware(phieucanController.deletePhieucan));
router.post(
  "/:id/complete",
  asyncMiddleware(phieucanController.completeWeighing)
);
router.post("/:id/cancel", asyncMiddleware(phieucanController.cancelPhieucan));
router.get(
  "/status/completed",
  asyncMiddleware(phieucanController.getCompletedWeighings)
);
router.get(
  "/status/pending",
  asyncMiddleware(phieucanController.getPendingWeighings)
);
router.get(
  "/status/canceled",
  asyncMiddleware(phieucanController.getCanceledWeighings)
);
router.get(
  "/date-range/search",
  asyncMiddleware(phieucanController.getPhieucansByDateRange)
);
router.get(
  "/vehicle/:soxe",
  asyncMiddleware(phieucanController.getPhieucansBySoxe)
);
router.get(
  "/product/:mahang",
  asyncMiddleware(phieucanController.getPhieucansByProduct)
);
router.get(
  "/customer/:makh",
  asyncMiddleware(phieucanController.getPhieucansByCustomer)
);
router.get(
  "/statistics/today",
  asyncMiddleware(phieucanController.getTodayStatistics)
);
router.get(
  "/statistics/weight",
  asyncMiddleware(phieucanController.getWeightStatistics)
);

export default router;
