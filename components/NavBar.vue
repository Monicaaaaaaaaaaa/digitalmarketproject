<script lang="ts" setup>
  import { AppRoute } from "~/utils/constants";
  import ModalComponent from "./ModalComponent.vue";

  const currentTabIndex = ref(0);
  const showLogin = ref(false);
  const showSignup = ref(false);
  const showForgot = ref(false);
  const { isAuthenticated } = useAppSession();

  const route = useRoute();
  watch(
    () => route.path, // Watch the current route path
    (newPath) => {
      //   Update tab index based on route
      if (newPath.includes(AppRoute.about)) {
        currentTabIndex.value = 1;
      } else if (newPath.includes(AppRoute.vendors)) {
        currentTabIndex.value = 2;
      } else if (newPath.includes(AppRoute.contact)) {
        currentTabIndex.value = 3;
      } else {
        currentTabIndex.value = 0; // Default to 0 if route doesn't match
      }
    },
    { immediate: true } // Run immediately on component mount
  );
</script>

<template>
  <ModalComponent
    v-model:showLogin="showLogin"
    v-model:showSignup="showSignup"
    v-model:showForgot="showForgot"
  />

  <nav class="navbar">
    <div class="container">
      <div class="logo">
        <h1>Campus<span>Cart</span></h1>
      </div>
      <div class="nav-toggle" id="navToggle">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul class="nav-menu" id="navMenu">
        <li><a href="/" :class="{ active: currentTabIndex === 0 }">Home</a></li>
        <li>
          <a href="/about" :class="{ active: currentTabIndex === 1 }">About</a>
        </li>
        <li>
          <a href="/vendors" :class="{ active: currentTabIndex === 2 }"
            >Vendors</a
          >
        </li>
        <li>
          <a href="/contact" :class="{ active: currentTabIndex === 3 }"
            >Contact</a
          >
        </li>
        <li class="auth-buttons">
          <a
            class="btn-login"
            @click="
              {
                if (isAuthenticated) {
                  navigateTo(AppRoute.profile);
                } else [(showLogin = true)];
              }
            "
          >
            {{ isAuthenticated ? "Profile" : "Login" }}
          </a>
          <a
            v-if="!isAuthenticated"
            class="btn-signup"
            @click="showSignup = true"
          >
            Sign Up
          </a>
        </li>

        <li class="user-dropdown" style="display: none">
          <div class="user-icon">
            <i class="fas fa-user-circle"></i>
            <span id="userNameNav"></span>
            <ul class="dropdown-menu">
              <li><a href="#" id="openCustomerProfile">My Profile</a></li>
              <li><a href="#" id="navLogoutBtn">Logout</a></li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style></style>
