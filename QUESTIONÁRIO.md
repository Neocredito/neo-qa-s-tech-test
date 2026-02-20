**QUESTIONÁRIO**

 Parte 2: Modus Operandi & Mindset (Questionário)

Responda às perguntas abaixo demonstrando seu raciocínio como QA.  
Não existe resposta certa ou errada \- queremos entender seu pensamento analítico.

Estratégia de Regressão

O time realiza implantações semanais em produção.

a) Como você definiria o que entraria na suíte de lazer informalmente ?

A suíte de lazer são basicamente os testes que não podem quebrar de jeito nenhum. É uma seleção enxuta, focando no que, se falhar, paralisa o sistema ou gera dor de cabeça pro usuário. Login, cadastro, listagem, edição e upload de comprovante isso é o core  do sistema e é o que eu rodaria primeiro.

**Login:** se não der pra entrar no sistema, nada funciona.

**Cadastro de Proposta:** CPF válido, idade maior ou igual a 18, campos obrigatórios; status inicial AGUARDANDO\_COMPROVANTE.

**Listagem e Filtros:** separar propostas por status (Aguardando Comprovante / Concluídas), busca por Nome/CPF.

**Edição de Proposta:** só propostas não concluídas; status CONCLUÍDA bloqueia edição.

**Upload de Comprovante:** PDFs/JPGs/PNGs; sucesso → status CONCLUÍDA e bloqueio da proposta.

b) Quais critérios usaria para decidir entre automação vs teste manual?

Pra mim, a escolha depende de **quanto a funcionalidade agrega e quanto tempo a gente tem**.

* Automação dá trabalho no começo: mesmo que depois seja rápida de rodar, levaria tempo pra desenvolver. Se a entrega é apertada ou a funcionalidade é simples, não vale a pena.  
* Funcionalidades simples: cadastro, verificação de carrinho… dá pra testar manualmente rapidinho e não precisam ser foco da automação caso não seja o foco principal do sistema  
* Funcionalidades críticas: que fazem parte do core do sistema, que se der ruim quebra muita coisa, aí sim faz sentido investir na automação.  
* Evitar retrabalho: se a automação for iniciada e por fim teve mudança de contexto, prazo apertado e se decidiu ir pelo manual e depois precisar refatorar porque a funcionalidade mudou, a equipe acaba tendo uma mão de obra a mais pois muitas vezes, dependendo do tempo que o código ficou pausado e da evolução do sistema, precisa ser refeito tudo do zero, se não tiver tempo para manutenção do codigo ele acaba virando inutil no quesito de caçar erros.

c) Como equilibrar velocidade de execução vs cobertura de testes?

Pra mim, o equilíbrio vem de usar testes manuais e automatizados juntos:

* Automação: foca no core do sistema, o que é crítico. Mesmo que seja só nessas partes, garante que os processos essenciais nunca quebrem, antes e durante os releases.  
* Manual: cobre o que a automação não consegue pegar, explorando o sistema com conhecimento real do produto. Isso aumenta a cobertura e ajuda a detectar coisas que só aparecem quando alguém realmente usa a plataforma.

Automação garante velocidade e estabilidade nos pontos críticos.  
 Manual garante maior cobertura e percepção real do produto.  
 Juntos, dão segurança e velocidade sem comprometer a qualidade.

Gestão de Defeitos  
Você está testando em homologação e descobre:

"Ao fazer upload do comprovante, o status não muda para CONCLUÍDA"

Simule o registro deste bug incluindo:

a) Título claro e objetivo

b) Passos detalhados para reprodução

c) Resultado esperado vs obtido

d) Evidências (descreva screenshots/logs que anexaria)

e) Severidade e

**Registro de Bug** 

**Título:** Upload de comprovante não atualiza status para CONCLUÍDA

**Severidade / Prioridade:** Crítico (P1)

**Módulo:** Cadastro de Proposta

**Requisitos relacionados:**

* RF005 — Upload de comprovante

* RF006 — Processamento do comprovante

* RF007 — Alteração automática de status

* RN005 — Upload válido altera status automáticamente para CONCLUÍDA

---

### **Passos para reprodução**

1. Acessar a plataforma de propostas com um usuário válido.

2. Criar uma nova proposta, preenchendo todos os campos obrigatórios.

   * Verificar que o status inicial é **AGUARDANDO\_COMPROVANTE** (RF004 / RN003).

3. Selecionar um arquivo de comprovante válido (PDF, JPG ou PNG).

4. Realizar o upload do arquivo na proposta.

5. Observar o status da proposta após a conclusão do upload.

---

### Resultado esperado

* O sistema deve processar o comprovante enviado e alterar automaticamente o status da proposta para CONCLUÍDA (RF007 / RN005).

### Resultado obtido

* O status permanece como AGUARDANDO\_COMPROVANTE, mesmo após o upload bem-sucedido do arquivo.

---

### **Evidências**

1. **print de tela/gravação:** Tela da proposta mostrando status **AGUARDANDO\_COMPROVANTE** antes do upload.

2. **log ou resposta do servidor no inspecionar :**   
3. **Log do sistema:**  
4. **Arquivo enviado:** comprovante.pdf 

---

### **Observações**

* O bug impacta todos os usuários que realizam upload de comprovante.

* Afeta relatórios e filtros por status, quebrando o fluxo de negócio principal.

* Deve ser tratado como **crítico**, pois impede a conclusão das propostas.

f) Como você comunicaria isso ao tempo? (Equipes? Jira? Reunião?)

Quando eu encontro um bug crítico, normalmente não espero: já mando no grupo do dev ou direto pro dev que eu sei que é responsável. Aí ele fica sabendo na hora e pode começar a ver o que fazer.

