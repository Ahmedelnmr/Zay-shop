document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const welcomeUser = document.getElementById("welcome-user");
    const logoutBtn = document.getElementById("logout-btn");
    const cartBtn = document.getElementById("cart-btn");
    const cartCountEl = document.getElementById("cart-count");

    if (user && user.email) {
   
        const username = user.email.split("@")[0];
        welcomeUser.textContent = `Welcome, ${username}`;

       
        if (logoutBtn) logoutBtn.classList.remove("d-none");

   
        if (cartBtn) cartBtn.classList.remove("d-none");

    
        const cartKey = `cart_${user.email}`;
        const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountEl) cartCountEl.textContent = count;

 
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("currentUser");
            window.location.href = "Login.html";
        });

    } else {
     
        welcomeUser.innerHTML = `<a href="Login.html" class="text-decoration-none text-dark">Login</a>`;

        if (logoutBtn) logoutBtn.classList.add("d-none");

    
        if (cartBtn) cartBtn.classList.add("d-none");
    }
});
