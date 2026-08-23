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

Para garantir o isolamento das dependências do projeto e a correta execução dos testes, recomenda-se a execução utilizando um ambiente virtual Python.

No terminal do seu sistema operacional, navegue até a pasta do projeto e siga os passos abaixo:

**Passo 1: Criar o ambiente virtual**

```bash
python -m venv venv

```

**Passo 2: Ativar o ambiente virtual**

* No Linux/macOS: `source venv/bin/activate`
* No Windows: `venv\Scripts\activate`

**Passo 3: Instalar as dependências**
*(O arquivo `requirements.txt` deve conter o pacote `pytest`)*

```bash
pip install -r requirements.txt

```

**Passo 4: Executar o programa principal e testes**

```bash
python main.py
pytest -v -s tests.py

```

---

## 2. Implementação

A implementação completa das classes `No`, `Informacao` e `ListaDinamica` encontra-se nos arquivos anexos do projeto (arquivos `.py`).

A estratégia adotada utiliza alocação sob demanda e manipulação de ponteiros (`elop` e `eloa`), eliminando completamente o uso de vetores fixos e a necessidade de uma Pilha de Nós Disponíveis (PND). A interface pública exigida foi integralmente mapeada, incluindo o tratamento adequado para inserções, remoções e busca tanto em cenários ideais quanto em listas vazias.

---

## 3. Testes e Evidências

Para comprovar a robustez do algoritmo e garantir a integridade dos ponteiros de memória, o grupo adotou uma abordagem de dupla validação:

1. **Validação de Uso (`main.py`):** Cobre os cenários exigidos com impressões no terminal para conferência visual e validação do encadeamento reverso.
2. **Validação de Regressão e Estado (`tests.py`):** Utiliza o *framework* `pytest` para aferir matematicamente se a manipulação dos ponteiros ocorre sem quebra de encadeamento.

**Evidência de Execução (Suíte Pytest):**

```text
(venv) txg@TX:~/VSCODE projects/dynamic-lists$ pytest -v -s tests.py 
============================= test session starts ==============================
platform linux -- Python 3.14.7, pytest-9.1.1, pluggy-1.6.0
cachedir: .pytest_cache
rootdir: /home/txg/VSCODE projects/dynamic-lists
collected 5 items                                                                                                                                           

tests.py::test_lista_vazia 
--- TESTE 1: Tratamento de Lista Vazia ---
Lista vazia.
Remover início vazia: None
Remover fim vazia: None
Buscar vazia (Vitor): None
PASSED

tests.py::test_insercao_ordenada 
--- TESTE 2: Inserção Ordenada ---
Inserindo: Tiago, Ana (força início) e Zeca (força fim)...
Estado atual da lista:
Ana -> Tiago -> Zeca
PASSED

tests.py::test_bloqueio_de_nomes_duplicados 
--- TESTE 3: Nomes Duplicados ---
Lista atual:
Henrique Oliveski Bombardiéri -> Pedro Schmitt Dalepiane -> Tiago Andrei de Almeida Mendonça -> Vitor da Silva Bonato
Tentando inserir 'Tiago Andrei de Almeida Mendonça' novamente...
Resultado: Falha (Correto - Bloqueado)
PASSED

tests.py::test_remocao_extremidades 
--- TESTE 4: Remoção nas Extremidades ---
Henrique Oliveski Bombardiéri -> Pedro Schmitt Dalepiane -> Tiago Andrei de Almeida Mendonça -> Vitor da Silva Bonato
PASSED

tests.py::test_busca_e_remocao_no_meio 
--- TESTE 5: Busca e Remoção no Meio ---
PASSED

============================== 5 passed in 0.04s ===============================

```

---

## 4. Comparação: Lista Matricial vs. Lista Dinâmica

