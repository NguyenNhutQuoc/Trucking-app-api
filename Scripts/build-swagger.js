const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

// Hàm đọc file YAML
const readYamlFile = (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    return yaml.load(fileContent);
  } catch (error) {
    console.error(`Error reading YAML file: ${filePath}`, error);
    return {};
  }
};

// Đọc file swagger chính
const swaggerFilePath = path.join(__dirname, "../src/swagger/swagger.yaml");
const swaggerDocument = readYamlFile(swaggerFilePath);

// Hàm đọc tất cả file YAML trong một thư mục
const readAllYamlFilesInDirectory = (directoryPath) => {
  try {
    const files = fs.readdirSync(directoryPath);
    const result = {};

    files.forEach((file) => {
      if (file.endsWith(".yaml")) {
        const filePath = path.join(directoryPath, file);
        const content = readYamlFile(filePath);
        Object.assign(result, content);
      }
    });

    return result;
  } catch (error) {
    console.error(`Error reading directory: ${directoryPath}`, error);
    return {};
  }
};

// Đọc tất cả schema
const schemasDirectory = path.join(__dirname, "../src/swagger/schemas");
const schemas = readAllYamlFilesInDirectory(schemasDirectory);
swaggerDocument.components = swaggerDocument.components || {};
swaggerDocument.components.schemas = schemas;

// Đọc tất cả responses
const responsesDirectory = path.join(
  __dirname,
  "../src/swagger/components/responses.yaml"
);
if (fs.existsSync(responsesDirectory)) {
  const responses = readYamlFile(responsesDirectory);
  Object.assign(swaggerDocument.components, responses.components);
}

// Đọc tất cả paths
const pathsDirectory = path.join(__dirname, "../src/swagger/paths");
swaggerDocument.paths = swaggerDocument.paths || {};
const paths = readAllYamlFilesInDirectory(pathsDirectory);
Object.assign(swaggerDocument.paths, paths);

// Ghi file output
const outputDirectory = path.join(__dirname, "../public");
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory, { recursive: true });
}

const outputFilePath = path.join(outputDirectory, "swagger.json");
fs.writeFileSync(outputFilePath, JSON.stringify(swaggerDocument, null, 2));
console.log(`Swagger documentation generated at ${outputFilePath}`);
