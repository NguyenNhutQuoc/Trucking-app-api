import {
  IHanghoaRepository,
  IPhieucanRepository,
} from "../../domain/repositories/IRepositoryInterfaces";
import { Phieucan } from "../../domain/entities/Phieucan";
import { NotFoundError, ValidationError } from "../../utils/errors/AppError";
import { HanghoaRepository } from "@/infrastructure/repositories/HanghoaRepository";
import { Hanghoa } from "@/domain/entities/Hanghoa";
import { start } from "repl";

export class PhieucanService {
  constructor(
    private phieucanRepository: IPhieucanRepository,
    private hanghoaRepository: IHanghoaRepository
  ) {}

  async getAllPhieucans(): Promise<any[]> {
    // 1. Lấy tất cả phiếu cân
    const phieucans: Phieucan[] = await this.phieucanRepository.getAll();

    // 2. Trích xuất danh sách duy nhất các mã hàng hóa
    const uniqueMahangs = [...new Set(phieucans.map((p) => p.mahang))];

    // 3. Lấy thông tin hàng hóa cho tất cả mã hàng trong một lần
    const hanghoaList = await Promise.all(
      uniqueMahangs.map((ma) => this.hanghoaRepository.getByMa(ma))
    );

    // 4. Tạo map từ mã hàng đến đơn giá
    const hanghoaMap: { [key: string]: Hanghoa } = {};
    hanghoaList.forEach((hanghoa) => {
      if (hanghoa) {
        hanghoaMap[hanghoa.ma] = hanghoa;
      }
    });

    // 5. Bổ sung đơn giá vào phiếu cân
    return phieucans.map((phieucan) => ({
      ...phieucan,
      dongia: hanghoaMap[phieucan.mahang]?.dongia || 0,
    }));
  }

  async getPhieucanById(id: number): Promise<any> {
    const phieucan: Phieucan = await this.phieucanRepository.getById(id);
    if (!phieucan) {
      throw new NotFoundError(`Phiếu cân với ID ${id} không tồn tại`);
    }

    const hanghoa: Hanghoa | null = await this.hanghoaRepository.getByMa(
      phieucan.mahang
    );

    const dongia = hanghoa ? hanghoa.dongia : 0;

    if (!hanghoa) {
      throw new NotFoundError(
        `Mã hàng ${phieucan.mahang} không tồn tại trong hệ thống`
      );
    }
    return {
      ...phieucan,
      dongia,
    };
  }

  async createPhieucan(phieucanData: Partial<Phieucan>): Promise<any> {
    // Validation
    if (!phieucanData.soxe) {
      throw new ValidationError("Số xe không được để trống");
    }

    // Generate sophieu as next available number if not provided
    if (!phieucanData.sophieu) {
      const allPhieucans = await this.phieucanRepository.getAll();
      const maxSophieu = allPhieucans.reduce((max, phieucan) => {
        return phieucan.sophieu && phieucan.sophieu > max
          ? phieucan.sophieu
          : max;
      }, 0);
      phieucanData.sophieu = maxSophieu + 1;
    }

    // Set defaults
    if (!phieucanData.ngaycan1) {
      phieucanData.ngaycan1 = new Date();
    }

    if (phieucanData.uploadStatus === undefined) {
      phieucanData.uploadStatus = 0;
    }

    // Add don gia
    const hanghoa = await this.hanghoaRepository.getByMa(
      phieucanData.mahang as string
    );
    if (!hanghoa) {
      throw new NotFoundError(
        `Mã hàng ${phieucanData.mahang} không tồn tại trong hệ thống`
      );
    }

    return {
      ...this.phieucanRepository.create(phieucanData),
      dongia: hanghoa.dongia,
    };
  }

  async updatePhieucan(
    id: number,
    phieucanData: Partial<Phieucan>
  ): Promise<Phieucan> {
    const phieucan = await this.phieucanRepository.getById(id);
    if (!phieucan) {
      throw new NotFoundError(`Phiếu cân với ID ${id} không tồn tại`);
    }

    const updatedPhieucan = await this.phieucanRepository.update(
      id,
      phieucanData
    );
    if (!updatedPhieucan) {
      throw new Error("Cập nhật phiếu cân thất bại");
    }

    return updatedPhieucan;
  }

  async deletePhieucan(id: number): Promise<boolean> {
    const phieucan = await this.phieucanRepository.getById(id);
    if (!phieucan) {
      throw new NotFoundError(`Phiếu cân với ID ${id} không tồn tại`);
    }

    return this.phieucanRepository.delete(id);
  }

