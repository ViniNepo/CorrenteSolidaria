// ============================================================
//  CONFIGURAÇÃO DO SITE — edite aqui, sem mexer no resto
// ============================================================
window.SITE_CONFIG = {
  // Repositório no GitHub (usado como fallback para listar a galeria)
  github: {
    owner: "ViniNepo",
    repo: "CorrenteSolidaria",
    branch: "main",
  },

  // Link da cesta na QualyCestas
  doacao: {
    produtoUrl: "https://www.qualycestas.com.br/cesta-basica-corrente-solidaria-luiz-savio-vl-medeiros/p",
    // Preço exibido no site (texto livre). Deixe "" para esconder.
    precoTexto: "R$ 76,00 por cesta",
    // Link direto para o carrinho (VTEX). Se true, o botão já adiciona a cesta
    // ao carrinho em vez de abrir a página do produto.
    adicionarDiretoAoCarrinho: false,
    sku: "59",
  },

  // Local do evento
  local: {
    nome: "Ponto de arrecadação — Vila Medeiros",
    endereco: "Rua Reverendo Israel Vieira Ferreira, 200 — Vila Medeiros, São Paulo - SP, 02215-000",
  },

  // Extensões de imagem aceitas na galeria
  extensoesImagem: ["jpg", "jpeg", "png", "webp", "gif", "avif"],
};
