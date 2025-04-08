
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

if (showSignupModal) {
    showSignupModal.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(signupModal);
    });
}

if (showSignupModalCta) {
    showSignupModalCta.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(signupModal);
    });
}

document.querySelectorAll('.close-modal').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        const modal = closeBtn.closest('.modal');
        closeModal(modal);
    });
});

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
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
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

                    let currentSlide = 0;
                    
                    function showSlide(index) {
                        testimonialCards.forEach(card => {
                            card.style.display = 'none';
                        });
                        dots.forEach(dot => {
                            dot.classList.remove('active');
                        });
                        if (testimonialCards[index]) {
                            testimonialCards[index].style.display = 'block';
                            dots[index].classList.add('active');
                        }
                    }
                    
                    if (testimonialCards.length > 0) {
                        showSlide(currentSlide);
                        
                        nextBtn?.addEventListener('click', () => {
                            currentSlide = (currentSlide + 1) % testimonialCards.length;
                            showSlide(currentSlide);
                        });
                    
                        prevBtn?.addEventListener('click', () => {
                            currentSlide = (currentSlide - 1 + testimonialCards.length) % testimonialCards.length;
                            showSlide(currentSlide);
                        });
                        dots.forEach((dot, index) => {
                            dot.addEventListener('click', () => {
                                currentSlide = index;
                                showSlide(currentSlide);
                            });
                        });
                    }
                    if (userTypes.length > 0) {
                        userTypes.forEach(type => {
                            type.addEventListener('click', () => {
                                userTypes.forEach(t => t.classList.remove('active'));
                                type.classList.add('active');
                                if (type.dataset.type === 'vendor') {
                                    vendorFields.forEach(field => {
                                        field.style.display = 'block';
                                    });
                                } else {
                                    vendorFields.forEach(field => {
                                        field.style.display = 'none';
                                    });
                                }
                            });
                        });
                    }
                    if (togglePasswordBtns.length > 0) {
                        togglePasswordBtns.forEach(btn => {
                            btn.addEventListener('click', () => {
                                const passwordField = btn.previousElementSibling;
                                const icon = btn.querySelector('i');
                                
                                if (passwordField.type === 'password') {
                                    passwordField.type = 'text';
                                    icon.classList.remove('fa-eye');
                                    icon.classList.add('fa-eye-slash');
                                } else {
                                    passwordField.type = 'password';
                                    icon.classList.remove('fa-eye-slash');
                                    icon.classList.add('fa-eye');
                                }
                            });
                        });
                    }
                    if (otpInputs.length > 0) {
                        otpInputs.forEach((input, index) => {
                            input.addEventListener('input', () => {
                                if (input.value.length === 1) {
                                    if (index < otpInputs.length - 1) {
                                        otpInputs[index + 1].focus();
                                    } else {
                                        verifyOTP();
                                    }
                                }
                            });
                            input.addEventListener('keydown', (e) => {
                                if (e.key === 'Backspace' && input.value === '' && index > 0) {
                                    otpInputs[index - 1].focus();
                                }
                            });
                        });
                    }
                    function verifyOTP() {
                        let otp = '';
                        otpInputs.forEach(input => {
                            otp += input.value;
                        });
                        
                        if (otp.length === otpInputs.length) {
                            console.log('OTP entered:', otp);
                            document.getElementById('otpForm')?.addEventListener('submit', (e) => {
                                e.preventDefault();
                                closeModal(otpModal);
                            });
                        }
                    }
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
                        document.getElementById('sendOtp')?.addEventListener('click', (e) => {
                            e.preventDefault();
                            closeModal(loginModal);
                            openModal(otpModal);
                            startOTPTimer();
                        });
                    }
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
                            
                            if (!isValid) {
                                e.preventDefault();
                            }
                        });
                    });
                    document.addEventListener("DOMContentLoaded", function() {
                        const sortDropdown = document.getElementById("sortOptions");
                        const vendorsGrid = document.querySelector(".vendors-grid");
                        const vendorCards = Array.from(document.querySelectorAll(".vendor-card"));
                    
                        sortDropdown.addEventListener("change", function() {
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
                    document.addEventListener("DOMContentLoaded", function () {
                        const signupForm = document.getElementById("signupForm");
                        const businessRegistration = document.getElementById("business-registration");
                        const userTypeSelectors = document.querySelectorAll(".user-type");
                        let selectedUserType = "customer"; 
                        userTypeSelectors.forEach((selector) => {
                            selector.addEventListener("click", function () {
                                userTypeSelectors.forEach((el) => el.classList.remove("active"));
                                this.classList.add("active");
                                selectedUserType = this.getAttribute("data-type");
                                const vendorFields = document.querySelectorAll(".vendor-field");
                                vendorFields.forEach(field => {
                                    field.style.display = selectedUserType === "vendor" ? "block" : "none";
                                });
                            });
                        });
                        signupForm.addEventListener("submit", function (event) {
                            event.preventDefault(); 
                    
                            if (selectedUserType === "vendor") {
                                const vendorName = document.getElementById("signupName").value;
                                const vendorEmail = document.getElementById("signupEmail").value;
                                const vendorPhone = document.getElementById("signupPhone").value;
                    
                                localStorage.setItem("vendorLoggedIn", "true");
                                localStorage.setItem("vendorName", vendorName);
                                localStorage.setItem("vendorEmail", vendorEmail);
                                localStorage.setItem("vendorPhone", vendorPhone);
                    
                                document.getElementById("signupModal").style.display = "none";
                    
                                businessRegistration.style.display = "block";
                            }
                        });
                        document.getElementById("business-registration-form").addEventListener("submit", function (event) {
                            event.preventDefault();
                    
                            const businessName = document.getElementById("business-name").value;
                            const category = document.getElementById("category").value;
                            const businessDescription = document.getElementById("business-description").value;
                            const businessLogo = document.getElementById("business-logo").files[0];
                    
                            console.log("Business Registered:", businessName, category, businessDescription, businessLogo);
                    
                            alert("Business Registered Successfully!");
                            document.getElementById("business-registration-form").reset();
                        });
                    
                        if (localStorage.getItem("vendorLoggedIn") === "true") {
                            businessRegistration.style.display = "block";
                        }
                    });
                    
                    document.addEventListener("DOMContentLoaded", function () {
                        gsap.from(".hero-content h1", { duration: 1, y: 50, opacity: 0, ease: "power3.out" });
                        gsap.from(".hero-content p", { duration: 1.2, y: 50, opacity: 0, ease: "power3.out", delay: 0.3 });
                        gsap.from(".hero-buttons", { duration: 1.4, y: 30, opacity: 0, ease: "power3.out", delay: 0.6 });
                    });
                    