  async getTodayStatistics(): Promise<{
    totalVehicles: number;
    totalWeight: number;
    byCompany: {
      companyName: string;
      weighCount: number;
      totalWeight: number;
    }[];
    byProduct: {
      productName: string;
      weighCount: number;
      totalWeight: number;
      totalPrice: () => Promise<number>;
    }[];
    byVehicle: {
      vehicleNumber: string;
      weighCount: number;
      totalWeight: number;
      averageWeight: number;
    }[];
    byDay: {
      date: string;
      weighCount: number;
      totalWeight: number;
    }[];
  }> {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const todayRecords = await this.phieucanRepository.getTodayRecords();
    const totalWeight = await this.phieucanRepository.sumWeightByDateRange(
      startDate,
      endDate
    );
    const byCompany =
      await this.phieucanRepository.getWeightStatisticsByCompany(
        startDate,
        endDate
      );
    const byProductRaw =
      await this.phieucanRepository.getWeightStatisticsByProduct(
        startDate,
        endDate
      );

    const byProduct = byProductRaw.map((item) => ({
      ...item,
      totalPrice: async () => {
        const hanghoa = await this.hanghoaRepository.getByMa(item.productId);
        return hanghoa ? item.totalWeight * hanghoa.dongia : 0;
      },
    }));

    const byVehicle =
      await this.phieucanRepository.getWeightStatisticsByVehicle(
        startDate,
        endDate
      );
    const byDay = await this.phieucanRepository.getWeightStatisticsByDay(
      startDate,
      endDate
    );

    // Calculate total weight for all today

    return {
      totalVehicles: todayRecords.length,
      totalWeight,
      byCompany,
      byProduct,
      byVehicle,
      byDay,
    };
  }

  async getWeightStatistics(startDate: Date, endDate: Date): Promise<any> {
    // Validate date range
    const totalVehicles = await this.phieucanRepository.countByDateRange(
      startDate,
      endDate
    );
    const totalWeight = await this.phieucanRepository.sumWeightByDateRange(
      startDate,
      endDate
    );
    const byCompany =
      await this.phieucanRepository.getWeightStatisticsByCompany(
        startDate,
        endDate
      );
    const byProduct =
      await this.phieucanRepository.getWeightStatisticsByProduct(
        startDate,
        endDate
      );

    // Calculate total price for each product
    const byProductWithPrice = await Promise.all(
      byProduct.map(async (item) => {
        const hanghoa = await this.hanghoaRepository.getByMa(item.productId);
        const totalPrice = hanghoa ? item.totalWeight * hanghoa.dongia : 0;
        return {
          ...item,
          totalPrice,
        };
      })
    );
    const byVehicle =
      await this.phieucanRepository.getWeightStatisticsByVehicle(
        startDate,
        endDate
      );
    const byDay = await this.phieucanRepository.getWeightStatisticsByDay(
      startDate,
      endDate
    );

    console.log(
      "Total Vehicles: ",
      totalVehicles,
      "Total Weight: ",
      totalWeight,
      "By Company: ",
      byCompany,
      "By Product: ",
      byProductWithPrice,
      "By Vehicle: ",
      byVehicle,
      "By Day: ",
      byDay
    );

    return {
      totalVehicles,
      totalWeight,
      byCompany,
      byProduct: byProductWithPrice,
      byVehicle,
      byDay,
    };
  }

  async completeWeighing(
    id: number,
    secondWeightData: { tlcan2: number; ngaycan2: Date }
  ): Promise<Phieucan> {
    const phieucan = await this.phieucanRepository.getById(id);
    if (!phieucan) {
      throw new NotFoundError(`Phiếu cân với ID ${id} không tồn tại`);
    }

    if (phieucan.ngaycan2) {
      throw new ValidationError("Phiếu cân này đã hoàn thành");
    }

    const updateData = {
      ...secondWeightData,
      uploadStatus: 0, // Mark as completed
    };

    const updatedPhieucan = await this.phieucanRepository.update(
      id,
      updateData
    );
    if (!updatedPhieucan) {
      throw new Error("Cập nhật phiếu cân thất bại");
    }

    return updatedPhieucan;
  }

  async getCompletedWeighings(): Promise<Phieucan[]> {
    return this.phieucanRepository.getCompleted();
  }

  async getPendingWeighings(): Promise<Phieucan[]> {
    return this.phieucanRepository.getPending();
  }

  async getCanceledWeighings(): Promise<Phieucan[]> {
    return this.phieucanRepository.getCanceledOrDeleted();
  }

  async getPhieucansByVehicle(soxe: string): Promise<Phieucan[]> {
    return this.phieucanRepository.getBySoxe(soxe);
  }

  async getPhieucansByProduct(mahang: string): Promise<Phieucan[]> {
    return this.phieucanRepository.getByMahang(mahang);
  }

  async getPhieucansByCustomer(makh: string): Promise<Phieucan[]> {
    return this.phieucanRepository.getByKhachhang(makh);
  }

  async getPhieucansByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<Phieucan[]> {
    return this.phieucanRepository.getByDateRange(startDate, endDate);
  }

  async cancelPhieucan(id: number, reason: string): Promise<Phieucan> {
    const phieucan = await this.phieucanRepository.getById(id);
    if (!phieucan) {
      throw new NotFoundError(`Phiếu cân với ID ${id} không tồn tại`);
    }

    const updateData = {
      uploadStatus: 1, // Mark as canceled
      ghichu: reason,
    };

    const updatedPhieucan = await this.phieucanRepository.update(
      id,
      updateData
    );
    if (!updatedPhieucan) {
      throw new Error("Hủy phiếu cân thất bại");
    }

    return updatedPhieucan;
  }
}
