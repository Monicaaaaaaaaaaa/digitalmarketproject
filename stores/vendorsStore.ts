import { defineStore } from "pinia";
import { dummyAccounts } from "~/data/dummyAccounts";

export const useVendorsStore = defineStore("vendors", () => {
  // Load dummy accounts
  const vendors = ref<Account[]>([...dummyAccounts]);
  const selectedCategory = ref("All");
  const searchQuery = ref("");

  const categoryOptions = computed(() => [
    "All",
    ...new Set(vendors.value.map((v) => v.businessType ?? "All")),
  ]);

  const filteredVendors = computed(() => {
    return vendors.value.filter((v) => {
      const matchesCategory =
        selectedCategory.value === "All" ||
        v.businessType === selectedCategory.value;

      const matchesSearch =
        !searchQuery.value ||
        v.businessName?.toLowerCase().includes(searchQuery.value.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  });

  async function loadSystemVendors(): Promise<ApiResponse<Account[]>> {
    const response = await makeAuthenticatedRequest<Account[]>({
      endPoint: "/vendors",
      isMultipart: false,
      method: Method.GET,
      errorMessage: "",
    });

    if (!response.ok || !response.data) {
      return ApiResponse.error(response.error?.message);
    }

    const systemVendors: Account[] = response.data;

    const merged = [...systemVendors, ...vendors.value];

    const allVendors = merged.filter(
      (vendor, index, self) =>
        index === self.findIndex((v) => v.id === vendor.id)
    );

    // Update state
    vendors.value = allVendors;

    return ApiResponse.success(allVendors);
  }

  async function bookAppointment({
    time,
    note,
    vendorId,
  }: {
    time: Date;
    note?: string;
    vendorId: string;
  }): Promise<ApiResponse<Appointment[]>> {
    const response = await makeAuthenticatedRequest<Appointment[]>({
      endPoint: "/vendor/service/appointment",
      isMultipart: false,
      method: Method.POST,
      body: {
        time: time,
        note,
        vendorId,
      },
    });

    if (!response.ok || !response.data) {
      return ApiResponse.error(response.error?.message);
    }

    const newAppointment = response.data;

    loadSystemVendors(); // Optionally await if it needs to complete

    return ApiResponse.success(newAppointment);
  }

  async function closeAppointment({
    id,
  }: {
    id: string;
  }): Promise<ApiResponse<Appointment>> {
    const response = await makeAuthenticatedRequest<Appointment>({
      endPoint: "/vendor/service/appointment",
      isMultipart: false,
      method: Method.PATCH,
      body: {
        opened: false,
        appointmentId: id,
      },
    });

    if (!response.ok || !response.data) {
      return ApiResponse.error(response.error?.message);
    }

    const newAppointment = response.data;

    loadSystemVendors(); // Optionally await if it needs to complete

    return ApiResponse.success(newAppointment);
  }

  async function createService({
    name,
    price,
    imageUrl,
  }: {
    name: string;
    price: number;
    imageUrl: string;
  }): Promise<ApiResponse> {
    const response = await makeAuthenticatedRequest<Appointment>({
      endPoint: "/vendor/service",
      isMultipart: false,
      method: Method.POST,
      body: {
        name: name,
        imageUrl: imageUrl,
        price: price,
      },
    });

    if (!response.ok || !response.data) {
      return ApiResponse.error(response.error?.message);
    }

    loadSystemVendors();
    return ApiResponse.success(true);
  }

  function getVendorByEmail(email: string): Account | undefined {
    return vendors.value.find((v) => v.email == email);
  }

  return {
    vendors,
    selectedCategory,
    categoryOptions,
    filteredVendors,
    searchQuery,
    createService,
    getVendorByEmail,
    bookAppointment,
    closeAppointment,
    loadSystemVendors,
  };
});
