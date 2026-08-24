/**
 * MODELO DE DADOS E GERADOR DE PASSOS
 * Lista Duplamente Encadeada Dinâmica & Lista Matricial com PND
 * Algoritmos e Estruturas de Dados - UNIJUÍ
 */

let nextNodeHex = 0x10A0;

function generateHeapAddress() {
  const addr = '0x' + nextNodeHex.toString(16).toUpperCase();
  nextNodeHex += 0x18; // Incrementa 24 bytes no Heap
  return addr;
}

// ==========================================================================
// 1. MODELO DINÂMICO (Heap, referências elop/eloa, Garbage Collector)
// ==========================================================================
class ListaDinamicaModel {
  constructor() {
    this.nodes = []; // Lista física de nós na Heap
    this.inicioId = null;
    this.fimId = null;
    this.nodeCounter = 1;
  }

  cloneState(extra = {}) {
    return {
      nodes: this.nodes.map(n => ({ ...n })),
      inicioId: this.inicioId,
      fimId: this.fimId,
      ...extra
    };
  }

  getNode(id) {
    return this.nodes.find(n => n.id === id) || null;
  }

  // Gera a lista de nós na ordem lógica do início ao fim
  getLogicalNodes() {
    const list = [];
    let cur = this.getNode(this.inicioId);
    const visited = new Set();
    while (cur && !visited.has(cur.id)) {
      visited.add(cur.id);
      list.push(cur);
      cur = this.getNode(cur.elopId);
    }
    return list;
  }

