const switchers = [...document.querySelectorAll('.switcher')];

switchers.forEach(item => {
    item.addEventListener('click', function () {
        switchers.forEach(item => item.parentElement.classList.remove('is-active'))
        this.parentElement.classList.add('is-active')
    })
});

function setCookie(name, value, days) {
    var date = new Date();
    date.setDate(date.getDate() + days);
    document.cookie = name + "=" + (value) + "; expires=" + date.toUTCString() + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var newccokoie = cookies[i].trim();
        if (newccokoie.indexOf(nameEQ) === 0) {
            return newccokoie.substring(nameEQ.length);
        }
    }
    return null;
}

document.addEventListener("DOMContentLoaded", function () {


    document.querySelector(".form-login").addEventListener("submit", function (event) {
        event.preventDefault();

        var email = document.getElementById("login-email").value;
        var password = document.getElementById("login-password").value;

        var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|eg|edu|org)$/;

        if (!emailRegex.test(email)) {
            alert(" You entered an incorrect email format! Example: example@example.com");
            return;
        }

        if (password.length < 8) {
            alert(" Password should be at least 8 characters long!");
            return;
        }

    
        var usersData = getCookie("usersData");

        if (usersData) {
            var users = JSON.parse(usersData);

            var validUser = users.find((user) => user.email === email && user.password === password);

            if (validUser) {
             
                localStorage.setItem("currentUser", JSON.stringify(validUser));

                alert(" Welcome to our website");
                window.location.href = "index.html";  

            } else {
                alert(" Incorrect email or password!");
            }
        } else {
            alert(" No users found in cookies!");
        }
    });

    document.querySelector(".form-signup").addEventListener("submit", function (event) {
        event.preventDefault();

        var email = document.getElementById("signup-email").value;
        var password = document.getElementById("signup-password").value;
        var confirmPassword = document.getElementById("signup-password-confirm").value;

        var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|eg|edu|org)$/;

        if (!emailRegex.test(email)) {
            alert(" Invalid email format! Example: example@example.com");
            return;
        }

        if (password.length < 8) {
            alert(" Password must be at least 8 characters long!");
            return;
        }

        if (password !== confirmPassword) {
            alert(" Passwords do not match!");
            return;
        }

        var usersData = getCookie("usersData");
        var users = usersData ? JSON.parse(usersData) : [];

        var existingUser = users.find((user) => user.email === email);
        if (existingUser) {
            alert(" This email is already registered!");
            return;
        }

      
        var newUser = { email: email, password: password };
        users.push(newUser);

        setCookie("usersData", JSON.stringify(users), 7);

    
        localStorage.setItem("currentUser", JSON.stringify(newUser));

        alert(" Registration successful! You are now logged in.");
        window.location.href = "index.html";

    });
});


document.addEventListener("DOMContentLoaded", function () {
    const userData = JSON.parse(localStorage.getItem("currentUser"));
    const welcomeUser = document.getElementById("welcome-user");

    if (userData && userData.email) {
        const username = userData.email.split("@")[0];
        welcomeUser.textContent = `Welcome, ${username}`;
    } else {
        welcomeUser.innerHTML = `<a href="Login.html" class="text-decoration-none text-dark">Login</a>`;
    }
});
