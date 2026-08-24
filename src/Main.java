public class Main {
    public static void main(String[] args) {
        ListaDinamica lista = new ListaDinamica();

        System.out.println("--- TESTE 1: Tratamento de Lista Vazia ---");
        lista.exibir();
        System.out.println("Remover início vazia: " + lista.removerInicio());
        System.out.println("Buscar vazia (Vitor): " + lista.buscar(new Informacao("Vitor da Silva Bonato")));

        System.out.println("\n--- TESTE 2: Inserção Ordenada ---");
        lista.inserirOrdenado(new Informacao("Pedro Schmitt Dalepiane"));
        lista.inserirOrdenado(new Informacao("Tiago Andrei de Almeida Mendonça"));
        lista.inserirOrdenado(new Informacao("Vitor da Silva Bonato"));
        lista.inserirOrdenado(new Informacao("Henrique Oliveski Bombardiéri"));
        lista.inserirOrdenado(new Informacao("Ana"));  // Força inserção no início
        lista.inserirOrdenado(new Informacao("Zeca")); // Força inserção no fim
        lista.exibir();

        System.out.println("\n--- TESTE 3: Nomes Duplicados ---");
        boolean sucesso = lista.inserirOrdenado(new Informacao("Tiago Andrei de Almeida Mendonça"));
        System.out.println("Inserir duplicado ('Tiago...'): " + (sucesso ? "Sucesso" : "Falha (Correto)"));

        System.out.println("\n--- TESTE 4: Remoção nas Extremidades ---");
        System.out.println("Removido Início: " + lista.removerInicio().getNome());
        System.out.println("Removido Fim: " + lista.removerFim().getNome());
        lista.exibir();

        System.out.println("\n--- TESTE 5: Busca e Remoção no Meio ---");
        Informacao busca = lista.buscar(new Informacao("Pedro Schmitt Dalepiane"));
        System.out.println("Busca 'Pedro...': " + (busca != null ? "Encontrado" : "Não Encontrado"));

        lista.remover(new Informacao("Pedro Schmitt Dalepiane"));
        System.out.println("Após remover 'Pedro...':");
        lista.exibir();
        
        System.out.println("\n--- TESTE 6: Exibição Inversa (Validação de eloa) ---");
        lista.exibirInverso();
    }
}