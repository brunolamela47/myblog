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
        let image = ""; // Variável para armazenar a URL da imagem
        let contentWithoutFrontMatter = markdown;

        if (match) {
          console.log("Front matter encontrado:", match[1]);

          const frontMatter = match[1];
          const frontMatterLines = frontMatter.split('\n');
          
          // Extração dos dados do front matter
          frontMatterLines.forEach(line => {
            console.log("Linha do front matter:", line);
            if (line.startsWith('title:')) {
              title = line.replace('title:', '').trim();
              console.log("Título extraído:", title);
            } else if (line.startsWith('date:')) {
              date = line.replace('date:', '').trim();
              console.log("Data extraída:", date);
            } else if (line.startsWith('author:')) {
              author = line.replace('author:', '').trim();
              console.log("Autor extraído:", author);
            } else if (line.startsWith('category:')) {
              category = line.replace('category:', '').trim();
              console.log("Categoria extraída:", category);
            } else if (line.startsWith('image:')) { // Adicionando a extração da imagem
              image = line.replace('image:', '').trim();
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

        // Se a URL da imagem for fornecida, exiba a imagem na div post-image
        if (image) {
          const imageElement = document.createElement("img");
          imageElement.src = image;
          imageElement.alt = title; // Definir um texto alternativo para a imagem
          imageElement.id = "post-image"; // Defina o ID para a imagem
          
          // Encontrar a div .post-image e substituir seu conteúdo pela imagem
          const postImageDiv = document.querySelector('.post-image');
          if (postImageDiv) {
            postImageDiv.innerHTML = '';  // Limpar qualquer conteúdo existente
            postImageDiv.appendChild(imageElement); // Adicionar a imagem à div
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
