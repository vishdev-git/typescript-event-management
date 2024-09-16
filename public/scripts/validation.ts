// public/scripts/validation.ts
const form = document.getElementById('signup-form') as HTMLFormElement;
const fullName = document.getElementById('fullName') as HTMLInputElement;
const email = document.getElementById('email') as HTMLInputElement;
const phoneNumber = document.getElementById('phoneNumber') as HTMLInputElement;
const password = document.getElementById('password') as HTMLInputElement;
const retypePassword = document.getElementById('retypePassword') as HTMLInputElement;

const fullNameError = document.getElementById('fullName-error') as HTMLParagraphElement;
const emailError = document.getElementById('email-error') as HTMLParagraphElement;
const phoneNumberError = document.getElementById('phoneNumber-error') as HTMLParagraphElement;
const passwordError = document.getElementById('password-error') as HTMLParagraphElement;
const retypePasswordError = document.getElementById('retypePassword-error') as HTMLParagraphElement;

const validateFullName = () => {
  if (fullName.value.trim() === '') {
    fullNameError.textContent = 'Full name is required';
    return false;
  } else {
    fullNameError.textContent = '';
    return true;
  }
};

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    emailError.textContent = 'Invalid email address';
    return false;
  } else {
    emailError.textContent = '';
    return true;
  }
};

const validatePhoneNumber = () => {
  const phoneRegex = /^\d{10}$/; // Example regex for 10-digit phone number
  if (!phoneRegex.test(phoneNumber.value)) {
    phoneNumberError.textContent = 'Invalid phone number';
    return false;
  } else {
    phoneNumberError.textContent = '';
    return true;
  }
};

const validatePassword = () => {
  if (password.value.length < 6) {
    passwordError.textContent = 'Password must be at least 6 characters long';
    return false;
  } else {
    passwordError.textContent = '';
    return true;
  }
};

const validateRetypePassword = () => {
  if (password.value !== retypePassword.value) {
    retypePasswordError.textContent = 'Passwords do not match';
    return false;
  } else {
    retypePasswordError.textContent = '';
    return true;
  }
};

form?.addEventListener('submit', (event) => {
  const isValidFullName = validateFullName();
  const isValidEmail = validateEmail();
  const isValidPhoneNumber = validatePhoneNumber();
  const isValidPassword = validatePassword();
  const isValidRetypePassword = validateRetypePassword();

  if (!isValidFullName || !isValidEmail || !isValidPhoneNumber || !isValidPassword || !isValidRetypePassword) {
    event.preventDefault();
  }
});

fullName?.addEventListener('input', validateFullName);
email?.addEventListener('input', validateEmail);
phoneNumber?.addEventListener('input', validatePhoneNumber);
password?.addEventListener('input', validatePassword);
retypePassword?.addEventListener('input', validateRetypePassword);
