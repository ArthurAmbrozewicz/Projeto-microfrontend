# Projeto PJBL - Loja do Campus

Catálogo em React (Vite) com listagem, detalhe e cadastro de produtos. A listagem e o detalhe consomem Azure Functions com dados mockados.

## Integrantes
Ver GRUPO.md

## Site publicado (Azure Static Web Apps)
https://nice-river-009133c10.7.azurestaticapps.net

## Endpoint da Azure Function
- Produção: https://nice-river-009133c10.7.azurestaticapps.net/api/GetItens
- Produção (por id): https://nice-river-009133c10.7.azurestaticapps.net/api/GetItemPorId/1
- Local: `http://localhost:7071/api/GetItens`
- Local (por id): `http://localhost:7071/api/GetItemPorId/1`

## Repositório
https://github.com/ArthurAmbrozewicz/Projeto-microfrontend

## Mock via Apidog (se utilizado)
Não utilizado. O mock ficou nas Azure Functions (`/api`) e, no cadastro, no `localStorage` do navegador.




