import { defineStore } from "pinia";

export const useAdminStore = defineStore("admin", () => {
  // Load dummy accounts
  const users = ref<Account[]>([]);

  async function getUsers(): Promise<ApiResponse<Account[]>> {
    const response = await makeAuthenticatedRequest<Account[]>({
      endPoint: "/users",
      isMultipart: false,
      method: Method.GET,
      errorMessage: "",
    });

    if (!response.ok || !response.data) {
      return ApiResponse.error(response.error?.message);
    }

    const systemVendors: Account[] = response.data;

    const merged = [...systemVendors, ...users.value];

    const allVendors = merged.filter(
      (vendor, index, self) =>
        index === self.findIndex((v) => v.id === vendor.id)
    );

    // Update state
    users.value = allVendors;

    return ApiResponse.success(allVendors);
  }

  async function suspendUser({
    userId,
  }: {
    userId: string;
  }): Promise<ApiResponse<Account>> {
    const response = await makeAuthenticatedRequest<Account>({
      endPoint: "/users/suspension",
      isMultipart: false,
      method: Method.POST,
      body: {
        userId: userId,
        suspended: true,
      },
    });

    if (!response.ok || !response.data) {
      return ApiResponse.error(response.error?.message);
    }

    const updatedUsers = users.value.map((u) =>
      u.id == userId ? response.data! : u
    );

    users.value = updatedUsers;
    return response;
  }

  async function unSuspendUser({
    userId,
  }: {
    userId: string;
  }): Promise<ApiResponse<Account>> {
    const response = await makeAuthenticatedRequest<Account>({
      endPoint: "/users/suspension",
      isMultipart: false,
      method: Method.POST,
      body: {
        userId: userId,
        suspended: false,
      },
    });

    if (!response.ok || !response.data) {
      return ApiResponse.error(response.error?.message);
    }

    const updatedUsers = users.value.map((u) =>
      u.id == userId ? response.data! : u
    );

    users.value = updatedUsers;
    return response;
  }

  return {
    users,
    getUsers,
    unSuspendUser,
    suspendUser,
  };
});
