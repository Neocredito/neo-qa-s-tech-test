# PLANO DE TESTES

1\. Objetivo

Este documento descreve os cenários de teste da aplicação utilizando abordagem BDD (Behavior Driven Development), cobrindo caminho feliz, validações, regras de negócio e cenários de erro conforme requisitos definidos.

          Os testes validam:

* criação de proposta  
* validação de CPF  
* validação de idade  
* controle de status  
* upload de comprovante  
* restrições de edição

### 

2\. Regras de Negócio Validadas

* CPF deve ser validado pelo algoritmo completo  
    
* Idade mínima de 18 anos  
    
* Status inicial sempre AGUARDANDO\_COMPROVANTE  
    
* Status não pode ser definido na criação  
    
* Propostas concluídas não podem ser editadas  
    
* Upload de comprovante altera status automaticamente para CONCLUÍDA

### 

### 

### 

### **1\. Requisitos do Sistema**

### **1.1 Requisitos Funcionais (RF)**

### 

RF001 — Cadastro de proposta

O sistema deve permitir cadastrar uma nova proposta com dados pessoais do usuário.

RF002 — Validação de CPF

O sistema deve validar o CPF informado utilizando o algoritmo completo.

RF003 — Validação de idade mínima

O sistema deve permitir cadastro apenas para usuários com idade maior ou igual a 18 anos.

RF004 — Definição automática de status inicial

O sistema deve atribuir automaticamente o status AGUARDANDO\_COMPROVANTE ao criar uma proposta.

RF005 — Upload de comprovante

O sistema deve permitir upload de arquivos nos formatos PDF, JPG ou PNG.

RF006 — Processamento do comprovante

O sistema deve processar o comprovante enviado e atualizar o status automaticamente.

RF007 — Alteração automática de status

Após upload bem-sucedido do comprovante, o sistema deve alterar o status para CONCLUÍDA.

RF008 — Edição de proposta não concluída

O sistema deve permitir edição apenas de propostas não concluídas.

RF009 — Listagem de propostas por status

O sistema deve exibir propostas separadas por status (Aguardando Comprovante e Concluídas).

### 

RF010   Filtro de propostas  
O sistema deve permitir filtrar propostas por nome ou CPF.

**1.2** **Regras de negócio**

RN001  CPF deve ser validado pelo algoritmo completo  
RN002  Idade mínima de 18 anos  
RN003  Status inicial sempre AGUARDANDO COMPROVANTE  
RN004   Propostas concluídas não podem ser editadas  
RN005   Upload válido altera status automáticamente para CONCLUÍDA

**1.3 Requisito não funcional**

RNF001 — Validação de tipo e tamanho de arquivo no upload  
1.2 Regras de Negócio (RN)

# **3\. Priorização de Testes**

## **Critérios de Prioridade**

| Nível | Descrição |
| ----- | :---- |
| Smoke | Fluxos essenciais que bloqueiam uso do sistema |
| Crítico | Alto impacto no negócio |
| Médio | Impacto moderado |
| Baixo | Melhoria de qualidade |

---

##            **Classificação dos Casos de Teste**

| Caso de Teste | Prioridade |       Justificativa |
| ----- | :---- | :---- |
| CT001     Cadastro válido | Smoke | Fluxo principal do sistema |
| CT002     CPF inválido | Crítico | Validação essencial de negócio |
| CT003     Menor de idade | Crítico | Regra legal |
| CT004     Status inicial fixo | Crítico | Integridade do fluxo |
| CT005      Upload válido | Smoke | Conclusão do processo |
| CT006      Upload inválido | Médio | Validação de entrada |
| CT007      Editar proposta | Médio | Funcionalidade secundária |
| CT008      Bloquear edição concluída | Crítico | Integridade dos dados |
| CT009      Listagem por status | Médio | Usabilidade |
| CT010      Filtros | Baixo | Qualidade da experiência |

---

# **4\. Análise de Riscos**

## **Áreas de maior risco**

### **Validação de CPF**

* Pode gerar dados inválidos no sistema.

* Impacto direto no negócio.

### **Mudança automática de status após upload**

* Falha quebra fluxo principal.

* Pode gerar inconsistência de dados.

### **Bloqueio de edição após conclusão**

