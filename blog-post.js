document.addEventListener("DOMContentLoaded", () => {
  const postId = new URLSearchParams(window.location.search).get("id");

  console.log("Post ID extraído da URL:", postId);

  if (postId) {
    fetch(`https://brunolamela47.github.io/myblog/posts/${postId}.md`)
        .then(response => {
        if (!response.ok) {
          throw new Error("Falha ao carregar o arquivo Markdown");
        }
        return response.text();
      })
      .then(markdown => {
        const frontMatterRegex = /^---\s*\n([\s\S]+?)\n\s*---/;
        const match = markdown.match(frontMatterRegex);

        let title = "Título desconhecido";
        let date = "Data desconhecida";
        let author = "Autor desconhecido";
        let category = "Categoria desconhecida";
        let image = "";
        let contentWithoutFrontMatter = markdown;

        if (match) {
          const frontMatter = match[1];
          const frontMatterLines = frontMatter.split('\n');
          frontMatterLines.forEach(line => {
            if (line.startsWith('title:')) {
              title = line.replace('title:', '').trim().replace(/"/g, '');
            } else if (line.startsWith('date:')) {
              date = line.replace('date:', '').trim().replace(/"/g, '');
            } else if (line.startsWith('author:')) {
              author = line.replace('author:', '').trim().replace(/"/g, '');
            } else if (line.startsWith('category:')) {
              category = line.replace('category:', '').trim().replace(/"/g, '');
            } else if (line.startsWith('image:')) {
              image = line.replace('image:', '').trim().replace(/"/g, '');
            }
          });

          contentWithoutFrontMatter = markdown.replace(frontMatterRegex, '');
        }

        const htmlContent = marked.parse(contentWithoutFrontMatter);

        // Verifique se o elemento existe antes de manipulá-lo
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

        // Atualizando a imagem do post (se houver)
        const postImageElement = document.getElementById("post-image");
        if (image && postImageElement) {
          postImageElement.src = image;
        }

      })
      .catch(error => {
        console.error("Erro ao carregar o arquivo markdown:", error);
      });
  } else {
    console.error("ID do post não fornecido na URL.");
  }
});
