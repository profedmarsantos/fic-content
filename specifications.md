# Especificações do Projeto: Editor de Algoritmos Hierárquicos

## 1. Visão Geral e Infraestrutura
O sistema é um editor de texto estruturado (Outliner) para descrever algoritmos lógicos através de níveis hierárquicos automatizados. 
* **Plataforma:** Aplicação Web (Client-side apenas).
* **Hospedagem:** GitHub Pages via GitHub Actions (`actions/pages`).
* **Tecnologias:** HTML, CSS e Vanilla JavaScript.

## 2. Interface do Usuário (UI)
A tela principal deve ser focada no editor de texto, dividida nos seguintes componentes:
* **Barra de Ferramentas (Topo):** Contém botões para `Abrir Arquivo`, `Salvar Arquivo`, `<-- Diminuir Recuo` e `Aumentar Recuo -->`.
* **Régua de Margem (Gutter):** Localizada à esquerda da área de texto. Exibe a numeração absoluta e física das linhas (1, 2, 3, 4...), similar a IDEs de programação.
* **Área de Edição:** O campo central onde o usuário digita. O texto deve reagir dinamicamente às regras de formatação descritas abaixo.

## 3. Regras de Hierarquia e Formatação Dinâmica
Cada linha pertence a um nível lógico baseado na sua indentação física (espaços em branco). A UI injeta máscaras visuais conforme o nível:

* **Nível 0 (Sem recuo):** Não recebe numeração lógica. O texto digitado é forçado para **MAIÚSCULAS E NEGRITO** dinamicamente. Age como Título ou Declaração de Função.
* **Nível 1 (Recuo base - ex: 4 espaços):** Recebe numeração sequencial inteira (1., 2., 3.).
* **Nível 2 em diante (Múltiplos de 4 espaços):** Recebe numeração lógica decimal aninhada (Ex: 1.1., 1.2., 1.2.1., etc.).
* **Regra de Comentários:** Se a linha começar com o prefixo `//` (ignorando espaços iniciais), ela é renderizada em cor diferente (ex: cinza/itálico). Comentários **não** recebem numeração lógica e **não** quebram a contagem dos passos das linhas vizinhas.

## 4. Comportamento de Teclado (Regras de Negócio)
* **Início:** A primeira linha começa no Nível 1 por padrão.
* **Indentação:** Tecla `Tab` avança a linha atual 1 nível. `Shift + Tab` retrocede 1 nível.
* **Herança (Enter):** Ao pressionar `Enter` em uma linha com texto, a nova linha herda automaticamente o nível (a indentação) da linha anterior.
* **Retrocesso Automático:** Se o usuário pressionar `Enter` em uma linha **completamente vazia**, o editor não cria uma nova linha. Em vez disso, ele retrocede o nível daquela linha em 1 passo (Outdent automático) até atingir o limite raiz.

## 5. Persistência de Dados (Gravação e Leitura de .txt)
O projeto não salva metadados ou HTML. Tudo é inferido através de texto puro usando a quantidade de espaços em branco.

* **Algoritmo de Salvar:** Ao exportar para `.txt`, o sistema pega o texto puro de cada linha e adiciona os espaços físicos correspondentes ao nível atual (ex: 4 espaços para Nível 1, 8 espaços para Nível 2). **A numeração lógica gerada pela UI (1., 1.1.) NÃO deve ser salva no arquivo**, apenas a indentação de espaços e o texto real do usuário.
* **Algoritmo de Abrir/Ler:** Ao carregar um `.txt`, o sistema analisa linha por linha. Ele conta a quantidade de espaços iniciais de cada linha para descobrir em qual Nível ela está (Espaços divididos por 4). Com base nisso, o script reconstrói a árvore na tela, injetando novamente o estilo de Nível 0, a numeração decimal aninhada e a cor dos comentários.