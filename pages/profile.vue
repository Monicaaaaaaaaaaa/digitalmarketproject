<script lang="ts" setup>
  import { watch } from "vue";

  definePageMeta({ layout: "profile" });

  const accountStore = useAccountStore();
  const vendorStore = useVendorsStore();
  const { account } = storeToRefs(accountStore);

  const isVendor = computed(() => account.value?.type == "Vendor");

  // Appointments
  const rawAppointments = computed(() =>
    isVendor.value
      ? account.value?.appointmentsAsVendor || []
      : account.value?.appointmentsAsUser || []
  );

  // Vendor Stats
  const vendorStats = computed(() => {
    if (!isVendor.value) return null;

    const total = rawAppointments.value.length;
    const pending = rawAppointments.value.filter((apt) => apt.opened).length;
    const completed = total - pending;

    return {
      total,
      pending,
      completed,
      services: account.value?.services?.length || 0,
      rating: account.value?.rating || 0,
    };
  });

  // Appointment Filtering
  const appointmentFilter = ref<"all" | "pending" | "completed">("all");

  const filteredAppointments = computed(() => {
    switch (appointmentFilter.value) {
      case "pending":
        return rawAppointments.value.filter((apt) => apt.opened);
      case "completed":
        return rawAppointments.value.filter((apt) => !apt.opened);
      default:
        return rawAppointments.value;
    }
  });

  // Format date to readable string
  function formatDate(date: Date | string): string {
    const d = new Date(date);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // Format currency to ₦
  function formatCurrency(amount: number): string {
    return `₦${amount.toLocaleString()}`;
  }

  // Update appointment status
  async function updateAppointmentStatus(
    appointmentId: string,
    opened: boolean
  ) {
    await vendorStore.closeAppointment({ id: appointmentId });
    try {
      await accountStore.fetchAccount();
    } catch (error) {
      console.error("Failed to update appointment:", error);
    }
  }

  // Profile update state
  const profileForm = ref({
    name: "",
    email: "",
    phone: "",
  });

  // Pre-fill profile form when account data is available
  watch(
    account,
    (newAccount) => {
      if (newAccount) {
        profileForm.value = {
          name: newAccount.name || "",
          email: newAccount.email || "",
          phone: newAccount.phoneNumber || "",
        };
      }
    },
    { immediate: true }
  );

  const profileUpdateStatus = ref<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  async function updateAccount() {
    profileUpdateStatus.value = "loading";
    const response = await accountStore.updateAccount({
      name: profileForm.value.name,
      email: profileForm.value.email,
      phone: profileForm.value.phone,
    });
    if (response.ok === false || response.error != null) {
      profileUpdateStatus.value = "error";
      return;
    }
    profileUpdateStatus.value = "success";
    try {
      await accountStore.fetchAccount();
    } catch (error) {
      console.error("Failed to update account:", error);
      profileUpdateStatus.value = "error";
    }
  }

  // Service creation state (Vendor only)
  const serviceForm = ref({
    name: "",
    price: "",
    imageUrl: "",
  });

  const serviceCreationStatus = ref<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  // Handle file selection for service image
  function handleImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      // Create a local URL for the selected file
      serviceForm.value.imageUrl = URL.createObjectURL(file);
    }
  }

  async function createService() {
    if (!isVendor.value) return;
    serviceCreationStatus.value = "loading";
    const response = await vendorStore.createService({
      name: serviceForm.value.name,
      price: parseFloat(serviceForm.value.price),
      imageUrl: serviceForm.value.imageUrl,
    });
    if (response.ok === false || response.error != null) {
      serviceCreationStatus.value = "error";
      return;
    }
    serviceCreationStatus.value = "success";
    serviceForm.value = { name: "", price: "", imageUrl: "" };
    try {
      await accountStore.fetchAccount();
    } catch (error) {
      console.error("Failed to create service:", error);
      serviceCreationStatus.value = "error";
    }
  }

  // Navigation
  const goToVendors = () => navigateTo(AppRoute.vendors);
  accountStore.fetchAccount();
</script>

