export const useAuthStore = defineStore("authentication", () => {
  const sessionManger = useAppSession();
  const isLoading = ref(false);
  const errorMessage = ref<string | null>(null);
  const successMessage = ref<string | null>(null);
  const userSession = ref<UserSession | null>(null);
  const userPassword = ref<string | null>(null);

  function resetState() {
    isLoading.value = false;
    errorMessage.value = null;
    successMessage.value = null;
  }

  async function login({
    phoneNumberOrEmail,
    password,
    role,
  }: {
    phoneNumberOrEmail: string;
    password: string;
    role: AccountType;
  }): Promise<ApiResponse<UserSession>> {
    resetState();
    isLoading.value = true;
    const api = useApiClient();
    const response = await api.request<UserSession>({
      endPoint: "/auth/login",
      method: Method.POST,
      body: { role: role, password, email: phoneNumberOrEmail },
    });

    isLoading.value = false;

    if (!response.ok || !response.data) {
      errorMessage.value =
        response.error?.message ?? kSomethingWentWrongTryAgain;
      return response;
    }

    const userSessionData: UserSession = {
      ...response.data,
    };

    sessionManger.updateSession(userSessionData);

    return response;
  }

  async function signup({
    fullName,
    password,
    email,
    phoneNumber,
    businessName,
    businessType,
    type,
  }: {
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
    businessName: string;
    businessType: BusinessType;
    type: AccountType;
  }): Promise<ApiResponse<UserSession>> {
    resetState();
    isLoading.value = true;
    const api = useApiClient();
    const response = await api.request<UserSession>({
      endPoint: "/auth/signup",
      method: Method.POST,
      body: {
        fullName: fullName,
        password: password,
        email: email,
        phoneNumber: phoneNumber,
        businessName: businessName,
        businessType: businessType,
        type: type,
      },
    });

    isLoading.value = false;

    if (!response.ok || !response.data) {
      errorMessage.value =
        response.error?.message ?? kSomethingWentWrongTryAgain;
      return response;
    }

    const userSessionData: UserSession = {
      ...response.data,
    };
    userSession.value = userSessionData;

    sessionManger.updateSession(userSessionData);

    return response;
  }

  async function logout(): Promise<void> {
    try {
      resetState();
      localStorage.clear();
      sessionStorage.clear();
      sessionManger.clearSession();
      navigateTo(AppRoute.home);
    } finally {
      navigateTo(AppRoute.home);
    }
  }

  return {
    login,
    signup,
    logout,
    isLoading,
    errorMessage,
    successMessage,
    data: userSession,
  };
});
