const navigateToLogin = (e) => {
    window.location.href = 'login.html';
}

const navigateToSignup = (e) => {
    window.location.href = 'signup.html';
}
const signupBtn = document.getElementById('signUpBtn');
signupBtn.addEventListener('click', navigateToSignup);

const loginBtn = document.getElementById('loginBtn');
loginBtn.addEventListener('click', navigateToLogin);

const gettingStartedBtn1 = document.getElementById('gettingStartedBtn1');
gettingStartedBtn1.addEventListener('click', navigateToLogin);

const gettingStartedBtn2 = document.getElementById('gettingStartedBtn2');
gettingStartedBtn2.addEventListener('click', navigateToLogin);

