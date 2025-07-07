import type { AxiosRequestConfig, CancelToken } from "axios";
import type { ApiResponse } from "../model";
import type { Method } from "../api/baseApiClient";

export interface BaseApiClientInterface {
  /**
   * Initiates the request. Allows an external AbortController to be passed in for aborting.
   *
   * @param endpoint - The API endpoint to request.
   * @param options - Additional fetch options (headers, etc).
   * @param method - The HTTP method (GET, POST, PATCH).
   * @param timeout - Timeout duration in milliseconds.
   * @param controller - The AbortController to manage request cancellation.
   * @returns {ApiResponse} - The response from the API.
   */
  request<T>({
    endPoint,
    method,
    timeout,
    options,
    cancelToken,
    body,
    queryParameters,
  }: {
    endPoint: string;
    method: Method;
    timeout?: number;
    options: AxiosRequestConfig;
    cancelToken?: CancelToken;
    body?: unknown;
    queryParameters?: Record<string, unknown>;
  }): Promise<ApiResponse<T>>;
}
export interface BaseApiInterface {
  apiClient: BaseApiClientInterface;
}
