Aqui está a versão do seu documento refatorada e adaptada para o ecossistema e nomenclatura do **Java**. As referências de ambiente virtual, `pytest` e arquivos `.py` foram substituídas por seus equivalentes em Java (JDK, Maven/JUnit e `.java`).

---

# Trabalho Prático: Lista Duplamente Encadeada Dinâmica

**Instituição:** UNIJUÍ - Universidade Regional do Noroeste do Estado do Rio Grande do Sul

**Disciplina:** Algoritmos e Estruturas de Dados

**Componentes do Grupo:**

* Tiago Andrei de Almeida Mendonça
* Vitor da Silva Bonato
* Pedro Schmitt Dalepiane
* Henrique Oliveski Bombardiéri

---

## 1. Instruções de Execução

Para garantir a correta compilação e execução do projeto, certifique-se de ter o **Java Development Kit (JDK)** (versão 11 ou superior) e o **Maven** (para os testes automatizados) instalados.

No terminal do seu sistema operacional, navegue até a pasta raiz do projeto e siga os passos abaixo:

**Passo 1: Compilar o projeto**

```bash
javac -d bin src\*.java

```

**Passo 2: Executar o programa principal**

```bash
java -cp bin Main

```


---

## 2. Implementação

A implementação completa das classes `No`, `Informacao` e `ListaDinamica` encontra-se nos arquivos fonte do projeto (arquivos `.java` no diretório `src`).

A estratégia adotada utiliza alocação sob demanda (instanciação de objetos) e manipulação de referências de memória (`elop` e `eloa`), eliminando completamente o uso de vetores fixos e a necessidade de uma Pilha de Nós Disponíveis (PND). A interface pública exigida foi integralmente mapeada, incluindo o tratamento adequado para inserções, remoções e busca, tanto em cenários ideais quanto em listas vazias.

---

## 3. Testes e Evidências

Para comprovar a robustez do algoritmo e garantir a integridade das referências de memória, o grupo adotou uma abordagem de dupla validação:

1. **Validação de Uso (`Main.java`):** Cobre os cenários exigidos com impressões no terminal para conferência visual e validação do encadeamento reverso.
2. **Validação de Regressão e Estado (`ListaDinamicaTest.java`):** Utiliza o *framework* **JUnit** para aferir matematicamente se a manipulação dos ponteiros (referências) ocorre sem quebra de encadeamento.

**Evidência de Execução (Suíte JUnit):**

```code
PS C:\Users\tiago\OneDrive\Documentos\Vscode Projetos\dynamic-lists> java -cp bin Main
--- TESTE 1: Tratamento de Lista Vazia ---
Lista vazia.
Remover início vazia: null
Buscar vazia (Vitor): null

--- TESTE 2: Inserção Ordenada ---
Ana -> Henrique Oliveski Bombardiéri -> Pedro Schmitt Dalepiane -> Tiago Andrei de Almeida Mendonça -> Vitor da Silva Bonato -> Zeca

--- TESTE 3: Nomes Duplicados ---
Inserir duplicado ('Tiago...'): Falha (Correto)

--- TESTE 4: Remoção nas Extremidades ---
Removido Início: Ana
Removido Fim: Zeca
Henrique Oliveski Bombardiéri -> Pedro Schmitt Dalepiane -> Tiago Andrei de Almeida Mendonça -> Vitor da Silva Bonato

--- TESTE 5: Busca e Remoção no Meio ---
Busca 'Pedro...': Encontrado
Após remover 'Pedro...':
Henrique Oliveski Bombardiéri -> Tiago Andrei de Almeida Mendonça -> Vitor da Silva Bonato

--- TESTE 6: Exibição Inversa (Validação de eloa) ---
Vitor da Silva Bonato <- Tiago Andrei de Almeida Mendonça <- Henrique Oliveski Bombardiéri
```

---

## 4. Comparação: Lista Matricial vs. Lista Dinâmica

