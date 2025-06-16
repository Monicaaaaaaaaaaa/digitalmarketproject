const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const otpModal = document.getElementById('otpModal');
const showLoginModalFromSignup = document.getElementById('showLoginModalFromSignup');
const showSignupModalFromLogin = document.getElementById('showSignupModalFromLogin');
const showSignupModal = document.getElementById('showSignupModal');
const showSignupModalCta = document.getElementById('showSignupModalCta');
const filterBtns = document.querySelectorAll('.filter-btn');
const vendorCards = document.querySelectorAll('.vendor-card');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const dots = document.querySelectorAll('.dot');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const userTypes = document.querySelectorAll('.user-type');
const vendorFields = document.querySelectorAll('.vendor-field');
const togglePasswordBtns = document.querySelectorAll('.toggle-password');
const otpInputs = document.querySelectorAll('.otp-input');
const resendOtpBtn = document.getElementById('resendOtp');
const otpTimerElement = document.getElementById('otpTimer');
const sendOtpBtn = document.getElementById("sendOtp");
const emailLSKey   = "userEmail";               // saved at login
const roleLSKey    = "userRole";                // "vendor" or "customer"
const dataPrefix   = "vendorData_";             // <-- one canonical prefix
const reviewsPrefix = "vendorReviews_";


// NAV TOGGLE
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && !e.target.closest('.navbar')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// MODAL UTILS
function openModal(modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}
function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// MODAL TOGGLE BUTTONS
if (showLoginModalFromSignup) {
    showLoginModalFromSignup.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(signupModal);
        openModal(loginModal);
    });
}
if (showSignupModalFromLogin) {
    showSignupModalFromLogin.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        openModal(signupModal);
    });
}
[showSignupModal, showSignupModalCta].forEach(btn => {
    btn?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(signupModal);
    });
});
document.querySelectorAll('.close-modal').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => closeModal(closeBtn.closest('.modal')));
});
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });
});
document.querySelector('.btn-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(loginModal);
});
document.querySelector('.btn-signup')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(signupModal);
});

// FILTERING
if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            vendorCards.forEach(card => {
                card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'block' : 'none';
            });
        });
    });
}

// TESTIMONIAL SLIDER
let currentSlide = 0;
function showSlide(index) {
    testimonialCards.forEach(card => card.style.display = 'none');
    dots.forEach(dot => dot.classList.remove('active'));
    if (testimonialCards[index]) {
        testimonialCards[index].style.display = 'block';
        dots[index].classList.add('active');
    }
}
if (testimonialCards.length > 0) {
    showSlide(currentSlide);
    nextBtn?.addEventListener('click', () => showSlide(++currentSlide % testimonialCards.length));
    prevBtn?.addEventListener('click', () => showSlide((currentSlide - 1 + testimonialCards.length) % testimonialCards.length));
    dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
}

// USER TYPE SELECT
if (userTypes.length > 0) {
    userTypes.forEach(type => {
        type.addEventListener('click', () => {
            userTypes.forEach(t => t.classList.remove('active'));
            type.classList.add('active');
            const isVendor = type.dataset.type === 'vendor';
            vendorFields.forEach(field => field.style.display = isVendor ? 'block' : 'none');
        });
    });
}

// PASSWORD TOGGLE
if (togglePasswordBtns.length > 0) {
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const passwordField = btn.previousElementSibling;
            const icon = btn.querySelector('i');
            const isHidden = passwordField.type === 'password';
            passwordField.type = isHidden ? 'text' : 'password';
            icon.classList.toggle('fa-eye', !isHidden);
            icon.classList.toggle('fa-eye-slash', isHidden);
        });
    });
}

// OTP
function verifyOTP() {
    let otp = '';
    otpInputs.forEach(input => otp += input.value);
    if (otp.length === otpInputs.length) {
        console.log('OTP entered:', otp);
        closeModal(otpModal);
    }
}
otpInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        if (input.value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.value === '' && index > 0) {
            otpInputs[index - 1].focus();
        }
    });
});

