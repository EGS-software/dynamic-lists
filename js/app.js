/**
 * CONTROLADOR PRINCIPAL DA APLICAÇÃO (APP ORCHESTRATOR)
 * Algoritmos e Estruturas de Dados - UNIJUÍ
 */

// Código Java de ListaDinamica.java para o visualizador sincronizado
const JAVA_SOURCE_CODE = {
  inserirOrdenado: [
    { line: 15, text: 'public boolean inserirOrdenado(Informacao info) {' },
    { line: 16, text: '    No novoNo = new No(info);' },
    { line: 17, text: '' },
    { line: 18, text: '    // Caso 1: Lista vazia' },
    { line: 19, text: '    if (estaVazia()) {' },
    { line: 20, text: '        this.inicio = this.fim = novoNo;' },
    { line: 21, text: '        return true;' },
    { line: 22, text: '    }' },
    { line: 23, text: '' },
    { line: 24, text: '    No atual = this.inicio;' },
    { line: 25, text: '    while (atual != null) {' },
    { line: 26, text: '        // Compara duplicidade e ordem alfabética' },
    { line: 27, text: '        if (atual.info.getNome().equals(info.getNome())) {' },
    { line: 28, text: '            return false; // Rejeita duplicatas' },
    { line: 29, text: '        }' },
    { line: 30, text: '        if (atual.info.getNome().compareTo(info.getNome()) > 0) {' },
    { line: 31, text: '            break;' },
    { line: 32, text: '        }' },
    { line: 33, text: '        atual = atual.elop;' },
    { line: 34, text: '    }' },
    { line: 35, text: '' },
    { line: 36, text: '    // Caso 2: Inserção no Início' },
    { line: 37, text: '    if (atual == this.inicio) {' },
    { line: 38, text: '        novoNo.elop = this.inicio;' },
    { line: 39, text: '        this.inicio.eloa = novoNo;' },
    { line: 40, text: '        this.inicio = novoNo;' },
    { line: 41, text: '    }' },
    { line: 42, text: '    // Caso 3: Inserção no Fim' },
    { line: 43, text: '    else if (atual == null) {' },
    { line: 44, text: '        novoNo.eloa = this.fim;' },
    { line: 45, text: '        this.fim.elop = novoNo;' },
    { line: 46, text: '        this.fim = novoNo;' },
    { line: 47, text: '    }' },
    { line: 48, text: '    // Caso 4: Inserção no Meio' },
    { line: 49, text: '    else {' },
    { line: 50, text: '        No anterior = atual.eloa;' },
    { line: 51, text: '        novoNo.elop = atual;' },
    { line: 52, text: '        novoNo.eloa = anterior;' },
    { line: 53, text: '        anterior.elop = novoNo;' },
    { line: 54, text: '        atual.eloa = novoNo;' },
    { line: 55, text: '    }' },
    { line: 56, text: '    return true;' },
    { line: 57, text: '}' }
  ],
  removerInicio: [
    { line: 61, text: 'public Informacao removerInicio() {' },
    { line: 62, text: '    if (estaVazia()) return null;' },
    { line: 63, text: '' },
    { line: 64, text: '    Informacao removido = this.inicio.info;' },
    { line: 65, text: '    this.inicio = this.inicio.elop;' },
    { line: 66, text: '' },
    { line: 67, text: '    if (this.inicio != null) {' },
    { line: 68, text: '        this.inicio.eloa = null; // Aterra eloa' },
    { line: 69, text: '    } else {' },
    { line: 70, text: '        this.fim = null; // Lista ficou vazia' },
    { line: 71, text: '    }' },
    { line: 72, text: '    return removido;' },
    { line: 73, text: '}' }
  ],
  removerFim: [
    { line: 79, text: 'public Informacao removerFim() {' },
    { line: 80, text: '    if (estaVazia()) return null;' },
    { line: 81, text: '' },
    { line: 82, text: '    Informacao removido = this.fim.info;' },
    { line: 83, text: '    this.fim = this.fim.eloa;' },
    { line: 84, text: '' },
    { line: 85, text: '    if (this.fim != null) {' },
    { line: 86, text: '        this.fim.elop = null; // Aterra elop' },
    { line: 87, text: '    } else {' },
    { line: 88, text: '        this.inicio = null; // Lista ficou vazia' },
    { line: 89, text: '    }' },
    { line: 90, text: '    return removido;' },
    { line: 91, text: '}' }
  ],
  remover: [
    { line: 97, text: 'public boolean remover(Informacao info) {' },
    { line: 98, text: '    if (estaVazia()) return false;' },
    { line: 99, text: '' },
    { line: 100, text: '    No atual = this.inicio;' },
    { line: 101, text: '    while (atual != null && !atual.info.getNome().equals(info.getNome())) {' },
    { line: 102, text: '        if (atual.info.getNome().compareTo(info.getNome()) > 0) return false;' },
    { line: 103, text: '        atual = atual.elop;' },
    { line: 104, text: '    }' },
    { line: 105, text: '    if (atual == null) return false;' },
    { line: 106, text: '' },
    { line: 107, text: '    if (atual == this.inicio) removerInicio();' },
    { line: 108, text: '    else if (atual == this.fim) removerFim();' },
    { line: 109, text: '    else {' },
    { line: 110, text: '        No anterior = atual.eloa;' },
    { line: 111, text: '        No proximo = atual.elop;' },
    { line: 112, text: '        anterior.elop = proximo;' },
    { line: 113, text: '        proximo.eloa = anterior;' },
    { line: 114, text: '    }' },
    { line: 115, text: '    return true;' },
    { line: 116, text: '}' }
  ],
  buscar: [
    { line: 132, text: 'public Informacao buscar(Informacao info) {' },
    { line: 133, text: '    if (estaVazia()) return null;' },
    { line: 134, text: '' },
    { line: 135, text: '    No atual = this.inicio;' },
    { line: 136, text: '    while (atual != null) {' },
    { line: 137, text: '        if (atual.info.getNome().equals(info.getNome())) return atual.info;' },
    { line: 138, text: '        if (atual.info.getNome().compareTo(info.getNome()) > 0) break;' },
    { line: 139, text: '        atual = atual.elop;' },
    { line: 140, text: '    }' },
    { line: 141, text: '    return null;' },
    { line: 142, text: '}' }
  ],
  exibir: [
    { line: 152, text: 'public void exibir() {' },
    { line: 153, text: '    if (estaVazia()) { System.out.println("Lista vazia."); return; }' },
    { line: 154, text: '    No atual = this.inicio;' },
    { line: 155, text: '    StringBuilder sb = new StringBuilder();' },
    { line: 156, text: '    while (atual != null) {' },
    { line: 157, text: '        sb.append(atual.info.getNome());' },
    { line: 158, text: '        if (atual.elop != null) sb.append(" -> ");' },
    { line: 159, text: '        atual = atual.elop;' },
    { line: 160, text: '    }' },
    { line: 161, text: '    System.out.println(sb.toString());' },
    { line: 162, text: '}' }
  ],
  exibirInverso: [
    { line: 171, text: 'public void exibirInverso() {' },
    { line: 172, text: '    if (estaVazia()) { System.out.println("Lista vazia."); return; }' },
    { line: 173, text: '    No atual = this.fim;' },
    { line: 174, text: '    StringBuilder sb = new StringBuilder();' },
    { line: 175, text: '    while (atual != null) {' },
    { line: 176, text: '        sb.append(atual.info.getNome());' },
    { line: 177, text: '        if (atual.eloa != null) sb.append(" <- ");' },
    { line: 178, text: '        atual = atual.eloa;' },
    { line: 179, text: '    }' },
    { line: 180, text: '    System.out.println(sb.toString());' },
    { line: 181, text: '}' }
  ]
};

