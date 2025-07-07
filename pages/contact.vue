<template>
  <div>
    <section class="contact-hero">
      <div class="container">
        <div class="section-header">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you</p>
        </div>
      </div>
    </section>

    <section class="contact" id="contact">
      <div class="container">
        <div class="contact-content">
          <div class="contact-form">
            <form id="contactForm">
              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" placeholder="Your name" required />
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Your email"
                  required
                />
              </div>
              <div class="form-group">
                <label for="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  placeholder="Subject"
                  required
                />
              </div>
              <div class="form-group">
                <label for="message">Message</label>
                <textarea
                  id="message"
                  placeholder="Your message"
                  rows="5"
                  required
                ></textarea>
              </div>
              <button type="submit" class="btn-primary">Send Message</button>
            </form>
          </div>
          <div class="contact-info">
            <div class="info-item">
              <i class="fas fa-map-marker-alt"></i>
              <div>
                <h3>Location</h3>
                <p>Bowen University, Iwo, Osun State</p>
              </div>
            </div>
            <div class="info-item">
              <i class="fas fa-envelope"></i>
              <div>
                <h3>Email</h3>
                <p>contact@CampusCart.com</p>
              </div>
            </div>
            <div class="info-item">
              <i class="fas fa-phone-alt"></i>
              <div>
                <h3>Phone</h3>
                <p>+234 808 045 2439</p>
              </div>
            </div>
            <div class="social-links">
              <a href="#"><i class="fab fa-facebook-f"></i></a>
              <a href="#"><i class="fab fa-twitter"></i></a>
              <a href="#"><i class="fab fa-instagram"></i></a>
              <a href="#"><i class="fab fa-whatsapp"></i></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
