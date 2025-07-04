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

/* VENDOR DASHBOARD*/
document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("updateForm")) return;            
  if (localStorage.getItem(roleLSKey) !== "vendor") {
    alert("Please login as vendor first.");
    return (window.location.href = "index.html");
  }

  const email = getCurrentEmail();
  const stored = readVendorData(email);

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
                      .split(",").map(s=>s.trim()).filter(Boolean), 
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

// local storage
localStorage.setItem("vendors", JSON.stringify([
  { id: 1, name: "Glam Squad", category: "Beauty Professionals" },
  { id: 2, name: "Campus Threads", category: "Local Products" },
  { id: 3, name: "Lashes", category: "Beauty Professionals" },
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


document.addEventListener("DOMContentLoaded", () =>{
  const path = location.pathname;            
  const email = localStorage.getItem("userEmail");
  const role  = localStorage.getItem("userRole");
  const dashboardNeeded = path.endsWith("vendors-dashboard.html");

  if (dashboardNeeded && role!=="vendor") {
      alert("Unauthorized access. Redirecting to home.");
      location.href = "index.html";            
  }

    document.getElementById("vendorEmail").textContent = userEmail;

    const savedData = JSON.parse(localStorage.getItem(`vendorData_${userEmail}`)) || {
        businessName: "",
        services: "",
        reviews: ""
    };

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
