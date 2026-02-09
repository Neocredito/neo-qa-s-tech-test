# 🧪 Desafio QA Engineer - Neo Crédito

Seja bem-vindo(a) ao nosso desafio técnico para **Quality Assurance (QA)**.  
A proposta é avaliar sua capacidade analítica, estratégia de testes, raciocínio crítico e conhecimento de boas práticas de Engenharia de Qualidade.

---

## 🎯 Contexto do Produto

Você atuará como QA responsável por garantir a qualidade de uma aplicação **Full-Stack** de **Gestão de Propostas de Crédito**.

### 🏗️ Stack Técnica

- **Frontend:** Next.js + React + TypeScript + Tailwind CSS  
- **Backend:** NestJS + TypeScript (Arquitetura DDD)  
- **Banco de Dados:** SQLite (via TypeORM)  
- **Mensageria:** Simulação de fila (console logs)

### 🔁 Fluxo Crítico da Aplicação

1. **Cadastro de Proposta**  
   - Usuário cadastra uma nova proposta com dados pessoais
   - Status inicial é **FIXO**: `AGUARDANDO_COMPROVANTE`
   - Validações: CPF válido, idade mínima de 18 anos, campos obrigatórios

2. **Listagem e Filtros**  
   - Duas telas separadas por status:
     - Propostas "Aguardando Comprovante"
     - Propostas "Concluídas"
   - Filtros disponíveis: Nome e CPF

3. **Edição de Proposta**  
   - Permite editar dados de propostas **não concluídas**
   - Pode alterar status manualmente
   - **Propostas concluídas** entram em modo somente leitura

4. **Upload de Comprovante**  
   - Upload de arquivo (PDF, JPG, PNG)
   - Arquivo é "processado" (simulação de fila RabbitMQ)
   - Se bem-sucedido:
     - Status muda **automaticamente** para `CONCLUÍDA`
     - Proposta fica **bloqueada para edição**

---

## 🚀 Como Executar a Aplicação

### Backend
```bash
cd backend
npm install
npm run start:dev
```
Backend disponível em: `http://localhost:3333`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend disponível em: `http://localhost:3000`

### 🔗 Endpoints da API
```
POST   /propostas              - Criar proposta
GET    /propostas              - Listar propostas (aceita filtros: ?status=X&nome=Y&cpf=Z)
GET    /propostas/:id          - Buscar proposta específica
PUT    /propostas/:id          - Atualizar proposta
POST   /propostas/:id/comprovante - Upload de comprovante (FormData)
```

---

## 📋 O Desafio

O desafio é dividido em **três partes principais**:

### 1️⃣ Planejamento de Testes (OBRIGATÓRIO)
### 2️⃣ Modus Operandi & Mindset - Questionário (OBRIGATÓRIO)
### 3️⃣ Automação de Testes (BÔNUS)

---

## 🧩 Parte 1: Planejamento de Testes (Test Design)

Crie um documento detalhado de planejamento de testes para esta feature.  
Pode ser no próprio `README.md` ou em um arquivo separado (ex: `PLANO_DE_TESTES.md`).

### 📝 O que esperamos ver:

#### ✅ Mapeamento de Cenários de Teste
Organize os casos de teste em categorias:

**1. Testes Funcionais**
- Cenários positivos (Caminho Feliz)
- Cenários negativos (Validações e erros)
- Casos de borda (Edge Cases)
- Integração entre funcionalidades

**2. Exemplos de casos esperados:**
- Cadastro com CPF válido vs inválido
- Tentativa de edição de proposta concluída
- Upload de arquivo muito grande
- Filtros com dados parciais
- Comportamento quando não há propostas
- Mudança de status ao fazer upload

#### 🔥 Priorização de Testes
Classifique cada cenário por:
- **Smoke Test** (bloqueante para deploy)
- **Crítico** (alta prioridade, deve ser testado antes do release)
- **Médio** (importante, mas não bloqueante)
- **Baixo** (melhoria de qualidade, pode ser testado posteriormente)

