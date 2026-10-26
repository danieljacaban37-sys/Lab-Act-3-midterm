/**
 * ITP10 Laboratory Activity 3
 * Student Registration Form with Input Validation
 * Pure validation functions + event-driven UI feedback
 */

/* ------------------------------------------------------------------
   Pure validation functions (autograder-compatible)
   These must NOT touch document / window.
------------------------------------------------------------------ */

/**
 * Validates student number format: 24-1234-123
 * Two digits, hyphen, four digits, hyphen, three digits.
 * @param {string} value
 * @returns {boolean}
 */
function isValidStudentNumber(value) {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  const pattern = /^\d{2}-\d{4}-\d{3}$/;
  return pattern.test(trimmed);
}

/**
 * Validates password rules:
 * - at least 8 characters
 * - one uppercase letter
 * - one digit
 * - one of @, $, or !
 * - no whitespace
 * @param {string} value
 * @returns {boolean}
 */
function isValidPassword(value) {
  if (typeof value !== "string") return false;
  if (/\s/.test(value)) return false;
  if (value.length < 8) return false;
  if (!/[A-Z]/.test(value)) return false;
  if (!/\d/.test(value)) return false;
  if (!/[@$!]/.test(value)) return false;
  return true;
}

/* Export for CommonJS / Node autograder when available */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    isValidStudentNumber,
    isValidPassword
  };
}

/* ------------------------------------------------------------------
   DOM helpers & UI logic (guarded so file stays Node-safe)
------------------------------------------------------------------ */

