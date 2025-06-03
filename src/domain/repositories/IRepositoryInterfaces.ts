import { Repository } from "typeorm";

export interface IGenericRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: number | string): Promise<T | null>;
  create(item: Partial<T>): Promise<T>;
  update(id: number | string, item: Partial<T>): Promise<T | null>;
  delete(id: number | string): Promise<boolean>;
}

export interface IPhieucanRepository extends IGenericRepository<any> {
  getByDateRange(startDate: Date, endDate: Date): Promise<any[]>;
  getBySoxe(soxe: string): Promise<any[]>;
  getByStatus(status: number): Promise<any[]>;
  countByDateRange(startDate: Date, endDate: Date): Promise<number>;
  sumWeightByDateRange(startDate: Date, endDate: Date): Promise<number>;
  getByMahang(mahang: string): Promise<any[]>;
  getByKhachhang(makh: string): Promise<any[]>;
  getCompleted(): Promise<any[]>;
  getPending(): Promise<any[]>;
  getCanceledOrDeleted(): Promise<any[]>;
  getTodayRecords(): Promise<any[]>;
  getWeightStatisticsByCompany(
    startDate: Date,
    endDate: Date
  ): Promise<
    {
      companyName: string;
      weighCount: number;
      totalWeight: number;
    }[]
  >;
  getWeightStatisticsByProduct(
    startDate: Date,
    endDate: Date
  ): Promise<
    {
      productId: string;
      productName: string;
      weighCount: number;
      totalWeight: number;
    }[]
  >;
  getWeightStatisticsByVehicle(
    startDate: Date,
    endDate: Date
  ): Promise<
    {
      vehicleNumber: string;
      weighCount: number;
      totalWeight: number;
      averageWeight: number;
    }[]
  >;
  getWeightStatisticsByDay(
    startDate: Date,
    endDate: Date
  ): Promise<
    {
      date: string;
      weighCount: number;
      totalWeight: number;
    }[]
  >;
}

export interface IHanghoaRepository extends IGenericRepository<any> {
  getByMa(ma: string): Promise<any | null>;
  searchByName(name: string): Promise<any[]>;
}

export interface IKhachhangRepository extends IGenericRepository<any> {
  getByMa(ma: string): Promise<any | null>;
  searchByName(name: string): Promise<any[]>;
}

export interface INhanvienRepository extends IGenericRepository<any> {
  authenticate(username: string, password: string): Promise<any | null>;
  getWithPermissions(nvId: string): Promise<any>;
}

export interface ISoxeRepository extends IGenericRepository<any> {
  getBySoxe(soxe: string): Promise<any | null>;
}

export interface INhomQuyenRepository extends IGenericRepository<any> {
  getWithPermissions(nhomId: number): Promise<any>;
}

export interface IQuyenRepository extends IGenericRepository<any> {
  getByNhomId(nhomId: number): Promise<any[]>;
  addPermission(nhomId: number, formId: number): Promise<any>;
  removePermission(nhomId: number, formId: number): Promise<boolean>;
}

export interface INhanvienRepository extends IGenericRepository<any> {
  authenticate(username: string, password: string): Promise<any | null>;
  getWithPermissions(nvId: string): Promise<any>;
}
