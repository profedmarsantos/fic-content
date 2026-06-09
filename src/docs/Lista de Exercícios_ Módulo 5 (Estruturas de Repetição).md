### **Lista de Exercícios: Módulo 5 (Estruturas de Repetição)**

#### **Exercício 1: Contador de passos (Contagem crescente com PARA)**

* **Enunciado:** Escreva um algoritmo que simule a contagem de passos de uma caminhada. O algoritmo deve exibir na tela uma contagem automatizada de 1 até 10, simulando os passos. Cada linha da saída deve mostrar a mensagem "Passo número: \[exibir contador\]". (Estrutura indicada: PARA de 1 ate 10\)

#### **Exercício 2: A tabuada de um número (Multiplicação repetitiva com PARA)**

* **Enunciado:** Escreva um algoritmo que gere a tabuada de um número inteiro introduzido pelo utilizador. Leia o número exibindo a mensagem "Digite o número que deseja ver a tabuada: ". Utilizando um laço de repetição, exiba os resultados da multiplicação desse número de 1 até 10 no formato de texto: "\[número\] \* \[contador\] \= \[resultado\]". (Fórmula: resultado \= numero \* contador; Estrutura indicada: PARA de 1 ate 10\)

#### **Exercício 3: Contagem decrescente para lançamento (PARA invertido)**

* **Enunciado:** Escreva um algoritmo que faça uma contagem decrescente de 5 até 1, simulando o cronómetro para o lançamento de um minifoguete numa feira de ciências. A cada segundo do laço, exiba a mensagem "Faltam \[contador\] segundos\!". Ao final, fora do laço, exiba "Decolar\!". (Estrutura indicada: PARA de 5 ate 1 com passo \-1)

#### **Exercício 4: Somatório de pacotes de doação (Acumulador com PARA)**

* **Enunciado:** Uma turma de estudantes recolheu 4 caixas de alimentos. Escreva um algoritmo que leia o peso de cada uma das 4 caixas. O programa deve usar um laço para pedir os pesos exibindo a mensagem "Digite o peso da caixa (kg): ". À medida que os pesos são introduzidos, o algoritmo deve somá-los e, ao final do laço, exibir a mensagem "O peso total dos alimentos arrecadados é (kg): ". (Fórmula: total\_peso \= total\_peso \+ peso\_caixa; Estrutura indicada: PARA de 1 ate 4\)

#### **Exercício 5: Validação de Senha Padrão (Estrutura ENQUANTO)**

* **Enunciado:** Escreva um algoritmo que simule o bloqueio de um cofre digital eletrónico. O cofre só abre se o utilizador digitar a senha correta que é "1234". O algoritmo deve ler a senha exibindo "Digite a senha do cofre: ". Enquanto a senha digitada for diferente de "1234", o programa deve exibir "Senha Incorreta\! Tente novamente: " e ler a senha outra vez. Quando o utilizador acertar, exiba fora do laço "Acesso Concedido. Cofre Aberto\!". (Condição do laço: senha \!= "1234"; Estrutura indicada: ENQUANTO)

#### **Exercício 6: Caixa de supermercado contínuo (Flag de paragem com ENQUANTO)**

* **Enunciado:** Um operador de caixa quer somar os valores das compras de um cliente, mas não sabe quantos produtos ele comprou. Escreva um algoritmo que leia o valor do produto exibindo "Digite o valor do produto (ou 0 para encerrar): ". Enquanto o valor digitado for maior que 0, o algoritmo deve acumular esse valor no total e pedir o valor do próximo produto. Quando for digitado 0, o laço termina e exibe a mensagem "O valor total da compra foi (R$): ". (Fórmula: total \= total \+ valor\_produto; Condição do laço: valor\_produto \> 0; Estrutura indicada: ENQUANTO)

#### **Exercício 7: Controlo de nível de reservatório de água (ENQUANTO)**

* **Enunciado:** Um reservatório de água escolar começa o dia com 100 litros e consome fixamente 20 litros a cada hora de aula. Escreva um algoritmo que utilize um laço para mostrar a perda de água hora a hora. O laço deve repetir enquanto a quantidade de água for maior que 0\. A cada repetição, subtraia 20 litros e exiba "Água restante no reservatório (litros): ". ao chegar a zero, exiba "Alerta: Reservatório vazio\!". (Fórmula: agua \= agua \- 20; Condição: agua \> 0; Estrutura indicada: ENQUANTO)

#### **Exercício 8: Menu simples de atendimento (Estrutura FAÇA...ENQUANTO)**

* **Enunciado:** Escreva um algoritmo que apresente um menu de opções para o utilizador. O menu deve exibir: "1 \- Ver Saldo", "2 \- Ver Extrato", "3 \- Sair do Sistema". O algoritmo deve executar o menu obrigatoriamente a primeira vez e ler a opção escolhida através da mensagem "Escolha uma opção: ". Se o utilizador digitar 1 ou 2, o programa mostra uma mensagem de simulação correspondente e repete o menu. O laço só deve parar quando a opção digitada for igual a 3\. (Condição de repetição: opcao \!= 3; Estrutura indicada: FAÇA...ENQUANTO)

#### **Exercício 9: Tentativas de Login limitado (Contador em FAÇA...ENQUANTO)**

* **Enunciado:** Um sistema escolar permite que o utilizador tente digitar a sua senha de acesso até 3 vezes. Escreva um algoritmo que execute um bloco de leitura da senha exibindo "Digite a sua senha de acesso: ". A cada tentativa incorreta, o algoritmo aumenta um contador de tentativas. O laço deve continuar a pedir a senha FAÇA...ENQUANTO a senha for incorreta E o número de tentativas for menor que 3\. (Condição de repetição: senha \!= "correta" E tentativas \< 3; Estrutura indicada: FAÇA...ENQUANTO)

#### **Exercício 10: Entrada de dados com confirmação (FAÇA...ENQUANTO)**

* **Enunciado:** Escreva um algoritmo que leia o nome de um aluno para um cadastro desportivo e, logo em seguida, pergunte se o utilizador deseja continuar a cadastrar mais alunos. Exiba "Digite o nome do aluno: " e depois "Deseja cadastrar outro aluno? (sim/nao): ". O laço deve repetir a leitura do nome sempre que a resposta for igual a "sim". (Condição de repetição: resposta \== "sim"; Estrutura indicada: FAÇA...ENQUANTO)

