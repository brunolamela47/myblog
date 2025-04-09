document.addEventListener('DOMContentLoaded', function() {
  const postsPerPage = 6; // Número de posts por página (você pode ajustar conforme necessário)
  let currentPage = 1; // Página inicial
  let totalPages = 1;  // Total de páginas, inicialmente é 1

  // Função para carregar os posts
  function loadPosts() {
    fetch('https://brunolamela47.github.io/myblog/posts/index.json')  // URL para o arquivo JSON
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao carregar os posts');
        }
        return response.json();
      })
      .then(data => {
        const postsData = data.posts;
        totalPages = data.totalPages; // Definindo o total de páginas da resposta
        displayPosts(postsData);
        displayPagination();
      })
      .catch(error => {
        console.error('Erro ao carregar os posts:', error);
      });
  }

  // Função para exibir os posts no HTML
  function displayPosts(posts) {
    const postsContainer = document.querySelector('.blog-grid');
    postsContainer.innerHTML = '';  // Limpa o conteúdo existente

    // Calculando os posts a serem exibidos para a página atual
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToDisplay = posts.slice(startIndex, endIndex);

    postsToDisplay.forEach(post => {
      const postElement = document.createElement('div');
      postElement.classList.add('blog-card');
      postElement.setAttribute('data-category', post.category.toLowerCase());

      postElement.innerHTML = `
  <div class="blog-image">
    <img src="${post.url}" alt="${post.title}">
  </div>
  <div class="blog-content">
    <div class="blog-date">${new Date(post.date).toLocaleDateString()}</div>
    <h3>${post.title}</h3>
    <p>${post.description}</p>
    <a href="blog-post.html?id=${post.file.replace('.md', '')}" class="read-more">
      Read more
      <i class="fa-solid fa-arrow-right"></i>
    </a>
  </div>
`;


      postsContainer.appendChild(postElement);
    });
  }

  // Função para exibir os botões de paginação
  function displayPagination() {
    const paginationContainer = document.querySelector('.pagination-buttons');
    paginationContainer.innerHTML = '';  // Limpa os botões de paginação existentes

    // Calculando a faixa de páginas
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement('button');
      pageButton.classList.add('pagination-btn');
      pageButton.textContent = i;

      // Adicionando classe ativa à página atual
      if (i === currentPage) {
        pageButton.classList.add('active');
      }

      // Configurando o clique para mudar de página
      pageButton.addEventListener('click', function() {
        currentPage = i;
        loadPosts();
      });

      paginationContainer.appendChild(pageButton);
    }
  }

  // Carregar os posts ao carregar a página
  loadPosts();
});
