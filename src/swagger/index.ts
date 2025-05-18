import fs from "fs";
import path from "path";
import yaml from "js-yaml";

// Hàm đọc file YAML
const readYamlFile = (filePath: string): any => {
  try {
    console.log(`Reading YAML file: ${filePath}`);
    const fileContent = fs.readFileSync(filePath, "utf8");
    return yaml.load(fileContent);
  } catch (error) {
    console.error(`Error reading YAML file: ${filePath}`, error);
    return {};
  }
};

// Đọc file swagger chính
const swaggerDocument = readYamlFile(path.join(__dirname, "swagger.yaml"));

// Khởi tạo các phần cần thiết nếu chưa tồn tại
swaggerDocument.paths = swaggerDocument.paths || {};
swaggerDocument.components = swaggerDocument.components || {};
swaggerDocument.components.schemas = swaggerDocument.components.schemas || {};
swaggerDocument.components.responses =
  swaggerDocument.components.responses || {};
swaggerDocument.components.parameters =
  swaggerDocument.components.parameters || {};

// Trực tiếp đọc responses.yaml và parameters.yaml
try {
  // Đọc file responses.yaml
  const responsesPath = path.join(__dirname, "responses.yaml");
  console.log(`Checking for responses file at: ${responsesPath}`);

  if (fs.existsSync(responsesPath)) {
    console.log(`Found responses file: ${responsesPath}`);
    const responsesContent = readYamlFile(responsesPath);

    if (responsesContent) {
      // Nếu file có cấu trúc "components: responses: {...}"
      if (
        responsesContent.components &&
        responsesContent.components.responses
      ) {
        Object.assign(
          swaggerDocument.components.responses,
          responsesContent.components.responses
        );
        console.log("Loaded responses from 'components.responses' structure");
      }
      // Nếu file có cấu trúc "responses: {...}"
      else if (responsesContent.responses) {
        Object.assign(
          swaggerDocument.components.responses,
          responsesContent.responses
        );
        console.log("Loaded responses from 'responses' structure");
      }
      // Nếu file có cấu trúc trực tiếp {...}
      else {
        Object.assign(swaggerDocument.components.responses, responsesContent);
        console.log("Loaded responses from direct structure");
      }
    }
  } else {
    console.warn(`Responses file not found: ${responsesPath}`);
  }

  // Đọc file parameters.yaml
  const parametersPath = path.join(__dirname, "parameters.yaml");
  console.log(`Checking for parameters file at: ${parametersPath}`);

  if (fs.existsSync(parametersPath)) {
    console.log(`Found parameters file: ${parametersPath}`);
    const parametersContent = readYamlFile(parametersPath);

    if (parametersContent) {
      // Nếu file có cấu trúc "components: parameters: {...}"
      if (
        parametersContent.components &&
        parametersContent.components.parameters
      ) {
        Object.assign(
          swaggerDocument.components.parameters,
          parametersContent.components.parameters
        );
        console.log("Loaded parameters from 'components.parameters' structure");
      }
      // Nếu file có cấu trúc "parameters: {...}"
      else if (parametersContent.parameters) {
        Object.assign(
          swaggerDocument.components.parameters,
          parametersContent.parameters
        );
        console.log("Loaded parameters from 'parameters' structure");
      }
      // Nếu file có cấu trúc trực tiếp {...}
      else {
        Object.assign(swaggerDocument.components.parameters, parametersContent);
        console.log("Loaded parameters from direct structure");
      }
    }
  } else {
    console.warn(`Parameters file not found: ${parametersPath}`);
  }
} catch (error) {
  console.error("Error loading responses or parameters:", error);
}

// Đọc tất cả schemas từ thư mục schemas
const schemasDir = path.join(__dirname, "schemas");
console.log(`Checking for schemas directory at: ${schemasDir}`);

