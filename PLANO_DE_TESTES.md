# Plano de Testes – Neo Crédito

## 1. Objetivo

Este plano de testes tem como objetivo garantir a qualidade do sistema de Gestão de Propostas de Crédito, validando os fluxos principais, as regras de negócio críticas e a integridade dos dados das propostas.

O foco é reduzir riscos em produção, especialmente relacionados ao controle de status, validação de dados (CPF e idade) e fluxo de upload de comprovantes.

---

## 2. Escopo

### Dentro do escopo
- Cadastro de nova proposta
- Validação de CPF e data de nascimento (idade mínima)
- Listagem de propostas por status
- Filtros por nome e CPF
- Edição de propostas não concluídas
- Upload de comprovante
- Mudança automática de status para “Concluída”
- Bloqueio de edição para propostas concluídas
- Exibição correta de dados e totais no dashboard

### Fora do escopo
- Testes de performance e carga
- Testes de segurança avançados
- Compatibilidade cross-browser aprofundada

---

## 3. Estratégia de Testes

### Frontend
- Validação de campos obrigatórios
- Mensagens de erro ao usuário
- Exibição e formatação correta de dados
- Bloqueio de ações na interface (ex: edição de proposta concluída)

### Backend / API
- Validação das regras de negócio (CPF válido, idade mínima)
- Garantia de status inicial fixo na criação da proposta
- Persistência correta de dados
- Bloqueio de edição de propostas concluídas
- Validação de upload e mudança automática de status

### Integração
- Fluxo completo: criar proposta -> editar -> upload -> concluir
- Sincronização entre frontend e backend
- Atualização correta de status e listas após upload

---

## 4. Critérios de Priorização

- **Smoke Test**  
  Funcionalidades essenciais para uso do sistema (criação de proposta, upload de comprovante e mudança de status).

- **Crítico**  
  Regras de negócio e integridade dos dados (CPF, idade mínima, status, bloqueio de edição).

- **Médio**  
  Funcionalidades importantes com possível workaround (listagens e filtros).

- **Baixo**  
  Ajustes visuais, mensagens ao usuário e melhorias de UX.

---

## 5. Análise de Riscos

- **Gestão de status da proposta**  
  Risco de inconsistência entre criação, edição manual e conclusão via upload.

- **Datas e cálculo de idade**  
  Risco de divergência de datas devido a conversões de formato/timezone, podendo impactar a regra de idade mínima (>=18).  
  Durante testes exploratórios foi identificado comportamento inconsistente nesse ponto.

- **Upload de comprovante**  
  Risco de falha na mudança automática de status, aceitação de arquivos inválidos, uploads duplicados ou problemas de tamanho de arquivo.

- **Bloqueio de edição**  
  Risco de edição indevida de propostas concluídas, especialmente via acesso direto à API.

- **Dashboard**  
  Risco de inconsistência nos totais de propostas e status exibidos.

---

## 6. Mapeamento de Cenários de Teste

### Categorias de Teste (visão geral)
- **Cenários Positivos (Caminho Feliz):** validação dos fluxos principais de cadastro, edição permitida, listagem e upload de comprovante.
- **Cenários Negativos:** validações de CPF inválido, idade menor que 18 anos, campos obrigatórios, upload inválido ou indevido e tentativas de edição não permitidas.
- **Casos de Borda:** idade exatamente 18 anos, datas limite (futuras/bissexto/formatos), CPF com e sem máscara e filtros parciais.
- **Integração entre Funcionalidades:** fluxo completo de criar proposta -> listar -> editar -> fazer upload -> mudar status -> bloquear edição -> refletir nas listas e dashboard.

### Cadastro de Proposta
- **Positivos**: cadastro com dados válidos
- **Negativos**: CPF inválido, idade < 18, campos obrigatórios vazios
- **Borda**: idade exatamente 18 anos, data futura, data bissexta, CPF com e sem máscara
- **Regra de negócio**: status inicial sempre “AGUARDANDO_COMPROVANTE”, mesmo via API
- **Prioridade**: Smoke / Crítico

### Listagem e Filtros
- Listagem correta por status (Aguardando vs Concluídas)
- Filtro por nome
- Filtro por CPF parcial
- Combinação de filtros (status + nome/CPF)
- Nenhum resultado encontrado
- Botão “Limpar” resetando filtros
- **Prioridade**: Médio

### Edição de Proposta
- Edição de proposta em status “Aguardando Comprovante”
- Alteração manual de status (valores permitidos)
- Bloqueio de edição de proposta concluída (UI)
- Tentativa de edição via API em proposta concluída
- **Prioridade**: Crítico

### Upload de Comprovante
- Upload de arquivo válido (PDF, JPG, PNG)
- Upload de arquivo inválido
- Upload sem arquivo
- Upload duplicado
- Upload de arquivo grande
- Upload em proposta inexistente
- Upload em proposta já concluída
- Mudança automática de status para “Concluída”
- Remoção da proposta da lista “Aguardando” e exibição em “Concluídas”
- **Prioridade**: Smoke / Crítico

### Dashboard
- Total de propostas consistente com as listas
- Atualização dos totais após criação de proposta
- Atualização dos totais após upload e mudança de status
- **Prioridade**: Médio

### Validações Diretas de Backend / API
- Criação de proposta com payload inválido (CPF, idade, status)
- Tentativa de alteração de status indevida via API
- Edição de proposta concluída via API
- Upload de comprovante para proposta inexistente
- **Prioridade**: Smoke / Crítico