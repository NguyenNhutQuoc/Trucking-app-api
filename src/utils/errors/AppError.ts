export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Không tìm thấy") {
    super(message);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Dữ liệu không hợp lệ") {
    super(message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Không được phép") {
    super(message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Truy cập bị từ chối") {
    super(message);
  }
}

export class DatabaseError extends AppError {
  constructor(message = "Lỗi cơ sở dữ liệu") {
    super(message);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Lỗi máy chủ nội bộ") {
    super(message);
  }
}
