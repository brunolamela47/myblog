document.addEventListener("DOMContentLoaded", () => {
  const postId = new URLSearchParams(window.location.search).get("id");

  console.log("Post ID extraído da URL:", postId);

  if (postId) {
    // Carregar o arquivo Markdown do repositório GitHub Pages
    fetch(`https://raw.githubusercontent.com/brunolamela47/myblog/refs/heads/main/posts/${postId}.md`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Falha ao carregar o arquivo Markdown");
        }
        return response.text();
      })
      .then(markdown => {
        // Regex para extrair o front matter corretamente
        const frontMatterRegex = /^---\s*\n([\s\S]+?)\n\s*---/;
        const match = markdown.match(frontMatterRegex);

        let title = "Título desconhecido";
        let date = "Data desconhecida";
        let author = "Autor desconhecido";
        let category = "Categoria desconhecida";
        let image = "";
        let video = "";
        let contentWithoutFrontMatter = markdown;

        if (match) {
          const frontMatter = match[1];
          const frontMatterLines = frontMatter.split('\n');
          frontMatterLines.forEach(line => {
            if (line.trim().startsWith('title:')) {
              title = line.replace('title:', '').trim().replace(/"/g, '');
            } else if (line.trim().startsWith('date:')) {
              date = line.replace('date:', '').trim().replace(/"/g, '');
            } else if (line.trim().startsWith('author:')) {
              author = line.replace('author:', '').trim().replace(/"/g, '');
            } else if (line.trim().startsWith('category:')) {
              category = line.replace('category:', '').trim().replace(/"/g, '');
            } else if (line.trim().startsWith('image:')) {
              image = line.replace('image:', '').trim().replace(/"/g, '');
            } else if (line.trim().startsWith('video:')) {
              video = line.replace('video:', '').trim().replace(/"/g, '');
            }
          });

          // Remover o front matter do conteúdo
          contentWithoutFrontMatter = markdown.replace(frontMatterRegex, '');
        }

        // Converter Markdown para HTML
        let htmlContent = marked.parse(contentWithoutFrontMatter);

        // Se houver um vídeo, substituir "TEST VIDEO" por um iframe com a URL do YouTube completa
        if (video) {
          htmlContent = htmlContent.replace("TEST VIDEO", `<a href="${video}" target="_blank" rel="noopener noreferrer">Vídeo</a>`);
        }

        // Atualizar os elementos na página com os dados extraídos
        const titleElement = document.getElementById("post-title");
        const dateElement = document.getElementById("post-date");
        const authorElement = document.getElementById("post-author");
        const categoryElement = document.getElementById("post-category");
        const contentElement = document.getElementById("post-content");

        if (titleElement) titleElement.textContent = title;
        if (dateElement) dateElement.textContent = date;
        if (authorElement) authorElement.textContent = author;
        if (categoryElement) categoryElement.textContent = category;
        if (contentElement) contentElement.innerHTML = htmlContent;

        // Atualizar a imagem, mas só se o campo 'image' contiver um valor válido
        const postImageElement = document.getElementById("post-image");
        if (image && image.trim() !== "") {
          postImageElement.src = image;
        } else {
          // Caso não haja uma imagem válida, ocultar a seção da imagem
          const postImageContainer = postImageElement.closest('.post-image');
          if (postImageContainer) {
            postImageContainer.style.display = 'none';
          }
        }

      })
      .catch(error => {
        console.error("Erro ao carregar o arquivo markdown:", error);
      });
  } else {
    console.error("ID do post não fornecido na URL.");
  }
});
