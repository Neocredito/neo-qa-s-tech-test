
# Respostas do questionário


# Estratégia de Regressão

### a 
    Na suíte de regressão entram os fluxos mais críticos para o negócio, ou seja, aqueles que se falharem comprometem o uso do sistema em produção. A priorização também considera funcionalidades usadas em todo deploy, regras de negócio sensíveis a erro e cenários com histórico de falhas a cada mudança.

    No contexto da Neo Crédito, isso inclui a criação de propostas com dados válidos, a garantia de que o status inicial seja sempre “AGUARDANDO_COMPROVANTE”, o fluxo de upload de comprovante e o bloqueio de edição de propostas concluídas. Esses são alguns dos cenários que precisam estar sempre estáveis a cada release.

### b
    Eu priorizo a automação de cenários estáveis, repetitivos e críticos para o negócio, que precisam ser executados a cada deploy. Testes manuais ficam para validações visuais, comportamentos que mudam com mais frequência e cenários exploratórios.

    Na Neo Crédito, automatizaria fluxos como a criação de propostas com dados válidos, a validação do status inicial, o upload de comprovante com mudança automática de status e o bloqueio de edição de propostas concluídas. Já ajustes de layout, mensagens específicas de erro e a experiência de uso do dashboard, geralmente são validados manualmente.

### c
    Optaria por uma suíte mais enxuta de testes automatizados, que roda rápido e valida os fluxos mais críticos do sistema. A ideia não é cobrir tudo no pipeline principal, mas garantir confiança no que realmente pode quebrar o uso do produto a cada deploy. Na pipeline principal eu rodaria unit + integração + um smoke E2E curto.
    Cenários mais pesados ou menos críticos ficam fora da execução contínua e podem rodar de forma agendada ou sob demanda.



# Gestão de Defeitos
##  SIMULAÇÃO DE REGISTRO DE BUG: 
    
    Upload de comprovante não altera status da proposta para CONCLUÍDA
    
    Ambiente: 
        Homologação/Local
        Frontend: http://localhost:3000
        Backend: http://localhost:3333


    Branch: thiago-gabiatti


    Passos para reprodução:
    1. Acessar a tela de propostas
    2. Criar uma proposta válida (CPF válido, idade >= 18)
    3. Confirmar que a proposta foi criada com status AGUARDANDO_COMPROVANTE
    4. Abrir a proposta criada (visualizar/detalhe)
    5. Realizar upload de um arquivo permitido (ex: PDF/JPG/PNG)
    6. Após o upload, verificar o status exibido na tela e/ou na listagem


    Resultado esperado vs obtido
    Esperado:
        Após upload com sucesso do comprovante, o status da proposta deve mudar automaticamente para CONCLUÍDA e a proposta deve ficar bloqueada para edição.

    Obtido:
        O upload é realizado, porém o status permanece AGUARDANDO_COMPROVANTE (ou não atualiza para CONCLUÍDA), mantendo a proposta editável indevidamente.


    Evidências (o que eu anexaria)
    1. Screenshot/vídeo do fluxo mostrando:
        a. status antes do upload (AGUARDANDO_COMPROVANTE)
        b. upload concluído com sucesso
        c. status após upload sem mudança

    2. Log/Network do navegador:
        a. request POST /propostas/:id/comprovante
        b. status HTTP da response
        c. body da response

    3. Arquivos utilizados durante o teste
        a. CPF utilizado no teste "12345678909"
        b. Arquivo utilizado no upload "comprovante.png"


    Severidade e justificativa
        Alta! (Crítica para o fluxo principal)
        Justificativa: quebra regra de negócio central do sistema, impede a conclusão correta da proposta e mantém o estado incorreto, com risco de permitir edição indevida e afetar o negócio.


    Como comunicaria ao time?
        Abriria um ticket no Jira/Azure DevOps com esse registro e anexos (prints + logs);
        Avisaria no Teams no canal do time (mensagem curta) destacando que há um bloqueio do fluxo principal: “upload não conclui proposta”;
        Se estiver perto de deploy/release: alinharia rapidamente em call (5 min) para garantir prioridade e evitar ir para produção com esse problema.



# Pirâmide de Testes

### a Como você distribuiria os testes:
    Unitários - 60%
    Responsabilidade: validar regras e comportamentos isolados com execução rápida.
    Backend: validações de domínio (CPF, idade >=18), regras de status, bloqueios, mapeamentos/transformações.
    Frontend: funções utilitárias (formatação/parse de data), validações locais (quando existirem), componentes simples (renderização e estados básicos) sem depender de API.

    Integração - 30%
    Responsabilidade: garantir que os fluxos principais funcionam no nível de API e persistência, com banco, integrados.
    Cobrir endpoints, validações no service, persistência de dados, transições de status, bloqueios.

    E2E - 10%
    Responsabilidade: validar fluxos ponta a ponta críticos do usuário, garantindo que o sistema esteja funcionando corretamente.
    Podendo ser pela UI ou via API quando o objetivo for validar regra/integração.

### b Justifique sua estratégia:
    Justificativa (custo, tempo, confiabilidade, ROI)

    Custo de manutenção: E2E é o mais caro (quebra com mudança de UI/fluxo). Integração tem custo moderado. Unitário é o mais barato de manter.

    Tempo de execução: Unitário roda em segundos, integração em alguns minutos, E2E é o mais lento. Para deploy semanal, manter o pipeline rápido é essencial.

    Confiabilidade: Unitário e integração são mais confiáveis. E2E tende a "flake" (timing, seletor, ambiente). Por isso deve ser um E2E pequeno e bem escolhido.

    ROI: O melhor retorno vem de testar regras críticas o mais “baixo” possível (unit/integração), porque pega bug cedo e com menos retrabalho. E2E fica para garantir que o fluxo principal não quebrou do ponto de vista do usuário.

