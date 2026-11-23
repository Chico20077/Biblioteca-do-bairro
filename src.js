/* ================================
   FUNÇÕES DE ARMAZENAMENTO
================================ */

function ler(chave, porOmissao) {
  try {
    const texto = localStorage.getItem(chave);

    if (texto === null) {
      return porOmissao;
    }

    return JSON.parse(texto);
  } catch {
    return porOmissao;
  }
}

function guardar(chave, valor) {
  try {
    localStorage.setItem(
      chave,
      JSON.stringify(valor)
    );

    return true;
  } catch {
    return false;
  }
}

function guardarTexto(chave, valor) {
  try {
    localStorage.setItem(chave, String(valor));
    return true;
  } catch {
    return false;
  }
}


/* ================================
   EXERCÍCIO 3 — CONTADOR DE VISITAS
================================ */

const contador = document.querySelector("#contador-visitas");
const recomecar = document.querySelector("#recomecar-visitas");

let visitas = Number(
  localStorage.getItem("visitas")
) || 0;

visitas++;

localStorage.setItem("visitas", visitas);

contador.textContent =
  `É a ${visitas}.ª vez que nos visitas`;

recomecar.addEventListener("click", () => {
  localStorage.removeItem("visitas");

  contador.textContent =
    "Contador reposto. Atualiza a página.";
});


/* ================================
   EXERCÍCIO 7 & DOM EX. 09 — TEMA E MENU
================================ */

const botaoTema = document.querySelector("#tema");
const seguirSistema =
  document.querySelector("#seguir-sistema");

const estadoTema =
  document.querySelector("#estado-preferencias");

const sistemaEscuro = window.matchMedia(
  "(prefers-color-scheme: dark)"
);

function aplicarTema() {
  const temaGuardado =
    localStorage.getItem("tema");

  const escuro = temaGuardado
    ? temaGuardado === "escuro"
    : sistemaEscuro.matches;

  document.body.classList.toggle(
    "escuro",
    escuro
  );

  botaoTema.setAttribute(
    "aria-pressed",
    escuro
  );

  estadoTema.textContent = temaGuardado
    ? `Tema escolhido: ${temaGuardado}`
    : "A seguir o tema do sistema.";
}

botaoTema.addEventListener("click", () => {
  const escuro =
    !document.body.classList.contains("escuro");

  localStorage.setItem(
    "tema",
    escuro ? "escuro" : "claro"
  );

  aplicarTema();
});

seguirSistema.addEventListener("click", () => {
  localStorage.removeItem("tema");
  aplicarTema();
});

aplicarTema();

const botaoMenu = document.querySelector("#abrir-menu");
const menuPrincipal = document.querySelector("#menu-principal");

function definirMenu(aberto) {
  menuPrincipal.classList.toggle("aberto", aberto);
  botaoMenu.setAttribute("aria-expanded", String(aberto));
}

botaoMenu.addEventListener("click", () => {
  const estaAberto = menuPrincipal.classList.contains("aberto");
  definirMenu(!estaAberto);
});

document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape" && menuPrincipal.classList.contains("aberto")) {
    definirMenu(false);
    botaoMenu.focus();
  }
});


/* ================================
   TAMANHO DA LETRA
================================ */

function aplicarLetra(tamanho) {
  document.body.classList.remove(
    "tamanho-pequeno",
    "tamanho-grande"
  );

  if (tamanho === "pequeno") {
    document.body.classList.add(
      "tamanho-pequeno"
    );
  }

  if (tamanho === "grande") {
    document.body.classList.add(
      "tamanho-grande"
    );
  }

  guardar(
    "biblioteca:tamanho-letra",
    tamanho
  );
}

aplicarLetra(
  ler("biblioteca:tamanho-letra", "normal")
);

document.querySelector("#letra-menor")
  .addEventListener("click", () => {
    aplicarLetra("pequeno");
  });

document.querySelector("#letra-maior")
  .addEventListener("click", () => {
    aplicarLetra("grande");
  });