// OTP TIMER
let otpTimer;
const otpTimerDuration = 60;
function startOTPTimer() {
    let timeLeft = otpTimerDuration;
    otpTimerElement.textContent = `${timeLeft}s`;
    resendOtpBtn.disabled = true;
    otpTimer = setInterval(() => {
        timeLeft--;
        otpTimerElement.textContent = `${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(otpTimer);
            resendOtpBtn.disabled = false;
            otpTimerElement.textContent = '';
        }
    }, 1000);
}

// OTP BUTTONS
if (resendOtpBtn) {
    resendOtpBtn.addEventListener('click', () => {
        console.log('Resending OTP...');
        startOTPTimer();
    });
}
if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        openModal(otpModal);
        startOTPTimer();
    });
}

// FORM VALIDATION
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        if (!isValid) e.preventDefault();
    });
});

// SIGNUP FLOW + BUSINESS REGISTRATION
document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");
    const businessRegistration = document.getElementById("business-registration");
    let selectedUserType = "customer";

    userTypes.forEach(selector => {
        selector.addEventListener("click", function () {
            userTypes.forEach(el => el.classList.remove("active"));
            this.classList.add("active");
            selectedUserType = this.getAttribute("data-type");
            vendorFields.forEach(field => field.style.display = selectedUserType === "vendor" ? "block" : "none");
        });
    });

    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (selectedUserType === "vendor") {
            localStorage.setItem("vendorLoggedIn", "true");
            localStorage.setItem("vendorName", document.getElementById("signupName").value);
            localStorage.setItem("vendorEmail", document.getElementById("signupEmail").value);
            localStorage.setItem("vendorPhone", document.getElementById("signupPhone").value);
        }

        closeModal(signupModal);
        openModal(otpModal);
        startOTPTimer();
    });

    document.getElementById("business-registration-form").addEventListener("submit", function (event) {
        event.preventDefault();

        const businessName = document.getElementById("business-name").value;
        const category = document.getElementById("category").value;
        const businessDescription = document.getElementById("business-description").value;

        localStorage.setItem("vendorProfile", JSON.stringify({
            name: businessName,
            desc: businessDescription,
            category: category
        }));

        window.location.href = "vendor-profile.html";
    });

    if (localStorage.getItem("vendorLoggedIn") === "true") {
        businessRegistration.style.display = "block";
    }
});

// SORT VENDORS
document.addEventListener("DOMContentLoaded", function () {
    const sortDropdown = document.getElementById("sortOptions");
    const vendorsGrid = document.querySelector(".vendors-grid");
    const vendorCards = Array.from(document.querySelectorAll(".vendor-card"));

    sortDropdown.addEventListener("change", function () {
        let sortedVendors = [...vendorCards];

        if (this.value === "rating") {
            sortedVendors.sort((a, b) => {
                const ratingA = parseFloat(a.querySelector(".vendor-rating span").textContent);
                const ratingB = parseFloat(b.querySelector(".vendor-rating span").textContent);
                return ratingB - ratingA;
            });
        } else if (this.value === "name") {
            sortedVendors.sort((a, b) => {
                const nameA = a.querySelector("h3").textContent.toLowerCase();
                const nameB = b.querySelector("h3").textContent.toLowerCase();
                return nameA.localeCompare(nameB);
            });
        }

        vendorsGrid.innerHTML = "";
        sortedVendors.forEach(vendor => vendorsGrid.appendChild(vendor));
    });
});

// GSAP & ANIMATION
document.addEventListener("DOMContentLoaded", function () {
    gsap.from(".hero-content h1", { duration: 1, y: 50, opacity: 0, ease: "power3.out" });
    gsap.from(".hero-content p", { duration: 1.2, y: 50, opacity: 0, ease: "power3.out", delay: 0.3 });
    gsap.from(".hero-buttons", { duration: 1.4, y: 30, opacity: 0, ease: "power3.out", delay: 0.6 });

    // Info card scroll animations
    function isInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top <= (window.innerHeight * 0.8) && rect.bottom >= 0;
    }

    const animateCards = () => {
        document.querySelectorAll('.info-card, .vision-card, .step-card').forEach((el, i) => {
            if (isInViewport(el) && !el.classList.contains('animated')) {
                setTimeout(() => el.classList.add('animated'), i * 150);
            }
        });
    };

    const stepCards = document.querySelectorAll('.step-card');
    stepCards.forEach(card => {
        card.addEventListener('mouseover', () => {
            const num = card.querySelector('.step-number');
            if (num) {
                num.style.transform = 'scale(1.1) rotate(10deg)';
                setTimeout(() => num.style.transform = 'scale(1) rotate(0deg)', 300);
            }
        });
    });

    const animateNumbers = () => {
        document.querySelectorAll('.step-number').forEach((el, i) => {
            let current = 0;
            const target = i + 1;
            const step = target / (1500 / 100);
            const counter = setInterval(() => {
                current += step;
                if (current >= target) {
                    clearInterval(counter);
                    current = target;
                }
                el.textContent = Math.floor(current);
            }, 100);
        });
    };

    const stepsGrid = document.querySelector('.steps-grid');
    if (stepsGrid) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        observer.observe(stepsGrid);
    }

    animateCards();
    window.addEventListener('scroll', animateCards);
});


document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const vendorId = urlParams.get("id") || "default";

  const vendorData = JSON.parse(localStorage.getItem(`vendorProfile_${vendorId}`)) || {};
  const reviews = JSON.parse(localStorage.getItem(`vendorReviews_${vendorId}`)) || [];

  // Set vendor data in HTML
  document.getElementById("vendor-name").textContent = vendorData.name || "Vendor Name";
  document.getElementById("vendor-email").textContent = vendorData.email || "Not provided";
  document.getElementById("vendor-phone").textContent = vendorData.phone || "Not provided";
  document.getElementById("vendor-category").textContent = vendorData.category || "Uncategorized";
  document.getElementById("vendor-description").textContent = vendorData.desc || "No description yet.";
  document.getElementById("vendor-image").src = vendorData.image || "default-vendor.jpg";
function getCurrentEmail() {
  return localStorage.getItem(emailLSKey);
}

function getVendorKey(email) {
  return `${dataPrefix}${email}`;
}

function getReviewKey(email) {
  return `${reviewsPrefix}${email}`;
}

function saveVendorData(email, obj) {
  localStorage.setItem(getVendorKey(email), JSON.stringify(obj));
}

function readVendorData(email) {
  return JSON.parse(localStorage.getItem(getVendorKey(email)) || "{}");
}

function saveReviews(email, arr) {
  localStorage.setItem(getReviewKey(email), JSON.stringify(arr));
}

function readReviews(email) {
  return JSON.parse(localStorage.getItem(getReviewKey(email)) || "[]");
}

/* ------------------------------------------------------------------
   3.  VENDOR DASHBOARD — store everything the vendor types
-------------------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("updateForm")) return;            // not on dashboard

  // 🔒 redirect if NOT the vendor
  if (localStorage.getItem(roleLSKey) !== "vendor") {
    alert("Please login as vendor first.");
    return (window.location.href = "index.html");
  }

  const email = getCurrentEmail();
  const stored = readVendorData(email);

  // pre-fill any existing data
  ["businessNameInput","vendorPhone","vendorCategory","vendorDesc"]
    .forEach(id => { if(stored[id]) document.getElementById(id).value = stored[id]; });

  document.getElementById("updateForm").addEventListener("submit", e => {
    e.preventDefault();

    const data = {
      businessName : document.getElementById("businessNameInput").value.trim(),
      phone        : document.getElementById("vendorPhone").value.trim(),
      category     : document.getElementById("vendorCategory").value.trim(),
      description  : document.getElementById("vendorDesc").value.trim(),
      services     : document.getElementById("servicesComma").value
                      .split(",").map(s=>s.trim()).filter(Boolean), // comma list → array
      imageUrl     : stored.imageUrl || "default-vendor.jpg"
    };

    // optional new image
    const file = document.getElementById("vendorImageInput").files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        data.imageUrl = reader.result;
        saveVendorData(email, data);
        alert("Saved!");
        location.reload();
      };
      return reader.readAsDataURL(file);
    }

    saveVendorData(email, data);
    alert("Saved!");
    location.reload();
  });
});

/* ------------------------------------------------------------------
   4.  PUBLIC  vendor-profile.html   (anyone can open)
-------------------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("vendor-name")) return;           // not on profile page

  // 4.1 Which vendor are we showing?
  const url   = new URL(location.href);
  const email = url.searchParams.get("email") || getCurrentEmail();
  if (!email) return alert("No vendor specified!");

  const data    = readVendorData(email);
  const reviews = readReviews(email);

  // 4.2 Render vendor core info
  document.getElementById("vendor-name").textContent      = data.businessName || "Vendor";
  document.getElementById("vendor-email").textContent     = email;
  document.getElementById("vendor-phone").textContent     = data.phone || "";
  document.getElementById("vendor-category").textContent  = data.category || "";
  document.getElementById("vendor-description").textContent = data.description || "";
  document.getElementById("vendor-image").src             = data.imageUrl || "default-vendor.jpg";

  // 4.3 Services
  const grid = document.getElementById("servicesGrid");
  grid.innerHTML = "";
  (data.services || []).forEach(name => {
    const div = document.createElement("div");
    div.className = "service-card";
    div.innerHTML = `
      <img src="${data.imageUrl}" alt="${name}">
      <div class="service-info">
        <p>${name}</p>
        <a href="#appointmentSection" class="btn-secondary">Contact to Book</a>
      </div>`;
    grid.appendChild(div);
  });

  // 4.4 Render reviews
  const out   = document.getElementById("review-list");
  const avgEl = document.getElementById("average-rating");
  function renderReviews() {
    out.innerHTML = "";
    if (!reviews.length) {
      out.innerHTML = "<p>No reviews yet.</p>";
      avgEl.textContent = "⭐ 0.0";
      return;
    }
    let sum = 0;
    reviews.forEach(r => {
      sum += +r.rating;
      out.insertAdjacentHTML("beforeend",
        `<div class="review"><p><strong>${r.name}</strong> (${r.rating} ⭐)</p><p>${r.text}</p></div>`);
    });
    avgEl.textContent = `⭐ ${(sum / reviews.length).toFixed(1)}`;
  }
  renderReviews();

  // 4.5 Add new review
  document.getElementById("reviewForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const name   = document.getElementById("reviewer").value.trim();
    const text   = document.getElementById("reviewText").value.trim();
    const rating = document.getElementById("rating").value;
    if (!name || !text || !rating) return alert("Complete all fields!");

    reviews.push({ name, text, rating });
    saveReviews(email, reviews);
    renderReviews();
    e.target.reset();
    [...document.querySelectorAll("#starRating span")].forEach(s=>s.classList.remove("active"));
  });

  // 4.6 Star-click logic
  document.querySelectorAll("#starRating span").forEach(star=>{
    star.addEventListener("click",()=>{
      const val = +star.dataset.value;
      document.getElementById("rating").value = val;
      document.querySelectorAll("#starRating span")
        .forEach(s => s.classList.toggle("active", +s.dataset.value <= val));
    });
  });
});

  // Dark mode toggle
  const darkToggle = document.getElementById("darkToggle");
  const currentMode = localStorage.getItem("darkMode") === "enabled";
  if (currentMode) document.body.classList.add("dark-mode");

  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
  });
});

// Show booking only for beauty category
document.addEventListener("DOMContentLoaded", () => {
  const category = document.getElementById("vendor-category").textContent.toLowerCase();
  const bookingSection = document.getElementById("bookingSection");
  const vendorId = localStorage.getItem("currentVendorId");

  if (category.includes("hair") || category.includes("beauty") || category.includes("nail") || category.includes("makeup")) {
    bookingSection.style.display = "block";
  }

  const bookingForm = document.getElementById("bookingForm");
  bookingForm?.addEventListener("submit", function (e) {
    e.preventDefault();

    const bookingsKey = `vendorBookings_${vendorId}`;
    const existingBookings = JSON.parse(localStorage.getItem(bookingsKey)) || [];

    const newBooking = {
      name: document.getElementById("appointmentName").value.trim(),
      date: document.getElementById("appointmentDate").value,
      time: document.getElementById("appointmentTime").value,
      note: document.getElementById("appointmentNote").value.trim(),
      status: "Pending"
    };

    existingBookings.push(newBooking);
    localStorage.setItem(bookingsKey, JSON.stringify(existingBookings));
    alert("Booking sent! Vendor will confirm shortly.");
    bookingForm.reset();
  });
});
// TODO: Replace localStorage with real backend POST request when API is ready
localStorage.setItem("vendors", JSON.stringify([
  { id: 1, name: "Glam Squad", category: "Beauty Professionals" },
  { id: 2, name: "Trendy Curls", category: "Hair Stylist" },
  // more vendors...
]));

document.querySelector("#searchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const query = document.querySelector("#searchInput").value.toLowerCase();
  const vendorList = JSON.parse(localStorage.getItem("vendors")) || [];

  const results = vendorList.filter(v =>
    v.name.toLowerCase().includes(query) ||
    v.category.toLowerCase().includes(query)
  );

  const resultsContainer = document.querySelector("#vendorResults");
  resultsContainer.innerHTML = "";

  if (results.length === 0) {
    resultsContainer.innerHTML = "<p>No vendors found.</p>";
    return;
  }

  results.forEach(v => {
    const card = document.createElement("div");
    card.className = "vendor-card";
    card.innerHTML = `
      <h4>${v.name}</h4>
      <p>Category: ${v.category}</p>
      <a href="vendor-profile.html?vendorId=${v.id}" class="view-button">View Profile</a>
    `;
    resultsContainer.appendChild(card);
  });
});

/* ------------------------------------------------------------------ */
/*  VERY small gate: only the *dashboard* needs the vendor role       */
/* ------------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () =>{
  const path = location.pathname;               // e.g.  /vendors-dashboard.html
  const email = localStorage.getItem("userEmail");
  const role  = localStorage.getItem("userRole");

  // Block only vendors-dashboard, allow everything else
  const dashboardNeeded = path.endsWith("vendors-dashboard.html");

  if (dashboardNeeded && role!=="vendor") {
      alert("Unauthorized access. Redirecting to home.");
      location.href = "index.html";             // or vendors.html
  }

    document.getElementById("vendorEmail").textContent = userEmail;

    const savedData = JSON.parse(localStorage.getItem(`vendorData_${userEmail}`)) || {
        businessName: "",
        services: "",
        reviews: ""
    };

    // Prefill inputs
    document.getElementById("businessNameInput").value = savedData.businessName;
    document.getElementById("servicesInput").value = savedData.services;
    document.getElementById("reviewsInput").value = savedData.reviews;
});

function saveVendorData() {
    const userEmail = localStorage.getItem("userEmail");
    const businessName = document.getElementById("businessNameInput").value;
    const services = document.getElementById("servicesInput").value;
    const reviews = document.getElementById("reviewsInput").value;

    const vendorData = {
        businessName,
        services,
        reviews
    };

    localStorage.setItem(`vendorData_${userEmail}`, JSON.stringify(vendorData));
    alert("Vendor data saved successfully!");
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}