#### 🐛 Análise de Riscos
- Quais são os pontos mais críticos do sistema?
- Onde bugs teriam maior impacto?
- Quais áreas precisam de mais atenção nos testes?

---

## 🧠 Parte 2: Modus Operandi & Mindset (Questionário)

Responda às perguntas abaixo demonstrando seu raciocínio como QA.  
**Não existe resposta certa ou errada** - queremos entender seu pensamento analítico.

---

### Estratégia de Regressão

O time realiza **deploys semanais** em produção.

**a)** Como você definiria o que entra na suíte de **regressão automatizada**?

**b)** Quais critérios usaria para decidir entre automação vs teste manual?

**c)** Como equilibraria velocidade de execução vs cobertura de testes?

---

### Gestão de Defeitos

Você está testando em homologação e descobre:  
> **"Ao fazer upload do comprovante, o status não muda para CONCLUÍDA"**

Simule o registro deste bug incluindo:

**a)** Título claro e objetivo

**b)** Passos detalhados para reprodução

**c)** Resultado esperado vs obtido

**d)** Evidências (descreva screenshots/logs que anexaria)

**e)** Severidade e justificativa

**f)** Como você comunicaria isso ao time? (Teams? Jira? Reunião?)

---

### Pirâmide de Testes

Considerando a stack desta aplicação (React, NestJS, SQLite):

**a)** Como você distribuiria os testes entre:
- **Unitários** (percentual e responsabilidade)
- **Integração** (percentual e responsabilidade)
- **E2E** (percentual e responsabilidade)

**b)** Justifique sua estratégia considerando:
- Custo de manutenção
- Tempo de execução
- Confiabilidade
- ROI (retorno sobre investimento)

**c)** Dê exemplos práticos de cada tipo para esta aplicação

---

### 5️⃣ Validação de Dados

O sistema valida CPF no backend E no frontend.

**a)** Isso é redundância desnecessária ou boa prática? Por quê?

**b)** Como você testaria a validação de CPF de forma eficiente?

**c)** Quais CPFs você usaria como dados de teste e por quê?

---

### 6️⃣ Testes Exploratórios

Você tem **2 horas** para fazer testes exploratórios nesta aplicação.

**a)** Como você estruturaria essas 2 horas?

**b)** Que áreas priorizaria explorar?

**c)** Que tipo de bugs você tentaria encontrar?

**d)** Como documentaria suas descobertas?

---

## 🎁 Parte 3: Automação de Testes (BÔNUS OPCIONAL)

Se você quiser demonstrar suas habilidades de automação, implemente uma **suíte mínima de testes**.

### 🛠️ Ferramentas Sugeridas (escolha uma):
- **Cypress** (E2E Frontend)
- **Playwright** (E2E Frontend)
- **Jest + Supertest** (Testes de API)
- **Postman/Newman** (Testes de API)
- Outra de sua preferência

### 🎯 Escopo Sugerido

**Cenário 1: Caminho Feliz (E2E)**
1. Criar nova proposta
2. Verificar se aparece na lista "Aguardando Comprovante"
3. Acessar edição da proposta
4. Fazer upload de comprovante
5. Validar mudança de status para "CONCLUÍDA"
6. Tentar editar novamente (deve estar bloqueado)

**Cenário 2: Validações (API ou Frontend)**
1. Tentar criar proposta com CPF inválido
2. Tentar criar proposta com idade < 18 anos
3. Verificar campos obrigatórios

### ⚙️ O que avaliaremos (se você fizer):
- Organização do código de teste (Page Objects, helpers, etc.)
- Clareza nas asserções
- Reutilização de código
- Facilidade de executar os testes
- README com instruções de execução