| Característica | Lista Matricial (Vetor + PND) | Lista Dinamicamente Encadeada |
| --- | --- | --- |
| **Alocação de Memória** | Estática/Prévia. Aloca um bloco contíguo de tamanho fixo na inicialização. | Sob demanda. Instancia objetos (`new No()`) na *heap* a cada inserção. |
| **Liberação de Memória** | Lógica. O índice volta para a PND, mas a RAM segue ocupada pelo vetor. | Física. O *Garbage Collector* (GC) da JVM libera a memória automaticamente ao perder as referências. |
| **Esgotamento ("Lista Cheia")** | Limite rígido. Quando a PND esvazia, a lista trava, mesmo sobrando RAM na máquina. | Limite elástico. Só ocorre falha se a memória da JVM estourar (`OutOfMemoryError`). |
| **Complexidade (Inserir/Buscar)** | $O(N)$ - Necessita iteração. | $O(N)$ - Necessita iteração de referência a referência. |
| **Complexidade (Remover Fim)** | $O(N)$ ou $O(1)$ dependendo do controle interno. | $O(1)$ - Acesso direto garantido pelo rastreamento da referência global `fim`. |

**Trade-offs (Vantagens e Desvantagens):**
A abordagem **Matricial** otimiza o uso de cache do processador (L1/L2) devido à contiguidade na memória e tipicamente de primitivos, não gerando *overhead* de referências de objetos. Seu uso faz sentido em sistemas onde a previsibilidade é crítica, o uso do *Garbage Collector* deve ser evitado (pausas STW - *Stop The World*) e o tamanho máximo dos dados é estritamente conhecido.

A abordagem **Dinâmica** resolve o problema do desperdício de memória ociosa. Ela gasta um pouco mais de bytes por registro (para manter as referências dos objetos `elop` e `eloa` na JVM), mas ganha flexibilidade total de expansão. É a escolha padrão na engenharia de software (como no caso da própria classe `LinkedList` do Java) para estruturas cujo volume de dados em tempo de execução é variável ou imprevisível.

---

## 5. Roteiro da Animação / Demonstração Visual

**Passo 1: Estado Inicial**

* Referências globais `inicio = null` e `fim = null`.

**Passo 2: `inserirOrdenado("Pedro")`**

* Cria-se um objeto na memória (Nó).
* `inicio` e `fim` apontam para o nó "Pedro".
* Referências `elop` e `eloa` do nó "Pedro" apontam para o "Aterramento" (`null`).

**Passo 3: `inserirOrdenado("Vitor")`**

* Cria-se novo nó "Vitor". Como é alfabeticamente maior que "Pedro", entra no fim da lista.
* Referência `elop` do "Pedro" passa a apontar para o nó "Vitor".
* Referência `eloa` do "Vitor" passa a apontar para o nó "Pedro".
* Referência global `fim` é atualizada para apontar para o nó "Vitor".

**Passo 4: `remover("Pedro")`**

* A referência global `inicio` passa a apontar direto para "Vitor".
* A referência `eloa` de "Vitor" perde a ligação com "Pedro" e vira `null`.
* O objeto "Pedro" fica completamente isolado (sem referências ativas *strong*) e sua memória é sinalizada para recolhimento e destruição pelo *Garbage Collector* da JVM.

---

## 6. Declaração de Uso de Inteligência Artificial

**Ferramenta utilizada:** Google Gemini.

**Finalidade do uso:** Auxílio na estruturação base do código em Java, elaboração da análise arquitetural (trade-offs físicos vs lógicos entre matriz e alocação dinâmica baseada em objetos) e montagem dos casos de teste isolados automatizados para validação das operações de manipulação de referências.

**Etapas da atividade em que foi utilizada:** Implementação lógica das classes, estruturação da suíte com `JUnit` e documentação textual comparativa.

**Procedimentos adotados para verificar e testar o conteúdo:** O código gerado foi submetido a testes locais no ambiente de execução do grupo na JVM (executando o `Main.java`), validando o comportamento das referências (elop/eloa) nas extremidades e no meio da lista. A validação garantiu a eficácia das atualizações nos testes após a introdução de novos integrantes alterarem a ordenação natural da lista. Realizou-se *code review* e depuração lógica para garantir que a interface pública exigida no enunciado da atividade estava perfeitamente mapeada e as operações possuíam a complexidade correta.

**Assinaturas dos Integrantes:**

---

Tiago Andrei de Almeida Mendonça

---

Vitor da Silva Bonato

---

Pedro Schmitt Dalepiane

---

Henrique Oliveski Bombardiéri