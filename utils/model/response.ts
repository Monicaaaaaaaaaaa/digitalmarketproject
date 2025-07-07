export interface ApiResponse<T = any> {
  // `true` only when response returns with no error
  ok: boolean;
  // Response data `JSON`
  data?: T | null;
  // Response error details
  error?: ApiErrorResponse | null;
}

export interface ApiErrorResponse {
  // Description of the error
  message: string;
  // Error code from server
  code?: number;
}

// A class that implements the ApiResponse interface
export class ApiResponse<T = any> implements ApiResponse<T> {
  ok: boolean;
  data?: T | null;
  error?: ApiErrorResponse | null;

  private constructor(
    ok: boolean,
    data?: T | null,
    error?: ApiErrorResponse | null
  ) {
    this.ok = ok;
    this.data = data || null;
    this.error = error || null;
  }

  // Static method to create a successful response
  static success<T>(data: T): ApiResponse<T> {
    return new ApiResponse<T>(true, data, null);
  }

  // Static method to create an error response
  static error<T>(error?: string): ApiResponse<T> {
    return new ApiResponse<T>(false, null, {
      message: error ?? "Something went wrong",
    });
  }
}
