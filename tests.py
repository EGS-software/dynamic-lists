import pytest
from dynamic_lists import ListaDinamica, Informacao

@pytest.fixture
def lista_base():
    lista = ListaDinamica()
    lista.inserirOrdenado(Informacao("Pedro Schmitt Dalepiane"))
    lista.inserirOrdenado(Informacao("Tiago Andrei de Almeida Mendonça"))
    lista.inserirOrdenado(Informacao("Vitor da Silva Bonato"))
    lista.inserirOrdenado(Informacao("Henrique Oliveski Bombardiéri"))
    return lista

def test_lista_vazia():
    print("\n\n--- TESTE 1: Tratamento de Lista Vazia ---")
    lista = ListaDinamica()
    lista.exibir()
    
    print(f"Remover início vazia: {lista.removerInicio()}")
    print(f"Remover fim vazia: {lista.removerFim()}")
    print(f"Buscar vazia (Vitor): {lista.buscar(Informacao('Vitor'))}")
    
    # Asserções para garantir que a lógica não quebrou
    assert lista.removerInicio() is None
    assert lista.removerFim() is None
    assert lista.buscar(Informacao("Vitor")) is None
    assert lista.remover(Informacao("Vitor")) is False

def test_insercao_ordenada():
    print("\n\n--- TESTE 2: Inserção Ordenada ---")
    lista = ListaDinamica()
    
    print("Inserindo: Tiago, Ana (força início) e Zeca (força fim)...")
    lista.inserirOrdenado(Informacao("Tiago"))
    lista.inserirOrdenado(Informacao("Ana"))
    lista.inserirOrdenado(Informacao("Zeca"))
    
    print("Estado atual da lista:")
    lista.exibir()
    
    # Asserções validando os ponteiros
    assert lista.inicio.info.nome == "Ana"
    assert lista.fim.info.nome == "Zeca"

def test_bloqueio_de_nomes_duplicados(lista_base):
    print("\n\n--- TESTE 3: Nomes Duplicados ---")
    print("Lista atual:")
    lista_base.exibir()
    
    print("Tentando inserir 'Tiago Andrei de Almeida Mendonça' novamente...")
    sucesso = lista_base.inserirOrdenado(Informacao("Tiago Andrei de Almeida Mendonça"))
    print(f"Resultado: {'Sucesso (Incorreto)' if sucesso else 'Falha (Correto - Bloqueado)'}")
    
    assert sucesso is False

def test_remocao_extremidades(lista_base):
    print("\n\n--- TESTE 4: Remoção nas Extremidades ---")
    lista_base.exibir()
    
    removido_inicio = lista_base.removerInicio()
    removido_fim = lista_base.removerFim()
    
    # Início ajustado para Oliveski
    assert removido_inicio.nome == "Henrique Oliveski Bombardiéri"
    # O fim continua sendo o Vitor
    assert removido_fim.nome == "Vitor da Silva Bonato"
    
    # Após remover as pontas, devem sobrar: Pedro -> Tiago
    assert lista_base.inicio.info.nome == "Pedro Schmitt Dalepiane"
    assert lista_base.fim.info.nome == "Tiago Andrei de Almeida Mendonça"
def test_busca_e_remocao_no_meio(lista_base):
    print("\n\n--- TESTE 5: Busca e Remoção no Meio ---")
    alvo = Informacao("Tiago Andrei de Almeida Mendonça")
    
    # Remove o Tiago
    lista_base.remover(alvo)
    
    # A lista era: Henrique -> Pedro -> Tiago -> Vitor
    # Agora ficou: Henrique -> Pedro -> Vitor
    
    assert lista_base.buscar(alvo) is None
    
    # O início continua sendo o Henrique, e o próximo dele é o Pedro
    assert lista_base.inicio.info.nome == "Henrique Oliveski Bombardiéri"
    assert lista_base.inicio.elop.info.nome == "Pedro Schmitt Dalepiane"