document.addEventListener("DOMContentLoaded", () => {
  const postId = new URLSearchParams(window.location.search).get("id");

  console.log("Post ID extraído da URL:", postId);

  if (postId) {
    fetch(`https://brunolamela47.github.io/myblog/posts/${postId}.md`)
      .then(response => {
        if (!response.ok) {
          console.error("Falha ao carregar o arquivo Markdown");
          throw new Error("Falha ao carregar o arquivo Markdown");
        }
        return response.text();
      })
      .then(markdown => {
        console.log("Conteúdo Markdown carregado:", markdown);

        // Regex para extrair o front matter corretamente, permitindo espaços extras antes e depois de ---
        const frontMatterRegex = /^---\s*\n([\s\S]+?)\n\s*---/;
        const match = markdown.match(frontMatterRegex);

        let title = "Título desconhecido";
        let date = "Data desconhecida";
        let author = "Autor desconhecido";
        let category = "Categoria desconhecida";
        let image = "";  // Adicionando a variável para imagem
        let contentWithoutFrontMatter = markdown;

        if (match) {
          console.log("Front matter encontrado:", match[1]);

          const frontMatter = match[1];
          const frontMatterLines = frontMatter.split('\n');
          
          // Extração dos dados do front matter
          frontMatterLines.forEach(line => {
            console.log("Linha do front matter:", line);
            if (line.startsWith('title:')) {
              title = line.replace('title:', '').trim().replace(/"/g, ''); // Remover aspas
              console.log("Título extraído:", title);
            } else if (line.startsWith('date:')) {
              date = line.replace('date:', '').trim().replace(/"/g, ''); // Remover aspas
              console.log("Data extraída:", date);
            } else if (line.startsWith('author:')) {
              author = line.replace('author:', '').trim().replace(/"/g, ''); // Remover aspas
              console.log("Autor extraído:", author);
            } else if (line.startsWith('category:')) {
              category = line.replace('category:', '').trim().replace(/"/g, ''); // Remover aspas
              console.log("Categoria extraída:", category);
            } else if (line.startsWith('image:')) {
              image = line.replace('image:', '').trim().replace(/"/g, ''); // Remover aspas
              console.log("Imagem extraída:", image);
            }
          });

          // Remover o front matter do conteúdo
          contentWithoutFrontMatter = markdown.replace(frontMatterRegex, '');
          console.log("Conteúdo sem o front matter:", contentWithoutFrontMatter);
        } else {
          console.log("Nenhum front matter encontrado.");
        }

        // Usando o marked para renderizar o conteúdo sem o front matter
        const htmlContent = marked.parse(contentWithoutFrontMatter);
        console.log("Conteúdo convertido para HTML:", htmlContent);

        // Atualizando os elementos na página com os dados extraídos
        document.getElementById("post-title").textContent = title;
        document.getElementById("post-date").textContent = date;
        document.getElementById("post-author").textContent = author;
        document.getElementById("post-category").textContent = category;
        document.getElementById("post-content").innerHTML = htmlContent;

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
