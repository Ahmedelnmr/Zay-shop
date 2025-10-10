const apiUrl = "https://fakestoreapi.com/products";
const productRow = document.getElementById("productRow");

// Fetch and save to localStorage
async function loadProducts() {
  let products = JSON.parse(localStorage.getItem("products"));

  if (!products) {
    const res = await fetch(apiUrl);
    products = await res.json();
    localStorage.setItem("products", JSON.stringify(products));
  }

  displayProducts(products.slice(0, 3)); 
}

// Render products
function displayProducts(products) {
  productRow.innerHTML = "";

  products.forEach(product => {
    productRow.innerHTML += `
      <div class="col-12 col-md-4 mb-4">
        <div class="card h-100">
         <a href="details.html?id=${product.id}">

            <img src="${product.image}" class="card-img-top product-img" alt="${product.title}">
          </a>
          <div class="card-body">
            <ul class="list-unstyled d-flex justify-content-between">
              <li>
                ${renderStars(product.rating?.rate || 0)}
              </li>
              <li class="text-muted text-right">$${product.price}</li>
            </ul>
            <a href="details.html?id=${product.id}" class="h2 text-decoration-none text-dark">${product.title}</a>
            <p class="card-text">
              ${product.description.substring(0, 80)}...
            </p>
            <p class="text-muted">Reviews (${product.rating?.count || 0})</p>
          </div>
        </div>
      </div>
    `;
  });
}

// Helper: render stars
function renderStars(rate) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += `<i class="fa ${i <= rate ? "text-warning fa-star" : "text-muted fa-star"}"></i>`;
  }
  return stars;
}

// Run on page load
loadProducts();
