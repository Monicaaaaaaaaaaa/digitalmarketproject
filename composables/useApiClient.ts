import BaseApiClient, { Method } from "~/utils/api/baseApiClient";
import type { ApiResponse } from "~/utils/model";

// Utility to create an instance
export const useApiClient = (accessToken?: string): BaseApiClient => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  return new BaseApiClient(baseUrl, accessToken);
};

interface RequestOptions {
  headers: Record<string, string>;
}

const getAuthenticatedOptions = async (
  isProtected: boolean,
  isMultipart: boolean = false
): Promise<ApiResponse<RequestOptions>> => {
  if (!isProtected) {
    return {
      ok: true,
      data: {
        headers: {
          "Content-Type": "application/json",
        },
      },
    };
  }

  // Get session from the composable here (in the function that will be called from Vue context)
  const appCookie = useAppSession();
  const session = await appCookie.getSession({ autoRefresh: true });

  if (!session.ok || !session.data) {
    return {
      ok: false,
      error: { message: session.error?.message ?? "Session not found" },
    };
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.data.accessToken}`,
  };

  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }

  return { ok: true, data: { headers } };
};

export const makeAuthenticatedRequest = async <T>({
  endPoint,
  method,
  queryParameters,
  body,
  errorMessage = "Something went wrong.",
  isMultipart = false,
}: {
  endPoint: string;
  method: Method;
  queryParameters?: Record<string, unknown>;
  body?: unknown;
  errorMessage?: string;
  isMultipart?: boolean;
}): Promise<ApiResponse<T>> => {
  try {
    const optionsResponse = await getAuthenticatedOptions(true, isMultipart);
    if (!optionsResponse.ok || !optionsResponse.data) {
      return {
        ok: false,
        error: {
          message: optionsResponse.error?.message || "Session not found",
        },
      };
    }

    const apiClient = useApiClient();

    const response = await apiClient.request<T>({
      endPoint,
      method,
      options: { headers: optionsResponse.data.headers },
      body,

      queryParameters,
    });

    if (!response.ok || !response.data) {
      return {
        ok: false,
        error: { message: response.error?.message || errorMessage },
      };
    }

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // console.error(`API REQUEST ERROR: ${error}`);
    return { ok: false, error: { message: errorMessage } };
  }
};
