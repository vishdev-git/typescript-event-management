// public/scripts/validation.ts
var form = document.getElementById('signup-form');
var fullName = document.getElementById('fullName');
var email = document.getElementById('email');
var phoneNumber = document.getElementById('phoneNumber');
var password = document.getElementById('password');
var retypePassword = document.getElementById('retypePassword');
var fullNameError = document.getElementById('fullName-error');
var emailError = document.getElementById('email-error');
var phoneNumberError = document.getElementById('phoneNumber-error');
var passwordError = document.getElementById('password-error');
var retypePasswordError = document.getElementById('retypePassword-error');
var validateFullName = function () {
    if (fullName.value.trim() === '') {
        fullNameError.textContent = 'Full name is required';
        return false;
    }
    else {
        fullNameError.textContent = '';
        return true;
    }
};
var validateEmail = function () {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        emailError.textContent = 'Invalid email address';
        return false;
    }
    else {
        emailError.textContent = '';
        return true;
    }
};
var validatePhoneNumber = function () {
    var phoneRegex = /^\d{10}$/; // Example regex for 10-digit phone number
    if (!phoneRegex.test(phoneNumber.value)) {
        phoneNumberError.textContent = 'Invalid phone number';
        return false;
    }
    else {
        phoneNumberError.textContent = '';
        return true;
    }
};
var validatePassword = function () {
    if (password.value.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters long';
        return false;
    }
    else {
        passwordError.textContent = '';
        return true;
    }
};
var validateRetypePassword = function () {
    if (password.value !== retypePassword.value) {
        retypePasswordError.textContent = 'Passwords do not match';
        return false;
    }
    else {
        retypePasswordError.textContent = '';
        return true;
    }
};
form === null || form === void 0 ? void 0 : form.addEventListener('submit', function (event) {
    var isValidFullName = validateFullName();
    var isValidEmail = validateEmail();
    var isValidPhoneNumber = validatePhoneNumber();
    var isValidPassword = validatePassword();
    var isValidRetypePassword = validateRetypePassword();
    if (!isValidFullName || !isValidEmail || !isValidPhoneNumber || !isValidPassword || !isValidRetypePassword) {
        event.preventDefault();
    }
});
fullName === null || fullName === void 0 ? void 0 : fullName.addEventListener('input', validateFullName);
email === null || email === void 0 ? void 0 : email.addEventListener('input', validateEmail);
phoneNumber === null || phoneNumber === void 0 ? void 0 : phoneNumber.addEventListener('input', validatePhoneNumber);
password === null || password === void 0 ? void 0 : password.addEventListener('input', validatePassword);
retypePassword === null || retypePassword === void 0 ? void 0 : retypePassword.addEventListener('input', validateRetypePassword);