No final do dia, gosto de mandar uma listinha de todas as cards que abri naquele dia, só pra deixar todo mundo atualizado do que apareceu e do que ainda está pendente. Assim ninguém fica perdido e todo mundo sabe o que precisa prioridade e elas podem ser discutidas em reunião como a dayli por exemplo.

Pirâmide de Testes  
Considerando a aplicação de pilha desta (React, NestJS, SQLite):

a) Como você distribuiu os testes entre:

Unitários (percentual e responsabilidade)  
Integração (percentual e responsabilidade)  
E2E (percentual e responsabilidade)

Então, nunca trabalhei com Jest, mas já usei bastante Cypress pra testes end to end, que é basicamente testar a aplicação do jeito que o usuário final vai usar.Se eu fosse pensar na pirâmide de testes pra uma aplicação como essa (React \+ NestJS \+ SQLite), eu distribuiria mais ou menos assim:

* Unitários: a maior parte, tipo uns 60–70%. Aqui a ideia é testar funções isoladas, componentes do React ou métodos do backend sem precisar subir tudo.

* Integração: uns 20–30%, pra garantir que os módulos funcionem bem juntos, tipo controller \+ service \+ banco, ou componentes que dependem de APIs internas.

* E2E (Cypress): uns 10–15%, só pros fluxos críticos do usuário, tipo cadastro completo, upload de comprovante e ver se o status muda, login e interações importantes.




b) Justifique sua estratégia considerando:

Custo de  
Tempo de execução  
Confiabilidade  
ROI (retorno sobre investimento)  
c) Dê exemplos práticos de cada tipo para esta aplicação

###  Justificando a estratégia

* Custo: Unitários são baratos, então eu faço a maior parte deles. Integração já dá um pouco mais de trabalho, e E2E é mais caro porque precisa de ambiente completo e dados de teste.

* Tempo de execução: Unitários rodam rapidinho, integração demora um pouco mais, e E2E é lento porque simula o usuário fazendo o fluxo todo.

* Confiabilidade: Unitários pegam bugs de lógica cedo, integração garante que os módulos conversem direito, e E2E garante que o usuário consiga usar a aplicação sem travar.

* ROI: Unitários ajudam a achar problemas antes que virem dor de cabeça, integração evita que partes quebradas passem despercebidas, e E2E garante que o fluxo crítico do usuário funcione, então mesmo sendo caro, vale o investimento.

###             Exemplos práticos

* Unitário: função que valida CPF ou idade mínima, ou método que calcula valores do frontend/backend.

* Integração: controller do NestJS chamando service e salvando no banco, ou componente React que chama a API e mostra o resultado.

* E2E (Cypress): fluxo completo de cadastro → upload de comprovante → status mudando pra CONCLUÍDA, ou login e compra dentro do app simulando comportamento real do usuário.


5️⃣ Validação de Dados

O sistema valida CPF no backend e no frontend.

a) Isso é redundância desnecessária ou boa prática? Por quê?

* **Frontend e backend:**  
   Não é redundância, porque no frontend você evita frustração do usuário, e no backend você protege contra inputs maliciosos. É defesa em camadas.

b) Como você testaria a validação do CPF de forma eficiente?

* Unitário: função que valida CPF (ex.: retorna true/false) → testar CPFs válidos, inválidos e limites.

  * Integração: enviar CPFs inválidos no backend via Postman ou script, ver se o cadastro é bloqueado.

  * E2E (Cypress): simular um usuário tentando cadastrar CPFs inválidos na interface real e validar mensagens de erro.

c) Quais CPFs você usaria como dados de teste e por quê?

* CPF válido real gerado pelo algoritmo (ex.: 529.982.247-25)

  * CPFs óbvios inválidos: 111.111.111-11, 000.000.000-00

Testar formatos diferentes: “52998224725”, “529.982.247-25”, “529-982-247.25”, strings com letras  ver se sistema trata tudo corretamente

6️⃣ Testes Exploratórios

Você tem 2 horas para fazer testes exploratórios nesta aplicação.

a) Como você estruturaria essas 2 horas?  
**Estrutura das 2 horas:**

* **Primeiros 10–15 min:** abrir o app e mapear rapidamente os fluxos de cadastro, upload, login e compras.

  * **Próximos 1h20:** testar casos que realmente quebram algo:

    * Upload de arquivo grande ou inválido

    * Cadastro de usuário menor de 18 anos ou com CPF inválido

    * Status da proposta não atualizando

    * Testar filtros com nomes e CPFs que existem e que não existem

  * **Últimos 20–25 min:** testar bordas e combinações estranhas:

    * Campos vazios, caracteres especiais, múltiplos uploads de uma vez, fechar a aba no meio do upload

    * E documentar tudo direto no Jira ou planilha

b) Quais áreas prioritárias explorariam?  
**Áreas prioritárias:**

* Cadastro e validação de dados → crítico

  * Upload de comprovante e mudança de status → fluxo que o usuário precisa completar

  * Filtros e listagem → garante que o usuário veja dados corretos  
    

* **Tipo de bugs esperados:**

  * Validação quebrando, status não atualizando, UI confusa, erros silenciosos, travamentos no fluxo de cadastro ou upload

c) Que tipo de bugs você tentaria encontrar?  
**Tipo de bugs esperados:**

* Validação quebrando, status não atualizando, UI confusa, erros silenciosos, travamentos no fluxo de cadastro ou upload

d) Como documentaria suas descobertas?

* Lista de bugs com passos, resultado esperado vs obtido, prints/logs.

  * Separar por prioridade (crítico, médio, baixo)