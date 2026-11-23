
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
   CATÁLOGO
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

const resumo =
  document.querySelector("#resumo");

const filtro =
  document.querySelector("#so-disponiveis");

let soDisponiveis = false;

function mostrarLivros(resultado) {
  listaLivros.innerHTML = "";

  resultado.forEach(livro => {
    const li = document.createElement("li");

    li.textContent =
      `${livro.titulo} — ${livro.autor}`;

    if (!livro.disponivel) {
      li.textContent += " — Emprestado";
      li.classList.add("indisponivel");
    }

    listaLivros.appendChild(li);
  });

  resumo.textContent =
    `${resultado.length} livros encontrados.`;

  if (resultado.length === 0) {
    listaLivros.textContent =
      "Não foram encontrados livros.";
  }
}

function pesquisar() {
  const termo =
    pesquisa.value.toLowerCase().trim();

  let resultado = livros.filter(livro =>
    livro.titulo.toLowerCase().includes(termo)
  );

  if (soDisponiveis) {
    resultado = resultado.filter(
      livro => livro.disponivel
    );
  }

  mostrarLivros(resultado);
}

pesquisa.addEventListener("input", pesquisar);

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
   EXERCÍCIO 8 — LISTA DE LEITURA
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
  listaLeitura.innerHTML = "";

  leitura.forEach((livro, indice) => {
    const li = document.createElement("li");

    li.className = "item-leitura";

    const texto = document.createElement("span");

    texto.textContent = livro.titulo;

    if (livro.lido) {
      texto.classList.add("lido");
    }

    const marcar = document.createElement("button");

    marcar.textContent = livro.lido
      ? "Marcar por ler"
      : "Marcar lido";

    marcar.addEventListener("click", () => {
      leitura[indice].lido =
        !leitura[indice].lido;

      atualizarLeitura();
    });

    const apagar = document.createElement("button");

    apagar.textContent = "Remover";

    apagar.addEventListener("click", () => {
      leitura.splice(indice, 1);

      atualizarLeitura();
    });

    li.append(texto, marcar, apagar);

    listaLeitura.appendChild(li);
  });

  estadoLeitura.textContent =
    `${leitura.length} livros na lista.`;
}

formLeitura.addEventListener("submit", evento => {
  evento.preventDefault();

  const titulo =
    document.querySelector("#novo-livro")
      .value.trim();

  if (!titulo) return;

  leitura.push({
    titulo: titulo,
    lido: false
  });

  document.querySelector("#novo-livro")
    .value = "";

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
   RASCUNHO DE SUGESTÃO
================================ */

const sugestao =
  document.querySelector("#sugestao");

const formSugestao =
  document.querySelector("#form-sugestao");

const estadoSugestao =
  document.querySelector("#estado-sugestao");

sugestao.value = ler(
  "biblioteca:rascunho",
  ""
);

sugestao.addEventListener("input", () => {
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
