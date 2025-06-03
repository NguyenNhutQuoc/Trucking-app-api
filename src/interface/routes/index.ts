import { Router } from "express";
import authRoutes from "./authRoutes";
import phieucanRoutes from "./phieucanRoutes";
import hanghoaRoutes from "./hanghoaRoutes";
import khachhangRoutes from "./khachhangRoutes";
import soxeRoutes from "./soxeRoutes";
import nhomQuyenRoutes from "./nhomQuyenRoutes";

const router = Router();

// API routes
router.use("/auth", authRoutes);
router.use("/phieucan", phieucanRoutes);
router.use("/hanghoa", hanghoaRoutes);
router.use("/khachhang", khachhangRoutes);
router.use("/soxe", soxeRoutes);
router.use("/nhomquyen", nhomQuyenRoutes);
router.use("/nhanvien", require("./nhanvienRoutes").default);

export default router;
