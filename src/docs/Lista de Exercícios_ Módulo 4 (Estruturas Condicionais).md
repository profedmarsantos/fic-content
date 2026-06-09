### **Lista de Exercícios: Módulo 4 (Estruturas Condicionais)**

#### **Exercício 1: Verificação de maioridade legal**

* **Enunciado:** Escreva um algoritmo que determine se uma pessoa já atingiu a maioridade. Leia a idade do usuário exibindo a mensagem "Digite a sua idade: ". Se a idade for maior ou igual a 18, exiba a mensagem "Você já é maior de idade.". Caso contrário, exiba "Você ainda é menor de idade.". (Condição: idade \>= 18\)

#### **Exercício 2: Alerta de velocidade em via pública**

* **Enunciado:** Um sensor de trânsito monitora uma via cujo limite de velocidade é de 60 km/h. Escreva um algoritmo que leia a velocidade medida de um veículo, exibindo "Digite a velocidade detectada (km/h): ". Se a velocidade for maior que 60, exiba a mensagem "Veículo MULTADO por excesso de velocidade\!". Caso contrário, exiba "Velocidade permitida.". (Condição: velocidade \> 60\)

#### **Exercício 3: Validação de saque bancário simplificado**

* **Enunciado:** Escreva um algoritmo que avalie a possibilidade de um saque em dinheiro. Leia o saldo atual de uma conta e o valor que o cliente deseja sacar, exibindo "Digite o seu saldo atual (R$): " e "Digite o valor do saque (R$): ". Se o saldo for suficiente para cobrir o saque, calcule o novo saldo e exiba "Saque realizado com sucesso\!". Caso contrário, exiba "Saldo insuficiente para realizar a operação.". (Condição: saldo \>= valor\_saque)

#### **Exercício 4: Classificação de faixa etária desportiva**

* **Enunciado:** Uma escolinha de futebol comunitária divide os alunos em três categorias por idade. Escreva um algoritmo que leia a idade do aluno exibindo "Digite a idade do atleta: ". O programa deve exibir a categoria correta com base nas seguintes regras: se tiver até 10 anos, exiba "Categoria: Sub-10"; se tiver entre 11 e 14 anos, exiba "Categoria: Sub-14"; se tiver 15 anos ou mais, exiba "Categoria: Sub-17". (Condições encadeadas)

#### **Exercício 5: Saudação conforme o período do dia**

* **Enunciado:** Escreva um algoritmo que automatize a recepção de um sistema com base na hora informada (formato de 24 horas). Leia a hora atual exibindo "Digite a hora atual (apenas o número inteiro): ". Se a hora for menor que 12, exiba "Bom dia\!". Se a hora for maior ou igual a 12 e menor que 18, exiba "Boa tarde\!". Caso contrário, exiba "Boa noite\!". (Condições encadeadas)

#### **Exercício 6: Triagem de pacotes por peso**

* **Enunciado:** O correio de uma escola classifica os pacotes recebidos em três tamanhos de transporte pelo seu peso. Escreva um algoritmo que leia o peso de um pacote (em kg), exibindo "Digite o peso do pacote (kg): ". Se o peso for menor ou igual a 2 kg, exiba "Transporte: Caixa Leve". Se for maior que 2 kg e menor ou igual a 10 kg, exiba "Transporte: Caixa Padrão". Caso contrário, exiba "Transporte: Caixa Pesada". (Condições encadeadas)

#### **Exercício 7: Aprovação combinada (Nota e Presença)**

* **Enunciado:** Neste algoritmo, o estudante precisa cumprir dois requisitos para passar de ano. Leia a média final do aluno e o seu total de faltas, exibindo "Digite a média final: " e "Digite o total de faltas no ano: ". Para ser aprovado, a média deve ser maior ou igual a 6.0 E o número de faltas deve ser menor ou igual a 10\. Se as duas condições forem verdadeiras, exiba "Estudante APROVADO\!". Caso contrário, exiba "Estudante REPROVADO\!". (Operador Lógico: media \>= 6.0 E faltas \<= 10\)

#### **Exercício 8: Critério de desconto para estudantes ou idosos (Operador OU)**

* **Enunciado:** Um cinema local oferece meia-entrada para quem for estudante OU para quem tiver 60 anos ou mais. Escreva um algoritmo que pergunte se a pessoa é estudante (lendo o texto "sim" ou "nao") e leia também a sua idade, exibindo "É estudante? (sim/nao): " e "Digite a sua idade: ". Se a resposta do estudante for igual a "sim" OU se a idade for maior ou igual a 60, exiba "Você tem direito à Meia-Entrada\!". Caso contrário, exiba "Ingresso Inteiro.". (Operador Lógico: estudante \== "sim" OU idade \>= 60\)

#### **Exercício 9: Verificação de número par ou ímpar (Uso do resto)**

* **Enunciado:** Escreva um algoritmo que identifique a natureza de um número. Leia um número inteiro informado pelo usuário, exibindo a mensagem "Digite um número inteiro: ". Calcule o resto da divisão desse número por 2\. Se o resto for igual a 0, exiba "O número digitado é PAR.". Caso contrário, exiba "O número digitado é ÍMPAR.". (Fórmula de apoio: resto \= numero % 2; Condição: resto \== 0\)

#### **Exercício 10: Validação de cupom de desconto em compras**

* **Enunciado:** Uma loja virtual dá desconto se o cliente fizer uma compra de valor alto OU se ele tiver o cupom especial de primeira compra. Escreva um algoritmo que leia o valor total da compra e pergunte se possui o cupom, exibindo "Valor total da compra (R$): " e "Possui o cupom 'QUERO10'? (sim/nao): ". Se o valor da compra for maior que 150.00 OU a resposta do cupom for igual a "sim", exiba "Desconto de 10% aplicado\!". Caso contrário, exiba "Sem direito a descontos.". (Operador Lógico: valor\_compra \> 150.00 OU cupom \== "sim")