  // ------------------------------------------------------------------------
  // Operação: Inserir Ordenado
  // ------------------------------------------------------------------------
  stepInserirOrdenado(nome) {
    const steps = [];
    const novoId = `node_${this.nodeCounter++}`;
    const novoAddr = generateHeapAddress();
    const novoNo = {
      id: novoId,
      addr: novoAddr,
      nome: nome,
      elopId: null,
      eloaId: null,
      isNew: true
    };

    // Adiciona o novo nó na Heap (ainda não encadeado)
    this.nodes.push(novoNo);

    // Passo 1: Alocação do nó na Heap com new No(info)
    steps.push({
      state: this.cloneState({ atualId: null, novoId: novoId }),
      method: 'inserirOrdenado',
      codeLine: 16,
      action: 'Alocação na Memória Heap',
      description: `Executado: <code>No novoNo = new No(new Informacao("${nome}"))</code>. O nó foi alocado dinamicamente no endereço <strong>${novoAddr}</strong> com <code>elop = null</code> e <code>eloa = null</code>.`,
      term: `[ALOCAÇÃO] Novo nó criado na Heap: "${nome}" (${novoAddr})`
    });

    // Caso 1: Lista Vazia
    if (this.inicioId === null) {
      steps.push({
        state: this.cloneState({ atualId: null, novoId: novoId }),
        method: 'inserirOrdenado',
        codeLine: 19,
        action: 'Verificação de Lista Vazia',
        description: `Avaliando <code>estaVazia()</code>. Como <code>inicio == null</code>, este é o primeiro elemento da lista.`,
        term: `[CASO 1] Lista vazia detectada.`
      });

      this.inicioId = novoId;
      this.fimId = novoId;
      novoNo.isNew = false;

      steps.push({
        state: this.cloneState({ atualId: null, novoId: null }),
        method: 'inserirOrdenado',
        codeLine: 20,
        action: 'Definição das Extremidades',
        description: `Executado: <code>this.inicio = this.fim = novoNo</code>. As referências globais <strong>inicio</strong> e <strong>fim</strong> agora apontam para "${nome}".`,
        term: `[SUCESSO] "${nome}" inserido como único elemento. (inicio = fim = ${novoAddr})`,
        result: true
      });

      return steps;
    }

    // Varredura para encontrar posição ordenada
    let atual = this.getNode(this.inicioId);
    let duplicado = false;

    steps.push({
      state: this.cloneState({ atualId: atual.id, novoId: novoId }),
      method: 'inserirOrdenado',
      codeLine: 24,
      action: 'Início da Varredura',
      description: `Executado: <code>No atual = this.inicio</code>. Ponteiro <strong>atual</strong> posicionado no nó "${atual.nome}" para comparar a ordem alfabética.`,
      term: `[VARREDURA] Iniciando busca por ponto de inserção a partir de "${atual.nome}".`
    });

    while (atual !== null) {
      // Comparação de duplicidade
      if (atual.nome.toLowerCase() === nome.toLowerCase()) {
        duplicado = true;
        steps.push({
          state: this.cloneState({ atualId: atual.id, novoId: novoId }),
          method: 'inserirOrdenado',
          codeLine: 27,
          action: 'Detecção de Nome Duplicado',
          description: `O nome "${nome}" já existe na lista (no endereço <strong>${atual.addr}</strong>). A inserção será rejeitada.`,
          term: `[ERRO] Inserção cancelada: "${nome}" já existe na lista!`
        });

        // Remove o nó recém-alocado da Heap (GC recolhe)
        this.nodes = this.nodes.filter(n => n.id !== novoId);

        steps.push({
          state: this.cloneState({ atualId: null, novoId: null }),
          method: 'inserirOrdenado',
          codeLine: 28,
          action: 'Rejeição & Limpeza GC',
          description: `Retornando <code>false</code>. O nó alocado foi descartado sem vínculos na lista.`,
          term: `[RETORNO] inserirOrdenado("${nome}") = false`,
          result: false
        });

        return steps;
      }

      // Comparação alfabética
      const comp = atual.nome.localeCompare(nome);
      steps.push({
        state: this.cloneState({ atualId: atual.id, novoId: novoId }),
        method: 'inserirOrdenado',
        codeLine: 30,
        action: 'Comparação Alfabética',
        description: `Comparando: <code>"${atual.nome}".compareTo("${nome}")</code> = <strong>${comp}</strong>. ${comp > 0 ? `"${atual.nome}" vem depois de "${nome}". Ponto de inserção encontrado!` : `"${atual.nome}" vem antes de "${nome}". Avançando.`}`,
        term: `[COMPARAÇÃO] "${atual.nome}" vs "${nome}" -> ${comp > 0 ? 'Parar aqui' : 'Avançar'}`
      });

      if (comp > 0) {
        break; // Encontrou a posição antes de atual
      }

      const proxId = atual.elopId;
      atual = this.getNode(proxId);

      if (atual) {
        steps.push({
          state: this.cloneState({ atualId: atual.id, novoId: novoId }),
          method: 'inserirOrdenado',
          codeLine: 33,
          action: 'Avanço de Ponteiro',
          description: `Executado: <code>atual = atual.elop</code>. Ponteiro avançou para "${atual.nome}".`,
          term: `[AVANÇO] atual -> "${atual.nome}"`
        });
      } else {
        steps.push({
          state: this.cloneState({ atualId: null, novoId: novoId }),
          method: 'inserirOrdenado',
          codeLine: 33,
          action: 'Fim da Lista Alcançado',
          description: `Executado: <code>atual = atual.elop</code>. Chegou a <code>null</code>. O novo nó será inserido no fim da lista.`,
          term: `[AVANÇO] atual chegou ao fim (null).`
        });
      }
    }

    novoNo.isNew = false;

    // Caso 2: Inserção no Início
    if (atual && atual.id === this.inicioId) {
      const primeiro = this.getNode(this.inicioId);
      novoNo.elopId = primeiro.id;
      steps.push({
        state: this.cloneState({ atualId: atual.id, novoId: novoId }),
        method: 'inserirOrdenado',
        codeLine: 38,
        action: 'Ligando elop do Novo Nó',
        description: `Executado: <code>novoNo.elop = this.inicio</code>. O ponteiro <strong>elop</strong> de "${nome}" agora aponta para "${primeiro.nome}".`,
        term: `[CASO 2: INÍCIO] novoNo.elop -> "${primeiro.nome}"`
      });

      primeiro.eloaId = novoNo.id;
      steps.push({
        state: this.cloneState({ atualId: atual.id, novoId: novoId }),
        method: 'inserirOrdenado',
        codeLine: 39,
        action: 'Ligando eloa do Antigo Início',
        description: `Executado: <code>this.inicio.eloa = novoNo</code>. O ponteiro <strong>eloa</strong> de "${primeiro.nome}" agora aponta para "${nome}".`,
        term: `[CASO 2: INÍCIO] "${primeiro.nome}".eloa -> novoNo`
      });

      this.inicioId = novoNo.id;
      steps.push({
        state: this.cloneState({ atualId: null, novoId: null }),
        method: 'inserirOrdenado',
        codeLine: 40,
        action: 'Atualizando Referência Início',
        description: `Executado: <code>this.inicio = novoNo</code>. A referência global <strong>inicio</strong> agora aponta para "${nome}".`,
        term: `[SUCESSO] "${nome}" inserido no início da lista.`,
        result: true
      });
    }
    // Caso 3: Inserção no Fim
    else if (atual === null) {
      const ultimo = this.getNode(this.fimId);
      novoNo.eloaId = ultimo.id;
      steps.push({
        state: this.cloneState({ atualId: null, novoId: novoId }),
        method: 'inserirOrdenado',
        codeLine: 44,
        action: 'Ligando eloa do Novo Nó',
        description: `Executado: <code>novoNo.eloa = this.fim</code>. O ponteiro <strong>eloa</strong> de "${nome}" agora aponta para "${ultimo.nome}".`,
        term: `[CASO 3: FIM] novoNo.eloa -> "${ultimo.nome}"`
      });

      ultimo.elopId = novoNo.id;
      steps.push({
        state: this.cloneState({ atualId: null, novoId: novoId }),
        method: 'inserirOrdenado',
        codeLine: 45,
        action: 'Ligando elop do Antigo Fim',
        description: `Executado: <code>this.fim.elop = novoNo</code>. O ponteiro <strong>elop</strong> de "${ultimo.nome}" agora aponta para "${nome}".`,
        term: `[CASO 3: FIM] "${ultimo.nome}".elop -> novoNo`
      });

      this.fimId = novoNo.id;
      steps.push({
        state: this.cloneState({ atualId: null, novoId: null }),
        method: 'inserirOrdenado',
        codeLine: 46,
        action: 'Atualizando Referência Fim',
        description: `Executado: <code>this.fim = novoNo</code>. A referência global <strong>fim</strong> agora aponta para "${nome}".`,
        term: `[SUCESSO] "${nome}" inserido no fim da lista.`,
        result: true
      });
    }
    // Caso 4: Inserção no Meio
    else {
      const anterior = this.getNode(atual.eloaId);
      novoNo.elopId = atual.id;
      novoNo.eloaId = anterior.id;

      steps.push({
        state: this.cloneState({ atualId: atual.id, novoId: novoId }),
        method: 'inserirOrdenado',
        codeLine: 51,
        action: 'Configurando elop e eloa do Novo Nó',
        description: `Executado: <code>novoNo.elop = atual; novoNo.eloa = anterior</code>. O novo nó "${nome}" se posiciona entre "${anterior.nome}" e "${atual.nome}".`,
        term: `[CASO 4: MEIO] novoNo conectado entre "${anterior.nome}" e "${atual.nome}".`
      });

      anterior.elopId = novoNo.id;
      steps.push({
        state: this.cloneState({ atualId: atual.id, novoId: novoId }),
        method: 'inserirOrdenado',
        codeLine: 53,
        action: 'Religando elop do Nó Anterior',
        description: `Executado: <code>anterior.elop = novoNo</code>. O ponteiro <strong>elop</strong> de "${anterior.nome}" agora aponta para "${nome}".`,
        term: `[CASO 4: MEIO] "${anterior.nome}".elop -> novoNo`
      });

      atual.eloaId = novoNo.id;
      steps.push({
        state: this.cloneState({ atualId: null, novoId: null }),
        method: 'inserirOrdenado',
        codeLine: 54,
        action: 'Religando eloa do Nó Atual',
        description: `Executado: <code>atual.eloa = novoNo</code>. O ponteiro <strong>eloa</strong> de "${atual.nome}" agora aponta para "${nome}". Encadeamento bidirecional concluído!`,
        term: `[SUCESSO] "${nome}" inserido ordenadamente no meio da lista.`,
        result: true
      });
    }

    return steps;
  }

