# Projeto PJBL - Loja do Campus

Catálogo em React (Vite) com CRUD completo via Azure Functions + MongoDB Atlas.

## Integrantes (alunos que realizaram a atividade)

- Arthur Ambrozewicz Cidral
- Erick Marlon Barbieri da Silva
- Luan Alberti Estevinho
- Vinícius de Oliveira Garcia

## Site publicado (Azure Static Web Apps)

https://nice-river-009133c10.7.azurestaticapps.net

## Repositório

https://github.com/ArthurAmbrozewicz/Projeto-microfrontend

## Banco de dados (MongoDB Atlas)

- Cluster: `Cluster0`
- Database: `lojaCampus`
- Collection: `produtos`
- Usuário: `arthuim_db_user`

## Azure Functions (CRUD)

| Operação | Método | Endpoint |
|---|---|---|
| Pesquisar | GET | `/api/PesquisarProdutos` e `/api/PesquisarProdutos/{id}` |
| Inserir | POST | `/api/InserirProduto` |
| Alterar | PUT | `/api/AlterarProduto/{id}` |
| Excluir | DELETE | `/api/ExcluirProduto/{id}` |

Produção (exemplos):

- https://nice-river-009133c10.7.azurestaticapps.net/api/PesquisarProdutos
- https://nice-river-009133c10.7.azurestaticapps.net/api/InserirProduto

Local:

- `http://localhost:7071/api/PesquisarProdutos`

## Como rodar localmente

1. Em `api/local.settings.json`, troque `<db_password>` pela senha real do usuário Atlas.
2. API:
   ```bash
   cd api
   npm install
   func start
   ```
3. Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. Abra `http://localhost:5173`

## Configuração no Azure (obrigatória após o push)

No portal do Static Web App → **Configuration** → **Application settings**, adicione:

- Nome: `MONGODB_URI`
- Valor: `mongodb+srv://arthuim_db_user:SENHA@cluster0.i7rlvm0.mongodb.net/lojaCampus?retryWrites=true&w=majority&appName=Cluster0`

Sem essa variável, as Functions não conectam no Atlas em produção.

## Funcionalidades no frontend

1. **Pesquisar** — listagem + busca (`PesquisarProdutos`)
2. **Inserir** — formulário `/novo` (`InserirProduto`)
3. **Alterar** — formulário `/editar/:id` (`AlterarProduto`)
4. **Excluir** — botão na tela de detalhe (`ExcluirProduto`)

## IA utilizada

Ver Prompt.md
