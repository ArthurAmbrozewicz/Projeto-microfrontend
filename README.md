# Projeto PJBL - Loja do Campus

Catálogo em React (Vite) com duas telas: listagem de produtos e detalhe/cadastro.

## Integrantes
Ver GRUPO.md

## Site publicado (Azure Static Web Apps)
Ainda não publicado.

## Endpoint da Azure Function
Local: `http://localhost:7071/api/GetItens`
Local (por id): `http://localhost:7071/api/GetItemPorId/1`
Publicado: ainda não publicado.

## Mock via Apidog (se utilizado)
Ainda não utilizado.

## Como rodar localmente
1. API (com Azure Functions Core Tools): `cd api && func start`
   - Sem o `func` instalado: `cd api && npm run start:local`
2. Frontend: `cd frontend && npm install && npm run dev`
3. Abra `http://localhost:5173`

A listagem consome `GET http://localhost:7071/api/GetItens`. Se a Function estiver desligada, o frontend avisa e usa o mock local.

## Funcionalidades implementadas
1. Listagem de produtos consumindo o GET da Azure Function
2. Tela de detalhe via `GET /api/GetItemPorId/{id}`
3. Formulário de cadastro que grava no mock local (`localStorage`)