  // ------------------------------------------------------------------------
  // Operação: Remover Início
  // ------------------------------------------------------------------------
  stepRemoverInicio() {
    const steps = [];

    // Verificação de Lista Vazia
    if (this.inicioId === null) {
      steps.push({
        state: this.cloneState(),
        method: 'removerInicio',
        codeLine: 62,
        action: 'Lista Vazia',
        description: `Avaliando <code>estaVazia()</code>. A lista está vazia, retornando <code>null</code>.`,
        term: `[REMOVER INÍCIO] Lista vazia. Retorno: null`,
        result: null
      });
      return steps;
    }

    const removido = this.getNode(this.inicioId);
    const removidoNome = removido.nome;

    steps.push({
      state: this.cloneState({ atualId: removido.id }),
      method: 'removerInicio',
      codeLine: 66,
      action: 'Identificação do Primeiro Nó',
      description: `Executado: <code>Informacao removido = this.inicio.info</code>. Nó selecionado para remoção: "${removidoNome}" (<strong>${removido.addr}</strong>).`,
      term: `[REMOVER INÍCIO] Alvo: "${removidoNome}"`
    });

    const proximoId = removido.elopId;
    this.inicioId = proximoId;

    steps.push({
      state: this.cloneState({ atualId: proximoId }),
      method: 'removerInicio',
      codeLine: 67,
      action: 'Avançando Referência Início',
      description: `Executado: <code>this.inicio = this.inicio.elop</code>. O início da lista agora aponta para ${proximoId ? `"${this.getNode(proximoId).nome}"` : `<code>null</code>`}.`,
      term: `[REMOVER INÍCIO] inicio avançado para ${proximoId ? `"${this.getNode(proximoId).nome}"` : 'null'}`
    });

    if (this.inicioId !== null) {
      const novoInicio = this.getNode(this.inicioId);
      novoInicio.eloaId = null;

      steps.push({
        state: this.cloneState({ atualId: novoInicio.id }),
        method: 'removerInicio',
        codeLine: 70,
        action: 'Aterrando eloa do Novo Início',
        description: `Executado: <code>this.inicio.eloa = null</code>. O ponteiro <strong>eloa</strong> de "${novoInicio.nome}" foi aterrado (⏚ null).`,
        term: `[REMOVER INÍCIO] "${novoInicio.nome}".eloa -> null`
      });
    } else {
      this.fimId = null;
      steps.push({
        state: this.cloneState(),
        method: 'removerInicio',
        codeLine: 72,
        action: 'Lista Esvaziada',
        description: `Executado: <code>this.fim = null</code>. A lista ficou completamente vazia.`,
        term: `[REMOVER INÍCIO] Lista agora está vazia (inicio = fim = null).`
      });
    }

    // Marca o nó para ação do Garbage Collector
    removido.isGC = true;
    steps.push({
      state: this.cloneState(),
      method: 'removerInicio',
      codeLine: 75,
      action: 'Garbage Collector (GC) Atuando',
      description: `O nó "${removidoNome}" perdeu todas as referências ativas (strong references). O <strong>Garbage Collector da JVM</strong> identifica o objeto inalcançável e libera os ${removido.addr} bytes da Heap.`,
      term: `[GARBAGE COLLECTOR] Memória do nó "${removidoNome}" (${removido.addr}) liberada fisicamente na RAM.`
    });

    // Remove fisicamente da lista de nós
    this.nodes = this.nodes.filter(n => n.id !== removido.id);

    steps.push({
      state: this.cloneState(),
      method: 'removerInicio',
      codeLine: 75,
      action: 'Conclusão da Remoção',
      description: `Retornando <code>${removidoNome}</code> com sucesso.`,
      term: `[SUCESSO] removerInicio() = [${removidoNome}]`,
      result: removidoNome
    });

    return steps;
  }

