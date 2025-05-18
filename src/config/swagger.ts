import { Options } from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Quản Lý Cân Xe API",
    version: "1.0.0",
    description: "API tài liệu cho hệ thống quản lý cân xe",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "Your Name",
      url: "https://yourwebsite.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3000/api/v1",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options: Options = {
  swaggerDefinition,
  // Đường dẫn tới các file chứa annotation (comments đặc biệt) cho Swagger
  apis: [
    "./src/interface/routes/*.ts", // Các file route
    "./src/interface/controllers/*.ts", // Các file controller
    "./src/domain/entities/*.ts", // Các file entity (để định nghĩa schema)
  ],
};

export default options;