class AppController {
  constructor() {
    this.model = new ListaDinamicaModel();
    this.visualizer = new DynamicListVisualizer('canvasWrapper', 'nodesContainer', 'linksSvgLayer');
    this.matrixVisualizer = new MatrixVisualizer('matrixTableContainer', 'pndStackContainer', 'matrixStatsContainer');

    // Stepper State
    this.stepsQueue = [];
    this.currentStepIdx = -1;
    this.isPlaying = false;
    this.playTimer = null;
    this.speedMs = 1200;

    this.initUI();
    this.renderInitial();
  }

  initUI() {
    // 1. Navigation Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.view-mode-container').forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        const targetContainer = document.getElementById(targetId);
        if (targetContainer) targetContainer.classList.add('active');

        if (targetId === 'matrixViewContainer') {
          this.matrixVisualizer.render();
        }
      });
    });

    // 2. Operações Dinâmicas
    const inputInsert = document.getElementById('inputInsertName');
    const btnInsert = document.getElementById('btnInsert');
    btnInsert.addEventListener('click', () => {
      const nome = inputInsert.value.trim();
      if (!nome) return;
      this.executeOperation(() => this.model.stepInserirOrdenado(nome));
      inputInsert.value = '';
    });
    inputInsert.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btnInsert.click();
    });

    // Remover Início / Fim / Nome
    document.getElementById('btnRemoveInicio').addEventListener('click', () => {
      this.executeOperation(() => this.model.stepRemoverInicio());
    });
    document.getElementById('btnRemoveFim').addEventListener('click', () => {
      this.executeOperation(() => this.model.stepRemoverFim());
    });

    const inputRemove = document.getElementById('inputRemoveName');
    const btnRemove = document.getElementById('btnRemove');
    btnRemove.addEventListener('click', () => {
      const nome = inputRemove.value.trim();
      if (!nome) return;
      this.executeOperation(() => this.model.stepRemoverPorNome(nome));
      inputRemove.value = '';
    });
    inputRemove.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btnRemove.click();
    });

    // Buscar
    const inputSearch = document.getElementById('inputSearchName');
    const btnSearch = document.getElementById('btnSearch');
    btnSearch.addEventListener('click', () => {
      const nome = inputSearch.value.trim();
      if (!nome) return;
      this.executeOperation(() => this.model.stepBuscar(nome));
      inputSearch.value = '';
    });
    inputSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btnSearch.click();
    });

    // Exibir / Exibir Inverso
    document.getElementById('btnDisplay').addEventListener('click', () => {
      this.executeOperation(() => this.model.stepExibir());
    });
    document.getElementById('btnDisplayReverse').addEventListener('click', () => {
      this.executeOperation(() => this.model.stepExibirInverso());
    });
    document.getElementById('btnResetList').addEventListener('click', () => {
      this.resetAll();
    });

    // 3. Controles de Reprodução (Stepper)
    document.getElementById('btnPlayPause').addEventListener('click', () => this.togglePlay());
    document.getElementById('btnStepPrev').addEventListener('click', () => this.stepPrev());
    document.getElementById('btnStepNext').addEventListener('click', () => this.stepNext());
    document.getElementById('btnSkipToEnd').addEventListener('click', () => this.skipToEnd());

    const speedSelect = document.getElementById('speedSelect');
    speedSelect.addEventListener('change', (e) => {
      this.speedMs = parseInt(e.target.value, 10);
      if (this.isPlaying) {
        this.pause();
        this.play();
      }
    });

    // 4. Presets dos Casos de Teste (Main.java)
    document.getElementById('presetTest1').addEventListener('click', () => this.runTest1());
    document.getElementById('presetTest2').addEventListener('click', () => this.runTest2());
    document.getElementById('presetTest3').addEventListener('click', () => this.runTest3());
    document.getElementById('presetTest4').addEventListener('click', () => this.runTest4());
    document.getElementById('presetTest5').addEventListener('click', () => this.runTest5());
    document.getElementById('presetTest6').addEventListener('click', () => this.runTest6());
    document.getElementById('presetTestAll').addEventListener('click', () => this.runAllTests());

    // 5. Botões do Modo Matricial
    const matrixInput = document.getElementById('matrixInputName');
    const matrixBtnInsert = document.getElementById('matrixBtnInsert');
    matrixBtnInsert.addEventListener('click', () => {
      const nome = matrixInput.value.trim();
      if (!nome) return;
      const res = this.matrixVisualizer.inserir(nome);
      this.logTerminal(res.msg, res.sucesso ? 'info' : 'error');
      matrixInput.value = '';
    });

    const matrixBtnRemove = document.getElementById('matrixBtnRemove');
    matrixBtnRemove.addEventListener('click', () => {
      const nome = matrixInput.value.trim();
      if (!nome) return;
      const res = this.matrixVisualizer.remover(nome);
      this.logTerminal(res.msg, res.sucesso ? 'info' : 'warning');
      matrixInput.value = '';
    });

    document.getElementById('matrixBtnReset').addEventListener('click', () => {
      this.matrixVisualizer.reset();
      this.logTerminal('[MATRICIAL] Matriz e PND reinicializadas.', 'system');
    });

    // 6. Modal de Autores
    const modal = document.getElementById('authorsModal');
    document.getElementById('btnShowAuthors').addEventListener('click', () => {
      modal.classList.add('active');
    });
    document.getElementById('btnCloseModal').addEventListener('click', () => {
      modal.classList.remove('active');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });

    // Redimensionamento de Janela (redesenha setas SVG)
    window.addEventListener('resize', () => {
      if (this.stepsQueue.length > 0 && this.currentStepIdx >= 0) {
        const step = this.stepsQueue[this.currentStepIdx];
        this.visualizer.render(step.state);
      }
    });
  }

  renderInitial() {
    this.visualizer.render(this.model.cloneState());
    this.renderJavaCode('inserirOrdenado', null);
    this.updateStats();
    this.logTerminal('Simulador iniciado. Pronto para executar operações.', 'system');
  }

  resetAll() {
    this.pause();
    this.model = new ListaDinamicaModel();
    this.stepsQueue = [];
    this.currentStepIdx = -1;
    this.visualizer.render(this.model.cloneState());
    this.updateStats();
    this.updateStepperUI();
    this.setExplanation('Lista Reinicializada', 'Todas as referências foram destruídas e a memória Heap foi zerada.', []);
    this.logTerminal('--- LISTA REINICIALIZADA ---', 'system');
  }

  executeOperation(generatorFn) {
    this.pause();
    const steps = generatorFn();
    if (!steps || steps.length === 0) return;

    this.stepsQueue = steps;
    this.currentStepIdx = 0;
    this.applyStep(this.stepsQueue[0]);
    this.updateStepperUI();
    this.play();
  }

  applyStep(step) {
    if (!step) return;

    // 1. Atualiza Nós no Canvas
    this.visualizer.render(step.state);

    // 2. Atualiza Código Java Sincronizado
    if (step.method) {
      this.renderJavaCode(step.method, step.codeLine);
    }

    // 3. Atualiza Caixa de Explicação
    this.setExplanation(step.action, step.description, [
      `Método: <code>${step.method}()</code>`,
      step.state.atualId ? `Ponteiro Atual: <strong>${step.state.atualId}</strong>` : `Ponteiro Atual: <em>null</em>`
    ]);

    // 4. Log no Terminal
    if (step.term) {
      this.logTerminal(step.term, 'info');
    }

    this.updateStats();
  }

  stepNext() {
    if (this.currentStepIdx < this.stepsQueue.length - 1) {
      this.currentStepIdx++;
      this.applyStep(this.stepsQueue[this.currentStepIdx]);
      this.updateStepperUI();
    } else {
      this.pause();
    }
  }

  stepPrev() {
    if (this.currentStepIdx > 0) {
      this.currentStepIdx--;
      this.applyStep(this.stepsQueue[this.currentStepIdx]);
      this.updateStepperUI();
    }
  }

  skipToEnd() {
    if (this.stepsQueue.length === 0) return;
    this.pause();
    this.currentStepIdx = this.stepsQueue.length - 1;
    this.applyStep(this.stepsQueue[this.currentStepIdx]);
    this.updateStepperUI();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (this.currentStepIdx >= this.stepsQueue.length - 1) {
      this.currentStepIdx = 0;
      this.applyStep(this.stepsQueue[0]);
    }
    this.isPlaying = true;
    const playIcon = document.getElementById('playIcon');
    if (playIcon) playIcon.textContent = '⏸';

    clearInterval(this.playTimer);
    this.playTimer = setInterval(() => {
      if (this.currentStepIdx < this.stepsQueue.length - 1) {
        this.stepNext();
      } else {
        this.pause();
      }
    }, this.speedMs);
  }

  pause() {
    this.isPlaying = false;
    clearInterval(this.playTimer);
    const playIcon = document.getElementById('playIcon');
    if (playIcon) playIcon.textContent = '▶';
  }

  updateStepperUI() {
    const total = this.stepsQueue.length;
    const current = total > 0 ? this.currentStepIdx + 1 : 0;
    const indicator = document.getElementById('stepIndicator');
    if (indicator) {
      indicator.textContent = `Passo ${current} / ${total}`;
    }

    const btnPrev = document.getElementById('btnStepPrev');
    const btnNext = document.getElementById('btnStepNext');
    if (btnPrev) btnPrev.disabled = this.currentStepIdx <= 0;
    if (btnNext) btnNext.disabled = this.currentStepIdx >= total - 1;
  }

  updateStats() {
    const totalNodesElem = document.getElementById('statTotalNodes');
    const heapBytesElem = document.getElementById('statHeapBytes');
    const count = this.model.nodes.length;
    if (totalNodesElem) totalNodesElem.textContent = count;
    if (heapBytesElem) heapBytesElem.textContent = `${count * 24} B`;
  }

  setExplanation(title, descriptionHtml, detailsArray = []) {
    const badge = document.getElementById('stepBadgeTitle');
    const desc = document.getElementById('stepDescText');
    const list = document.getElementById('stepDetailsList');

    if (badge) badge.textContent = title;
    if (desc) desc.innerHTML = descriptionHtml;
    if (list) {
      list.innerHTML = detailsArray.map(d => `<li>${d}</li>`).join('');
    }
  }

  renderJavaCode(methodName, activeLineNum) {
    const container = document.getElementById('codeViewerBody');
    if (!container) return;

    const lines = JAVA_SOURCE_CODE[methodName] || JAVA_SOURCE_CODE.inserirOrdenado;
    let html = '';

    lines.forEach(item => {
      const isActive = item.line === activeLineNum;
      const highlightedText = this.highlightJavaSyntax(item.text);
      html += `
        <div class="code-line ${isActive ? 'active-line' : ''}" id="code-line-${item.line}">
          <span class="code-line-num">${item.line}</span>
          <span class="code-line-content">${highlightedText}</span>
        </div>
      `;
    });

    container.innerHTML = html;

    // Rola para a linha ativa
    if (activeLineNum) {
      const activeElem = document.getElementById(`code-line-${activeLineNum}`);
      if (activeElem) {
        activeElem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }

  highlightJavaSyntax(text) {
    return text
      .replace(/(\/\/.*$)/g, '<span class="cmt">$1</span>')
      .replace(/\b(public|private|boolean|void|if|else|while|break|return|new|this|null)\b/g, '<span class="kw">$1</span>')
      .replace(/\b(No|Informacao|ListaDinamica|String|StringBuilder)\b/g, '<span class="tp">$1</span>')
      .replace(/\b(inserirOrdenado|removerInicio|removerFim|remover|buscar|exibir|exibirInverso|estaVazia|getNome|equals|compareTo|append)\b(?=\()/g, '<span class="fn">$1</span>')
      .replace(/(".*?")/g, '<span class="str">$1</span>')
      .replace(/\b(inicio|fim|elop|eloa|info|atual|anterior|proximo|novoNo|removido)\b/g, '<span class="var">$1</span>');
  }

  logTerminal(msg, type = 'info') {
    const terminal = document.getElementById('terminalLogBody');
    if (!terminal) return;

    const line = document.createElement('div');
    line.className = `term-line ${type}`;
    line.innerHTML = `<span class="prompt">></span> <span>${msg}</span>`;
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
  }

  // ========================================================================
  // CENÁRIOS DE TESTE DO TRABALHO (Main.java)
  // ========================================================================
  runTest1() {
    this.resetAll();
    this.logTerminal('=== TESTE 1: Tratamento de Lista Vazia ===', 'warning');
    this.executeOperation(() => this.model.stepExibir());
  }

  runTest2() {
    this.resetAll();
    this.logTerminal('=== TESTE 2: Inserção Ordenada (Integrantes + Ana/Zeca) ===', 'warning');
    
    // Lista de nomes para inserir em sequência
    const names = [
      "Pedro Schmitt Dalepiane",
      "Tiago Andrei de Almeida Mendonça",
      "Vitor da Silva Bonato",
      "Henrique Oliveski Bombardiéri",
      "Ana",
      "Zeca"
    ];

    let allSteps = [];
    names.forEach(name => {
      const steps = this.model.stepInserirOrdenado(name);
      allSteps = allSteps.concat(steps);
    });

    this.stepsQueue = allSteps;
    this.currentStepIdx = 0;
    this.applyStep(this.stepsQueue[0]);
    this.updateStepperUI();
    this.play();
  }

  runTest3() {
    this.logTerminal('=== TESTE 3: Nomes Duplicados ===', 'warning');
    this.executeOperation(() => this.model.stepInserirOrdenado("Tiago Andrei de Almeida Mendonça"));
  }

  runTest4() {
    this.logTerminal('=== TESTE 4: Remoção nas Extremidades ===', 'warning');
    let steps = this.model.stepRemoverInicio();
    steps = steps.concat(this.model.stepRemoverFim());
    this.stepsQueue = steps;
    this.currentStepIdx = 0;
    this.applyStep(this.stepsQueue[0]);
    this.updateStepperUI();
    this.play();
  }

  runTest5() {
    this.logTerminal('=== TESTE 5: Busca e Remoção no Meio ===', 'warning');
    let steps = this.model.stepBuscar("Pedro Schmitt Dalepiane");
    steps = steps.concat(this.model.stepRemoverPorNome("Pedro Schmitt Dalepiane"));
    this.stepsQueue = steps;
    this.currentStepIdx = 0;
    this.applyStep(this.stepsQueue[0]);
    this.updateStepperUI();
    this.play();
  }

  runTest6() {
    this.logTerminal('=== TESTE 6: Exibição Inversa (Validação de eloa) ===', 'warning');
    this.executeOperation(() => this.model.stepExibirInverso());
  }

  async runAllTests() {
    this.logTerminal('▶ INICIANDO SUÍTE COMPLETA DE TESTES DO TRABALHO...', 'system');
    this.runTest2();
  }
}

// Inicializa a aplicação ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
});
