<script lang="ts" setup>
  import { computed, ref } from "vue";

  const props = defineProps<{
    showLogin: boolean;
    showSignup: boolean;
    showForgot: boolean;
  }>();

  const authStore = useAuthStore();

  const emit = defineEmits<{
    (e: "update:showLogin", value: boolean): void;
    (e: "update:showSignup", value: boolean): void;
    (e: "update:showForgot", value: boolean): void;
  }>();

  const showLogin = computed({
    get: () => props.showLogin,
    set: (value) => emit("update:showLogin", value),
  });

  const showSignup = computed({
    get: () => props.showSignup,
    set: (value) => emit("update:showSignup", value),
  });

  const showForgot = computed({
    get: () => props.showForgot,
    set: (value) => emit("update:showForgot", value),
  });

  // State management
  const loginState = ref({
    loading: false,
    error: "",
    success: false,
  });

  const signupState = ref({
    loading: false,
    error: "",
    success: false,
  });

  const forgotState = ref({
    loading: false,
    error: "",
    success: false,
  });

  const forgotEmail = ref("");

  const login = ref({
    email: "",
    password: "",
    role: "",
    remember: false,
  });

  const signup = ref({
    name: "",
    email: "",
    phone: "",
    role: "customer",
    businessName: "",
    businessType: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  async function togglePassword(id: string) {
    const input = document.getElementById(id) as HTMLInputElement | null;
    if (input) input.type = input.type === "password" ? "text" : "password";
  }

  async function handleLogin() {
    // Reset states
    loginState.value.loading = true;
    loginState.value.error = "";
    loginState.value.success = false;

    try {
      let role: AccountType = login.value.role == "Vendor" ? "VENDOR" : "USER";
      let response = await authStore.login({
        phoneNumberOrEmail: login.value.email,
        password: login.value.password,
        role: role,
      });

      if (!response.ok || response.error) {
        loginState.value.error =
          response.error?.message || "Login failed. Please try again.";
        return;
      }

      // SUCCESS
      loginState.value.success = true;
      setTimeout(() => {
        showLogin.value = false;
        // Reset form
        login.value = {
          email: "",
          password: "",
          role: "",
          remember: false,
        };
        loginState.value.success = false;
        navigateTo(AppRoute.profile);
      }, 1500);
    } catch (error) {
      loginState.value.error = "Network error. Please check your connection.";
    } finally {
      loginState.value.loading = false;
    }
  }

  async function handleSignup() {
    // Reset states
    signupState.value.loading = true;
    signupState.value.error = "";
    signupState.value.success = false;

    try {
      // Validate passwords match
      if (signup.value.password !== signup.value.confirmPassword) {
        signupState.value.error = "Passwords do not match.";
        signupState.value.loading = false;
        return;
      }

      // Validate vendor fields
      if (signup.value.role === "vendor" && !signup.value.businessName) {
        signupState.value.error = "Business name is required for vendors.";
        signupState.value.loading = false;
        return;
      }

      // Simulate API call (replace with actual signup logic)
      let type: AccountType = signup.value.role == "Vendor" ? "VENDOR" : "USER";
      let businessType: BusinessType =
        signup.value.businessType == "Beauty Professional"
          ? "BeautyProfessional"
          : "LocalProducts";

      let response = await authStore.signup({
        fullName: signup.value.name,
        email: signup.value.email,
        password: signup.value.password,
        businessName: signup.value.businessName,
        phoneNumber: signup.value.phone,
        businessType: businessType,
        type: type,
      });

      if (!response.ok || response.error) {
        signupState.value.error =
          response.error?.message || "Signup failed. Please try again.";
        return;
      }

      // SUCCESS
      signupState.value.success = true;
      setTimeout(() => {
        showSignup.value = false;
        // Reset form
        signup.value = {
          name: "",
          email: "",
          phone: "",
          role: "customer",
          businessName: "",
          businessType: "",
          password: "",
          confirmPassword: "",
          terms: false,
        };
        signupState.value.success = false;
        navigateTo(AppRoute.profile);
      }, 1500);
    } catch (error) {
      signupState.value.error = "Signup failed. Please try again.";
    } finally {
      signupState.value.loading = false;
    }
  }

  async function sendOtp() {
    if (!forgotEmail.value) {
      forgotState.value.error = "Email is required";
      return;
    }

    // Reset states
    forgotState.value.loading = true;
    forgotState.value.error = "";
    forgotState.value.success = false;

    try {
      // Simulate API call (replace with actual OTP logic)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // SUCCESS
      forgotState.value.success = true;
      setTimeout(() => {
        showForgot.value = false;
        forgotEmail.value = "";
        forgotState.value.success = false;
      }, 2000);
    } catch (error) {
      forgotState.value.error = "Failed to send OTP. Please try again.";
    } finally {
      forgotState.value.loading = false;
    }
  }
</script>

<template>
  <div>
    <!-- Login Modal -->
    <div class="modal" id="loginModal" v-show="showLogin">
      <div class="modal-content">
        <span class="close-modal" @click="showLogin = false">&times;</span>
        <h2>Login to CampusCart</h2>

        <!-- Success Message -->
        <div v-if="loginState.success" class="alert alert-success">
          <i class="fas fa-check-circle"></i>
          Login successful! Redirecting...
        </div>

        <!-- Error Message -->
        <div v-if="loginState.error" class="alert alert-error">
          <i class="fas fa-exclamation-circle"></i>
          {{ loginState.error }}
        </div>

        <form id="loginForm" @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="loginEmail">Email</label>
            <input
              type="email"
              id="loginEmail"
              v-model="login.email"
              :disabled="loginState.loading"
              required
            />
          </div>
          <div class="form-group">
            <label for="loginPassword">Password</label>
            <div class="password-field">
              <input
                type="password"
                id="loginPassword"
                v-model="login.password"
                :disabled="loginState.loading"
                required
              />
              <i
                class="fas fa-eye toggle-password"
                @click="togglePassword('loginPassword')"
              ></i>
            </div>
          </div>
          <div class="form-group">
            <label for="userRole">Login as</label>
            <select
              id="userRole"
              v-model="login.role"
              :disabled="loginState.loading"
              required
            >
              <option value="">Select role</option>
              <option value="vendor">Vendor</option>
              <option value="customer">Customer</option>
            </select>
          </div>
          <div class="form-options">
            <div class="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                v-model="login.remember"
                :disabled="loginState.loading"
              />
              <label for="rememberMe">Remember me</label>
            </div>
            <a
              href="#"
              class="forgot-password"
              @click="
                showForgot = true;
                showLogin = false;
              "
              >Forgot Password?</a
            >
          </div>
          <button
            type="submit"
            class="btn-primary btn-block"
            :disabled="loginState.loading"
          >
            <span v-if="loginState.loading" class="spinner"></span>
            {{ loginState.loading ? "Logging in..." : "Login" }}
          </button>
        </form>
        <div class="modal-footer">
          <p>
            Don't have an account?
            <a
              href="#"
              @click="
                showSignup = true;
                showLogin = false;
              "
              >Sign Up</a
            >
          </p>
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div class="modal" id="forgotPasswordModal" v-show="showForgot">
      <div class="modal-content">
        <span class="close-modal" @click="showForgot = false">&times;</span>
        <h2>Forgot Password</h2>

        <!-- Success Message -->
        <div v-if="forgotState.success" class="alert alert-success">
          <i class="fas fa-check-circle"></i>
          OTP sent successfully! Check your email.
        </div>

        <!-- Error Message -->
        <div v-if="forgotState.error" class="alert alert-error">
          <i class="fas fa-exclamation-circle"></i>
          {{ forgotState.error }}
        </div>

        <p>Enter your registered email address</p>
        <input
          type="email"
          v-model="forgotEmail"
          placeholder="Enter email"
          :disabled="forgotState.loading"
          required
        />
        <button
          @click="sendOtp"
          class="btn-primary btn-block"
          :disabled="forgotState.loading"
        >
          <span v-if="forgotState.loading" class="spinner"></span>
          {{ forgotState.loading ? "Sending..." : "Send OTP" }}
        </button>
      </div>
    </div>

    <!-- Signup Modal -->
    <div class="modal" id="signupModal" v-show="showSignup">
      <div class="modal-content">
        <span class="close-modal" @click="showSignup = false">&times;</span>
        <h2>Create an Account</h2>

        <!-- Success Message -->
        <div v-if="signupState.success" class="alert alert-success">
          <i class="fas fa-check-circle"></i>
          Account created successfully! Welcome to CampusCart!
        </div>

        <!-- Error Message -->
        <div v-if="signupState.error" class="alert alert-error">
          <i class="fas fa-exclamation-circle"></i>
          {{ signupState.error }}
        </div>

        <div class="user-type-selector">
          <div
            class="user-type"
            :class="{ active: signup.role === 'customer' }"
            @click="signup.role = 'customer'"
          >
            <i class="fas fa-user"></i>
            <span>Customer</span>
          </div>
          <div
            class="user-type"
            :class="{ active: signup.role === 'vendor' }"
            @click="signup.role = 'vendor'"
          >
            <i class="fas fa-store"></i>
            <span>Vendor</span>
          </div>
        </div>
        <form id="signupForm" @submit.prevent="handleSignup">
          <div class="form-group">
            <label for="signupName">Full Name</label>
            <input
              type="text"
              id="signupName"
              v-model="signup.name"
              :disabled="signupState.loading"
              required
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Email</label>
              <input
                type="email"
                v-model="signup.email"
                :disabled="signupState.loading"
                required
              />
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                v-model="signup.phone"
                :disabled="signupState.loading"
                required
              />
            </div>
          </div>
          <div class="form-group" v-if="signup.role === 'vendor'">
            <label>Business Name</label>
            <input
              type="text"
              v-model="signup.businessName"
              :disabled="signupState.loading"
            />
          </div>
          <div class="form-group" v-if="signup.role === 'vendor'">
            <label>Business Type</label>
            <select
              v-model="signup.businessType"
              :disabled="signupState.loading"
            >
              <option value="">Select business type</option>
              <option value="beauty">Beauty Professional</option>
              <option value="Local products">Local Products</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Password</label>
              <div class="password-field">
                <input
                  type="password"
                  id="signupPassword"
                  v-model="signup.password"
                  :disabled="signupState.loading"
                  required
                />
                <i
                  class="fas fa-eye toggle-password"
                  @click="togglePassword('signupPassword')"
                ></i>
              </div>
            </div>
            <div class="form-group">
              <label>Confirm Password</label>
              <div class="password-field">
                <input
                  type="password"
                  id="confirmPassword"
                  v-model="signup.confirmPassword"
                  :disabled="signupState.loading"
                  required
                />
                <i
                  class="fas fa-eye toggle-password"
                  @click="togglePassword('confirmPassword')"
                ></i>
              </div>
            </div>
          </div>
          <div class="form-group">
            <input
              type="checkbox"
              v-model="signup.terms"
              :disabled="signupState.loading"
              required
            />
            <label
              >I agree to the <a href="#">Terms</a> and
              <a href="#">Privacy Policy</a></label
            >
          </div>
          <button
            type="submit"
            class="btn-primary btn-block"
            :disabled="signupState.loading"
          >
            <span v-if="signupState.loading" class="spinner"></span>
            {{ signupState.loading ? "Creating Account..." : "Create Account" }}
          </button>
        </form>
        <div class="modal-footer">
          <p>
            Already have an account?
            <a
              href="#"
              @click="
                showLogin = true;
                showSignup = false;
              "
              >Login</a
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1000;
  }
  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
    position: relative;
  }

  .close-modal {
    position: absolute;
    right: 1rem;
    top: 1rem;
    font-size: 1.5rem;
    cursor: pointer;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
  }

  .form-group input:disabled,
  .form-group select:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .form-row {
    display: flex;
    gap: 1rem;
  }

  .form-row .form-group {
    flex: 1;
  }

  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .remember-me {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .remember-me input {
    width: auto;
  }

  .forgot-password {
    color: #4285f4;
    text-decoration: none;
  }

  .forgot-password:hover {
    text-decoration: underline;
  }

  .btn-primary {
    background-color: #4285f4;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .btn-primary:hover:not(:disabled) {
    background-color: #164a9e;
  }

  .btn-primary:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .btn-block {
    width: 100%;
  }

  .user-type-selector {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .user-type {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
  }

  .user-type.active {
    background-color: #4285f4;
    color: #fff;
    border-color: #4285f4;
  }

  .user-type i {
    display: block;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .password-field {
    position: relative;
  }

  .password-field .toggle-password {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #666;
  }

  .password-field .toggle-password:hover {
    color: #333;
  }

  .modal-footer {
    text-align: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
  }

  .modal-footer a {
    color: #4285f4;
    text-decoration: none;
  }

  .modal-footer a:hover {
    text-decoration: underline;
  }

  h2 {
    margin-bottom: 1.5rem;
    color: #333;
    text-align: center;
  }

  p {
    margin-bottom: 1rem;
    color: #666;
  }

  /* Alert Styles */
  .alert {
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .alert-success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .alert-error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  /* Spinner Animation */
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
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
</style>