### 📝 Nota Importante
**Automação é BÔNUS.** Avaliaremos principalmente suas respostas do questionário e planejamento de testes.  
Se optar por não fazer automação, foque em respostas detalhadas e bem justificadas.

---

## ✅ Critérios de Avaliação

### 🔍 O que mais valorizamos:

#### 1. **Pensamento Analítico**
- Profundidade nas respostas do questionário
- Raciocínio crítico sobre qualidade
- Identificação de riscos e prioridades
- Maturidade em gestão de defeitos

#### 2. **Planejamento de Testes**
- Cobertura de cenários (positivos, negativos, borda)
- Criatividade nos casos de teste
- Priorização inteligente
- Organização e clareza do documento

#### 3. **Comunicação**
- Clareza na escrita
- Capacidade de justificar decisões
- Documentação objetiva e profissional

#### 4. **Automação (BÔNUS)**
- Boas práticas de automação

---

## 📦 Entrega

1. Faça um **fork** deste repositório: [https://github.com/Neocredito/neo-qa-engineer-challenge](https://github.com/Neocredito/neo-qa-s-tech-test)
2. Crie uma branch com seu nome: `seu-nome-sobrenome`
3. Adicione seus arquivos:
   - `PLANO_DE_TESTES.md` (ou adicione no README)
   - `RESPOSTAS_QUESTIONARIO.md` (respostas das 6 questões)
   - Pasta `/testes` (se fizer automação)
4. Abra um **Pull Request** para a branch `main` do repositório original

---

## 🗂️ Estrutura Técnica do Projeto

```
neo-test/
├── backend/                     # API NestJS com arquitetura DDD
│   ├── src/
│   │   ├── domain/             # Entidades, Value Objects, Regras de Negócio
│   │   ├── application/        # Casos de Uso
│   │   ├── infrastructure/     # TypeORM, Repositórios
│   │   └── presentation/       # Controllers, DTOs
│   └── uploads/                # Arquivos de comprovante (gerados em runtime)
│
├── frontend/                    # Next.js App
│   └── src/
│       ├── app/                # Páginas (Dashboard, Nova, Editar, Listas)
│       ├── services/           # Chamadas à API
│       ├── types/              # TypeScript Types
│       └── utils/              # Helpers (CPF, formatação)
│
└── README.md                   # Este arquivo
```

### 🔐 Regras de Negócio Importantes

1. **CPF** deve ser validado (algoritmo completo implementado)
2. **Idade mínima** de 18 anos
3. **Status inicial** sempre `AGUARDANDO_COMPROVANTE` (não pode ser alterado na criação)
4. **Propostas concluídas** não podem mais ser editadas (modo somente leitura)
5. **Upload de comprovante** muda status automaticamente para `CONCLUÍDA`

---

## ❓ Dúvidas

Em caso de dúvidas sobre o desafio, entre em contato via LinkedIn:

- [Daniela Vieira](https://www.linkedin.com/in/daniellavieira/)
- [Danilo Gomes Ferraz](https://www.linkedin.com/in/udaanilo/)
- [Handryos Ghidorsi dos Santos](https://www.linkedin.com/in/handryos-ghidorsi-dos-santos-421b00258/)

---

**Boa sorte! Estamos ansiosos para conhecer sua forma de pensar sobre qualidade de software. 🚀**

---

## 📚 Apêndice: Dados para Teste

### CPFs Válidos para Teste:
- `123.456.789-09` ou `12345678909`
- `111.444.777-35` ou `11144477735`

### Payload de Exemplo (Criar Proposta):
```json
{
  "nome": "João da Silva",
  "cpf": "12345678909",
  "dataNascimento": "1990-05-15",
  "observacoes": "Proposta de crédito pessoal para aquisição de veículo"
}
```

### Filtros de Query Params:
```
GET /propostas?status=AGUARDANDO_COMPROVANTE
GET /propostas?nome=João
GET /propostas?cpf=123456
GET /propostas?status=CONCLUIDA&nome=Silva
```
