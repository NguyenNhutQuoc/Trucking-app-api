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

const router = Router();

// New multi-tenant routes
router.use("/auth", multiTenantAuthRoutes);
router.use("/phieucan", multiTenantPhieucanRoutes);

// Legacy routes (có thể giữ lại cho admin hoặc migration)
router.use("/legacy/auth", authRoutes);
router.use("/legacy/phieucan", phieucanRoutes);
router.use("/legacy/hanghoa", hanghoaRoutes);
router.use("/legacy/khachhang", khachhangRoutes);
router.use("/legacy/soxe", soxeRoutes);
router.use("/legacy/nhomquyen", nhomQuyenRoutes);

export default router;
