// src/interface/routes/index.ts - Updated
import { Router } from "express";
import multiTenantAuthRoutes from "./multiTenantAuthRoutes";
import multiTenantPhieucanRoutes from "./multiTenantPhieucanRoutes";

// Import old routes for backward compatibility (if needed)
import authRoutes from "./authRoutes";
import phieucanRoutes from "./phieucanRoutes";
import hanghoaRoutes from "./hanghoaRoutes";
import khachhangRoutes from "./khachhangRoutes";
import soxeRoutes from "./soxeRoutes";
import nhomQuyenRoutes from "./nhomQuyenRoutes";
import multiTenantHanghoaRoutes from "./multiTenantHanghoaRoutes";
import multiTenantKhachhangRoutes from "./multiTenantKhachhangRoutes";
import multiTenantSoxeRoutes from "./multiTenantSoxeRoutes";
import multiTenantNhomQuyenRoutes from "./multiTenantNhomQuyenRoutes";
import tramCanRoute from "./tramCanRoutes";

const router = Router();

// New multi-tenant routes
router.use("/auth", multiTenantAuthRoutes);
router.use("/phieucan", multiTenantPhieucanRoutes);
router.use("/auth", multiTenantAuthRoutes);
router.use("/phieucan", multiTenantPhieucanRoutes);
router.use("/hanghoa", multiTenantHanghoaRoutes);
router.use("/khachhang", multiTenantKhachhangRoutes);
router.use("/soxe", multiTenantSoxeRoutes);
router.use("/nhomquyen", multiTenantNhomQuyenRoutes);
router.use("tramcan", tramCanRoute);

// Legacy routes (có thể giữ lại cho admin hoặc migration)
router.use("/legacy/auth", authRoutes);
router.use("/legacy/phieucan", phieucanRoutes);
router.use("/legacy/hanghoa", hanghoaRoutes);
router.use("/legacy/khachhang", khachhangRoutes);
router.use("/legacy/soxe", soxeRoutes);
router.use("/legacy/nhomquyen", nhomQuyenRoutes);

export default router;
