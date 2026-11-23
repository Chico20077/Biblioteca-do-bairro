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
   EX. 09 — MENU ACESSÍVEL (aria-expanded + Escape)
================================ */

const btnMenu = document.querySelector("#btn-menu");
const menuPrincipal = document.querySelector("#menu-principal");

if (btnMenu && menuPrincipal) {
  btnMenu.addEventListener("click", () => {
    const aberto = menuPrincipal.classList.toggle("aberto");
    btnMenu.setAttribute("aria-expanded", String(aberto));
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && menuPrincipal.classList.contains("aberto")) {
      menuPrincipal.classList.remove("aberto");
      btnMenu.setAttribute("aria-expanded", "false");
      btnMenu.focus();
    }
  });
}


/* ================================
   EX. 05 & EX. 06 — LIVRO EM DESTAQUE E FICHA (data-*)
================================ */

const destaque = document.querySelector("#destaque");

if (destaque) {
  const idLivro = Number(destaque.dataset.id);
  const estadoLivro = destaque.dataset.estado;
  const devolucao = destaque.dataset.devolucao;
  const autorSlug = destaque.dataset.autor || "pessoa";

  const tituloDestaque = destaque.querySelector(".titulo-destaque");
  const capaDestaque = destaque.querySelector(".capa");
  const linkMais = destaque.querySelector(".mais");
  const estadoTexto = destaque.querySelector(".estado-livro");
  const btnReservar = destaque.querySelector(".reservar");

  if (tituloDestaque) {
    tituloDestaque.textContent = "Mensagem";
  }

  if (capaDestaque) {
    capaDestaque.src = "img/mensagem.jpg";
    capaDestaque.alt = "Capa de Mensagem, de Fernando Pessoa";
  }

  if (linkMais) {
    linkMais.href = `/catalogo?autor=${encodeURIComponent(autorSlug)}`;
  }

  if (estadoTexto) {
    estadoTexto.textContent = `Ficha #${idLivro} — Estado: ${estadoLivro}`;
  }

  if (btnReservar) {
    if (estadoLivro === "emprestado") {
      const partesData = (devolucao || "").split("-");
      const dataFormatada = partesData.length === 3
        ? `${partesData[2]}/${partesData[1]}`
        : devolucao;

      btnReservar.textContent = dataFormatada
        ? `Disponível a ${dataFormatada}`
        : "Indisponível";
      btnReservar.disabled = true;
    } else {
      btnReservar.addEventListener("click", () => {
        btnReservar.textContent = "Reservado";
        btnReservar.disabled = true;
        if (estadoTexto) {
          estadoTexto.textContent = `Ficha #${idLivro} — Estado: reservado`;
        }
      });
    }
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
   EXERCÍCIO 7 — TEMA
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
   CATÁLOGO (Ex. 11 <template> + Ex. 15 Pesquisa em direto)
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
  if (!tplLivro) return;

  const fragmento = document.createDocumentFragment();

  livros.forEach(livro => {
    const clone = tplLivro.content.cloneNode(true);
    const li = clone.querySelector(".item-catalogo");
    const elTitulo = clone.querySelector(".titulo-livro");
    const elAutor = clone.querySelector(".autor-livro");
    const elBadge = clone.querySelector(".badge-emprestado");

    elTitulo.textContent = livro.titulo;
    elAutor.textContent = ` — ${livro.autor}`;
    li.dataset.titulo = livro.titulo.toLowerCase();
    li.dataset.autor = livro.autor.toLowerCase();
    li.dataset.disponivel = String(livro.disponivel);

    if (!livro.disponivel) {
      li.classList.add("indisponivel");
      elBadge.hidden = false;
    }

    fragmento.append(clone);
  });

  listaLivros.replaceChildren(fragmento);
}

function pesquisar() {
  const termo =
    pesquisa.value.toLowerCase().trim();

  const itens = [...listaLivros.querySelectorAll(".item-catalogo")];
  let visiveis = 0;

  itens.forEach(li => {
    const correspondeTermo =
      !termo ||
      li.dataset.titulo.includes(termo) ||
      li.dataset.autor.includes(termo);

    const correspondeEstado =
      !soDisponiveis || li.dataset.disponivel === "true";

    const visivel = correspondeTermo && correspondeEstado;
    li.hidden = !visivel;

    if (visivel) {
      visiveis++;
    }
  });

  resumo.textContent =
    `${visiveis} livros encontrados`;
}

construirCatalogo();

pesquisa.addEventListener("input", pesquisar);

// Ex. 07 / Ex. 15: Escape limpa a pesquisa no próprio campo
pesquisa.addEventListener("keydown", evento => {
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
   EX. 12 & EX. 13 — LISTA DE LEITURA (Delegação + data-acao)
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

function atualizarLeitura() {
  guardar(
    "biblioteca:leitura",
    leitura
  );

  mostrarLeitura();
}

function mostrarLeitura() {
  const fragmento = document.createDocumentFragment();

  leitura.forEach((livro, indice) => {
    const li = document.createElement("li");
    li.className = "item-leitura";
    li.dataset.indice = String(indice);

    const texto = document.createElement("span");
    texto.className = "titulo-leitura";
    texto.textContent = livro.titulo;

    if (livro.lido) {
      texto.classList.add("lido");
    }

    const acoes = document.createElement("div");

    const subir = document.createElement("button");
    subir.type = "button";
    subir.textContent = "↑";
    subir.dataset.acao = "subir";
    subir.setAttribute("aria-label", `Subir ${livro.titulo}`);

    const descer = document.createElement("button");
    descer.type = "button";
    descer.textContent = "↓";
    descer.dataset.acao = "descer";
    descer.setAttribute("aria-label", `Descer ${livro.titulo}`);

    const apagar = document.createElement("button");
    apagar.type = "button";
    apagar.textContent = "Remover";
    apagar.dataset.acao = "remover";

    acoes.append(subir, descer, apagar);
    li.append(texto, acoes);
    fragmento.append(li);
  });

  listaLeitura.replaceChildren(fragmento);

  estadoLeitura.textContent =
    `${leitura.length} livros na lista.`;
}

// Um único ouvinte na lista para marcar como lido, subir, descer e remover
listaLeitura.addEventListener("click", evento => {
  const li = evento.target.closest(".item-leitura");
  if (!li) return;

  const indice = Number(li.dataset.indice);
  if (Number.isNaN(indice) || !leitura[indice]) return;

  const botao = evento.target.closest("button[data-acao]");

  if (!botao) {
    leitura[indice].lido = !leitura[indice].lido;
    atualizarLeitura();
    return;
  }

  const acao = botao.dataset.acao;

  if (acao === "remover") {
    leitura.splice(indice, 1);
    atualizarLeitura();
  } else if (acao === "subir" && indice > 0) {
    const atual = leitura[indice];
    leitura[indice] = leitura[indice - 1];
    leitura[indice - 1] = atual;
    atualizarLeitura();
  } else if (acao === "descer" && indice < leitura.length - 1) {
    const atual = leitura[indice];
    leitura[indice] = leitura[indice + 1];
    leitura[indice + 1] = atual;
    atualizarLeitura();
  }
});

formLeitura.addEventListener("submit", evento => {
  evento.preventDefault();

  const campoLivro = document.querySelector("#novo-livro");
  const titulo = campoLivro.value.trim();

  if (!titulo) return;

  leitura.push({
    titulo,
    lido: false
  });

  campoLivro.value = "";
  atualizarLeitura();
});

mostrarLeitura();


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
   RASCUNHO DE SUGESTÃO + EX. 07 (Contador de caracteres)
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
  if (!contadorSugestao) return;
  const n = sugestao.value.length;
  contadorSugestao.textContent = `${n}/200`;
  contadorSugestao.classList.toggle("alerta-limite", n > 180);
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
   EX. 14 — INSCRIÇÃO NO CLUBE (FormData + setCustomValidity)
================================ */

const formClube = document.querySelector("#form-clube");
const campoNomeClube = document.querySelector("#nome-clube");
const resumoClube = document.querySelector("#resumo-clube");

if (formClube && campoNomeClube && resumoClube) {
  campoNomeClube.addEventListener("input", evento => {
    const partes = evento.target.value.trim().split(/\s+/);
    const mensagem = partes.length < 2
      ? "Escreve nome e apelido."
      : "";
    evento.target.setCustomValidity(mensagem);
  });

  formClube.addEventListener("submit", evento => {
    evento.preventDefault();

    const partes = campoNomeClube.value.trim().split(/\s+/);
    if (partes.length < 2) {
      campoNomeClube.setCustomValidity("Escreve nome e apelido.");
      campoNomeClube.reportValidity();
      return;
    }

    const dados = new FormData(formClube);
    const primeiroNome = String(dados.get("nome") || "").trim().split(/\s+/)[0];
    const clube = String(dados.get("clube") || "");

    resumoClube.textContent =
      `Obrigado, ${primeiroNome}! Inscrição no clube ${clube}.`;

    formClube.reset();
    campoNomeClube.setCustomValidity("");
    campoNomeClube.focus();
  });
}


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