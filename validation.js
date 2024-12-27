// Simple validation for the login form
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password) {
        authenticateUser(email, password);
    } else {
        alert("Please enter both email and password.");
    }
});
