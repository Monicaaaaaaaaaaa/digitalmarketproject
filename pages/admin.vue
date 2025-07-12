<script lang="ts" setup>
  import { ref, watch } from "vue";
  import { useAdminStore } from "~/stores/adminStore";
  import { storeToRefs } from "pinia";

  definePageMeta({ layout: "profile" });

  const adminStore = useAdminStore();
  const errorMsg = ref<string>();
  const isLoading = ref<boolean>(false);
  const { users } = storeToRefs(adminStore);

  function suspendUser(userId: string) {
    adminStore.suspendUser({ userId });
  }

  function unSuspendUser(userId: string) {
    adminStore.unSuspendUser({ userId });
  }

  async function loadData() {
    isLoading.value = true;
    errorMsg.value = undefined;

    const response = await adminStore.getUsers();

    if (!response.ok || response.data == null) {
      errorMsg.value = response.error?.message ?? "Failed to load users";
    }
    isLoading.value = false;
  }

  // Load data on component mount
  loadData();
</script>

<template>
  <div class="container">
    <!-- Header -->
    <header class="header">
      <h1>Admin Dashboard - User Management</h1>
      <p>Manage user accounts, view details, and control account status.</p>
    </header>

    <!-- Error Message -->
    <div v-if="errorMsg" class="error-message">
      <svg
        class="error-icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {{ errorMsg }}
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
    </div>

    <!-- Users Table -->
    <div v-else-if="users.length" class="table-container">
      <table class="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="user-row">
            <td>
              <div class="user-info">
                <img
                  v-if="user.avatarUrl"
                  :src="user.avatarUrl"
                  alt="Avatar"
                  class="avatar"
                />
                <div>
                  <div class="user-name">{{ user.name }}</div>
                  <div v-if="user.businessName" class="business-name">
                    {{ user.businessName }}
                  </div>
                </div>
              </div>
            </td>
            <td>{{ user.email || "N/A" }}</td>
            <td>{{ user.phoneNumber }}</td>
            <td>{{ user.type }}</td>
            <td>
              <span
                :class="{
                  status: true,
                  suspended: user.isSuspended,
                  active: !user.isSuspended,
                }"
              >
                {{ user.isSuspended ? "Suspended" : "Active" }}
              </span>
            </td>
            <td>
              <button
                v-if="!user.isSuspended"
                @click="suspendUser(user.id)"
                class="action-button suspend"
              >
                Suspend
              </button>
              <button
                v-else
                @click="unSuspendUser(user.id)"
                class="action-button unsuspend"
              >
                Unsuspend
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- No Users Found -->
    <div v-else class="no-users">
      <svg
        class="no-users-icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-4 0H7a2 2 0 01-2-2v-6a2 2 0 012-2h2m4 0V6a2 2 0 00-2-2H7a2 2 0 00-2 2v2"
        />
      </svg>
      <h3>No users found</h3>
      <p>There are currently no users in the system.</p>
    </div>
  </div>
</template>

<style scoped>
  .container {
    min-height: 100vh;
    background-color: #f5f5f5;
    padding: 24px;
    font-family: Arial, sans-serif;
  }

  .header {
    margin-bottom: 32px;
  }

  .header h1 {
    font-size: 28px;
    font-weight: bold;
    color: #333;
  }

  .header p {
    color: #666;
    margin-top: 8px;
  }

  .error-message {
    display: flex;
    align-items: center;
    background-color: #fee2e2;
    color: #b91c1c;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;
  }

  .error-icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 256px;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .table-container {
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
  }

  .user-table {
    width: 100%;
    border-collapse: collapse;
  }

  .user-table th,
  .user-table td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  .user-table th {
    background-color: #f9fafb;
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
    text-transform: uppercase;
  }

  .user-row:hover {
    background-color: #f9fafb;
  }

  .user-info {
    display: flex;
    align-items: center;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 12px;
  }

  .user-name {
    font-size: 14px;
    font-weight: 500;
    color: #111827;
  }

  .business-name {
    font-size: 12px;
    color: #6b7280;
  }

  .status {
    display: inline-flex;
    padding: 4px 8px;
    font-size: 12px;
    font-weight: 500;
    border-radius: 9999px;
  }

  .status.suspended {
    background-color: #fee2e2;
    color: #b91c1c;
  }

  .status.active {
    background-color: #dcfce7;
    color: #15803d;
  }

  .action-button {
    font-size: 14px;
    font-weight: 500;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
  }

  .action-button.suspend {
    color: #b91c1c;
  }

  .action-button.suspend:hover {
    color: #991b1b;
  }

  .action-button.unsuspend {
    color: #15803d;
  }

  .action-button.unsuspend:hover {
    color: #166534;
  }

  .no-users {
    text-align: center;
    padding: 48px 0;
  }

  .no-users-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto;
    color: #9ca3af;
  }

  .no-users h3 {
    font-size: 16px;
    font-weight: 500;
    color: #111827;
    margin-top: 8px;
  }

  .no-users p {
    font-size: 14px;
    color: #6b7280;
    margin-top: 4px;
  }
</style>
