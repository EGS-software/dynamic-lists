class Informacao:
    def __init__(self, nome: str):
        self.nome = nome

    def __repr__(self):
        return f"[{self.nome}]"


class No:
    def __init__(self, info: Informacao):
        self.info = info
        self.elop = None  
        self.eloa = None  


class ListaDinamica:
    def __init__(self):
        self.inicio = None
        self.fim = None

    def _esta_vazia(self) -> bool:
        return self.inicio is None

    def inserirOrdenado(self, info: Informacao) -> bool:
        """Insere ordenado por nome. Retorna False se o nome já existir."""
        novo_no = No(info)

        # Caso 1: Lista vazia
        if self._esta_vazia():
            self.inicio = self.fim = novo_no
            return True

        atual = self.inicio
        while atual is not None:
            if atual.info.nome == info.nome:
                return False  # Não permite duplicatas
            if atual.info.nome > info.nome:
                break
            atual = atual.elop

        # Caso 2: Inserção no Início (antes do atual que é o primeiro)
        if atual == self.inicio:
            novo_no.elop = self.inicio
            self.inicio.eloa = novo_no
            self.inicio = novo_no

        # Caso 3: Inserção no Fim (atual chegou a None)
        elif atual is None:
            novo_no.eloa = self.fim
            self.fim.elop = novo_no
            self.fim = novo_no

        # Caso 4: Inserção no Meio (entre atual.eloa e atual)
        else:
            anterior = atual.eloa
            novo_no.elop = atual
            novo_no.eloa = anterior
            anterior.elop = novo_no
            atual.eloa = novo_no

        return True

    def removerInicio(self) -> Informacao | None:
        """Remove e retorna a informação do início. Retorna None se vazia."""
        if self._esta_vazia():
            return None
            
        removido = self.inicio.info
        self.inicio = self.inicio.elop
        
        if self.inicio is not None:
            self.inicio.eloa = None
        else:
            self.fim = None  # Lista ficou vazia
            
        return removido

    def removerFim(self) -> Informacao | None:
        """Remove e retorna a informação do fim. Retorna None se vazia."""
        if self._esta_vazia():
            return None
            
        removido = self.fim.info
        self.fim = self.fim.eloa
        
        if self.fim is not None:
            self.fim.elop = None
        else:
            self.inicio = None  # Lista ficou vazia
            
        return removido

    def remover(self, info: Informacao) -> bool:
        """Busca e remove o nó exato pelo nome. Retorna True se sucesso."""
        if self._esta_vazia():
            return False

        atual = self.inicio
        while atual is not None and atual.info.nome != info.nome:
            # Otimização: como é ordenada, se passarmos do ponto, já podemos parar
            if atual.info.nome > info.nome:
                return False
            atual = atual.elop

        if atual is None:
            return False  # Não encontrado

        # Reaproveita a lógica caso seja nas extremidades
        if atual == self.inicio:
            self.removerInicio()
        elif atual == self.fim:
            self.removerFim()
        else:
            # Remoção no meio
            anterior = atual.eloa
            proximo = atual.elop
            anterior.elop = proximo
            proximo.eloa = anterior

        return True

    def buscar(self, info: Informacao) -> Informacao | None:
        """Retorna a Informacao se o nome existir, ou None."""
        if self._esta_vazia():
            return None

        atual = self.inicio
        while atual is not None:
            if atual.info.nome == info.nome:
                return atual.info
            if atual.info.nome > info.nome:
                break  # Como está ordenado, não adianta buscar adiante
            atual = atual.elop
            
        return None

    def exibir(self) -> None:
        """Exibe os elementos do início ao fim."""
        if self._esta_vazia():
            print("Lista vazia.")
            return
            
        atual = self.inicio
        elementos = []
        while atual is not None:
            elementos.append(atual.info.nome)
            atual = atual.elop
        print(" -> ".join(elementos))

    def exibirInverso(self) -> None:
        """Exibe os elementos do fim ao início."""
        if self._esta_vazia():
            print("Lista vazia.")
            return
            
        atual = self.fim
        elementos = []
        while atual is not None:
            elementos.append(atual.info.nome)
            atual = atual.eloa
        print(" <- ".join(elementos))