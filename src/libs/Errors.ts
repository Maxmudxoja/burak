export enum HttpCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum Message {
  SOMETHING_WENT_WRONG = "Something went wrong",
  NO_DATA_FOUND = "No data found",
  CREATED_FAILED = "Created failed",
  UPDATE_FAILED = "Update failed",
  OK = "OK",
  BAD_REQUEST = "Bad Request",
  UNAUTHORIZED = "Unauthorized",
  FORBIDDEN = "Forbidden",
  NOT_FOUND = "Not Found",
  INTERNAL_SERVER_ERROR = "Internal Server Error",
}

class Errors extends Error {
  public code: HttpCode;
  public message: Message;

  constructor(code: HttpCode, message: Message) {
    super();
    this.code = code;
    this.message = message;
  }
}

export default Errors;
