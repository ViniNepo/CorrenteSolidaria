(function () {
  "use strict";

  const CFG = window.SITE_CONFIG;
  const EXT_RE = new RegExp("\\.(" + CFG.extensoesImagem.join("|") + ")$", "i");

  // ------------------------------------------------------------
  // Navegação (menu mobile + sombra ao rolar)
  // ------------------------------------------------------------
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("menu");

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("nav--open");
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("no-scroll", open);
  });
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("nav--open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
    })
  );
  window.addEventListener("scroll", () => {
    nav.classList.toggle("nav--scrolled", window.scrollY > 24);
  }, { passive: true });

  // ------------------------------------------------------------
  // Doação
  // ------------------------------------------------------------
  const btnDoar = document.getElementById("btn-doar");
  const d = CFG.doacao;
  btnDoar.href = d.adicionarDiretoAoCarrinho
    ? "https://www.qualycestas.com.br/checkout/cart/add?sku=" + encodeURIComponent(d.sku) + "&qty=1&seller=1&sc=1"
    : d.produtoUrl;
  const precoEl = document.getElementById("doar-preco");
  if (d.precoTexto) precoEl.textContent = d.precoTexto; else precoEl.hidden = true;

  // ------------------------------------------------------------
  // Local
  // ------------------------------------------------------------
  const L = CFG.local;
  document.getElementById("local-nome").textContent = L.nome;
  document.getElementById("local-endereco").textContent = L.endereco;
  const q = encodeURIComponent(L.endereco);
  document.getElementById("local-link").href = "https://www.google.com/maps/search/?api=1&query=" + q;

  document.getElementById("ano-atual").textContent = new Date().getFullYear();

  // ------------------------------------------------------------
  // Fontes de imagens:
  //   1) manifest.json (gerado automaticamente pelo GitHub Action)
  //   2) fallback: API do GitHub (lista as pastas do repo em tempo real)
  // ------------------------------------------------------------
  async function carregarManifest() {
    try {
      const r = await fetch("manifest.json", { cache: "no-store" });
      if (!r.ok) throw new Error("sem manifest");
      return await r.json();
    } catch (e) {
      return null;
    }
  }

  async function listarGitHub(path) {
    const g = CFG.github;
    const url = `https://api.github.com/repos/${g.owner}/${g.repo}/contents/${path}?ref=${g.branch}`;
    const r = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
    if (!r.ok) throw new Error("GitHub API " + r.status);
    return r.json();
  }

  async function galeriaViaGitHub() {
    const pastas = (await listarGitHub("galeria")).filter((e) => e.type === "dir" && /^\d{4}$/.test(e.name));
    const anos = {};
    await Promise.all(
      pastas.map(async (p) => {
        const arquivos = await listarGitHub("galeria/" + p.name);
        anos[p.name] = arquivos
          .filter((f) => f.type === "file" && EXT_RE.test(f.name))
          .map((f) => f.name)
          .sort();
      })
    );
    return anos;
  }

  async function sobreViaGitHub() {
    try {
      const arquivos = await listarGitHub("images/sobre");
      return arquivos.filter((f) => f.type === "file" && EXT_RE.test(f.name)).map((f) => f.name).sort();
    } catch (e) {
      return [];
    }
  }

  // ------------------------------------------------------------
  // Imagens da seção "O projeto"
  // ------------------------------------------------------------
  function renderSobre(lista) {
    const wrap = document.getElementById("sobre-imagens");
    wrap.innerHTML = "";
    if (!lista.length) {
      wrap.innerHTML =
        '<div class="placeholder"><span>✦</span><p>Adicione fotos em <code>images/sobre/</code></p></div>';
      return;
    }
    lista.slice(0, 4).forEach((nome, i) => {
      const img = document.createElement("img");
      img.src = "images/sobre/" + nome;
      img.alt = "Foto do projeto " + (i + 1);
      img.loading = "lazy";
      img.className = "projeto__img projeto__img--" + (i + 1);
      wrap.appendChild(img);
    });
  }

  // ------------------------------------------------------------
  // Galeria por ano
  // ------------------------------------------------------------
  const tabsEl = document.getElementById("galeria-tabs");
  const galEl = document.getElementById("galeria-viewer");
  const mainBtn = document.getElementById("galeria-main");
  const mainImg = document.getElementById("galeria-main-img");
  const mainCount = document.getElementById("galeria-main-count");
  const thumbsEl = document.getElementById("galeria-thumbs");
  const vaziaEl = document.getElementById("galeria-vazia");
  let fotosAtuais = [];
  let atual = 0;

  function renderTabs(anos) {
    const lista = Object.keys(anos).sort((a, b) => b.localeCompare(a)); // mais novo primeiro
    tabsEl.innerHTML = "";
    if (!lista.length) {
      vaziaEl.hidden = false;
      vaziaEl.textContent = "Crie pastas como galeria/2025/ com suas fotos — elas aparecem aqui automaticamente.";
      return;
    }
    lista.forEach((ano, i) => {
      const b = document.createElement("button");
      b.className = "tab" + (i === 0 ? " tab--active" : "");
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", i === 0 ? "true" : "false");
      b.textContent = ano;
      b.addEventListener("click", () => {
        tabsEl.querySelectorAll(".tab").forEach((t) => {
          t.classList.remove("tab--active");
          t.setAttribute("aria-selected", "false");
        });
        b.classList.add("tab--active");
        b.setAttribute("aria-selected", "true");
        renderGrid(ano, anos[ano]);
      });
      tabsEl.appendChild(b);
    });
    renderGrid(lista[0], anos[lista[0]]);
  }

  function renderGrid(ano, arquivos) {
    fotosAtuais = arquivos.map((nome) => ({ src: "galeria/" + ano + "/" + nome, alt: "Corrente Solidária " + ano }));
    thumbsEl.innerHTML = "";
    const temFotos = fotosAtuais.length > 0;
    vaziaEl.hidden = temFotos;
    galEl.hidden = !temFotos;
    if (!temFotos) return;
    fotosAtuais.forEach((f, i) => {
      const b = document.createElement("button");
      b.className = "gallery__thumb";
      b.setAttribute("role", "listitem");
      b.setAttribute("aria-label", "Foto " + (i + 1) + " de " + ano);
      const img = document.createElement("img");
      img.src = f.src; img.alt = ""; img.loading = "lazy"; img.decoding = "async";
      b.appendChild(img);
      b.addEventListener("click", () => selecionar(i));
      thumbsEl.appendChild(b);
    });
    selecionar(0, true);
  }

  function selecionar(i, semScroll) {
    atual = i;
    mainImg.classList.remove("is-loaded");
    mainImg.src = fotosAtuais[i].src;
    mainImg.alt = fotosAtuais[i].alt;
    mainImg.onload = () => mainImg.classList.add("is-loaded");
    mainCount.textContent = (i + 1) + " / " + fotosAtuais.length;
    thumbsEl.querySelectorAll(".gallery__thumb").forEach((t, k) => t.classList.toggle("is-active", k === i));
    if (!semScroll) {
      const t = thumbsEl.children[i];
      if (t) t.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }
  mainBtn.addEventListener("click", () => { if (fotosAtuais.length) abrirLightbox(atual); });
  // swipe na imagem grande troca a foto
  let mx0 = null;
  mainBtn.addEventListener("touchstart", (e) => { mx0 = e.touches[0].clientX; }, { passive: true });
  mainBtn.addEventListener("touchend", (e) => {
    if (mx0 === null) return;
    const dx = e.changedTouches[0].clientX - mx0;
    if (Math.abs(dx) > 40) selecionar((atual + (dx < 0 ? 1 : -1) + fotosAtuais.length) % fotosAtuais.length);
    mx0 = null;
  });

  // ------------------------------------------------------------
  // Lightbox
  // ------------------------------------------------------------
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbCap = document.getElementById("lightbox-caption");
  let idx = 0;

  function mostrar(i) {
    idx = (i + fotosAtuais.length) % fotosAtuais.length;
    lbImg.src = fotosAtuais[idx].src;
    lbImg.alt = fotosAtuais[idx].alt;
    lbCap.textContent = `${idx + 1} / ${fotosAtuais.length}`;
  }
  function abrirLightbox(i) {
    mostrar(i);
    lb.hidden = false;
    document.body.classList.add("no-scroll");
    lb.querySelector(".lightbox__close").focus();
  }
  function fecharLightbox() {
    if (fotosAtuais.length) selecionar(idx);
    lb.hidden = true;
    lbImg.src = "";
    document.body.classList.remove("no-scroll");
  }
  lb.querySelector(".lightbox__close").addEventListener("click", fecharLightbox);
  lb.querySelector(".lightbox__nav--prev").addEventListener("click", () => mostrar(idx - 1));
  lb.querySelector(".lightbox__nav--next").addEventListener("click", () => mostrar(idx + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) fecharLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") fecharLightbox();
    if (e.key === "ArrowLeft") mostrar(idx - 1);
    if (e.key === "ArrowRight") mostrar(idx + 1);
  });
  // swipe no celular
  let x0 = null;
  lb.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) mostrar(dx < 0 ? idx + 1 : idx - 1);
    x0 = null;
  });

  // ------------------------------------------------------------
  // Boot
  // ------------------------------------------------------------
  (async function init() {
    let manifest = await carregarManifest();
    if (!manifest) {
      try {
        manifest = { galeria: await galeriaViaGitHub(), sobre: await sobreViaGitHub() };
      } catch (e) {
        manifest = { galeria: {}, sobre: [] };
      }
    }
    renderSobre(manifest.sobre || []);
    renderTabs(manifest.galeria || {});
  })();

  // Animação de entrada das seções
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".section").forEach((s) => io.observe(s));
  } else {
    document.querySelectorAll(".section").forEach((s) => s.classList.add("is-visible"));
  }
})();
