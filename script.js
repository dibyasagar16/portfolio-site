// Mobile Navigation Toggle
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((n) =>
  n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  })
);

// Custom cursor logic
const dotCursor = document.getElementById("dot-cursor");
const circleCursor = document.getElementById("circle-cursor");

let mouseX = 0;
let mouseY = 0;
let circleX = 0;
let circleY = 0;
const lerpFactor = 0.1; /* Controls smoothness (0-1, lower is smoother) */

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  /* Update dot cursor position directly */
  dotCursor.style.left = `${mouseX}px`;
  dotCursor.style.top = `${mouseY}px`;
});

function animateCustomCursor() {
  /* Interpolate circle cursor position towards mouse position */
  circleX += (mouseX - circleX) * lerpFactor;
  circleY += (mouseY - circleY) * lerpFactor;

  circleCursor.style.left = `${circleX}px`;
  circleCursor.style.top = `${circleY}px`;

  requestAnimationFrame(animateCustomCursor);
}

animateCustomCursor(); /* Start the animation loop */

// Navbar scroll effect
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Active navigation link highlighting
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    // Adjust offset for fixed navbar
    if (scrollY >= sectionTop - navbar.offsetHeight - 50) {
      // Added navbar.offsetHeight for better accuracy
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements for animation
document
  .querySelectorAll(".skill-category, .project-card, .experience-item")
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

// Contact form handling
const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  // Basic validation
  if (!name || !email || !message) {
    showNotification("Please fill in all fields", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showNotification("Please enter a valid email address", "error");
    return;
  }

  // Show immediate "Sending message..." notification
  const sendingNotification = showNotification("Sending message...", "info");

  const formSpreeAction = "https://formspree.io/f/mrbqnkne"; // Your Formspree form ID
  const formSpreeData = {
    name: name,
    email: email,
    message: message,
  };

  try {
    const response = await fetch(formSpreeAction, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formSpreeData),
    });

    if (response.ok) {
      // Update the existing notification to success
      showNotification(
        "Message sent successfully! I'll get back to you soon.",
        "success",
        sendingNotification
      );
      this.reset(); // Clear form fields on successful submission
    } else {
      // Attempt to parse error message from Formspree response
      const errorData = await response.json();
      const errorMessage = errorData.errors
        ? errorData.errors.map((err) => err.message).join(", ")
        : "Unknown error.";
      // Update the existing notification to error
      showNotification(`Error: ${errorMessage}`, "error", sendingNotification);
    }
  } catch (error) {
    console.error("Form submission failed:", error);
    // Update the existing notification to a network error
    showNotification(
      "Error: Could not connect to the server. Please check your internet connection.",
      "error",
      sendingNotification
    );
  }
});

// Email validation function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Notification system
// Modified to accept an optional existing notification element to update
function showNotification(message, type, existingNotification = null) {
  let notification;

  if (existingNotification) {
    notification = existingNotification;
    notification.className = `notification ${type}`; // Update class to change styling
  } else {
    // If no existing notification is provided, remove any currently visible one
    const existing = document.querySelector(".notification");
    if (existing) {
      existing.remove();
    }
    notification = document.createElement("div");
    notification.className = `notification ${type}`;
    document.body.appendChild(notification);
  }

  notification.textContent = message;

  // Only animate in if it's a new notification or was previously hidden
  if (
    !existingNotification ||
    notification.style.transform === "translateX(100%)"
  ) {
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);
  }

  // Remove after 5 seconds (or update if needed)
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);

  return notification; // Return the notification element for potential future updates
}

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.textContent = ""; // Use textContent to avoid issues with HTML inside

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Initialize typing animation when page loads
window.addEventListener("load", () => {
  const heroContent = document.getElementById("hero-content-animated"); // Get the hero content div
  const typedNameElement = document.getElementById("typed-name"); // Get the span for the name

  if (heroContent && typedNameElement) {
    // Wait for the hero-content animation to finish before starting typing
    heroContent.addEventListener(
      "animationend",
      () => {
        typeWriter(typedNameElement, "Dibya Sagar Samal", 50); // Type the name into the span
      },
      { once: true }
    ); // Use { once: true } to ensure it runs only once
  }
});

