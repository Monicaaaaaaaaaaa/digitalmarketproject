/* eslint-disable @typescript-eslint/no-explicit-any */
// composables/useApiClient.ts
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CancelToken,
} from "axios";
import axios from "axios";
import { ApiResponse } from "../model";
import type { BaseApiClientInterface } from "../apiInterface";

export enum Method {
  GET = "get",
  POST = "post",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
}

export default class BaseApiClient implements BaseApiClientInterface {
  private accessToken?: string;
  private baseUrl: string;
  private axios: AxiosInstance;

  constructor(baseUrl: string, accessToken?: string) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
    this.axios = axios.create({
      baseURL: baseUrl,
    });
  }

  async request<T>({
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
    options?: AxiosRequestConfig;
    cancelToken?: CancelToken;
    body?: unknown;
    queryParameters?: Record<string, unknown>;
  }): Promise<ApiResponse<T>> {
    try {
      const config: AxiosRequestConfig = {
        ...options,
        method,
        url: endPoint,
        params: queryParameters,
        data: body,
        timeout,
        cancelToken,
        headers: {
          ...(options?.headers || {}), // Use provided headers first
          ...(this.accessToken
            ? { Authorization: `Bearer ${this.accessToken}` }
            : {}),
        },
      };

      // // Do NOT set Content-Type if body is FormData; let Axios handle it
      // if (!(body instanceof FormData) && config.headers) {
      //   config.headers["Content-Type"] = "application/json";
      // }

      // console.log("Request Config:", {
      //   url: config.url,
      //   method: config.method,
      //   headers: config.headers,
      //   data:
      //     config.data instanceof FormData
      //       ? "[FormData]"
      //       : JSON.stringify(config.data),
      // });

      const response: AxiosResponse = await this.axios.request(config);

      // console.log({
      //   url: response.config.url,
      //   method: response.config.method,
      //   status: response.status,
      //   requestData: response.config.data,
      //   responseData: response.data,
      // });

      return ApiResponse.success(response.data.data);
    } catch (error: any) {
      // console.error(`Request error: ${error.message || error.response?.data}`);
      if (error.response) {
        const errorMessage =
          error.response.data?.error?.message ||
          error.response.data?.message ||
          "Unknown error";
        return {
          ok: false,
          error: { message: errorMessage, code: error.response.status },
        };
      }
      if (error.request) {
        return {
          ok: false,
          error: { message: "Connection timeout. Please try again later." },
        };
      }
      return {
        ok: false,
        error: { message: error.message || "Something went wrong 4000" },
      };
    }
  }
}
