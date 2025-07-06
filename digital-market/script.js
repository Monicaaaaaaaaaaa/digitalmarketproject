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
const emailLSKey   = "userEmail";              
const roleLSKey    = "userRole";                
const dataPrefix   = "vendorData_";            
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

document.querySelector(".forgot-password").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("forgotPasswordModal").style.display = "block";
});

function sendOtp() {
  const email = document.getElementById("resetEmail").value.trim();
  const errorBox = document.getElementById("forgotError");

  if (!email) {
    errorBox.textContent = "Please enter your email.";
    return;
  }

  const vendor = localStorage.getItem(`vendorData_${email}`);
  const customer = localStorage.getItem(`customerData_${email}`);

  if (!vendor && !customer) {
    errorBox.textContent = "Email not found.";
    return;
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  localStorage.setItem("resetEmail", email);
  localStorage.setItem("resetOtp", otp.toString());

  alert(`OTP sent to ${email} (Dev only: ${otp})`);
  document.getElementById("otpVerificationModal").style.display = "block";

}

// OTP
function verifyOTP() {
    let otp = '';
    otpInputs.forEach(input => otp += input.value);
    if (otp.length === otpInputs.length) {
        console.log('OTP entered:', otp);
        document.getElementById("otpVerificationModal").style.display = "none";
        document.getElementById("resetPasswordModal").style.display = "block";

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

function resetPassword() {
  const email = localStorage.getItem("resetEmail");
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmNewPassword").value;
  const error = document.getElementById("resetError");

  if (!email || !newPassword || !confirmPassword) {
    error.textContent = "All fields are required.";
    return;
  }

  if (newPassword !== confirmPassword) {
    error.textContent = "Passwords do not match.";
    return;
  }

  // Update local data (dev only — no backend call yet)
  const vendorKey = `vendorData_${email}`;
  const customerKey = `customerData_${email}`;
  let user = JSON.parse(localStorage.getItem(vendorKey) || localStorage.getItem(customerKey));

  if (user) {
    user.password = newPassword;
    localStorage.setItem(vendorKey.includes(email) ? vendorKey : customerKey, JSON.stringify(user));
    alert("Password reset successful!");
    document.getElementById("resetPasswordModal").style.display = "none";
  } else {
    error.textContent = "User not found.";
  }
}


document.getElementById("signupForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const role = document.querySelector(".user-type.active").dataset.type;

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirm = document.getElementById("confirmPassword").value;
    const phone = document.getElementById("signupPhone").value;
    const businessName = document.getElementById("businessName").value.trim();
    const businessType = document.getElementById("businessType").value;

    if (password !== confirm) {
        alert("Passwords do not match.");
        return;
    }

    let payload;
    let apiRoute;

    if(role === "customer"){
        apiRoute = "auth/signup/customer"
        payload = {
            full_name: name,
            email: email,
            phone_number: phone,
            role: role,
            password: password,
            confirm_password: confirm
        }
    }
    else{
        apiRoute = "authsignup/vendor"
        payload = {
            full_name: name,
            email: email,
            phone_number: phone,
            role: role,
            password: password,
            confirm_password: confirm,
            business_name: businessName,
            business_type: businessType
        }
    }

    const response = await fetch("https://e-commerce-4sit.onrender.com/api/v1/" + apiRoute, {
        headers:{
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(payload)
    })

    if(response.ok) alert("Signup successful!");
    else{
        const data = await response.json()
        alert(data?.detail[0]?.msg)
    }
    
    document.getElementById("signupForm").reset();
    document.getElementById("signupModal").style.display = "none";
});
      
document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    // const role = document.getElementById("userRole").value;

    const payload = {
        email: email,
        password: password
    }

    const response = await fetch("https://e-commerce-4sit.onrender.com/api/v1/auth/login", {
        headers:{
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(payload)
    })
    const data = await response.json()
    if(response.ok){
        console.log(data)
        const user = {
            role: ""
        }

        // if (currentRole === "customer") showCustomerProfile(currentUsers[currentEmail]); 
        // else if (currentRole === "vendor") window.location.href = "vendors-dashboard.html";

        localStorage.setItem("user", JSON.stringify(user))
    }
    else alert(data?.detail[0]?.msg)
});
document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("user"));





    const userEmail = localStorage.getItem("userEmail");
    const userRole = localStorage.getItem("userRole");
    const users = JSON.parse(localStorage.getItem("users") || "{}");

    const authBtns = document.querySelector(".auth-buttons");
    const userDropdown = document.querySelector(".user-dropdown");
    const userNameNav = document.getElementById("userNameNav");
    const profileBtn = document.getElementById("openCustomerProfile");
    const profileModal = document.getElementById("customerProfileModal");

    if (userEmail && users[userEmail]) {
        authBtns.style.display = "none";
        userDropdown.style.display = "flex";
        userNameNav.textContent = users[userEmail].name.split(" ")[0];
    }
profileBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const currentRole = localStorage.getItem("userRole");
    const currentEmail = localStorage.getItem("userEmail");
    const currentUsers = JSON.parse(localStorage.getItem("users") || "{}");

    if (!currentEmail || !currentUsers[currentEmail]) return;

    if (currentRole === "customer") {
        showCustomerProfile(currentUsers[currentEmail]); 
    } else if (currentRole === "vendor") {
        window.location.href = "vendors-dashboard.html"; 
    } else {
        alert("Unknown user role. Please log in again.");
    }
});
function showCustomerProfile(user) {
    document.getElementById("profileView").style.display = "block";
    document.getElementById("editProfileForm").style.display = "none";
    document.getElementById("viewProfileName").textContent = user.name;
    document.getElementById("viewProfileEmail").textContent = user.email;
    document.getElementById("viewProfilePhone").textContent = user.phone;
    document.getElementById("profileName").value = user.name;
    document.getElementById("profileEmail").value = user.email;
    document.getElementById("profilePhone").value = user.phone;
    document.getElementById("customerProfileModal").style.display = "block";
}

document.getElementById("editProfileBtn").addEventListener("click", function () {
    document.getElementById("profileView").style.display = "none";
    document.getElementById("editProfileForm").style.display = "block";
});

document.getElementById("cancelEditBtn").addEventListener("click", function () {
    document.getElementById("profileView").style.display = "block";
    document.getElementById("editProfileForm").style.display = "none";
});

    document.getElementById("editProfileForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const email = localStorage.getItem("userEmail");
        const users = JSON.parse(localStorage.getItem("users") || "{}");

        if (!users[email]) return;

        users[email].name = document.getElementById("profileName").value;
        users[email].phone = document.getElementById("profilePhone").value;

        localStorage.setItem("users", JSON.stringify(users));
        alert("Profile updated successfully!");
        profileModal.style.display = "none";
    });

    // Logout
    document.getElementById("navLogoutBtn").addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        location.reload();
    });
    window.onclick = function (event) {
        if (event.target == profileModal) {
            profileModal.style.display = "none";
        }
    };
});


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