document.querySelector("#letra-normal")
  .addEventListener("click", () => {
    aplicarLetra("normal");
  });


/* ================================
   DOM EX. 05 & 06 — LIVRO EM DESTAQUE
================================ */

const destaque = document.querySelector("#destaque .ficha-destaque");
const tituloDestaque = destaque.querySelector(".titulo-destaque");
const capaDestaque = destaque.querySelector(".capa");
const linkMais = destaque.querySelector(".mais");
const estadoDestaque = destaque.querySelector(".estado-destaque");
const botaoReservar = destaque.querySelector(".reservar");

const idDestaque = Number(destaque.dataset.id);
const estadoInicialDestaque = destaque.dataset.estado;

tituloDestaque.textContent = "Mensagem";
capaDestaque.src = "img/mensagem.jpg";
capaDestaque.alt = "Capa de Mensagem, de Fernando Pessoa";
linkMais.href = "/catalogo?autor=pessoa";
estadoDestaque.textContent = `Estado (ID ${idDestaque}): ${estadoInicialDestaque}`;

if (estadoInicialDestaque === "emprestado") {
  const [, mes, dia] = destaque.dataset.devolucao.split("-");
  botaoReservar.textContent = `Disponível a ${dia}/${mes}`;
  botaoReservar.disabled = true;
}

botaoReservar.addEventListener("click", () => {
  destaque.dataset.estado = "emprestado";
  botaoReservar.textContent = "Reservado";
  botaoReservar.disabled = true;
  estadoDestaque.textContent = `Estado (ID ${idDestaque}): emprestado`;
});


/* ================================
   CATÁLOGO + DOM EX. 11 & 15 (<template> E PESQUISA)
================================ */

const livros = [
  {
    titulo: "Os Maias",
    autor: "Eça de Queirós",
    disponivel: true
  },
  {
    titulo: "Mensagem",
    autor: "Fernando Pessoa",
    disponivel: false
  },
  {
    titulo: "A Sibila",
    autor: "Agustina Bessa-Luís",
    disponivel: true
  },
  {
    titulo: "Os Lusíadas",
    autor: "Luís de Camões",
    disponivel: true
  },
  {
    titulo: "Memorial do Convento",
    autor: "José Saramago",
    disponivel: true
  },
  {
    titulo: "O Principezinho",
    autor: "Antoine de Saint-Exupéry",
    disponivel: true
  }
];

const pesquisa =
  document.querySelector("#pesquisa");

const listaLivros =
  document.querySelector("#lista-livros");

const tplLivro =
  document.querySelector("#tpl-livro");

const resumo =
  document.querySelector("#resumo");

const filtro =
  document.querySelector("#so-disponiveis");

let soDisponiveis = false;

function construirCatalogo() {
  const fragmento = document.createDocumentFragment();

  livros.forEach((livro) => {
    const clone = tplLivro.content.cloneNode(true);
    const li = clone.querySelector(".livro");
    const tituloEl = clone.querySelector(".titulo");
    const autorEl = clone.querySelector(".autor");
    const badgeEl = clone.querySelector(".badge");

    li.dataset.estado = livro.disponivel ? "disponivel" : "emprestado";
    li.dataset.pesquisa = `${livro.titulo} ${livro.autor}`.toLowerCase();

    tituloEl.textContent = livro.titulo;
    autorEl.textContent = ` — ${livro.autor}`;

    if (!livro.disponivel) {
      li.classList.add("indisponivel");
      badgeEl.hidden = false;
    }

    fragmento.append(clone);
  });

  listaLivros.replaceChildren(fragmento);
}

construirCatalogo();

function pesquisar() {
  const termo =
    pesquisa.value.trim().toLowerCase();

  const itens = [...listaLivros.querySelectorAll(".livro")];
  let visiveis = 0;

  itens.forEach((li) => {
    const correspondeTexto =
      !termo || li.dataset.pesquisa.includes(termo);
    const correspondeEstado =
      !soDisponiveis || li.dataset.estado === "disponivel";

    const visivel = correspondeTexto && correspondeEstado;
    li.hidden = !visivel;

    if (visivel) {
      visiveis++;
    }
  });

  resumo.textContent =
    `${visiveis} livros encontrados.`;
}

