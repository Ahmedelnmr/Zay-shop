
    const API_URL = "https://fakestoreapi.com/products";
    let products = [];
    let filteredProducts = [];
    let currentPage = 1;
    const itemsPerPage = 6;

    const productsContainer = document.getElementById("products-container");
    const paginationContainer = document.querySelector(".pagination");
    const categorySidebar = document.getElementById("category-sidebar");
    const searchInput = document.getElementById("searchInput");

  
    async function fetchProducts() {
      const res = await fetch(API_URL);
      products = await res.json();
      filteredProducts = products;
      renderCategories();
      renderProducts();
      renderPagination();
    }

    
    function renderCategories() {
      const categories = [...new Set(products.map(p => p.category))];
      categorySidebar.innerHTML = `<li><a href="#" class="category-link" data-category="all">All</a></li>`;
      categories.forEach(cat => {
        categorySidebar.innerHTML += `<li><a href="#" class="category-link" data-category="${cat}">${cat}</a></li>`;
      });

      document.querySelectorAll(".category-link").forEach(link => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const category = e.target.dataset.category;
          if (category === "all") {
            filteredProducts = products;
          } else {
            filteredProducts = products.filter(p => p.category === category);
          }
          currentPage = 1;
          renderProducts();
          renderPagination();
        });
      });
    }

    function renderProducts() {
      productsContainer.innerHTML = "";
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginatedProducts = filteredProducts.slice(start, end);

      if (paginatedProducts.length === 0) {
        productsContainer.innerHTML = `<div class="alert alert-warning text-center">No products found</div>`;
        return;
      }

      paginatedProducts.forEach(item => {
        productsContainer.innerHTML += `
          <div class="col-md-4 mb-4">
            <a href="details.html?id=${item.id}" class="text-decoration-none text-dark">
              <div class="card product-card h-100">
                <img src="${item.image}" class="card-img-top" alt="${item.title}">
                <div class="card-body">
                  <h6 class="card-title">${item.title.substring(0, 40)}...</h6>
                  <p class="card-text text-success fw-bold">$${item.price}</p>
                  <span class="btn btn-sm btn-primary">View Details</span>
                </div>
              </div>
            </a>
          </div>
        `;
      });
    }

   
    function renderPagination() {
      paginationContainer.innerHTML = "";
      const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

      for (let i = 1; i <= totalPages; i++) {
        paginationContainer.innerHTML += `
          <li class="page-item ${i === currentPage ? "active" : ""}">
            <a class="page-link" href="#">${i}</a>
          </li>
        `;
      }

      document.querySelectorAll(".page-item").forEach((item, index) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          currentPage = index + 1;
          renderProducts();
          renderPagination();
        });
      });
    }


    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchTerm)
      );
      currentPage = 1;
      renderProducts();
      renderPagination();
    });


    fetchProducts();


