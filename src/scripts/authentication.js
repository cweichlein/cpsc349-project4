import * as mockroblog from '../mockroblog.js'

console.log('authentication.js called')


// Display error after redirect to login page if not logged in
if (window.sessionStorage.getItem('login-error') !== null) {
  document.getElementById('login-validation').innerHTML = window.sessionStorage.getItem('login-error')
}

// Login button functionality
function login () {
  const loginSession = window.sessionStorage
  const usernameInput = document.getElementById('login-username').value
  const passwordInput = document.getElementById('login-password').value
  const userInfo = mockroblog.authenticateUser(usernameInput, passwordInput) // todo
  checkForLoginValidation(usernameInput, passwordInput, userInfo)
  if (userInfo) {
    loginSession.setItem('uid', userInfo.id)
    loginSession.setItem('username', userInfo.username)
    window.location.href = 'home_timeline.html'
  }
}

const loginButton = document.getElementById('login-button')
loginButton.onclick = function () { login() }

// Switch between login and registration forms
const loginForm = document.getElementById('login-form')
const registrationForm = document.getElementById('registration-form')
const newLoginButton = document.getElementById('new-login-button')
const newRegistrationButton = document.getElementById('new-registration-button')

newLoginButton.addEventListener('click', () => {
  loginForm.classList.toggle('hidden')
  registrationForm.classList.toggle('hidden')
})

newRegistrationButton.addEventListener('click', () => {
  registrationForm.classList.toggle('hidden')
  loginForm.classList.toggle('hidden')
})

// Login validation
function checkForLoginValidation (usernameInput, passwordInput, userInfo) {
  const loginValidation = document.getElementById('login-validation')
  loginValidation.innerHTML = ''
  if (usernameInput === '' && passwordInput === '') {
    loginValidation.innerHTML = 'Error: Please enter a username and password.'
  } else if (usernameInput === '') {
    loginValidation.innerHTML = 'Error: Please enter a username.'
  } else if (passwordInput === '') {
    loginValidation.innerHTML = 'Error: Please enter a password.'
  } else if (!userInfo) {
    loginValidation.innerHTML = 'Error: The username and/or password was incorrect. Please try again.'
  }
}

function register () {
  const loginSession = window.sessionStorage
  const usernameInput = document.getElementById('registration-username').value
  const emailInput = document.getElementById('registration-email').value
  const passwordInput = document.getElementById('registration-password').value
  const confirmPasswordInput = document.getElementById('registration-confirm-password').value
  const userInfo = mockroblog.createUser(usernameInput, emailInput, passwordInput) // todo
  if (checkForRegistrationValidation(usernameInput, emailInput, passwordInput, confirmPasswordInput, userInfo)) {
    loginSession.setItem('uid', userInfo.id)
    loginSession.setItem('username', userInfo.username)
    window.location.href = 'public_timeline.html'
  }
}

const registerButton = document.getElementById('register-button')
registerButton.onclick = function () { register() }

// Registration validation
function checkForRegistrationValidation (usernameInput, emailInput, passwordInput, confirmPasswordInput, userInfo) {
  const registrationValidation = document.getElementById('registration-validation')
  registrationValidation.innerHTML = ''
  if (emailInput === '' && usernameInput === '' && passwordInput === '') {
    registrationValidation.innerHTML = 'Error: Please enter an email, username, and password.'
  } else if (emailInput === '') {
    registrationValidation.innerHTML = 'Error: Please enter an email.'
  } else if (passwordInput === '') {
    registrationValidation.innerHTML = 'Error: Please enter your password.'
  } else if (confirmPasswordInput === '') {
    registrationValidation.innerHTML = 'Error: Please confirm your password.'
  } else if (passwordInput !== confirmPasswordInput) {
    registrationValidation.innerHTML = 'Error: Passwords do not match.'
  } else if (!userInfo) {
    registrationValidation.innerHTML = 'Error: Username is already taken.'
  } else {
    return true
  }
}

// Clear validation errors if switching to registration
newRegistrationButton.onclick = function () {
  document.getElementById('login-validation').innerHTML = ''
}

// Clear validation errors if switching to login
newLoginButton.onclick = function () {
  document.getElementById('registration-validation').innerHTML = ''
}