  // ------------------------------------------------------------------------
  // Operação: Remover Fim
  // ------------------------------------------------------------------------
  stepRemoverFim() {
    const steps = [];

    if (this.inicioId === null) {
      steps.push({
        state: this.cloneState(),
        method: 'removerFim',
        codeLine: 80,
        action: 'Lista Vazia',
        description: `Avaliando <code>estaVazia()</code>. A lista está vazia, retornando <code>null</code>.`,
        term: `[REMOVER FIM] Lista vazia. Retorno: null`,
        result: null
      });
      return steps;
    }

    const removido = this.getNode(this.fimId);
    const removidoNome = removido.nome;

    steps.push({
      state: this.cloneState({ atualId: removido.id }),
      method: 'removerFim',
      codeLine: 84,
      action: 'Identificação do Último Nó',
      description: `Executado: <code>Informacao removido = this.fim.info</code>. Nó selecionado para remoção: "${removidoNome}" (<strong>${removido.addr}</strong>). Operação O(1) graças ao ponteiro direto <strong>fim</strong>.`,
      term: `[REMOVER FIM] Alvo: "${removidoNome}"`
    });

    const anteriorId = removido.eloaId;
    this.fimId = anteriorId;

    steps.push({
      state: this.cloneState({ atualId: anteriorId }),
      method: 'removerFim',
      codeLine: 85,
      action: 'Retrocedendo Referência Fim',
      description: `Executado: <code>this.fim = this.fim.eloa</code>. O fim da lista agora aponta para ${anteriorId ? `"${this.getNode(anteriorId).nome}"` : `<code>null</code>`}.`,
      term: `[REMOVER FIM] fim retrocedido para ${anteriorId ? `"${this.getNode(anteriorId).nome}"` : 'null'}`
    });

    if (this.fimId !== null) {
      const novoFim = this.getNode(this.fimId);
      novoFim.elopId = null;

      steps.push({
        state: this.cloneState({ atualId: novoFim.id }),
        method: 'removerFim',
        codeLine: 88,
        action: 'Aterrando elop do Novo Fim',
        description: `Executado: <code>this.fim.elop = null</code>. O ponteiro <strong>elop</strong> de "${novoFim.nome}" foi aterrado (⏚ null).`,
        term: `[REMOVER FIM] "${novoFim.nome}".elop -> null`
      });
    } else {
      this.inicioId = null;
      steps.push({
        state: this.cloneState(),
        method: 'removerFim',
        codeLine: 90,
        action: 'Lista Esvaziada',
        description: `Executado: <code>this.inicio = null</code>. A lista ficou completamente vazia.`,
        term: `[REMOVER FIM] Lista esvaziada (inicio = fim = null).`
      });
    }

    removido.isGC = true;
    steps.push({
      state: this.cloneState(),
      method: 'removerFim',
      codeLine: 93,
      action: 'Garbage Collector (GC) Atuando',
      description: `O nó "${removidoNome}" foi isolado na memória. O <strong>Garbage Collector</strong> coletará este objeto automaticamente na próxima passagem de limpeza.`,
      term: `[GARBAGE COLLECTOR] Nó "${removidoNome}" destruído da Heap.`
    });

    this.nodes = this.nodes.filter(n => n.id !== removido.id);

    steps.push({
      state: this.cloneState(),
      method: 'removerFim',
      codeLine: 93,
      action: 'Conclusão da Remoção',
      description: `Retornando <code>${removidoNome}</code> com sucesso.`,
      term: `[SUCESSO] removerFim() = [${removidoNome}]`,
      result: removidoNome
    });

    return steps;
  }