| Característica | Lista Matricial (Vetor + PND) | Lista Dinamicamente Encadeada |
| --- | --- | --- |
| **Alocação de Memória** | Estática/Prévia. Aloca um bloco contíguo de tamanho fixo na inicialização. | Sob demanda. Aloca memória na *heap* a cada inserção (`novo_no = No()`). |
| **Liberação de Memória** | Lógica. O índice volta para a PND, mas a RAM segue ocupada pelo vetor. | Física. O *Garbage Collector* libera a memória automaticamente ao cortar os elos. |
| **Esgotamento ("Lista Cheia")** | Limite rígido. Quando a PND esvazia, a lista trava, mesmo sobrando RAM no PC. | Limite elástico. Só ocorre falha se a memória RAM física da máquina acabar (*Out of Memory*). |
| **Complexidade (Inserir/Buscar)** | $O(N)$ - Necessita iteração. | $O(N)$ - Necessita iteração de ponteiro a ponteiro. |
| **Complexidade (Remover Fim)** | $O(N)$ ou $O(1)$ dependendo do controle interno. | $O(1)$ - Acesso direto garantido pelo rastreamento do ponteiro global `fim`. |

**Trade-offs (Vantagens e Desvantagens):**
A abordagem **Matricial** otimiza o uso de cache do processador (L1/L2) devido à contiguidade na memória, não gerando *overhead* de ponteiros. Seu uso faz sentido em sistemas embarcados (como hardwares de rede ou automação industrial) onde a previsibilidade é crítica, a alocação dinâmica é perigosa e o tamanho máximo dos dados é estritamente conhecido e imutável.

A abordagem **Dinâmica** resolve o problema do desperdício de memória ociosa. Ela gasta um pouco mais de bytes por registro (para manter as referências `elop` e `eloa`), mas ganha flexibilidade total de expansão. É a escolha padrão na engenharia de software para estruturas cujo volume máximo de dados em tempo de execução é variável ou imprevisível.

---

## 5. Roteiro da Animação / Demonstração Visual

**Passo 1: Estado Inicial**

* Variáveis globais `inicio = Null` e `fim = Null`.

**Passo 2: `inserirOrdenado("Pedro")**`

* Cria-se um bloco na memória (Nó).
* `inicio` e `fim` apontam para o bloco "Pedro".
* Setas `elop` e `eloa` do bloco "Pedro" apontam para o "Aterramento" (Null).

**Passo 3: `inserirOrdenado("Vitor")**`

* Cria-se novo bloco "Vitor". Como é alfabeticamente maior que "Pedro", entra no fim da lista.
* Seta `elop` do "Pedro" passa a apontar para o bloco "Vitor".
* Seta `eloa` do "Vitor" passa a apontar para o bloco "Pedro".
* Ponteiro global `fim` é atualizado para referenciar o bloco "Vitor".

**Passo 4: `remover("Pedro")**`

* O ponteiro global `inicio` passa a apontar direto para "Vitor".
* A seta `eloa` de "Vitor" perde a ligação com "Pedro" e vira Null.
* O bloco "Pedro" fica completamente isolado (sem referências ativas) e sua memória é recolhida/destruída pelo *Garbage Collector* da linguagem.

---

## 6. Declaração de Uso de Inteligência Artificial

**Ferramenta utilizada:** Google Gemini.

**Finalidade do uso:** Auxílio na estruturação base do código em Python, elaboração da análise arquitetural (trade-offs físicos vs lógicos entre matriz e alocação dinâmica) e montagem dos casos de teste isolados automatizados para validação das operações de manipulação de referências.

**Etapas da atividade em que foi utilizada:** Implementação lógica das classes, estruturação da suíte com `pytest` e documentação textual comparativa.

**Procedimentos adotados para verificar e testar o conteúdo:** O código gerado foi submetido a testes locais no ambiente de execução do grupo em *virtualenv* (utilizando `pytest -v -s` e `main.py`), validando o comportamento dos ponteiros (elop/eloa) nas extremidades e no meio da lista. A validação garantiu a eficácia das atualizações nos testes após a introdução de novos integrantes alterarem a ordenação natural da lista. Realizou-se *code review* e depuração lógica para garantir que a interface pública exigida no enunciado da atividade estava perfeitamente mapeada e as operações possuíam a complexidade correta.

**Assinaturas dos Integrantes:**

---

Tiago Andrei de Almeida Mendonça

---

Vitor da Silva Bonato

---

Pedro Schmitt Dalepiane

---

Henrique Oliveski Bombardiéri