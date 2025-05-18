import {
  INhanvienRepository,
  IQuyenRepository,
  INhomQuyenRepository,
} from "../../domain/repositories/IRepositoryInterfaces";
import { Nhanvien } from "../../domain/entities/Nhanvien";
import {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
} from "../../utils/errors/AppError";
import { sign } from "jsonwebtoken";
import { config } from "../../config/env";

export class AuthService {
  constructor(
    private nhanvienRepository: INhanvienRepository,
    private quyenRepository: IQuyenRepository,
    private nhomQuyenRepository: INhomQuyenRepository
  ) {}

  async login(
    username: string,
    password: string
  ): Promise<{ user: Partial<Nhanvien>; token: string }> {
    const user = await this.nhanvienRepository.authenticate(username, password);

    if (!user) {
      throw new UnauthorizedError("Tên đăng nhập hoặc mật khẩu không đúng");
    }

    if (user.trangthai !== 0) {
      throw new UnauthorizedError("Tài khoản đã bị khóa hoặc vô hiệu hóa");
    }

    // Get user permissions based on user's role
    const userWithPermissions =
      await this.nhanvienRepository.getWithPermissions(user.nvId);

    // Generate JWT token
    const token = sign(
      {
        id: user.nvId,
        username: user.nvId,
        name: user.tenNV,
        nhomId: user.nhomId,
        isAdmin: user.type === 1,
      },
      config.jwtSecret,
      { expiresIn: "1d" }
    );

    // Remove sensitive info
    const { matkhau, ...userWithoutPassword } = userWithPermissions;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const user = await this.nhanvienRepository.authenticate(
      userId,
      currentPassword
    );

    if (!user) {
      throw new UnauthorizedError("Mật khẩu hiện tại không đúng");
    }

    if (newPassword.length < 6) {
      throw new ValidationError("Mật khẩu mới phải có ít nhất 6 ký tự");
    }

    const updatedUser = await this.nhanvienRepository.update(userId, {
      matkhau: newPassword,
    });

    return !!updatedUser;
  }

  async getUserPermissions(userId: string): Promise<any> {
    const user = await this.nhanvienRepository.getById(userId);

    if (!user) {
      throw new NotFoundError(`Người dùng với ID ${userId} không tồn tại`);
    }

    // If the user is an admin (type = 1), they have access to everything
    if (user.type === 1) {
      return {
        isAdmin: true,
        hasFullAccess: true,
        permissions: [], // Not needed for admin as they have access to everything
      };
    }

    // Otherwise, get their permissions based on their role
    if (!user.nhomId) {
      return {
        isAdmin: false,
        hasFullAccess: false,
        permissions: [],
      };
    }

    const permissions = await this.quyenRepository.getByNhomId(user.nhomId);

    return {
      isAdmin: false,
      hasFullAccess: false,
      permissions,
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      // This would be implemented with jwt.verify() in a real application
      // For the purpose of this example, we're simulating the verification

      // In a real implementation:
      // const decoded = jwt.verify(token, config.jwtSecret);
      // return decoded;

      // Mock implementation:
      return { valid: true };
    } catch (error) {
      throw new UnauthorizedError("Token không hợp lệ hoặc đã hết hạn");
    }
  }
}