pesquisa.addEventListener("input", pesquisar);

pesquisa.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") {
    pesquisa.value = "";
    pesquisa.dispatchEvent(new Event("input"));
  }
});

filtro.addEventListener("click", () => {
  soDisponiveis = !soDisponiveis;

  filtro.textContent = soDisponiveis
    ? "Mostrar todos os livros"
    : "Mostrar apenas disponíveis";

  pesquisar();
});

pesquisar();


/* ================================
   EXERCÍCIO 11 — PESQUISAS RECENTES
================================ */

const CHAVE_PESQUISAS =
  "biblioteca:pesquisas";

const SETE_DIAS =
  7 * 24 * 60 * 60 * 1000;

const listaPesquisas =
  document.querySelector("#ultimas-pesquisas");

function lerPesquisas() {
  const caixa = ler(
    CHAVE_PESQUISAS,
    null
  );

  if (
    !caixa ||
    caixa.versao !== 1 ||
    Date.now() - caixa.guardadoEm > SETE_DIAS
  ) {
    return [];
  }

  return caixa.dados || [];
}

function mostrarPesquisas() {
  listaPesquisas.innerHTML = "";

  lerPesquisas().forEach(termo => {
    const li = document.createElement("li");

    const botao = document.createElement("button");

    botao.type = "button";
    botao.textContent = termo;

    botao.addEventListener("click", () => {
      pesquisa.value = termo;
      pesquisar();
    });

    li.appendChild(botao);
    listaPesquisas.appendChild(li);
  });
}

function registarPesquisa(termo) {
  if (!termo) return;

  const antigas = lerPesquisas()
    .filter(t => t !== termo);

  const dados = [
    termo,
    ...antigas
  ].slice(0, 5);

  guardar(CHAVE_PESQUISAS, {
    versao: 1,
    guardadoEm: Date.now(),
    dados
  });

  mostrarPesquisas();
}

pesquisa.addEventListener("change", () => {
  registarPesquisa(
    pesquisa.value.trim()
  );
});

document.querySelector("#limpar-pesquisas")
  .addEventListener("click", () => {
    localStorage.removeItem(
      CHAVE_PESQUISAS
    );

    mostrarPesquisas();
  });

mostrarPesquisas();


/* ================================
   EXERCÍCIO 5 — FICHA DO LEITOR
================================ */

const formLeitor =
  document.querySelector("#form-leitor");

const saudacao =
  document.querySelector("#saudacao-leitor");

const generosLista =
  document.querySelector("#generos-lista");

let leitor = ler(
  "biblioteca:leitor",
  null
);

function mostrarLeitor() {
  if (!leitor) {
    saudacao.textContent =
      "Olá, visitante.";

    generosLista.innerHTML = "";
    return;
  }

  saudacao.textContent =
    `Olá, ${leitor.nome}!`;

  generosLista.innerHTML = "";

  leitor.generos.forEach(genero => {
    const li = document.createElement("li");

    li.textContent = genero;

    generosLista.appendChild(li);
  });
}

mostrarLeitor();

formLeitor.addEventListener("submit", evento => {
  evento.preventDefault();

  leitor = {
    nome: document.querySelector("#nome-leitor")
      .value,

    cartao: document.querySelector("#cartao-leitor")
      .value,

    generos: document.querySelector("#generos-leitor")
      .value
      .split(",")
      .map(g => g.trim())
      .filter(Boolean)
  };

  guardar("biblioteca:leitor", leitor);

  mostrarLeitor();
});

document.querySelector("#apagar-ficha")
  .addEventListener("click", () => {
    localStorage.removeItem(
      "biblioteca:leitor"
    );

    leitor = null;

    mostrarLeitor();
  });


/* ================================
   EXERCÍCIO 8 & DOM EX. 12–13 — LISTA DE LEITURA (DELEGAÇÃO)
================================ */