### c Dê exemplos práticos:
    Unitários
        Backend:

            validação de CPF (válido/inválido)

            validação de idade (17, 18, 18+)

            regra “status inicial sempre AGUARDANDO_COMPROVANTE”

            regra “não permite editar se CONCLUÍDA”

        Frontend:

            formato de data (evitar bug de timezone/data “voltando um dia”)

            validações do formulário (campos obrigatórios, máscara/normalização de CPF)

    Integração (API + DB)

        POST /propostas cria proposta com status correto e valida CPF/idade

        GET /propostas?status=...&nome=...&cpf=... retorna lista filtrada corretamente

        PUT /propostas/:id permite editar se aguardando e bloqueia se concluída

        POST /propostas/:id/comprovante aceita PDF/JPG/PNG, rejeita inválidos, atualiza status para CONCLUÍDA e persiste a mudança

        Upload para proposta inexistente retorna erro adequado

    E2E (UI) — poucos e essenciais

        Criar proposta válida e aparecer na lista “Aguardando”

        Editar proposta aguardando e salvar

        Fazer upload de comprovante e ver status mudar para “Concluída”

        Confirmar que após concluir a edição fica bloqueada (UI)

# 5. Validação de Dados

### a Isso é redundância desnecessária ou boa prática? Por quê?
    É uma boa prática, frontend valida para dar feedback rápido e melhorar UX, o backend irá validar por segurança e integridade. 
    Ele (backend) precisa proteger o sistema contra chamadas diretas, automações, scripts e clientes fora do front.
    O risco de validar só no front é aceitar dado inválido via API. O risco de validar só no back é UX ruim e mais chamadas desnecessárias.

### b Como você testaria a validação de CPF de forma eficiente?
    Eu testaria em camadas, buscando cobertura alta com baixo custo:
    Unit (rápido): testar a função de CPF (válidos, inválidos, bordas).
    Isso pega a maior parte dos bugs com uma execução rápida.

    Integração/API: testar POST /propostas garantindo que CPFs inválidos retornam erro consistente e que CPFs válidos passam.
    Focando no comportamento do sistema.

    UI (mínimo): confirmar que o formulário impede envio e exibe mensagem quando CPF é inválido, e que permite prosseguir quando válido.

### c Quais CPFs eu usaria como dados de teste e por quê?
    Eu usaria um conjunto pequeno, mas eficaz:

        Válidos (controle positivo)
            123.456.789-09 e 12345678909 (com e sem máscara)

            111.444.777-35 e 11144477735 (segundo válido conhecido)

    Inválidos (controle negativo)

        CPF com dígito verificador errado (ex: alterar 1 dígito de um CPF válido)

        CPF com tamanho errado (menos de 11 e mais de 11)

        CPF com caracteres não numéricos em formato inválido (ex: abc, 123.456)

        CPFs “clássicos inválidos” que muita lib bloqueia: 00000000000, 11111111111, etc.

    Motivo: cobre formatos, máscaras, regra de dígito verificador e entradas comuns de usuários.


# 6. Testes Exploratórios

### 6.a Como eu estruturaria essas 2 horas?
    Eu dividiria em blocos curtos com objetivo claro:

    10 min - Setup + entendimento rápido
    Subir app, entender telas e fluxos, checar dados iniciais, confirmar rotas principais.

    20 min - Smoke exploratório do fluxo principal
    Criar proposta válida, listar, editar, fazer upload e confirmar mudança de status e bloqueio.

    40 min - Explorar riscos críticos (maior profundidade)
    Focar em CPF/idade/data, status e transições, bloqueios, upload (tipo/tamanho/duplicado), consistência front x back.

    30 min - Filtros e comportamento de lista/dashboard
    Filtros combinados, dados parciais, nenhum resultado, limpar filtros, atualização do dashboard após ações.

    15 min - Exploração com tentativa de “quebrar regra”
    Tentativas via UI e via API (Postman) para editar concluída, criar com status indevido, upload em id inválido.

    5 min - Finalização
    Organizar achados, priorizar, e preparar evidências.

### 6.b Que áreas eu priorizaria explorar?
    Prioridade máxima para o que quebra regra de negócio ou integridade do sistema:
        - Validação de dados: CPF, idade mínima, datas e timezone
        - Status: status inicial fixo, mudança para CONCLUÍDA no upload, consistência entre listas
        - Bloqueios: edição proibida quando CONCLUÍDA (UI e API)
        - Upload: formatos aceitos, tamanho, duplicado, proposta inexistente
        - Consistência front/back: o que a UI mostra vs o que a API persiste
        - Dashboard: totais e atualização após mudanças

### 6.c Que tipo de bugs eu tentaria encontrar?
    - Quebra de regra de negócio: menor de 18 aprovado, status errado, editar concluída
    - Inconsistência de dados: datas mudando, status divergente, UI diferente da API
    - Erros de validação: CPF com máscara aceito em um lugar e rejeitado em outro
    - Problemas de upload: aceita formato errado, não atualiza status
    - Problemas de listagem/filtro: filtro parcial retornando errado, limpar não limpando filtro, nenhum resultado quebrando UI
    - Tratamento de erro ruim: 500 sem mensagem, UI sem feedback

### 6.d Como eu documentaria as descobertas?
    Eu registraria em um documento simples com foco em:
        - Lista de achados por severidade e impacto (Crítico/Alto/Médio/Baixo)
        - Para cada bug: título, passos, esperado vs obtido, evidências
        - Evidências: prints, vídeos curtos e logs de network quando relevante
        - Separar “bug” de “melhoria/UX”
        - Se possível, criar tickets no board e deixar o doc como resumo executivo do que foi encontrado nas 2 horas