* Se falhar → integridade comprometida.

### **Processamento assíncrono (fila RabbitMQ simulada)**

* Risco de falha silenciosa.

* Estado inconsistente.

---

## **Impactos possíveis**

* dados inconsistentes

* fraude ou cadastro inválido

* fluxo do usuário interrompido

* propostas em estado incorreto

Cadastro de Proposta  
---

### CT001 — Cadastro de proposta com dados válidos

Requisitos cobertos: RF001, RF002, RF003, RF004, RN001, RN002, RN003  
 Prioridade: Smoke

Pré-condições:

* usuário acessa tela de cadastro

* não existe proposta cadastrada com o CPF informado

Dados de teste:

* CPF válido

* idade maior que 18 anos

* todos os campos obrigatórios preenchidos

Dado que o usuário está na tela de cadastro de proposta  
E informa dados válidos incluindo CPF válido e idade maior ou igual a 18 anos  
Quando confirma o cadastro  
Então o sistema deve criar a proposta com sucesso  
E deve exibir mensagem de confirmação  
E o status da proposta deve ser definido como AGUARDANDO\_COMPROVANTE  
E a proposta deve ser persistida no sistema  
E a proposta deve aparecer na listagem de propostas aguardando comprovante

---

### CT002 — Impedir cadastro com CPF inválido

Requisitos cobertos: RF002, RN001  
 Prioridade: Crítico

Pré-condições:

* usuário com acesso a tela de cadastro

Dado que o usuário informa um CPF inválido  
Quando tenta concluir o cadastro  
Então o sistema não deve criar a proposta  
E deve exibir mensagem informando CPF inválido  
E os dados informados não devem ser persistidos

---

### CT003 — Impedir cadastro para menor de idade

Requisitos cobertos: RF003, RN002  
 Prioridade: Crítico

Pré-condições:

 usuário acessa tela de cadastro

Dado que o usuário informa data de nascimento que indica idade menor que 18 anos  
Quando tenta concluir o cadastro  
Então o sistema deve impedir o cadastro  
E deve exibir mensagem informando idade mínima não atendida  
E nenhuma proposta deve ser registrada

---

### CT004 — Garantir status inicial fixo

Requisitos cobertos: RF004, RN003  
 Prioridade: Crítico

Dado que o usuário preenche todos os dados válidos para cadastro  
Quando cria a proposta  
Então o sistema deve atribuir automaticamente o status AGUARDANDO\_COMPROVANTE  
E não deve permitir definir outro status na criação

---

## Upload de Comprovante

---

### CT005 — Upload de comprovante válido

Requisitos cobertos: RF005, RF006, RF007, RN005, RNF001  
 Prioridade: Smoke

Pré-condições:

* existir proposta com status AGUARDANDO\_COMPROVANTE

Dado que existe uma proposta com status AGUARDANDO\_COMPROVANTE  
Quando o usuário envia arquivo válido nos formatos permitidos (PDF, JPG ou PNG)  
Então o sistema deve aceitar o upload  
E deve processar o arquivo com sucesso  
E o status da proposta deve ser alterado para CONCLUÍDA  
E a proposta deve ser movida para a listagem de propostas concluídas

---

### CT006 — Upload com formato inválido

Requisitos cobertos: RF005, RNF001  
 Prioridade: Médio  
Pré-condições:

* Ter uma proposta com status “Aguardando comprovante”

Dado que existe uma proposta aguardando comprovante  
Quando o usuário envia arquivo em formato não permitido  
Então o sistema deve rejeitar o upload  
E deve exibir mensagem de erro informando formato inválido  
E o status da proposta deve permanecer inalterado

---

## Edição de Proposta

---

### CT007 — Editar proposta não concluída

Requisitos cobertos: RF008  
 Prioridade: Médio

Pré-condições:

* proposta com status diferente de CONCLUÍDA

Dado que existe uma proposta não concluída  
Quando o usuário altera os dados da proposta  
Então o sistema deve permitir a edição  
E deve salvar as alterações realizadas  
E os dados atualizados devem ser exibidos na proposta

---

### CT008 — Bloquear edição de proposta concluída

Requisitos cobertos: RF008, RN004  
 Prioridade: Crítico