  // ------------------------------------------------------------------------
  // Operação: Remover por Nome
  // ------------------------------------------------------------------------
  stepRemoverPorNome(nome) {
    const steps = [];

    if (this.inicioId === null) {
      steps.push({
        state: this.cloneState(),
        method: 'remover',
        codeLine: 98,
        action: 'Lista Vazia',
        description: `Avaliando <code>estaVazia()</code>. Lista vazia, remoção de "${nome}" não realizada.`,
        term: `[REMOVER POR NOME] Lista vazia. Retorno: false`,
        result: false
      });
      return steps;
    }

    let atual = this.getNode(this.inicioId);

    steps.push({
      state: this.cloneState({ atualId: atual.id }),
      method: 'remover',
      codeLine: 102,
      action: 'Início da Busca para Remoção',
      description: `Executado: <code>No atual = this.inicio</code>. Buscando nó com nome "${nome}" a partir de "${atual.nome}".`,
      term: `[REMOVER POR NOME] Iniciando busca por "${nome}" a partir do início.`
    });

    while (atual !== null && atual.nome.toLowerCase() !== nome.toLowerCase()) {
      const comp = atual.nome.localeCompare(nome);
      if (comp > 0) {
        steps.push({
          state: this.cloneState({ atualId: atual.id }),
          method: 'remover',
          codeLine: 106,
          action: 'Parada Antecipada (Lista Ordenada)',
          description: `O nó atual "${atual.nome}" é alfabeticamente maior que "${nome}". Como a lista é ordenada, o elemento certamente não existe. Retornando <code>false</code>.`,
          term: `[PARADA ANTECIPADA] "${atual.nome}" > "${nome}". Elemento não encontrado.`
        });
        return steps;
      }

      const proxId = atual.elopId;
      atual = this.getNode(proxId);

      if (atual) {
        steps.push({
          state: this.cloneState({ atualId: atual.id }),
          method: 'remover',
          codeLine: 108,
          action: 'Avanço de Ponteiro',
          description: `Avançando para <code>atual = atual.elop</code> ("${atual.nome}").`,
          term: `[AVANÇO] atual -> "${atual.nome}"`
        });
      }
    }

    if (atual === null) {
      steps.push({
        state: this.cloneState({ atualId: null }),
        method: 'remover',
        codeLine: 112,
        action: 'Não Encontrado',
        description: `Chegou ao final da lista sem encontrar "${nome}". Retornando <code>false</code>.`,
        term: `[REMOVER POR NOME] "${nome}" não encontrado na lista. Retorno: false`,
        result: false
      });
      return steps;
    }

    // Nó Encontrado!
    steps.push({
      state: this.cloneState({ atualId: atual.id }),
      method: 'remover',
      codeLine: 110,
      action: 'Nó Encontrado para Remoção',
      description: `Nó "${atual.nome}" localizado no endereço <strong>${atual.addr}</strong>. Preparando desconexão dos elos.`,
      term: `[LOCALIZADO] "${atual.nome}" (${atual.addr}) pronto para remoção.`
    });

    if (atual.id === this.inicioId) {
      // Delega para lógica de remover início
      return this.stepRemoverInicio();
    } else if (atual.id === this.fimId) {
      // Delega para lógica de remover fim
      return this.stepRemoverFim();
    } else {
      // Remoção no Meio
      const anterior = this.getNode(atual.eloaId);
      const proximo = this.getNode(atual.elopId);

      anterior.elopId = proximo.id;
      steps.push({
        state: this.cloneState({ atualId: atual.id }),
        method: 'remover',
        codeLine: 124,
        action: 'Desvio do Elo Próximo (elop)',
        description: `Executado: <code>anterior.elop = proximo</code>. O elop de "${anterior.nome}" agora pula "${atual.nome}" e aponta direto para "${proximo.nome}".`,
        term: `[REMOÇÃO MEIO] "${anterior.nome}".elop -> "${proximo.nome}"`
      });

      proximo.eloaId = anterior.id;
      steps.push({
        state: this.cloneState({ atualId: atual.id }),
        method: 'remover',
        codeLine: 125,
        action: 'Desvio do Elo Anterior (eloa)',
        description: `Executado: <code>proximo.eloa = anterior</code>. O eloa de "${proximo.nome}" agora aponta direto para "${anterior.nome}". O nó "${atual.nome}" ficou completamente desconectado!`,
        term: `[REMOÇÃO MEIO] "${proximo.nome}".eloa -> "${anterior.nome}"`
      });

      atual.isGC = true;
      steps.push({
        state: this.cloneState(),
        method: 'remover',
        codeLine: 128,
        action: 'Garbage Collector Atuando',
        description: `O nó "${atual.nome}" está órfão de referências vivas na Heap. A JVM libera automaticamente o espaço de memória ocupado por ele.`,
        term: `[GARBAGE COLLECTOR] Memória do nó "${atual.nome}" desalocada fisicamente.`
      });

      this.nodes = this.nodes.filter(n => n.id !== atual.id);

      steps.push({
        state: this.cloneState(),
        method: 'remover',
        codeLine: 128,
        action: 'Sucesso',
        description: `Remoção do nó "${nome}" concluída com sucesso. Retornando <code>true</code>.`,
        term: `[SUCESSO] remover("${nome}") = true`,
        result: true
      });
    }

    return steps;
  }

