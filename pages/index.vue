<script lang="ts" setup>
  const showLogin = ref(false);
  const showSignup = ref(false);
  const showForgot = ref(false);
</script>

<template>
  <ModalComponent
    v-model:showLogin="showLogin"
    v-model:showSignup="showSignup"
    v-model:showForgot="showForgot"
  />

  <div>
    <section class="hero" id="home">
      <div class="container">
        <div class="hero-content">
          <h1>Your one-stop Campus Marketplace for students and businesses.</h1>
          <p>
            Connect with beauty professionals, businesses, and student
            entrepreneurs—all in one place.
          </p>
          <div class="hero-buttons">
            <a
              @click="showLogin = true"
              class="btn-primary"
              id="showSignupModal"
              >Get Started</a
            >
            <a :href="AppRoute.vendors" class="btn-secondary"
              >Explore Vendors</a
            >
          </div>
        </div>
        <div class="hero-image">
          <img
            src="/images/campuscart logo.jpg"
            alt="Bowen University Marketplace"
          />
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <div class="section-header">
          <h2>What We Offer</h2>
          <p>Everything you need in one place</p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-store"></i>
            </div>
            <h3>Local Businesses</h3>
            <p>Shop from student-run businesses right on campus</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-calendar-check"></i>
            </div>
            <h3>Beauty Appointments</h3>
            <p>Book services with talented beauty professionals</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-truck"></i>
            </div>
            <h3>Secure Platform</h3>
            <p>Safe and trusted community marketplace</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Join CampusCart?</h2>
          <p>
            Sign up today and start connecting with vendors or register your
            business.
          </p>
          <div class="cta-buttons">
            <a
              @click="showSignup = true"
              class="btn-primary"
              id="showSignupModalCta"
              >Sign Up Now</a
            >
            <a :href="AppRoute.vendors" class="btn-outline">Learn More</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style></style>
