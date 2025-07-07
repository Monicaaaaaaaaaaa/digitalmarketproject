<script lang="ts" setup>
  definePageMeta({ layout: "profile" });

  const route = useRoute();
  const email = route.query.email as string;

  const vendorsStore = useVendorsStore();
  const vendor = vendorsStore.getVendorByEmail(email);
  const { isAuthenticated } = useAppSession();

  const showBookingSection = ref(false);
  const isBooking = ref(false);
  const bookingError = ref("");
  const bookingSuccess = ref("");

  const bookingForm = reactive({
    date: "",
    time: "",
    note: "",
  });

  function scrollToBookingSection() {
    showBookingSection.value = true;
    requestAnimationFrame(() => {
      const el = document.getElementById("bookingSection");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    });
  }

  async function bookAppointment(e: Event) {
    e.preventDefault();
    bookingError.value = "";
    bookingSuccess.value = "";
    isBooking.value = true;

    try {
      if (!bookingForm.date || !bookingForm.time) {
        throw new Error("Please fill all required fields.");
      }

      const combinedDateTime = new Date(
        `${bookingForm.date}T${bookingForm.time}`
      );

      const response = await vendorsStore.bookAppointment({
        time: combinedDateTime,
        note: bookingForm.note,
        vendorId: vendor!.id,
      });

      if (!response.ok || response.error) {
        const errorMsg =
          response.error?.message ?? "Failed to book appointment.";
        bookingError.value = errorMsg;
        return;
      }

      bookingSuccess.value = "Appointment successfully booked.";
      Object.assign(bookingForm, {
        name: "",
        email: "",
        date: "",
        time: "",
        note: "",
      });
      // goBack();
    } catch (err: any) {
      bookingError.value =
        err?.data?.message || err.message || "Failed to book appointment.";
    } finally {
      isBooking.value = false;
    }
  }

  // Review logic
  const reviewForm = reactive({
    name: "",
    text: "",
    rating: 0,
  });
  const isSubmittingReview = ref(false);
  const reviewError = ref("");
  const reviewSuccess = ref("");

  function selectRating(value: number) {
    reviewForm.rating = value;
  }

  async function submitReview(e: Event) {
    e.preventDefault();
    reviewError.value = "";
    reviewSuccess.value = "";
    isSubmittingReview.value = true;

    try {
      if (!reviewForm.name || !reviewForm.text || reviewForm.rating === 0) {
        throw new Error("All fields including rating are required.");
      }

      await $fetch("/api/reviews", {
        method: "POST",
        body: {
          ...reviewForm,
          vendorId: vendor?.id,
        },
      });

      reviewSuccess.value = "Review submitted successfully.";
      Object.assign(reviewForm, { name: "", text: "", rating: 0 });
    } catch (err: any) {
      reviewError.value =
        err?.data?.message || err.message || "Failed to submit review.";
    } finally {
      isSubmittingReview.value = false;
    }
  }

  // WhatsApp contact
  function contactViaWhatsApp() {
    const phone = vendor?.phoneNumber?.replace(/^0/, "+234") || "";
    const message = encodeURIComponent(
      "Hello, I found your profile and would like to make an inquiry."
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  }
</script>

<template>
  <div>
    <header class="profile-header">
      <h1 id="vendor-name">{{ vendor?.name || "Vendor" }}</h1>
      <button id="backToDashboardBtn" class="btn-secondary" @click="goBack">
        🔙 Dashboard
      </button>
    </header>

    <main class="vendor-profile-container">
      <!-- Vendor Info -->
      <section class="vendor-details fade-in">
        <img
          id="vendor-image"
          :src="vendor?.avatarUrl"
          alt="Vendor banner"
          style="max-height: 250px; object-fit: cover"
        />
        <p>
          <strong>Email: </strong><span>{{ vendor?.email }}</span>
        </p>
        <p>
          <strong>Phone: </strong><span>{{ vendor?.phoneNumber }}</span>
        </p>
        <p>
          <strong>Category: </strong><span>{{ vendor?.businessType }}</span>
        </p>
      </section>

      <!-- Services -->
      <section class="vendor-services fade-in" id="servicesBlock">
        <h3>Services Offered</h3>
        <div class="services-grid">
          <vendor-service-card
            v-for="service in vendor?.services"
            :key="service.name"
            :service="service"
          />
        </div>
      </section>

      <!-- Booking Trigger -->
      <section
        class="fade-in"
        id="bookingTrigger"
        v-if="vendor?.businessType === 'BeautyProfessional' && isAuthenticated"
        style="margin-top: 30px"
      >
        <button class="btn-primary" @click="scrollToBookingSection">
          Book Appointment
        </button>
      </section>

      <!-- Booking Form -->
      <section
        class="vendor-booking fade-in"
        id="bookingSection"
        v-show="showBookingSection"
      >
        <h3>Book an Appointment</h3>

        <form @submit="bookAppointment">
          <label for="appointmentDate">Date:</label>
          <input
            v-model="bookingForm.date"
            type="date"
            id="appointmentDate"
            required
          />

          <label for="appointmentTime">Time:</label>
          <input
            v-model="bookingForm.time"
            type="time"
            id="appointmentTime"
            required
          />

          <label for="appointmentNote">Note (optional):</label>
          <textarea v-model="bookingForm.note" id="appointmentNote"></textarea>

          <div v-if="bookingError" class="error-msg">{{ bookingError }}</div>
          <div v-if="bookingSuccess" class="success-msg">
            {{ bookingSuccess }}
          </div>

          <button type="submit" class="btn-primary" :disabled="isBooking">
            {{ isBooking ? "Booking..." : "Book Now" }}
          </button>
        </form>
      </section>

      <!-- WhatsApp Contact -->
      <section id="contactFormSection" class="fade-in">
        <h3>Send a Message</h3>
        <button class="btn-secondary" @click="contactViaWhatsApp">
          💬 Message on WhatsApp
        </button>
      </section>

      <!-- Ratings & Reviews -->
      <section class="vendor-rating fade-in">
        <h3>Ratings & Reviews</h3>
        <div class="rating-display" id="average-rating">
          ⭐ {{ vendor?.rating }}
        </div>
        <div class="review-list" id="review-list"></div>
      </section>

      <!-- Submit Review -->
      <section class="leave-review fade-in">
        <h3>Leave a Review</h3>
        <form @submit="submitReview">
          <label for="reviewer">Name:</label>
          <input v-model="reviewForm.name" type="text" id="reviewer" required />

          <label for="reviewText">Review:</label>
          <textarea
            v-model="reviewForm.text"
            id="reviewText"
            required
          ></textarea>

          <label>Rating:</label>
          <div class="star-rating" id="starRating">
            <span
              v-for="n in 5"
              :key="n"
              :data-value="n"
              @click="selectRating(n)"
              :style="{
                color: reviewForm.rating >= n ? '#f5a623' : '#ccc',
                cursor: 'pointer',
              }"
            >
              ★
            </span>
          </div>

          <div v-if="reviewError" class="error-msg">{{ reviewError }}</div>
          <div v-if="reviewSuccess" class="success-msg">
            {{ reviewSuccess }}
          </div>

          <button
            type="submit"
            class="btn-primary"
            :disabled="isSubmittingReview"
          >
            {{ isSubmittingReview ? "Submitting..." : "Submit Review" }}
          </button>
        </form>
      </section>
    </main>
  </div>
</template>

<style scoped>
  .vendor-profile-container {
    padding: 1rem;
    max-width: 960px;
    margin: auto;
  }

  .profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .vendor-services .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
  }

  .vendor-booking form,
  .leave-review form,
  #contactForm {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .star-rating span {
    font-size: 1.5rem;
  }

  .error-msg {
    color: red;
    font-size: 0.9rem;
  }

  .success-msg {
    color: green;
    font-size: 0.9rem;
  }
</style>
