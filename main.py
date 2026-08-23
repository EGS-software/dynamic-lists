from dynamic_lists import ListaDinamica, Informacao


if __name__ == "__main__":
    lista = ListaDinamica()

    print("--- TESTE 1: Tratamento de Lista Vazia ---")
    lista.exibir()
    print(f"Remover início vazia: {lista.removerInicio()}")
    print(f"Buscar vazia (Vitor): {lista.buscar(Informacao('Vitor da Silva Bonato'))}")

    print("\n--- TESTE 2: Inserção Ordenada ---")
    lista.inserirOrdenado(Informacao("Pedro Schmitt Dalepiane"))
    lista.inserirOrdenado(Informacao("Tiago Andrei de Almeida Mendonça"))
    lista.inserirOrdenado(Informacao("Vitor da Silva Bonato"))
    lista.inserirOrdenado(Informacao("Henrique Oliveski Bombardiéri"))
    lista.inserirOrdenado(Informacao("Ana"))  # Força inserção no início
    lista.inserirOrdenado(Informacao("Zeca")) # Força inserção no fim
    lista.exibir()

    print("\n--- TESTE 3: Nomes Duplicados ---")
    sucesso = lista.inserirOrdenado(Informacao("Tiago Andrei de Almeida Mendonça"))
    print(f"Inserir duplicado ('Tiago...'): {'Sucesso' if sucesso else 'Falha (Correto)'}")

    print("\n--- TESTE 4: Remoção nas Extremidades ---")
    print(f"Removido Início: {lista.removerInicio().nome}")
    print(f"Removido Fim: {lista.removerFim().nome}")
    lista.exibir()

    print("\n--- TESTE 5: Busca e Remoção no Meio ---")
    busca = lista.buscar(Informacao("Pedro Schmitt Dalepiane"))
    print(f"Busca 'Pedro...': {'Encontrado' if busca else 'Não Encontrado'}")

    lista.remover(Informacao("Pedro Schmitt Dalepiane"))
    print("Após remover 'Pedro...':")
    lista.exibir()
    
    print("\n--- TESTE 6: Exibição Inversa (Validação de eloa) ---")
    lista.exibirInverso()