  // ------------------------------------------------------------------------
  // Operação: Buscar
  // ------------------------------------------------------------------------
  stepBuscar(nome) {
    const steps = [];

    if (this.inicioId === null) {
      steps.push({
        state: this.cloneState(),
        method: 'buscar',
        codeLine: 133,
        action: 'Lista Vazia',
        description: `Avaliando <code>estaVazia()</code>. A lista está vazia, busca retorna <code>null</code>.`,
        term: `[BUSCA] Lista vazia. Retorno: null`,
        result: null
      });
      return steps;
    }

    let atual = this.getNode(this.inicioId);

    steps.push({
      state: this.cloneState({ atualId: atual.id }),
      method: 'buscar',
      codeLine: 137,
      action: 'Início da Busca',
      description: `Executado: <code>No atual = this.inicio</code>. Iniciando verificação sequencial no nó "${atual.nome}".`,
      term: `[BUSCA] Verificando nós para localizar "${nome}".`
    });

    while (atual !== null) {
      if (atual.nome.toLowerCase() === nome.toLowerCase()) {
        steps.push({
          state: this.cloneState({ atualId: atual.id, matchedId: atual.id }),
          method: 'buscar',
          codeLine: 140,
          action: 'Elemento Encontrado!',
          description: `Elemento "${atual.nome}" encontrado no nó com endereço <strong>${atual.addr}</strong>! Retornando objeto Informacao.`,
          term: `[BUSCA SUCESSO] "${nome}" ENCONTRADO em ${atual.addr}.`,
          result: atual.nome
        });
        return steps;
      }

      const comp = atual.nome.localeCompare(nome);
      if (comp > 0) {
        steps.push({
          state: this.cloneState({ atualId: atual.id }),
          method: 'buscar',
          codeLine: 143,
          action: 'Otimização: Parada Antecipada',
          description: `Como a lista é ordenada alfabeticamente e "${atual.nome}" > "${nome}", o elemento procurado não existe na lista. Retornando <code>null</code>.`,
          term: `[BUSCA OTIMIZADA] "${atual.nome}" > "${nome}". Busca encerrada sem varrer o restante. Retorno: null`,
          result: null
        });
        return steps;
      }

      const proxId = atual.elopId;
      atual = this.getNode(proxId);

      if (atual) {
        steps.push({
          state: this.cloneState({ atualId: atual.id }),
          method: 'buscar',
          codeLine: 145,
          action: 'Avanço por elop',
          description: `Executado: <code>atual = atual.elop</code>. Avançando para "${atual.nome}".`,
          term: `[BUSCA] Avançando para "${atual.nome}"...`
        });
      }
    }

    steps.push({
      state: this.cloneState({ atualId: null }),
      method: 'buscar',
      codeLine: 148,
      action: 'Não Encontrado',
      description: `Fim da lista alcançado sem correspondência. Retornando <code>null</code>.`,
      term: `[BUSCA] "${nome}" não encontrado na lista. Retorno: null`,
      result: null
    });

    return steps;
  }