Pré-condições:

* Ter uma proposta com status “Concluída”

Dado que existe uma proposta com status CONCLUÍDA  
Quando o usuário tenta editar qualquer campo da proposta  
Então o sistema deve impedir a edição  
E deve manter os dados originais  
E deve informar que propostas concluídas são somente leitura

---

## Listagem e Filtros

---

### CT009 — Listar propostas por status

Requisitos cobertos: RF009  
 Prioridade: Médio

Pré-condições:

* Ter uma proposta com status “Aguardando comprovante” 

Dado que existem propostas com status AGUARDANDO\_COMPROVANTE e CONCLUÍDA  
Quando o usuário acessa a tela de listagem  
Então o sistema deve exibir propostas separadas por status  
E cada proposta deve aparecer apenas na categoria correspondente

---

### CT010 — Filtrar propostas por CPF ou nome

Requisitos cobertos: RF010  
 Prioridade: Baixo

Dado que existem propostas cadastradas  
Quando o usuário aplica filtro por CPF ou nome  
Então o sistema deve exibir apenas propostas que correspondem ao filtro informado  
E as demais propostas não devem ser exibidas

---

## Integração / Fluxo Completo

---

### CT011 — Fluxo completo da proposta

Requisitos cobertos: RF001, RF004, RF005, RF007, RF008, RN003, RN004, RN005  
Prioridade: Smoke

Dado que o usuário cadastra uma proposta com dados válidos

E a proposta é criada com status AGUARDANDO\_COMPROVANTE  
Quando o usuário envia um comprovante válido  
Então o status deve mudar para CONCLUÍDA  
E a proposta deve ficar bloqueada para edição  
E deve aparecer na listagem de propostas concluídas

---

# Casos de Borda 

---

### EC001 — Cadastro com CPF com máscara ou sem máscara

Dado que o usuário informa CPF com formatação ou sem formatação  
Quando realiza o cadastro  
Então o sistema deve validar corretamente o CPF  
E o comportamento deve ser equivalente nos dois casos

---

### EC002 — Upload de arquivo acima do limite permitido

Dado que existe proposta aguardando comprovante  
Quando o usuário envia arquivo acima do limite de tamanho permitido  
Então o sistema deve rejeitar o upload  
E deve informar que o tamanho excede o limite permitido

---

### EC003 — Filtro sem resultados

Dado que não existem propostas correspondentes ao filtro informado  
Quando o usuário aplica o filtro  
Então o sistema deve exibir mensagem informando que não há resultados

---

### EC004 — Sistema sem propostas cadastradas

Dado que não existem propostas cadastradas  
Quando o usuário acessa a listagem  
Então o sistema deve exibir estado vazio  
E deve informar que não existem propostas

# **Matriz de Rastreabilidade**

## **Requisitos Funcionais (RF)**

| Requisito | Casos de Teste |
| :---- | :---- |
| RF001 — Cadastro de proposta | CT001, CT011 |
| RF002 — Validação de CPF | CT001, CT002 |
| RF003 — Validação de idade | CT001, CT003 |
| RF004 — Status inicial automático | CT001, CT004, CT011 |
| RF005 — Upload de comprovante | CT005, CT006, CT011 |
| RF006 — Processamento do comprovante | CT005 |
| RF007 — Alteração automática de status | CT005, CT011 |
| RF008 — Edição de proposta | CT007, CT008, CT011 |
| RF009 — Listagem por status | CT009, CT011 |
| RF010 — Filtro de propostas | CT010 |

---

## **Regras de Negócio** 

| Requisito | Casos de Teste |
| :---- | :---- |
| RN001 — CPF validado por algoritmo | CT001, CT002, EC001 |
| RN002 — Idade mínima 18 anos | CT001, CT003 |
| RN003 — Status inicial fixo AGUARDANDO COMPROVANTE | CT001, CT004, CT011 |
| RN004 — Proposta concluída não editável | CT008, CT011 |
| RN005 — Upload válido altera status para CONCLUÍDA | CT005, CT011 |

---

## **Requisitos Não Funcionais** 

| Requisito |  Casos de Teste |
| :---- | ----- |
| RNF001 — Validação de tipo e tamanho de arquivo | CT005, CT006, EC002 |