if (fs.existsSync(schemasDir)) {
  console.log(`Found schemas directory: ${schemasDir}`);
  const schemaFiles = fs.readdirSync(schemasDir);
  console.log(`Found ${schemaFiles.length} schema files`);

  schemaFiles.forEach((file) => {
    if (file.endsWith(".yaml") || file.endsWith(".yml")) {
      const filePath = path.join(schemasDir, file);
      const schemaContent = readYamlFile(filePath);

      if (schemaContent) {
        // Hợp nhất vào components.schemas
        Object.assign(swaggerDocument.components.schemas, schemaContent);
      }
    }
  });
} else {
  console.warn(`Schemas directory not found: ${schemasDir}`);
}

// Đọc tất cả paths từ thư mục paths
const pathsDirectory = path.join(__dirname, "paths");
console.log(`Checking for paths directory at: ${pathsDirectory}`);

if (fs.existsSync(pathsDirectory)) {
  console.log(`Found paths directory: ${pathsDirectory}`);
  const pathFiles = fs.readdirSync(pathsDirectory);
  console.log(`Found ${pathFiles.length} path files`);

  // Hợp nhất tất cả file paths
  pathFiles.forEach((file) => {
    if (file.endsWith(".yaml") || file.endsWith(".yml")) {
      const filePath = path.join(pathsDirectory, file);
      const pathContent = readYamlFile(filePath);

      // Kiểm tra nếu pathContent không phải là object rỗng
      if (pathContent && Object.keys(pathContent).length > 0) {
        // Hợp nhất path vào tài liệu Swagger
        Object.assign(swaggerDocument.paths, pathContent);
      } else {
        console.warn(`Path file ${file} is empty or invalid.`);
      }
    }
  });
} else {
  console.warn(`Paths directory not found: ${pathsDirectory}`);
}

// Thêm responses mặc định (fallback) nếu không load được
if (Object.keys(swaggerDocument.components.responses).length === 0) {
  console.warn("No responses loaded, adding fallback responses");

  swaggerDocument.components.responses = {
    SuccessResponse: {
      description: "Thao tác thành công",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: { type: "string" },
              data: { type: "object" },
            },
          },
        },
      },
    },

    ValidationError: {
      description: "Dữ liệu không hợp lệ",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Dữ liệu không hợp lệ" },
            },
          },
        },
      },
    },

    UnauthorizedError: {
      description: "Không có quyền truy cập",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Không có quyền truy cập" },
            },
          },
        },
      },
    },

    NotFoundError: {
      description: "Không tìm thấy dữ liệu",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Không tìm thấy dữ liệu" },
            },
          },
        },
      },
    },

    InternalServerError: {
      description: "Lỗi máy chủ",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Lỗi máy chủ nội bộ" },
            },
          },
        },
      },
    },
  };
}

// Thêm parameters mặc định (fallback) nếu không load được
if (Object.keys(swaggerDocument.components.parameters).length === 0) {
  console.warn("No parameters loaded, adding fallback parameters");

  swaggerDocument.components.parameters = {
    IdPathParam: {
      name: "id",
      in: "path",
      required: true,
      schema: {
        type: "number",
      },
      description: "ID của bản ghi",
    },

    StartDateQueryParam: {
      name: "startDate",
      in: "query",
      required: true,
      schema: {
        type: "string",
        format: "date",
      },
      description: "Ngày bắt đầu (định dạng YYYY-MM-DD)",
    },

    EndDateQueryParam: {
      name: "endDate",
      in: "query",
      required: true,
      schema: {
        type: "string",
        format: "date",
      },
      description: "Ngày kết thúc (định dạng YYYY-MM-DD)",
    },
  };
}

// In ra thông tin để debug
console.log("Components loaded:");
console.log(
  `- Schemas: ${Object.keys(swaggerDocument.components.schemas).length}`
);
console.log(
  `- Responses: ${Object.keys(swaggerDocument.components.responses).length}`
);
console.log(
  `- Parameters: ${Object.keys(swaggerDocument.components.parameters).length}`
);
console.log(`- Paths: ${Object.keys(swaggerDocument.paths).length}`);

export default swaggerDocument;