let leitura = ler(
  "biblioteca:leitura",
  []
);

const listaLeitura =
  document.querySelector("#lista-leitura");

const estadoLeitura =
  document.querySelector("#estado-leitura");

const formLeitura =
  document.querySelector("#form-leitura");

function sincronizarOrdemLeitura() {
  const titulosOrdenados = [...listaLeitura.querySelectorAll(".item-leitura")].map((li) => ({
    titulo: li.querySelector(".titulo-item").textContent,
    lido: li.querySelector(".titulo-item").classList.contains("lido")
  }));

  leitura = titulosOrdenados;
  guardar("biblioteca:leitura", leitura);
  estadoLeitura.textContent =
    `${leitura.length} livros na lista.`;
}

function atualizarLeitura() {
  guardar(
    "biblioteca:leitura",
    leitura
  );

  mostrarLeitura();
}

function mostrarLeitura() {
  listaLeitura.innerHTML = "";

  leitura.forEach((livro) => {
    const li = document.createElement("li");
    li.className = "item-leitura";

    const texto = document.createElement("span");
    texto.className = "titulo-item";
    texto.textContent = livro.titulo;

    if (livro.lido) {
      texto.classList.add("lido");
    }

    const acoes = document.createElement("div");

    const subir = document.createElement("button");
    subir.type = "button";
    subir.textContent = "↑";
    subir.dataset.acao = "subir";

    const descer = document.createElement("button");
    descer.type = "button";
    descer.textContent = "↓";
    descer.dataset.acao = "descer";

    const apagar = document.createElement("button");
    apagar.type = "button";
    apagar.textContent = "Remover";
    apagar.dataset.acao = "remover";

    acoes.append(subir, descer, apagar);
    li.append(texto, acoes);
    listaLeitura.appendChild(li);
  });

  estadoLeitura.textContent =
    `${leitura.length} livros na lista.`;
}

listaLeitura.addEventListener("click", (evento) => {
  const li = evento.target.closest(".item-leitura");
  if (!li) return;

  const botao = evento.target.closest("button");

  if (!botao) {
    li.querySelector(".titulo-item")?.classList.toggle("lido");
    sincronizarOrdemLeitura();
    return;
  }

  const acao = botao.dataset.acao;

  if (acao === "subir") {
    li.previousElementSibling?.before(li);
  } else if (acao === "descer") {
    li.nextElementSibling?.after(li);
  } else if (acao === "remover") {
    li.remove();
  }

  sincronizarOrdemLeitura();
});

formLeitura.addEventListener("submit", evento => {
  evento.preventDefault();

  const campoLivro = document.querySelector("#novo-livro");
  const titulo = campoLivro.value.trim();

  if (!titulo) return;

  leitura.push({
    titulo: titulo,
    lido: false
  });

  campoLivro.value = "";

  atualizarLeitura();
});

mostrarLeitura();


/* ================================
   DOM EX. 10 — PROGRESSO DE LEITURA
================================ */

const progressoRange = document.querySelector("#progresso-range");
const barraProgresso = document.querySelector(".progresso");
const percentagemLeitura = document.querySelector("#percentagem-leitura");

function atualizarProgresso() {
  const valor = Number(progressoRange.value);
  barraProgresso.style.width = `${valor}%`;
  percentagemLeitura.textContent = `${valor}% lido`;
  barraProgresso.classList.toggle("completo", valor === 100);
}

progressoRange.addEventListener("input", atualizarProgresso);
atualizarProgresso();


/* ================================
   DOM EX. 14 — INSCRIÇÃO NO CLUBE
================================ */

const formInscricao = document.querySelector("#form-inscricao");
const campoNomeInscricao = document.querySelector("#nome-inscricao");
const resumoInscricao = document.querySelector("#resumo-inscricao");

campoNomeInscricao.addEventListener("input", (evento) => {
  const partes = evento.target.value.trim().split(/\s+/);
  const mensagem = partes.length < 2
    ? "Escreve nome e apelido."
    : "";
  evento.target.setCustomValidity(mensagem);
});

