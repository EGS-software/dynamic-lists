public class ListaDinamica {
    private No inicio;
    private No fim;

    public ListaDinamica() {
        this.inicio = null;
        this.fim = null;
    }

    private boolean estaVazia() {
        return this.inicio == null;
    }

    // Insere ordenado por nome. Retorna false se o nome já existir.
    public boolean inserirOrdenado(Informacao info) {
        No novoNo = new No(info);

        // Caso 1: Lista vazia
        if (estaVazia()) {
            this.inicio = this.fim = novoNo;
            return true;
        }

        No atual = this.inicio;
        while (atual != null) {
            // Em Java usamos equals() para igualdade e compareTo() para ordem alfabética
            if (atual.info.getNome().equals(info.getNome())) {
                return false; // Não permite duplicatas
            }
            if (atual.info.getNome().compareTo(info.getNome()) > 0) {
                break;
            }
            atual = atual.elop;
        }

        // Caso 2: Inserção no Início (antes do atual que é o primeiro)
        if (atual == this.inicio) {
            novoNo.elop = this.inicio;
            this.inicio.eloa = novoNo;
            this.inicio = novoNo;
        }
        // Caso 3: Inserção no Fim (atual chegou a null)
        else if (atual == null) {
            novoNo.eloa = this.fim;
            this.fim.elop = novoNo;
            this.fim = novoNo;
        }
        // Caso 4: Inserção no Meio (entre atual.eloa e atual)
        else {
            No anterior = atual.eloa;
            novoNo.elop = atual;
            novoNo.eloa = anterior;
            anterior.elop = novoNo;
            atual.eloa = novoNo;
        }

        return true;
    }

    // Remove e retorna a informação do início. Retorna null se vazia.
    public Informacao removerInicio() {
        if (estaVazia()) {
            return null;
        }

        Informacao removido = this.inicio.info;
        this.inicio = this.inicio.elop;

        if (this.inicio != null) {
            this.inicio.eloa = null;
        } else {
            this.fim = null; // Lista ficou vazia
        }

        return removido;
    }

    // Remove e retorna a informação do fim. Retorna null se vazia.
    public Informacao removerFim() {
        if (estaVazia()) {
            return null;
        }

        Informacao removido = this.fim.info;
        this.fim = this.fim.eloa;

        if (this.fim != null) {
            this.fim.elop = null;
        } else {
            this.inicio = null; // Lista ficou vazia
        }

        return removido;
    }

    // Busca e remove o nó exato pelo nome. Retorna true se sucesso.
    public boolean remover(Informacao info) {
        if (estaVazia()) {
            return false;
        }

        No atual = this.inicio;
        while (atual != null && !atual.info.getNome().equals(info.getNome())) {
            // Otimização: como é ordenada, se passarmos do ponto, já podemos parar
            if (atual.info.getNome().compareTo(info.getNome()) > 0) {
                return false;
            }
            atual = atual.elop;
        }

        if (atual == null) {
            return false; // Não encontrado
        }

        // Reaproveita a lógica caso seja nas extremidades
        if (atual == this.inicio) {
            removerInicio();
        } else if (atual == this.fim) {
            removerFim();
        } else {
            // Remoção no meio
            No anterior = atual.eloa;
            No proximo = atual.elop;
            anterior.elop = proximo;
            proximo.eloa = anterior;
        }

        return true;
    }

    // Retorna a Informacao se o nome existir, ou null.
    public Informacao buscar(Informacao info) {
        if (estaVazia()) {
            return null;
        }

        No atual = this.inicio;
        while (atual != null) {
            if (atual.info.getNome().equals(info.getNome())) {
                return atual.info;
            }
            if (atual.info.getNome().compareTo(info.getNome()) > 0) {
                break; // Como está ordenado, não adianta buscar adiante
            }
            atual = atual.elop;
        }

        return null;
    }

    // Exibe os elementos do início ao fim.
    public void exibir() {
        if (estaVazia()) {
            System.out.println("Lista vazia.");
            return;
        }

        No atual = this.inicio;
        StringBuilder sb = new StringBuilder();
        while (atual != null) {
            sb.append(atual.info.getNome());
            if (atual.elop != null) {
                sb.append(" -> ");
            }
            atual = atual.elop;
        }
        System.out.println(sb.toString());
    }

    // Exibe os elementos do fim ao início.
    public void exibirInverso() {
        if (estaVazia()) {
            System.out.println("Lista vazia.");
            return;
        }

        No atual = this.fim;
        StringBuilder sb = new StringBuilder();
        while (atual != null) {
            sb.append(atual.info.getNome());
            if (atual.eloa != null) {
                sb.append(" <- ");
            }
            atual = atual.eloa;
        }
        System.out.println(sb.toString());
    }
}