(function () {
  "use strict";

  if (typeof document === "undefined") return;

  /* ---------- Element references ---------- */
  const form = document.getElementById("registrationForm");
  const fullNameInput = document.getElementById("fullName");
  const studentNumberInput = document.getElementById("studentNumber");
  const emailInput = document.getElementById("email");
  const mobileNumberInput = document.getElementById("mobileNumber");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const courseSelect = document.getElementById("course");
  const termsCheckbox = document.getElementById("terms");
  const registerBtn = document.getElementById("registerBtn");
  const resetBtn = document.getElementById("resetBtn");

  const fullNameError = document.getElementById("fullNameError");
  const studentNumberError = document.getElementById("studentNumberError");
  const emailError = document.getElementById("emailError");
  const mobileNumberError = document.getElementById("mobileNumberError");
  const passwordError = document.getElementById("passwordError");
  const confirmPasswordError = document.getElementById("confirmPasswordError");
  const courseError = document.getElementById("courseError");
  const termsError = document.getElementById("termsError");
  const passwordFeedback = document.getElementById("passwordFeedback");
  const successMessage = document.getElementById("successMessage");
  const registrationSummary = document.getElementById("registrationSummary");

  const summaryName = document.getElementById("summaryName");
  const summaryStudentNumber = document.getElementById("summaryStudentNumber");
  const summaryEmail = document.getElementById("summaryEmail");
  const summaryMobileNumber = document.getElementById("summaryMobileNumber");
  const summaryCourse = document.getElementById("summaryCourse");

  /* ---------- Utility: show / clear error ---------- */
  function showError(inputEl, errorEl, message) {
    errorEl.textContent = message;
    inputEl.setAttribute("aria-invalid", "true");
  }

  function clearError(inputEl, errorEl) {
    errorEl.textContent = "";
    inputEl.setAttribute("aria-invalid", "false");
  }

  /* ---------- Individual field validators (return true if valid) ---------- */
  function validateFullName() {
    const raw = fullNameInput.value;
    const trimmed = raw.trim();
    if (trimmed.length === 0) {
      showError(fullNameInput, fullNameError, "Full name is required.");
      return false;
    }
    if (trimmed.length < 2) {
      showError(fullNameInput, fullNameError, "Full name must be at least two characters.");
      return false;
    }
    clearError(fullNameInput, fullNameError);
    return true;
  }

  function validateStudentNumber() {
    const trimmed = studentNumberInput.value.trim();
    if (trimmed.length === 0) {
      showError(studentNumberInput, studentNumberError, "Student number is required.");
      return false;
    }
    if (!isValidStudentNumber(trimmed)) {
      showError(
        studentNumberInput,
        studentNumberError,
        "Enter a student number in the format 24-1234-123."
      );
      return false;
    }
    clearError(studentNumberInput, studentNumberError);
    return true;
  }

  function validateEmail() {
    const trimmed = emailInput.value.trim();
    if (trimmed.length === 0) {
      showError(emailInput, emailError, "Email address is required.");
      return false;
    }
    // Simplified pattern: text before @, domain containing a dot, text after that dot; no whitespace
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmed)) {
      showError(emailInput, emailError, "Enter a valid email address (e.g., name@domain.com).");
      return false;
    }
    clearError(emailInput, emailError);
    return true;
  }

  function validateMobileNumber() {
    const trimmed = mobileNumberInput.value.trim();
    if (trimmed.length === 0) {
      showError(mobileNumberInput, mobileNumberError, "Mobile number is required.");
      return false;
    }
    // 09 followed by 9 digits  OR  +639 followed by 9 digits; no spaces/hyphens
    const mobilePattern = /^(09\d{9}|\+639\d{9})$/;
    if (!mobilePattern.test(trimmed)) {
      showError(
        mobileNumberInput,
        mobileNumberError,
        "Enter a valid mobile number (09XXXXXXXXX or +639XXXXXXXXX)."
      );
      return false;
    }
    clearError(mobileNumberInput, mobileNumberError);
    return true;
  }

  function validatePassword() {
    const value = passwordInput.value;
    if (value.length === 0) {
      showError(passwordInput, passwordError, "Password is required.");
      return false;
    }
    if (!isValidPassword(value)) {
      showError(
        passwordInput,
        passwordError,
        "Password must be at least 8 characters, include one uppercase letter, one digit, and one of @, $, or !."
      );
      return false;
    }
    clearError(passwordInput, passwordError);
    return true;
  }

  function validateConfirmPassword() {
    const value = confirmPasswordInput.value;
    if (value.length === 0) {
      showError(confirmPasswordInput, confirmPasswordError, "Please confirm your password.");
      return false;
    }
    if (value !== passwordInput.value) {
      showError(confirmPasswordInput, confirmPasswordError, "Passwords do not match.");
      return false;
    }
    clearError(confirmPasswordInput, confirmPasswordError);
    return true;
  }

  function validateCourse() {
    if (courseSelect.value !== "BSIT" && courseSelect.value !== "BSCS") {
      showError(courseSelect, courseError, "Please select BSIT or BSCS.");
      return false;
    }
    clearError(courseSelect, courseError);
    return true;
  }

  function validateTerms() {
    if (!termsCheckbox.checked) {
      showError(termsCheckbox, termsError, "You must agree to the terms and conditions.");
      return false;
    }
    clearError(termsCheckbox, termsError);
    return true;
  }

  /* ---------- Live password feedback (input event) ---------- */
  function updatePasswordFeedback() {
    const value = passwordInput.value;
    if (value.length === 0) {
      passwordFeedback.textContent = "";
      passwordFeedback.className = "feedback";
      return;
    }

    const hasLength = value.length >= 8;
    const hasUpper = /[A-Z]/.test(value);
    const hasDigit = /\d/.test(value);
    const hasSymbol = /[@$!]/.test(value);
    const noSpace = !/\s/.test(value);

    if (hasLength && hasUpper && hasDigit && hasSymbol && noSpace) {
      passwordFeedback.textContent = "Password meets all requirements.";
      passwordFeedback.className = "feedback valid";
    } else {
      const missing = [];
      if (!hasLength) missing.push("8+ characters");
      if (!hasUpper) missing.push("uppercase letter");
      if (!hasDigit) missing.push("digit");
      if (!hasSymbol) missing.push("@, $ or !");
      if (!noSpace) missing.push("no spaces");
      passwordFeedback.textContent = "Still needed: " + missing.join(", ");
      passwordFeedback.className = "feedback invalid";
    }
  }

  /* ---------- Clear all feedback & summary ---------- */
  function clearAllFeedback() {
    clearError(fullNameInput, fullNameError);
    clearError(studentNumberInput, studentNumberError);
    clearError(emailInput, emailError);
    clearError(mobileNumberInput, mobileNumberError);
    clearError(passwordInput, passwordError);
    clearError(confirmPasswordInput, confirmPasswordError);
    clearError(courseSelect, courseError);
    clearError(termsCheckbox, termsError);

    passwordFeedback.textContent = "";
    passwordFeedback.className = "feedback";

    successMessage.textContent = "";
    successMessage.hidden = true;

    registrationSummary.hidden = true;
    summaryName.textContent = "";
    summaryStudentNumber.textContent = "";
    summaryEmail.textContent = "";
    summaryMobileNumber.textContent = "";
    summaryCourse.textContent = "";
  }

  /* ---------- Show success summary (textContent only) ---------- */
  function showSuccessSummary() {
    summaryName.textContent = fullNameInput.value.trim();
    summaryStudentNumber.textContent = studentNumberInput.value.trim();
    summaryEmail.textContent = emailInput.value.trim();
    summaryMobileNumber.textContent = mobileNumberInput.value.trim();
    summaryCourse.textContent = courseSelect.value;

    successMessage.textContent = "Registration details validated successfully!";
    successMessage.hidden = false;
    registrationSummary.hidden = false;
  }

  /* ---------- Event listeners ---------- */

  // Submit
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Validate every field (collect all errors)
    const nameOk = validateFullName();
    const studentOk = validateStudentNumber();
    const emailOk = validateEmail();
    const mobileOk = validateMobileNumber();
    const passwordOk = validatePassword();
    const confirmOk = validateConfirmPassword();
    const courseOk = validateCourse();
    const termsOk = validateTerms();

    const allValid =
      nameOk && studentOk && emailOk && mobileOk &&
      passwordOk && confirmOk && courseOk && termsOk;

    if (allValid) {
      showSuccessSummary();
    } else {
      // Keep success / summary hidden
      successMessage.hidden = true;
      successMessage.textContent = "";
      registrationSummary.hidden = true;
    }
  });

  // Live password feedback
  passwordInput.addEventListener("input", updatePasswordFeedback);

  // Blur on full name
  fullNameInput.addEventListener("blur", validateFullName);

  // Change on course
  courseSelect.addEventListener("change", validateCourse);

  // Change on terms
  termsCheckbox.addEventListener("change", validateTerms);

  // Reset button – restore initial state
  resetBtn.addEventListener("click", function () {
    // Native reset happens first; then we clear custom feedback
    // Use setTimeout(0) so the browser finishes clearing the form values
    setTimeout(function () {
      clearAllFeedback();
      // Ensure course placeholder is selected
      courseSelect.selectedIndex = 0;
    }, 0);
  });

  // Also handle form reset event for completeness
  form.addEventListener("reset", function () {
    setTimeout(clearAllFeedback, 0);
  });

})();
