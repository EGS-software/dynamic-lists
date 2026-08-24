/**
 * RENDERIZADOR VISUAL DOS NÓS DINÂMICOS E CONEXÕES SVG
 * Algoritmos e Estruturas de Dados - UNIJUÍ
 */

class DynamicListVisualizer {
  constructor(canvasWrapperId, nodesContainerId, svgLayerId) {
    this.canvasWrapper = document.getElementById(canvasWrapperId);
    this.nodesContainer = document.getElementById(nodesContainerId);
    this.svgLayer = document.getElementById(svgLayerId);
  }

  render(stepState) {
    if (!stepState) return;

    const { nodes, inicioId, fimId, atualId, novoId, matchedId, highlightElop, highlightEloa } = stepState;

    // Se lista completamente vazia e sem nó sendo alocado
    if (nodes.length === 0 && !novoId) {
      this.nodesContainer.innerHTML = `
        <div class="canvas-empty-state">
          <div class="ground-symbol">⏚</div>
          <p><strong>Lista Vazia</strong></p>
          <span style="font-size: 0.8rem; color: #64748b;">(inicio = null, fim = null)</span>
        </div>
      `;
      this.svgLayer.innerHTML = '';
      return;
    }

    // Identifica nós encadeados em ordem lógica a partir de inicioId
    const orderedNodes = [];
    let curId = inicioId;
    const visited = new Set();

    while (curId) {
      const node = nodes.find(n => n.id === curId);
      if (!node || visited.has(curId)) break;
      visited.add(curId);
      orderedNodes.push(node);
      curId = node.elopId;
    }

    // Se houver nós ainda não encadeados (ex: novoNo sendo alocado ou desvinculado por GC)
    nodes.forEach(n => {
      if (!visited.has(n.id)) {
        orderedNodes.push(n);
      }
    });

    // Monta o HTML dos nós
    let html = '';

    // Aterramento à esquerda (para o eloa do primeiro nó)
    html += `
      <div class="ground-node" id="ground-left">
        <div class="symbol">⏚</div>
        <div>null</div>
      </div>
    `;

    orderedNodes.forEach(node => {
      const isInicio = node.id === inicioId;
      const isFim = node.id === fimId;
      const isAtual = node.id === atualId;
      const isNovo = node.id === novoId || node.isNew;
      const isGC = node.isGC;
      const isMatched = node.id === matchedId;

      let cardClasses = ['node-card'];
      if (isAtual) cardClasses.push('active-traversal');
      if (isNovo) cardClasses.push('new-node-allocating');
      if (isGC) cardClasses.push('targeted-for-gc');
      if (isMatched) cardClasses.push('active-traversal');

      // Obter nomes dos apontados para exibir nos slots
      const eloaNode = node.eloaId ? nodes.find(n => n.id === node.eloaId) : null;
      const elopNode = node.elopId ? nodes.find(n => n.id === node.elopId) : null;

      const eloaText = eloaNode ? eloaNode.addr : 'null ⏚';
      const elopText = elopNode ? elopNode.addr : 'null ⏚';

      html += `
        <div class="${cardClasses.join(' ')}" id="node-elem-${node.id}" data-id="${node.id}">
          ${isInicio ? '<div class="ptr-badge ptr-inicio">inicio</div>' : ''}
          ${isFim ? '<div class="ptr-badge ptr-fim">fim</div>' : ''}
          ${isAtual ? '<div class="ptr-badge ptr-atual">atual</div>' : ''}
          ${isNovo ? '<div class="ptr-badge ptr-atual" style="background: var(--novo-no-color); color: #fff; bottom: -38px;">novoNo</div>' : ''}
          
          <div class="node-header">
            <span class="heap-tag">Heap</span>
            <span class="heap-address">${node.addr}</span>
          </div>

          <div class="node-body">
            <div class="node-info-label">info.nome</div>
            <div class="node-info-value">${node.nome}</div>
          </div>

          <div class="node-pointers-row">
            <div class="pointer-box eloa-box" id="eloa-box-${node.id}">
              <span class="pointer-label">eloa (ant)</span>
              <span class="pointer-target ${!node.eloaId ? 'is-null' : ''}">${eloaText}</span>
            </div>
            <div class="pointer-box elop-box" id="elop-box-${node.id}">
              <span class="pointer-label">elop (próx)</span>
              <span class="pointer-target ${!node.elopId ? 'is-null' : ''}">${elopText}</span>
            </div>
          </div>
        </div>
      `;
    });

    // Aterramento à direita (para o elop do último nó)
    html += `
      <div class="ground-node" id="ground-right">
        <div class="symbol">⏚</div>
        <div>null</div>
      </div>
    `;

    this.nodesContainer.innerHTML = html;

    // Renderiza os conectores SVG após layout do DOM
    requestAnimationFrame(() => {
      this.drawSvgLinks(orderedNodes, stepState);
    });
  }

