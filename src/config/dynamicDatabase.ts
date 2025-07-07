// src/config/dynamicDatabase.ts
import { DataSource } from "typeorm";
import { join } from "path";

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  instanceName?: string;
}

export class DynamicDatabaseManager {
  private static connections: Map<string, DataSource> = new Map();

  /**
   * Tạo connection key duy nhất từ config
   */
  private static createConnectionKey(config: DatabaseConfig): string {
    return `${config.host}:${config.port}:${config.database}:${config.username}`;
  }

  /**
   * Tạo hoặc lấy DataSource từ cache
   */
  static async getDataSource(config: DatabaseConfig): Promise<DataSource> {
    const connectionKey = this.createConnectionKey(config);

    // Kiểm tra cache
    if (this.connections.has(connectionKey)) {
      const existingConnection = this.connections.get(connectionKey)!;

      // Kiểm tra connection còn hoạt động không
      if (existingConnection.isInitialized) {
        return existingConnection;
      } else {
        // Connection đã bị đóng, xóa khỏi cache
        this.connections.delete(connectionKey);
      }
    }

    // Tạo DataSource mới
    const dataSource = new DataSource({
      type: "mssql",
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      synchronize: false,
      logging: process.env.NODE_ENV !== "production",
      entities: [join(__dirname, "../domain/entities/**/*.{js,ts}")],
      options: {
        enableArithAbort: true,
        trustServerCertificate: true,
        instanceName: config.instanceName,
        encrypt: false,
      },
    });

    try {
      await dataSource.initialize();
      console.log(
        `✅ Connected to database: ${config.database} on ${config.host}`
      );

      // Lưu vào cache
      this.connections.set(connectionKey, dataSource);

      return dataSource;
    } catch (error) {
      console.error(
        `❌ Failed to connect to database: ${config.database}`,
        error
      );
      throw new Error(`Không thể kết nối tới database: ${config.database}`);
    }
  }

  /**
   * Đóng connection cụ thể
   */
  static async closeConnection(config: DatabaseConfig): Promise<void> {
    const connectionKey = this.createConnectionKey(config);
    const connection = this.connections.get(connectionKey);

    if (connection && connection.isInitialized) {
      await connection.destroy();
      this.connections.delete(connectionKey);
      console.log(`🔌 Closed connection to: ${config.database}`);
    }
  }

  /**
   * Đóng tất cả connections
   */
  static async closeAllConnections(): Promise<void> {
    const closePromises = Array.from(this.connections.values()).map(
      (connection) =>
        connection.isInitialized ? connection.destroy() : Promise.resolve()
    );

    await Promise.all(closePromises);
    this.connections.clear();
    console.log("🔌 All database connections closed");
  }

  /**
   * Lấy thông tin các connections đang hoạt động
   */
  static getActiveConnections(): Array<{
    key: string;
    isInitialized: boolean;
  }> {
    return Array.from(this.connections.entries()).map(([key, connection]) => ({
      key,
      isInitialized: connection.isInitialized,
    }));
  }
}
