document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("current-year").textContent = new Date().getFullYear();

  // Theme toggle functionality
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle.querySelector("i");

  // Check for saved theme preference or use default
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.className = savedTheme;
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.className;
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.className = newTheme;
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (theme === "dark") {
      themeIcon.className = "fa-solid fa-sun";
    } else {
      themeIcon.className = "fa-solid fa-moon";
    }
  }

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.querySelector(".mobile-menu");

  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", (event) => {
    if (!mobileMenuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
      mobileMenu.classList.remove("active");
    }
  });

  // Newsletter form submission
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');

      if (emailInput.value) {
        alert("Thank you for subscribing to our newsletter!");
        emailInput.value = "";
      }
    });
  }

  // Blog category filtering
  const categoryButtons = document.querySelectorAll(".category-btn");
  if (categoryButtons.length > 0) {
    categoryButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Remove active class from all buttons
        categoryButtons.forEach((btn) => btn.classList.remove("active"));

        // Add active class to clicked button
        this.classList.add("active");

        const category = this.getAttribute("data-category");
        filterBlogPosts(category);
      });
    });
  }

  function filterBlogPosts(category) {
    const blogCards = document.querySelectorAll(".blog-card");

    blogCards.forEach((card) => {
      if (category === "all" || card.getAttribute("data-category") === category) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  // Search functionality
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      searchBlogPosts(searchTerm);
    });
  }

  function searchBlogPosts(searchTerm) {
    const blogCards = document.querySelectorAll(".blog-card");

    blogCards.forEach((card) => {
      const title = card.querySelector("h3").textContent.toLowerCase();
      const excerpt = card.querySelector("p").textContent.toLowerCase();

      if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  // Pagination
  const paginationButtons = document.querySelectorAll(".pagination-btn");
  if (paginationButtons.length > 0) {
    paginationButtons.forEach((button) => {
      button.addEventListener("click", function () {
        paginationButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");
        // In a real application, this would load different blog posts
        // For this demo, we'll just show an alert
        alert("Pagination clicked: Page " + this.textContent);
      });
    });
  }

  // Load blog posts dynamically from index.json
  fetch('https://brunolamela47.github.io/myblog/posts/index.json')
    .then(response => response.json())
    .then(data => {
      // Acessando corretamente os posts
      const postsData = data.posts || [];
      const totalPages = data.totalPages || 1;  // Definindo as páginas totais

      // Renderizando os posts
      const blogPosts = postsData.map(post => {
        const fileName = post.file ? post.file.replace(/\.md$/, "") : "";
        return `
          <div class="blog-card" data-category="${post.category}">
            <div class="blog-image">
              <img src="${post.url}" alt="${post.title}">
            </div>
            <div class="blog-content">
              <div class="blog-date">${post.date}</div>
              <h3>${post.title}</h3>
              <p>${post.description}</p>
              <a href="blog-post.html?id=${fileName}" class="read-more">
                Read more <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        `;
      }).join('');

      // Colocando os posts na página
      document.querySelector('.blog-grid').innerHTML = blogPosts;

      // Implementando a Paginação
    

    })
    .catch(error => {
      console.error("Erro ao carregar o index.json:", error);
    });
});
