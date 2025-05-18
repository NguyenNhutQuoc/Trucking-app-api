Truck Weighing Management System Project Structure
src/
├── config/ # Configuration files
│ ├── database.ts # Database configuration
│ ├── env.ts # Environment variables
│ └── server.ts # Server configuration
├── domain/ # Domain layer (Clean Architecture)
│ ├── entities/ # Domain entities
│ ├── repositories/ # Repository interfaces
│ └── services/ # Domain services
├── infrastructure/ # Infrastructure layer
│ ├── database/ # Database setup
│ │ ├── migrations/ # TypeORM migrations
│ │ └── seeds/ # Database seeds
│ └── repositories/ # Repository implementations
├── interface/ # Interface layer
│ ├── controllers/ # Controllers
│ ├── middlewares/ # Express middlewares
│ ├── routes/ # API routes
│ └── validators/ # Request validators
├── application/ # Application layer
│ └── use-cases/ # Use cases (application services)
├── utils/ # Utility functions
│ ├── errors/ # Custom error classes
│ ├── helpers/ # Helper functions
│ └── logger.ts # Logging utility
├── types/ # TypeScript type definitions
│ └── index.ts # Type exports
├── app.ts # Express application setup
└── server.ts # Entry point
Additional files
.env # Environment variables
.env.example # Example environment variables
.gitignore # Git ignore file
.eslintrc.js # ESLint configuration
.prettierrc # Prettier configuration
tsconfig.json # TypeScript configuration
package.json # Project dependencies
README.md # Project documentation
docker-compose.yml # Docker compose configuration
Dockerfile # Docker configuration
jest.config.js # Jest test configuration

Truck Weighing Management System
A comprehensive system for managing truck weighing operations, built with Node.js, TypeScript, Express, and TypeORM.

Features
User authentication and authorization
Role-based access control
Truck weighing management
Customer management
Product management
Vehicle management
Reports and statistics
Clean Architecture implementation
Technologies
Node.js
TypeScript
Express.js
TypeORM
MS SQL Server
JWT Authentication
Docker & Docker Compose
Project Structure
This project follows Clean Architecture principles with the following structure:

src/
├── config/ # Configuration files
├── domain/ # Domain layer (entities, repositories interfaces)
├── infrastructure/ # Infrastructure layer (DB setup, repository implementations)
├── interface/ # Interface layer (controllers, routes, middlewares)
├── application/ # Application layer (services, use cases)
├── utils/ # Utility functions
└── types/ # TypeScript type definitions
Prerequisites
Node.js (v14 or later)
MS SQL Server
Docker & Docker Compose (optional)
Installation & Setup
Using npm
Clone the repository:
bash
git clone https://github.com/yourusername/truck-weighing-system.git
cd truck-weighing-system
Install dependencies:
bash
npm install
Configure environment variables:
bash
cp .env.example .env

# Edit .env file with your configuration

Run database migrations:
bash
npm run migration:run
Start the development server:
bash
npm run dev
Using Docker
Clone the repository:
bash
git clone https://github.com/yourusername/truck-weighing-system.git
cd truck-weighing-system
Configure environment variables:
bash
cp .env.example .env

# Edit .env file with your configuration

Start the containers:
bash
docker-compose up -d
Run database migrations (inside the container):
bash
docker exec -it truck-weighing-api npm run migration:run
API Documentation
Authentication
POST /api/auth/login - Login
POST /api/auth/validate-token - Validate token
POST /api/auth/change-password - Change password
GET /api/auth/permissions - Get user permissions
Phieucan (Weighing Records)
GET /api/phieucan - Get all records
GET /api/phieucan/:id - Get record by ID
POST /api/phieucan - Create new record
PUT /api/phieucan/:id - Update record
DELETE /api/phieucan/:id - Delete record
POST /api/phieucan/:id/complete - Complete weighing
POST /api/phieucan/:id/cancel - Cancel weighing
GET /api/phieucan/status/completed - Get completed weighings
GET /api/phieucan/status/pending - Get pending weighings
GET /api/phieucan/status/canceled - Get canceled weighings
GET /api/phieucan/date-range/search - Get records by date range
GET /api/phieucan/vehicle/:soxe - Get records by vehicle
GET /api/phieucan/product/:mahang - Get records by product
GET /api/phieucan/customer/:makh - Get records by customer
GET /api/phieucan/statistics/today - Get today's statistics
GET /api/phieucan/statistics/weight - Get weight statistics
Hanghoa (Products)
GET /api/hanghoa - Get all products
GET /api/hanghoa/search - Search products by name
GET /api/hanghoa/:id - Get product by ID
GET /api/hanghoa/code/:ma - Get product by code
POST /api/hanghoa - Create new product
PUT /api/hanghoa/:id - Update product
DELETE /api/hanghoa/:id - Delete product
Khachhang (Customers)
GET /api/khachhang - Get all customers
GET /api/khachhang/search - Search customers by name
GET /api/khachhang/:id - Get customer by ID
GET /api/khachhang/code/:ma - Get customer by code
POST /api/khachhang - Create new customer
PUT /api/khachhang/:id - Update customer
DELETE /api/khachhang/:id - Delete customer
Soxe (Vehicles)
GET /api/soxe - Get all vehicles
GET /api/soxe/:id - Get vehicle by ID
GET /api/soxe/number/:soxe - Get vehicle by number
POST /api/soxe - Create new vehicle
PUT /api/soxe/:id - Update vehicle
DELETE /api/soxe/:id - Delete vehicle
NhomQuyen (Permission Groups)
GET /api/nhomquyen - Get all permission groups
GET /api/nhomquyen/:id - Get permission group by ID
GET /api/nhomquyen/:id/permissions - Get permission group with permissions
POST /api/nhomquyen - Create new permission group
PUT /api/nhomquyen/:id - Update permission group
DELETE /api/nhomquyen/:id - Delete permission group
POST /api/nhomquyen/:nhomId/permissions/:formId - Add permission to group
DELETE /api/nhomquyen/:nhomId/permissions/:formId - Remove permission from group
PUT /api/nhomquyen/:nhomId/permissions - Update group permissions (bulk)
License
This project is licensed under the ISC License.
