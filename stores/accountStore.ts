import { defineStore } from "pinia";

export const useAccountStore = defineStore("account", () => {
  const account = ref<Account>();

  async function fetchAccount(): Promise<ApiResponse<Account>> {
    const response = await makeAuthenticatedRequest<Account>({
      endPoint: "/account",
      isMultipart: false,
      method: Method.GET,
      errorMessage: "",
    });

    if (!response.ok || !response.data) {
      return ApiResponse.error(response.error?.message);
    }

    account.value = response.data;

    return response;
  }

  async function updateAccount({
    email,
    name,
    phone,
  }: {
    email: string;
    name: string;
    phone: string;
  }): Promise<ApiResponse<Account>> {
    const response = await makeAuthenticatedRequest<Account>({
      endPoint: "/account",
      isMultipart: false,
      method: Method.PATCH,
      errorMessage: "",
      body: { email, name, phone },
    });

    if (!response.ok || !response.data) {
      return ApiResponse.error(response.error?.message);
    }

    account.value = response.data;

    return response;
  }

  return {
    account,
    updateAccount,
    fetchAccount,
  };
});
