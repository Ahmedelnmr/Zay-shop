// ================= USER HELPERS =================
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

// ================= CART HELPERS =================
function getCart() {
    const user = getCurrentUser();
    if (!user) return [];
    return JSON.parse(localStorage.getItem(`cart_${user.email}`)) || [];
}

function saveCart(cart) {
    const user = getCurrentUser();
    if (!user) return;
    localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));
}

function addToCart(product) {
    let cart = getCart();
    let existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    saveCart(cart);
    renderCart();
    updateCartCount();
}

function removeFromCart(id) {
    let cart = getCart().filter(item => item.id !== id);
    saveCart(cart);
    renderCart();
    updateCartCount();
}

function updateQuantity(id, type) {
    let cart = getCart();
    cart = cart.map(item => {
        if (item.id === id) {
            if (type === "inc") item.quantity++;
            if (type === "dec" && item.quantity > 1) item.quantity--;
        }
        return item;
    });
    saveCart(cart);
    renderCart();
    updateCartCount();
}


function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHtml = '';

    for (let i = 0; i < fullStars; i++) starsHtml += '<i class="fas fa-star"></i>';
    if (hasHalfStar) starsHtml += '<i class="fas fa-star-half-alt"></i>';
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) starsHtml += '<i class="far fa-star"></i>';

    return starsHtml;
}

function renderCart() {
    let cart = getCart();
    let container = document.getElementById("cart-items");
    let emptyCartDiv = document.getElementById("empty-cart");

    if (!container || !emptyCartDiv) return;

    if (cart.length === 0) {
        container.innerHTML = "";
        emptyCartDiv.classList.remove("d-none");
        updateCartSummary();
        return;
    }

    emptyCartDiv.classList.add("d-none");
    container.innerHTML = "";

    cart.forEach(item => {
        container.innerHTML += `
            <div class="cart-item" data-id="${item.id}">
                <div class="row align-items-center">
                    <div class="col-md-3 col-sm-4">
                        <img src="${item.image}" alt="${item.title}" class="product-image w-100">
                    </div>
                    <div class="col-md-5 col-sm-8">
                        <div class="product-info">
                            <div class="product-category">${item.category}</div>
                            <h5>${item.title}</h5>
                            <p class="product-description">${item.description}</p>
                            <div class="product-rating">
                                <div class="stars">${renderStars(item.rating.rate)}</div>
                                <span class="rating-count">(${item.rating.count} reviews)</span>
                            </div>
                            <div class="product-price">$${item.price.toFixed(2)}</div>
                        </div>
                    </div>
                    <div class="col-md-2 col-sm-6 mt-3 mt-md-0">
                        <div class="quantity-controls d-flex align-items-center justify-content-center">
                            <button class="quantity-btn me-2" onclick="updateQuantity(${item.id}, 'dec')" ${item.quantity <= 1 ? 'disabled' : ''}>
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity-display mx-2 fw-bold">${item.quantity}</span>
                            <button class="quantity-btn ms-2" onclick="updateQuantity(${item.id}, 'inc')">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-2 col-sm-6 mt-3 mt-md-0">
                        <button class="remove-btn w-100" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash-alt me-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    updateCartSummary();
}

function updateCartSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 15.00;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    if (document.getElementById('subtotal'))
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    if (document.getElementById('shipping'))
        document.getElementById('shipping').textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    if (document.getElementById('tax'))
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    if (document.getElementById('total'))
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const el = document.getElementById('cart-count');
    if (el) el.textContent = count;
}


function proceedToCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const btn = document.querySelector('.checkout-btn');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<span class="loading"></span> Processing...';
    btn.disabled = true;

    setTimeout(() => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        alert(`Order processed successfully! Total: ${(total + (total > 100 ? 0 : 15) + (total * 0.08)).toFixed(2)}`);

        const user = getCurrentUser();
        if (user) {
            localStorage.removeItem(`cart_${user.email}`);
        }

        renderCart();
        updateCartCount();

        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 2000);
}


document.addEventListener("DOMContentLoaded", function () {
 

    renderCart();
    updateCartCount();
});