  // ------------------------------------------------------------------------
  // Operação: Exibir (Início -> Fim)
  // ------------------------------------------------------------------------
  stepExibir() {
    const steps = [];

    if (this.inicioId === null) {
      steps.push({
        state: this.cloneState(),
        method: 'exibir',
        codeLine: 154,
        action: 'Lista Vazia',
        description: `A lista está vazia. Saída no console: "Lista vazia."`,
        term: `Lista vazia.`
      });
      return steps;
    }

    let atual = this.getNode(this.inicioId);
    let acumulado = [];

    steps.push({
      state: this.cloneState({ atualId: atual.id, highlightElop: true }),
      method: 'exibir',
      codeLine: 158,
      action: 'Início da Exibição Direta',
      description: `Executado: <code>No atual = this.inicio</code>. Percorrendo referências <strong>elop</strong> (próximo) do início ao fim.`,
      term: `--- EXIBIÇÃO DIRETA (elop) ---`
    });

    while (atual !== null) {
      acumulado.push(atual.nome);
      steps.push({
        state: this.cloneState({ atualId: atual.id, highlightElop: true }),
        method: 'exibir',
        codeLine: 161,
        action: 'Lendo Nó Atual',
        description: `Visitando nó <strong>"${atual.nome}"</strong>. Sequência até agora: <code>${acumulado.join(' -> ')}</code>`,
        term: `Nó lido: "${atual.nome}"`
      });

      const proxId = atual.elopId;
      atual = this.getNode(proxId);
    }

    const resultadoFinal = acumulado.join(' -> ');
    steps.push({
      state: this.cloneState({ highlightElop: false }),
      method: 'exibir',
      codeLine: 167,
      action: 'Exibição Concluída',
      description: `Impressão final no console: <code>${resultadoFinal}</code>`,
      term: `Saída: ${resultadoFinal}`
    });

    return steps;
  }

  // ------------------------------------------------------------------------
  // Operação: Exibir Inverso (Fim -> Início)
  // ------------------------------------------------------------------------
  stepExibirInverso() {
    const steps = [];

    if (this.inicioId === null) {
      steps.push({
        state: this.cloneState(),
        method: 'exibirInverso',
        codeLine: 173,
        action: 'Lista Vazia',
        description: `A lista está vazia. Saída no console: "Lista vazia."`,
        term: `Lista vazia.`
      });
      return steps;
    }

    let atual = this.getNode(this.fimId);
    let acumulado = [];

    steps.push({
      state: this.cloneState({ atualId: atual.id, highlightEloa: true }),
      method: 'exibirInverso',
      codeLine: 177,
      action: 'Início da Exibição Reversa',
      description: `Executado: <code>No atual = this.fim</code>. Percorrendo referências <strong>eloa</strong> (anterior) do fim para o início para validar a integridade bidirecional.`,
      term: `--- EXIBIÇÃO INVERSA (eloa) ---`
    });

    while (atual !== null) {
      acumulado.push(atual.nome);
      steps.push({
        state: this.cloneState({ atualId: atual.id, highlightEloa: true }),
        method: 'exibirInverso',
        codeLine: 180,
        action: 'Lendo Nó Anterior',
        description: `Visitando nó <strong>"${atual.nome}"</strong> por <code>eloa</code>. Sequência reversa: <code>${acumulado.join(' <- ')}</code>`,
        term: `Nó lido (reverso): "${atual.nome}"`
      });

      const antId = atual.eloaId;
      atual = this.getNode(antId);
    }

    const resultadoFinal = acumulado.join(' <- ');
    steps.push({
      state: this.cloneState({ highlightEloa: false }),
      method: 'exibirInverso',
      codeLine: 186,
      action: 'Exibição Inversa Concluída',
      description: `Impressão final no console: <code>${resultadoFinal}</code>`,
      term: `Saída Reversa: ${resultadoFinal}`
    });

    return steps;
  }
}