formInscricao.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const dados = new FormData(formInscricao);
  const nomeCompleto = String(dados.get("nome") || "").trim();
  const primeiroNome = nomeCompleto.split(/\s+/)[0] || "";
  const clube = dados.get("clube");

  resumoInscricao.textContent =
    `Obrigado, ${primeiroNome}! Inscrição no clube ${clube}.`;

  formInscricao.reset();
  campoNomeInscricao.setCustomValidity("");
  campoNomeInscricao.focus();
});


/* ================================
   EXERCÍCIO 9 — AVISO POR VISITA
================================ */

const aviso =
  document.querySelector("#aviso-visita");

const fecharAviso =
  document.querySelector("#fechar-aviso");

if (
  sessionStorage.getItem(
    "biblioteca:aviso-fechado"
  ) !== "sim"
) {
  aviso.hidden = false;
}

fecharAviso.addEventListener("click", () => {
  aviso.hidden = true;

  sessionStorage.setItem(
    "biblioteca:aviso-fechado",
    "sim"
  );
});


/* ================================
   RASCUNHO DE SUGESTÃO + DOM EX. 07 CONTADOR
================================ */

const sugestao =
  document.querySelector("#sugestao");

const contadorSugestao =
  document.querySelector("#contador-sugestao");

const formSugestao =
  document.querySelector("#form-sugestao");

const estadoSugestao =
  document.querySelector("#estado-sugestao");

function atualizarContadorSugestao() {
  const total = sugestao.value.length;
  contadorSugestao.textContent = `${total}/200`;
  contadorSugestao.classList.toggle("alerta", total > 180);
}

sugestao.value = ler(
  "biblioteca:rascunho",
  ""
);

atualizarContadorSugestao();

sugestao.addEventListener("input", () => {
  atualizarContadorSugestao();
  guardarTexto(
    "biblioteca:rascunho",
    sugestao.value
  );
});

formSugestao.addEventListener("submit", evento => {
  evento.preventDefault();

  if (!sugestao.value.trim()) {
    estadoSugestao.textContent =
      "Escreve uma sugestão primeiro.";

    return;
  }

  estadoSugestao.textContent =
    "Sugestão enviada (demonstração).";

  sugestao.value = "";
  atualizarContadorSugestao();

  localStorage.removeItem(
    "biblioteca:rascunho"
  );
});


/* ================================
   EXERCÍCIO 10 — SINCRONIZAÇÃO
================================ */

window.addEventListener("storage", evento => {
  if (evento.key === "biblioteca:leitura") {
    leitura = ler(
      "biblioteca:leitura",
      []
    );

    mostrarLeitura();
  }

  if (evento.key === "tema") {
    aplicarTema();
  }

  if (evento.key === "biblioteca:pesquisas") {
    mostrarPesquisas();
  }

  if (evento.key === "biblioteca:leitor") {
    leitor = ler(
      "biblioteca:leitor",
      null
    );

    mostrarLeitor();
  }
});


/* ================================
   EXERCÍCIO 1 — VER DADOS
================================ */

const dadosGuardados =
  document.querySelector("#dados-guardados");

const estadoDados =
  document.querySelector("#estado-dados");

document.querySelector("#ver-dados")
  .addEventListener("click", () => {
    const dados = {};

    for (
      let i = 0;
      i < localStorage.length;
      i++
    ) {
      const chave = localStorage.key(i);

      dados[chave] =
        localStorage.getItem(chave);
    }

    dadosGuardados.textContent =
      JSON.stringify(dados, null, 2);
  });


/* ================================
   APAGAR DADOS
================================ */

document.querySelector("#apagar-dados")
  .addEventListener("click", () => {
    localStorage.clear();

    estadoDados.textContent =
      "Dados apagados!";

    dadosGuardados.textContent = "{}";

    leitura = [];
    mostrarLeitura();

    leitor = null;
    mostrarLeitor();

    aplicarTema();
    aplicarLetra("normal");
    mostrarPesquisas();
  });