<template>
  <div class="dashboard-container">
    <header class="profile-header">
      <button id="backToDashboardBtn" class="btn-secondary" @click="goBack">
        🔙 Dashboard
      </button>
    </header>
    <!-- Header -->
    <header class="dashboard-header">
      <div class="user-info">
        <img
          :src="account?.avatarUrl || '/images/placeholder.jpg'"
          alt="Profile"
          class="avatar"
        />
        <div>
          <h1>Welcome, {{ account?.name }}</h1>
          <p class="user-type">
            {{ isVendor ? "Vendor" : "Customer" }} Dashboard
          </p>
        </div>
      </div>
    </header>

    <!-- Vendor Stats -->
    <section v-if="isVendor && vendorStats" class="stats-section">
      <h2>Business Overview</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <h3>{{ vendorStats.total }}</h3>
          <p>Total Appointments</p>
        </div>
        <div class="stat-card">
          <h3>{{ vendorStats.pending }}</h3>
          <p>Pending</p>
        </div>
        <div class="stat-card">
          <h3>{{ vendorStats.completed }}</h3>
          <p>Completed</p>
        </div>
        <div class="stat-card">
          <h3>{{ vendorStats.services }}</h3>
          <p>Services</p>
        </div>
        <div class="stat-card">
          <h3>⭐ {{ vendorStats.rating }}</h3>
          <p>Rating</p>
        </div>
      </div>
    </section>

    <!-- Vendor Services (for vendors only) -->
    <section
      v-if="isVendor && account?.services?.length"
      class="services-section"
    >
      <h2>Your Services</h2>
      <div class="services-grid">
        <div
          v-for="service in account.services"
          :key="service.id"
          class="service-card"
        >
          <img :src="service.imageUrl" :alt="service.name" />
          <div class="service-info">
            <h4>{{ service.name }}</h4>
            <p class="price">₦{{ service.price.toLocaleString() }}</p>
            <p class="created-at">
              Created: {{ formatDate(service.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Appointments Section -->
    <section class="appointments-section">
      <div class="section-header">
        <h2>{{ isVendor ? "Appointment Requests" : "My Appointments" }}</h2>
        <div class="filter-tabs">
          <button
            :class="['filter-tab', { active: appointmentFilter === 'all' }]"
            @click="appointmentFilter = 'all'"
          >
            All
          </button>
          <button
            :class="['filter-tab', { active: appointmentFilter === 'pending' }]"
            @click="appointmentFilter = 'pending'"
          >
            Pending
          </button>
          <button
            :class="[
              'filter-tab',
              { active: appointmentFilter === 'completed' },
            ]"
            @click="appointmentFilter = 'completed'"
          >
            Completed
          </button>
        </div>
      </div>

      <div v-if="filteredAppointments.length === 0" class="no-appointments">
        <p>
          {{
            isVendor
              ? "No appointment requests yet."
              : "No appointments booked yet."
          }}
        </p>
        <button v-if="!isVendor" class="btn-primary" @click="goToVendors">
          Book Your First Appointment
        </button>
      </div>

      <div class="appointments-list">
        <div
          v-for="appointment in filteredAppointments"
          :key="appointment.id"
          class="appointment-card"
        >
          <div class="appointment-info">
            <div class="appointment-time">
              <h4>{{ formatDate(appointment.time) }}</h4>
              <span
                :class="[
                  'status',
                  {
                    pending: appointment.opened,
                    completed: !appointment.opened,
                  },
                ]"
              >
                {{ !appointment.opened ? "Completed" : "Pending" }}
              </span>
            </div>
            <div class="appointment-details">
              <p v-if="isVendor">
                <strong>Name:</strong> {{ appointment.user?.name }} <br />
                <strong>Phone:</strong>
                {{ appointment.user?.phoneNumber }}
              </p>
            </div>
          </div>

          <div v-if="isVendor" class="appointment-actions">
            <button
              v-if="appointment.opened"
              class="btn-secondary"
              @click="updateAppointmentStatus(appointment.id, true)"
            >
              Mark Complete
            </button>
            <button v-else class="btn-success">Completed</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Profile Update Section -->
    <section class="profile-update-section">
      <h2>Update Profile</h2>
      <div class="profile-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input
            id="name"
            v-model="profileForm.name"
            type="text"
            placeholder="Enter

 your name"
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="profileForm.email"
            type="email"
            placeholder="Enter your email"
          />
        </div>
        <div class="form-group">
          <label for="phone">Phone</label>
          <input
            id="phone"
            v-model="profileForm.phone"
            type="tel"
            placeholder="Enter your phone number"
          />
        </div>
        <button
          class="btn-primary"
          :disabled="profileUpdateStatus === 'loading'"
          @click="updateAccount"
        >
          {{
            profileUpdateStatus === "loading" ? "Updating..." : "Update Profile"
          }}
        </button>
        <p v-if="profileUpdateStatus === 'success'" class="success-message">
          Profile updated successfully!
        </p>
        <p v-if="profileUpdateStatus === 'error'" class="error-message">
          Failed to update profile. Please try again.
        </p>
      </div>
    </section>

    <!-- Create Service Section (Vendor only) -->
    <section v-if="isVendor" class="create-service-section">
      <h2>Create New Service</h2>
      <div class="service-form">
        <div class="form-group">
          <label for="serviceName">Service Name</label>
          <input
            id="serviceName"
            v-model="serviceForm.name"
            type="text"
            placeholder="Enter service name"
          />
        </div>
        <div class="form-group">
          <label for="servicePrice">Price (₦)</label>
          <input
            id="servicePrice"
            v-model="serviceForm.price"
            type="number"
            placeholder="Enter price"
          />
        </div>
        <div class="form-group">
          <label for="serviceImage">Service Image</label>
          <input
            id="serviceImage"
            type="file"
            accept="image/*"
            @change="handleImageSelect"
          />
          <p v-if="serviceForm.imageUrl" class="image-preview">
            Selected: {{ serviceForm.imageUrl }}
          </p>
        </div>
        <button
          class="btn-primary"
          :disabled="serviceCreationStatus === 'loading'"
          @click="createService"
        >
          {{
            serviceCreationStatus === "loading"
              ? "Creating..."
              : "Create Service"
          }}
        </button>
        <p v-if="serviceCreationStatus === 'success'" class="success-message">
          Service created successfully!
        </p>
        <p v-if="serviceCreationStatus === 'error'" class="error-message">
          Failed to create service. Please try again.
        </p>
      </div>
    </section>

    <!-- Account Info -->
    <section class="account-info">
      <h2>Account Information</h2>
      <div class="info-grid">
        <div class="info-item">
          <strong>Email:</strong> {{ account?.email || "Not provided" }}
        </div>
        <div class="info-item">
          <strong>Phone:</strong> {{ account?.phoneNumber }}
        </div>
        <div v-if="isVendor && account?.businessName" class="info-item">
          <strong>Business:</strong> {{ account.businessName }}
        </div>
        <div v-if="isVendor && account?.businessType" class="info-item">
          <strong>Category:</strong> {{ account.businessType }}
        </div>
        <div class="info-item">
          <strong>Member since:</strong>
          {{ formatDate(account?.createdAt || new Date()) }}
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
  .dashboard-container {
    padding: 1rem;
    max-width: 1200px;
    margin: auto;
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #e9ecef;
  }

  .user-type {
    color: #6c757d;
    margin: 0;
  }

  .profile-update-section,
  .create-service-section {
    margin-bottom: 2rem;
  }

  .profile-form,
  .service-form {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: grid;
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-group label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #2c3e50;
  }

  .form-group input {
    padding: 0.75rem;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    font-size: 1rem;
  }

  .form-group input[type="file"] {
    padding: 0.5rem;
  }

  .image-preview {
    margin-top: 0.5rem;
    color: #6c757d;
    font-size: 0.9rem;
    word-break: break-all;
  }

  .success-message {
    color: #28a745;
    margin-top: 0.5rem;
  }

  .error-message {
    color: #dc3545;
    margin-top: 0.5rem;
  }

  .stats-section {
    margin-bottom: 2rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .stat-card h3 {
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
  }

  .stat-card p {
    margin: 0;
    color: #6c757d;
  }

  .appointments-section {
    margin-bottom: 2rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .filter-tabs {
    display: flex;
    gap: 0.5rem;
  }

  .filter-tab {
    padding: 0.5rem 1rem;
    border: 1px solid #dee2e6;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .filter-tab.active {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }

  .no-appointments {
    text-align: center;
    padding: 2rem;
    color: #6c757d;
  }

  .appointments-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .appointment-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .appointment-info {
    flex: 1;
  }

  .appointment-time {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  .appointment-time h4 {
    margin: 0;
    color: #2c3e50;
  }

  .status {
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
  }

  .status.pending {
    background: #fff3cd;
    color: #856404;
  }

  .status.completed {
    background: #d4edda;
    color: #155724;
  }

  .appointment-details {
    color: #6c757d;
    font-size: 0.9rem;
  }

  .appointment-details p {
    margin: 0.25rem 0;
  }

  .appointment-actions {
    display: flex;
    gap: 0.5rem;
  }

  .btn-success {
    background: #28a745;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
  }

  .btn-success:hover {
    background: #218838;
  }

  .services-section {
    margin-bottom: 2rem;
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
  }

  .service-card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .service-card img {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }

  .service-info {
    padding: 1rem;
  }

  .service-info h4 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
  }

  .price {
    font-weight: bold;
    color: #28a745;
    margin: 0;
  }

  .created-at {
    color: #6c757d;
    font-size: 0.9rem;
    margin: 0.5rem 0 0;
  }

  .account-info {
    margin-bottom: 2rem;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .info-item {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .btn-primary {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
  }

  .btn-primary:hover {
    background: #0056b3;
  }

  .btn-secondary {
    background: #6c757d;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
  }

  .btn-secondary:hover {
    background: #545b62;
  }

  @media (max-width: 768px) {
    .dashboard-header {
      flex-direction: column;
      gap: 1rem;
    }

    .section-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .appointment-card {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .stats-grid {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }

    .profile-form,
    .service-form {
      grid-template-columns: 1fr;
    }
  }
</style>
