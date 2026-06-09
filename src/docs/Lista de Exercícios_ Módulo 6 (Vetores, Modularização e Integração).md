### **Lista de Exercícios: Módulo 6 (Vetores, Modularização e Integração)**

#### **Exercício 1: Exibição ordenada de uma lista de presença (Vetor de Texto)**

* **Enunciado:** Escreva um algoritmo que armazene o primeiro nome de 3 alunos num vetor. O programa deve ler os 3 nomes utilizando as mensagens sequenciais "Digite o nome do aluno 1: ", "Digite o nome do aluno 2: " e "Digite o nome do aluno 3: ". De seguida, utilizando um laço de repetição `PARA`, exiba a lista de chamada na tela com a mensagem "Aluno na posição \[indice\]: \[nome\]". (Mecânica: vetor de texto de tamanho 3, índices de 1 a 3\)

#### **Exercício 2: Listagem de preços de uma feira (Vetor Real e Varredura)**

* **Enunciado:** Escreva um algoritmo que ajude a registar o preço de 4 produtos na feira. O algoritmo deve ler os 4 valores reais e guardá-los num vetor de preços, exibindo a mensagem "Digite o preço do produto: ". Ao final, utilize um laço `PARA` para percorrer o vetor e exibir todos os preços salvos precedidos por "Preço registado no sistema (R$): ". (Mecânica: vetor real de tamanho 4\)

#### **Exercício 3: Soma automatizada de itens de estoque (Vetor de Inteiros)**

* **Enunciado:** Um pequeno mercado organizou a contagem de caixas de sumos em 3 prateleiras diferentes. Escreva um algoritmo que leia a quantidade de caixas de cada prateleira e armazene-as num vetor de inteiros de 3 posições. De seguida, utilize um laço `PARA` para somar automaticamente os valores guardados dentro do vetor e exiba o resultado com a mensagem "O total de caixas no estoque é: ". (Fórmula: total \= total \+ vetor\[indice\]; Mecânica: acumulação via varredura)

#### **Exercício 4: Substituição de valores nulos em vetor**

* **Enunciado:** Um sensor escolar regista a temperatura ambiente diária de 3 salas de aula. Escreva um algoritmo que leia estas 3 temperaturas num vetor, exibindo "Digite a temperatura da sala (C): ". O programa deve fazer uma varredura nesse vetor e, se encontrar alguma temperatura igual a 0, deve alterá-la na memória para um padrão de 20 graus. Ao final, exiba o vetor atualizado com a mensagem "Temperatura final da sala: ". (Condição interna ao laço: se vetor\[indice\] \== 0 então vetor\[indice\] \= 20\)

#### **Exercício 5: Pesquisa simplificada de elemento em lista**

* **Enunciado:** Escreva um algoritmo que armazene 3 números inteiros escolhidos pelo professor num vetor. O programa lê os 3 números e depois pergunta ao utilizador: "Digite um número para pesquisar na lista: ". O algoritmo deve percorrer o vetor usando um laço e, caso o número digitado seja igual a algum elemento da lista, deve exibir a mensagem "Número encontrado na lista\!". (Condição interna ao laço: se vetor\[indice\] \== numero\_pesquisa)

#### **Exercício 6: Função Saudação Personalizada (Introdução à Modularização)**

* **Enunciado:** Escreva um algoritmo modularizado que possua uma função chamada `saudarUsuario`. Esta função deve receber como parâmetro o nome de uma pessoa e exibir a mensagem estruturada "Olá, \[nome\]\! Seja bem-vindo ao sistema escolar.". O algoritmo principal deve ler o nome do utilizador com "Digite o seu nome: " e fazer a chamada da função passando o nome lido. (Mecânica: Função sem retorno, apenas passagem de parâmetro de texto)

#### **Exercício 7: Função para cálculo do Dobro (Retorno de Valor)**

* **Enunciado:** Escreva um algoritmo contendo uma função chamada `calcularDobro`. Esta função deve receber um número inteiro como parâmetro, calcular o seu dobro e retornar o resultado para o programa principal. O programa principal deve ler um número do utilizador com "Digite um número: ", chamar a função e exibir o valor retornado acompanhado de "O dobro calculado pela função é: ". (Fórmula interna da função: retorno \= numero \* 2\)

#### **Exercício 8: Função Somar Dois Números (Múltiplos Parâmetros)**

* **Enunciado:** Escreva um algoritmo que isole a lógica da adição. Crie uma função chamada `somarValores` que receba dois números inteiros como parâmetros. A função deve calcular a soma deles e retornar o resultado. O programa principal deve ler duas entradas ("Digite o primeiro valor: " e "Digite o segundo valor: "), enviar ambas para a função e exibir o resultado final com a mensagem "O resultado da soma é: ". (Fórmula interna da função: retorno \= valor1 \+ valor2)

#### **Exercício 9: Função validadora de acesso (Retorno Booleano/Texto)**

* **Enunciado:** Escreva um algoritmo com uma função chamada `verificarAcesso` que receba uma senha textual como parâmetro. Se a senha for igual a "escola123", a função deve retornar o texto "Acesso Liberado". Caso contrário, deve retornar "Acesso Bloqueado". O programa principal lê a senha digitada pelo utilizador com "Digite a senha de acesso: ", envia para a função e exibe na tela o texto de retorno retornado por ela. (Condição interna da função: se senha \== "escola123")

#### **Exercício 10: Integração Final (Vetor e Função Combinados)**

* **Enunciado:** Para fechar o curso, escreva um algoritmo integrado. Crie uma função chamada `mostrarMensagem` que recebe a nota de um aluno e exibe na tela "Nota processada: \[nota\]". No programa principal, crie um vetor de tamanho 3 e leia a nota de 3 avaliações de um estudante. Utilizando um laço `PARA`, percorra o vetor de notas e, para cada posição do vetor, faça a chamada da função `mostrarMensagem` enviando a nota correspondente armazenada naquela gaveta. (Mecânica: Laço percorrendo vetor e enviando cada elemento como parâmetro)

