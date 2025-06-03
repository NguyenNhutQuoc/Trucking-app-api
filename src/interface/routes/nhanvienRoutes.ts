import { Router } from "express";
import { NhanvienController } from "../controllers/NhanvienController";
import { NhanvienService } from "../../application/use-cases/NhanvienService";
import { NhanvienRepository } from "../../infrastructure/repositories/NhanvienRepository";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();
const nhanvienRepository = new NhanvienRepository();
const nhanvienService = new NhanvienService(nhanvienRepository);
const nhanvienController = new NhanvienController(nhanvienService);

function asyncMiddleware(handler: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

router.use(authenticate);

router.get("/", asyncMiddleware(nhanvienController.getAllNhanviens));
router.get("/:nvId", asyncMiddleware(nhanvienController.getNhanvienById));
router.post("/", asyncMiddleware(nhanvienController.createNhanvien));
router.put("/:nvId", asyncMiddleware(nhanvienController.updateNhanvien));
router.delete("/:nvId", asyncMiddleware(nhanvienController.deleteNhanvien));

export default router;