  drawSvgLinks(orderedNodes, stepState) {
    if (!this.svgLayer || !this.nodesContainer) return;

    const containerRect = this.nodesContainer.getBoundingClientRect();
    const svgRect = this.svgLayer.getBoundingClientRect();
    
    // Atualiza viewBox do SVG
    this.svgLayer.setAttribute('width', this.nodesContainer.scrollWidth + 100);
    this.svgLayer.setAttribute('height', this.nodesContainer.scrollHeight + 100);

    let svgContent = `
      <defs>
        <!-- Marcador de Seta para ELOP (Ciano) -->
        <marker id="arrow-elop" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L7,3 z" fill="#00f0ff" />
        </marker>
        <!-- Marcador de Seta para ELOA (Laranja) -->
        <marker id="arrow-eloa" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L7,3 z" fill="#ff9f1c" />
        </marker>
      </defs>
    `;

    const getRelativeCoords = (elem) => {
      if (!elem) return null;
      const rect = elem.getBoundingClientRect();
      const parentRect = this.nodesContainer.getBoundingClientRect();
      return {
        x: rect.left - parentRect.left + this.nodesContainer.scrollLeft + 40,
        y: rect.top - parentRect.top + this.nodesContainer.scrollTop + 60,
        width: rect.width,
        height: rect.height
      };
    };

    const groundLeftElem = document.getElementById('ground-left');
    const groundRightElem = document.getElementById('ground-right');
    const groundLeftCoords = getRelativeCoords(groundLeftElem);
    const groundRightCoords = getRelativeCoords(groundRightElem);

    orderedNodes.forEach(node => {
      const nodeElem = document.getElementById(`node-elem-${node.id}`);
      if (!nodeElem) return;

      const nodeCoords = getRelativeCoords(nodeElem);
      if (!nodeCoords) return;

      // 1. DESENHAR CONEXÃO ELOP (PRÓXIMO) - Arco Superior
      if (node.elopId) {
        const targetNodeElem = document.getElementById(`node-elem-${node.elopId}`);
        if (targetNodeElem) {
          const targetCoords = getRelativeCoords(targetNodeElem);
          const startX = nodeCoords.x + nodeCoords.width - 20;
          const startY = nodeCoords.y + nodeCoords.height - 15;
          const endX = targetCoords.x + 10;
          const endY = targetCoords.y + targetCoords.height - 15;

          const dx = endX - startX;
          const curveY = startY + 35; // Arco curvado para baixo

          const d = `M ${startX} ${startY} C ${startX + dx * 0.3} ${curveY}, ${endX - dx * 0.3} ${curveY}, ${endX} ${endY}`;
          const isHighlighted = stepState.highlightElop;

          svgContent += `
            <path d="${d}" class="arrow-path elop-path ${isHighlighted ? 'changing' : ''}" marker-end="url(#arrow-elop)" />
          `;
        }
      } else if (groundRightCoords && node.id === stepState.fimId) {
        // Conecta ao aterramento null direito
        const startX = nodeCoords.x + nodeCoords.width - 20;
        const startY = nodeCoords.y + nodeCoords.height - 15;
        const endX = groundRightCoords.x;
        const endY = groundRightCoords.y + groundRightCoords.height / 2;

        const d = `M ${startX} ${startY} Q ${startX + 20} ${startY + 20}, ${endX} ${endY}`;
        svgContent += `
          <path d="${d}" class="arrow-path elop-path" stroke-dasharray="4" marker-end="url(#arrow-elop)" opacity="0.6" />
        `;
      }

      // 2. DESENHAR CONEXÃO ELOA (ANTERIOR) - Arco Superior
      if (node.eloaId) {
        const targetNodeElem = document.getElementById(`node-elem-${node.eloaId}`);
        if (targetNodeElem) {
          const targetCoords = getRelativeCoords(targetNodeElem);
          const startX = nodeCoords.x + 20;
          const startY = nodeCoords.y + 15;
          const endX = targetCoords.x + targetCoords.width - 10;
          const endY = targetCoords.y + 15;

          const dx = startX - endX;
          const curveY = startY - 35; // Arco curvado para cima

          const d = `M ${startX} ${startY} C ${startX - dx * 0.3} ${curveY}, ${endX + dx * 0.3} ${curveY}, ${endX} ${endY}`;
          const isHighlighted = stepState.highlightEloa;

          svgContent += `
            <path d="${d}" class="arrow-path eloa-path ${isHighlighted ? 'changing' : ''}" marker-end="url(#arrow-eloa)" />
          `;
        }
      } else if (groundLeftCoords && node.id === stepState.inicioId) {
        // Conecta ao aterramento null esquerdo
        const startX = nodeCoords.x + 20;
        const startY = nodeCoords.y + 15;
        const endX = groundLeftCoords.x + groundLeftCoords.width;
        const endY = groundLeftCoords.y + groundLeftCoords.height / 2;

        const d = `M ${startX} ${startY} Q ${startX - 20} ${startY - 20}, ${endX} ${endY}`;
        svgContent += `
          <path d="${d}" class="arrow-path eloa-path" stroke-dasharray="4" marker-end="url(#arrow-eloa)" opacity="0.6" />
        `;
      }
    });

    this.svgLayer.innerHTML = svgContent;
  }
}

window.DynamicListVisualizer = DynamicListVisualizer;
