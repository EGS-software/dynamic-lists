/**
 * RENDERIZADOR VISUAL DA LISTA MATRICIAL (VETOR FIXO + PND)
 * Algoritmos e Estruturas de Dados - UNIJUÍ
 */

class MatrixVisualizer {
  constructor(tableContainerId, pndContainerId, statsContainerId) {
    this.tableContainer = document.getElementById(tableContainerId);
    this.pndContainer = document.getElementById(pndContainerId);
    this.statsContainer = document.getElementById(statsContainerId);
    this.model = new ListaMatricialModel(6);
  }

  render() {
    if (!this.tableContainer || !this.pndContainer) return;

    // Renderiza a Tabela da Matriz
    let tableHtml = `
      <table class="matrix-table">
        <thead>
          <tr>
            <th>Índice</th>
            <th>info.nome</th>
            <th>eloa (ant)</th>
            <th>elop (próx)</th>
            <th>Status do Slot</th>
          </tr>
        </thead>
        <tbody>
    `;

    this.model.matriz.forEach(cell => {
      const isOccupied = cell.isOccupied;
      const isInicio = cell.indice === this.model.inicioLista;
      const isFim = cell.indice === this.model.fimLista;
      const isTopoPND = cell.indice === this.model.topoPND;

      let statusBadge = '';
      if (isOccupied) {
        let roles = [];
        if (isInicio) roles.push('<span style="color: var(--inicio-color); font-weight: 700;">[INÍCIO]</span>');
        if (isFim) roles.push('<span style="color: var(--fim-color); font-weight: 700;">[FIM]</span>');
        statusBadge = roles.length > 0 ? roles.join(' ') : '<span style="color: #38bdf8;">OCUPADO</span>';
      } else {
        statusBadge = isTopoPND ? '<span style="color: var(--atual-color); font-weight: 700;">TOPO PND</span>' : '<span style="color: #64748b;">DISPONÍVEL (PND)</span>';
      }

      tableHtml += `
        <tr class="${isOccupied ? 'occupied' : 'in-pnd'} ${isTopoPND ? 'active-matrix-row' : ''}">
          <td><strong>[${cell.indice}]</strong></td>
          <td style="font-weight: ${isOccupied ? '700' : '400'}; color: ${isOccupied ? '#fff' : '#64748b'};">
            ${cell.info ? `"${cell.info}"` : '<em>null</em>'}
          </td>
          <td>${cell.eloa !== -1 ? `[${cell.eloa}]` : '<span style="color: #64748b;">-1 (⏚)</span>'}</td>
          <td>${cell.elop !== -1 ? `[${cell.elop}]` : '<span style="color: #64748b;">-1 (⏚)</span>'}</td>
          <td>${statusBadge}</td>
        </tr>
      `;
    });

    tableHtml += `
        </tbody>
      </table>
    `;

    this.tableContainer.innerHTML = tableHtml;

    // Renderiza a Pilha de Nós Disponíveis (PND)
    let pndHtml = '';
    let curPnd = this.model.topoPND;
    const pndChain = [];

    while (curPnd !== -1 && curPnd !== null && pndChain.length < this.model.capacidade) {
      pndChain.push(curPnd);
      curPnd = this.model.matriz[curPnd]?.elop ?? -1;
    }

    if (pndChain.length === 0) {
      pndHtml = `
        <div style="padding: 14px; text-align: center; color: var(--gc-color); font-weight: 700; background: rgba(239, 68, 68, 0.1); border-radius: 6px; border: 1px solid rgba(239,68,68,0.3);">
          ⚠️ PILHA DE NÓS ESGOTADA (PND VAZIA)
          <div style="font-size: 0.75rem; font-weight: 400; color: #fca5a5; margin-top: 4px;">A lista atingiu a capacidade máxima do vetor fixo (6/6).</div>
        </div>
      `;
    } else {
      pndChain.forEach((slotIdx, idx) => {
        const isTop = idx === 0;
        pndHtml += `
          <div class="pnd-slot ${isTop ? 'top' : ''}">
            <span>${isTop ? '👉 TOPO PND' : '↳ Disponível'}</span>
            <strong>Slot [${slotIdx}]</strong>
          </div>
        `;
      });
    }

    this.pndContainer.innerHTML = pndHtml;

    // Estatísticas da Matriz
    if (this.statsContainer) {
      const occupiedCount = this.model.matriz.filter(c => c.isOccupied).length;
      this.statsContainer.innerHTML = `
        <span>Capacidade Fixa: <strong>${this.model.capacidade}</strong></span>
        <span>Ocupados: <strong>${occupiedCount}/${this.model.capacidade}</strong></span>
        <span>Ponteiro topoPND: <strong>${this.model.topoPND !== -1 ? `[${this.model.topoPND}]` : 'null (-1)'}</strong></span>
        <span>inicioLista: <strong>${this.model.inicioLista !== -1 ? `[${this.model.inicioLista}]` : 'null (-1)'}</strong></span>
        <span>fimLista: <strong>${this.model.fimLista !== -1 ? `[${this.model.fimLista}]` : 'null (-1)'}</strong></span>
      `;
    }
  }

  inserir(nome) {
    const res = this.model.inserir(nome);
    this.render();
    return res;
  }

  remover(nome) {
    const res = this.model.remover(nome);
    this.render();
    return res;
  }

  reset() {
    this.model.inicializar();
    this.render();
  }
}

window.MatrixVisualizer = MatrixVisualizer;