// Parallax effect for hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const heroImage = document.querySelector(".hero-image");

  if (heroImage) {
    heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
});

// Skills animation on scroll
const skillItems = document.querySelectorAll(".skill-item");

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0) scale(1)";
        }, index * 100);
      }
    });
  },
  { threshold: 0.5 }
);

skillItems.forEach((item) => {
  item.style.opacity = "0";
  item.style.transform = "translateY(20px) scale(0.9)";
  item.style.transition = "all 0.5s ease";
  skillObserver.observe(item);
});

// Project cards hover effect
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-10px) scale(1.02)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});

// Add loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// Add CSS for loading animation
const loadingStyles = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    body:not(.loaded)::after {
        content: '';
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50px;
        height: 50px;
        border: 3px solid rgba(59, 130, 246, 0.3);
        border-top: 3px solid var(--accent-gradient-start);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        z-index: 10001;
    }
    
    @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
`;

// Inject loading styles
const styleSheet = document.createElement("style");
styleSheet.textContent = loadingStyles;
document.head.appendChild(styleSheet);

// Smooth reveal animation for sections
const revealElements = document.querySelectorAll(
  ".about, .skills, .experience, .projects, .contact"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
      }
    });
  },
  { threshold: 0.1 }
);

revealElements.forEach((element) => {
  element.style.opacity = "0";
  element.style.transform = "translateY(50px)";
  element.style.transition = "opacity 0.8s ease, transform 0.8s ease";
  revealObserver.observe(element);
});

// Add CSS for reveal animation
const revealStyles = `
    .revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;

const revealStyleSheet = document.createElement("style");
revealStyleSheet.textContent = revealStyles;
document.head.appendChild(revealStyleSheet);

// Theme toggle logic
const themeToggle = document.getElementById("theme-toggle");
const htmlElement = document.documentElement; // This is the <html> tag

// Function to set the theme
function setTheme(theme) {
  htmlElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  // Update icon based on theme
  const sunIcon = themeToggle.querySelector(".sun-icon");
  const moonIcon = themeToggle.querySelector(".moon-icon");
  if (sunIcon && moonIcon) {
    // Ensure icons exist before trying to access
    if (theme === "light") {
      sunIcon.style.display = "block";
      moonIcon.style.display = "none";
    } else {
      sunIcon.style.display = "none";
      moonIcon.style.display = "block";
    }
  }
}

// Check for saved theme preference on load
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    // Default to dark theme if no preference saved
    setTheme("dark");
  }
});

// Event listener for theme toggle button
if (themeToggle) {
  // Check if themeToggle exists
  themeToggle.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-theme");
    if (currentTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  });
}

//Battery status fetching starts here
const handleBatteryStatus = () => {
  if ("getBattery" in navigator) {
    navigator
      .getBattery()
      .then((battery) => {
        const batteryFill = document.getElementById("battery-fill");
        const batteryPercentage = document.getElementById("battery-percentage");

        const updateBattery = () => {
          const level = Math.floor(battery.level * 100);
          const isCharging = battery.charging;

          // Set the width of the fill bar
          batteryFill.style.width = `${level}%`;

          // Update the text and dynamic classes based on status
          if (isCharging) {
            batteryPercentage.innerHTML = `${level}% ⚡️`;
            batteryFill.classList.add("charging");
            batteryFill.classList.remove("low");
          } else if (level < 20) {
            batteryPercentage.innerHTML = `${level}% 🪫`;
            batteryFill.classList.add("low");
            batteryFill.classList.remove("charging");
          } else {
            batteryPercentage.innerHTML = `${level}%`;
            batteryFill.classList.remove("low");
            batteryFill.classList.remove("charging");
          }
        };

        updateBattery();

        battery.addEventListener("levelchange", updateBattery);
        battery.addEventListener("chargingchange", updateBattery);
      })
      .catch((error) => {
        console.error("Failed to get battery status:", error);
        document.getElementById("battery-percentage").innerHTML = "Error";
      });
  } else {
    document.getElementById("battery-percentage").innerHTML = "API N/A";
  }
};

handleBatteryStatus();