// ==========================================================================
// 2. MODELO MATRICIAL (Vetor Fixo de Nós + Pilha de Nós Disponíveis - PND)
// ==========================================================================
class ListaMatricialModel {
  constructor(capacidade = 6) {
    this.capacidade = capacidade;
    this.matriz = [];
    this.topoPND = 0;
    this.inicioLista = -1;
    this.fimLista = -1;
    this.inicializar();
  }

  inicializar() {
    this.matriz = [];
    for (let i = 0; i < this.capacidade; i++) {
      this.matriz.push({
        indice: i,
        info: null,
        eloa: -1,
        elop: i < this.capacidade - 1 ? i + 1 : -1, // Encadeia PND inicialmente
        isOccupied: false
      });
    }
    this.topoPND = 0;
    this.inicioLista = -1;
    this.fimLista = -1;
  }

  inserir(nome) {
    if (this.topoPND === -1) {
      return {
        sucesso: false,
        msg: `ESTOURO DE CAPACIDADE! A Pilha de Nós Disponíveis (PND) está esgotada (${this.capacidade}/${this.capacidade} slots ocupados). Na abordagem matricial com vetor fixo, não é possível alocar mais memória.`
      };
    }

    // Desempilha da PND
    const slotIndex = this.topoPND;
    const proximoLivre = this.matriz[slotIndex].elop;
    this.topoPND = proximoLivre;

    const cell = this.matriz[slotIndex];
    cell.info = nome;
    cell.isOccupied = true;
    cell.eloa = -1;
    cell.elop = -1;

    // Se lista vazia
    if (this.inicioLista === -1) {
      this.inicioLista = slotIndex;
      this.fimLista = slotIndex;
      return {
        sucesso: true,
        slotIndex,
        msg: `"${nome}" inserido no slot [${slotIndex}] do vetor. PND atualizada para apontar para o próximo índice livre (${this.topoPND}).`
      };
    }

    // Inserção simples no fim para demonstração
    const anteriorFim = this.fimLista;
    cell.eloa = anteriorFim;
    this.matriz[anteriorFim].elop = slotIndex;
    this.fimLista = slotIndex;

    return {
      sucesso: true,
      slotIndex,
      msg: `"${nome}" inserido no slot [${slotIndex}]. Ligação: slot [${anteriorFim}].elop = ${slotIndex} e slot [${slotIndex}].eloa = ${anteriorFim}.`
    };
  }

  remover(nome) {
    let cur = this.inicioLista;
    while (cur !== -1 && this.matriz[cur].info !== nome) {
      cur = this.matriz[cur].elop;
    }

    if (cur === -1) {
      return { sucesso: false, msg: `"${nome}" não encontrado na matriz.` };
    }

    const cell = this.matriz[cur];
    const ant = cell.eloa;
    const prox = cell.elop;

    if (ant !== -1) {
      this.matriz[ant].elop = prox;
    } else {
      this.inicioLista = prox;
    }

    if (prox !== -1) {
      this.matriz[prox].eloa = ant;
    } else {
      this.fimLista = ant;
    }

    // Devolve para a PND (Empilha na PND)
    cell.info = null;
    cell.isOccupied = false;
    cell.eloa = -1;
    cell.elop = this.topoPND;
    this.topoPND = cur;

    return {
      sucesso: true,
      slotIndex: cur,
      msg: `Slot [${cur}] liberado logicamente e devolvido ao topo da PND (topoPND = ${cur}). A memória do vetor segue alocada fisicamente na RAM.`
    };
  }
}

// Exportações globais para os scripts da página
window.ListaDinamicaModel = ListaDinamicaModel;
window.ListaMatricialModel = ListaMatricialModel;
