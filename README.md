# Corrente Solidária de Natal

Site do projeto social de doação de cestas básicas para famílias carentes. Página única (HTML + CSS + JS puro), responsiva para computador e celular, sem build.

## Estrutura

```
index.html            página
css/style.css         estilos
js/config.js          ← textos/links que mudam (QualyCestas, endereço, preço)
js/main.js            galeria dinâmica, lightbox, menu
images/capa.jpg       ← imagem de capa (coloque a sua)
images/sobre/         ← fotos da seção "O projeto" (até 4 são exibidas)
galeria/2025/         ← fotos da edição de 2025
galeria/2024/         ← fotos da edição de 2024
manifest.json         gerado automaticamente — não editar à mão
scripts/gerar_manifest.py
.github/workflows/manifest.yml
```

## Como adicionar fotos

1. Crie uma pasta `galeria/<ANO>/` (ex.: `galeria/2026/`) e coloque as fotos dentro (`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.avif`).
2. Faça o push. O GitHub Action regenera o `manifest.json` sozinho e o site passa a mostrar a nova aba do ano (do mais novo para o mais antigo).

Mesmo que o Action não rode (ou o `manifest.json` não exista), o site tem um fallback que lê as pastas direto pela API do GitHub.

Fotos da seção "O projeto" vão em `images/sobre/`. A capa é `images/capa.jpg`.

> Dica: redimensione as fotos para ~1600px de largura antes de subir — o site carrega muito mais rápido.

## Textos e links

- Textos da página: edite direto no `index.html` (os blocos estão comentados).
- Link da cesta, preço, endereço do evento: `js/config.js`.
- `adicionarDiretoAoCarrinho: true` faz o botão já colocar a cesta no carrinho da QualyCestas em vez de abrir a página do produto.

## Publicar

**GitHub Pages:** Settings → Pages → Source: *Deploy from a branch* → `main` / `/ (root)`. O site fica em `https://vininepo.github.io/CorrenteSolidaria/`.

**Netlify:** conecte o repositório, sem comando de build, diretório de publicação `/`.

## Rodar local

```bash
python3 scripts/gerar_manifest.py   # opcional
python3 -m http.server 8000          # abra http://localhost:8000
```
