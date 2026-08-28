# Prompts utilizados (IA Generativa)

## Ferramenta utilizada
Cursor (Claude), no editor, durante a montagem do frontend em React/Vite.

Os prompts abaixo foram usados para gerar as telas, o CSS e a ligação com a Azure Function. Ajustes pequenos (nomes dos produtos, textos da loja) foram feitos na mão depois.

---

## Prompt 1 — Estrutura inicial do frontend

Cria um frontend React com Vite na pasta frontend, em português, para um catálogo chamado Loja do Campus (loja da universidade).

Preciso de no mínimo duas telas com react-router-dom:

1. Listagem em `/` — faz fetch em `http://localhost:7071/api/GetItens`, mostra os produtos em cards (nome, descrição, categoria, preço em real, estoque). Cada card leva para `/item/:id`. Enquanto carrega, mostra "Carregando...". Se a API cair, não deixa a tela em branco: avisa que a Function está offline e cai no mock local.
2. Detalhe em `/item/:id` — consome `GET /api/GetItemPorId/{id}` e mostra preço, estoque e código. Se não achar o produto, uma mensagem simples e um botão voltando pro catálogo.
3. Formulário em `/novo` — cadastro falso, grava no localStorage. Campos: nome, descrição, categoria (Papelaria, Kits, Vestuário, Acessórios, Eletrônicos), preço e estoque. Depois de salvar, redireciona pro detalhe do item novo.

Usa um Layout com topo: marca "LC", nome Loja do Campus, links Catálogo e Novo produto.

Os produtos mock podem ser coisas de faculdade (kit calouro, camiseta do curso, caderno, caneca, mochila, calculadora). Sem TypeScript. Componentes em JSX, pastas `pages`, `components` e `data`. A URL da API tem que funcionar local (`localhost:7071`) e no Azure Static Web Apps (caminho relativo `/api`).

---

## Prompt 2 — Estilização

Quero um CSS simples, sem Tailwind e sem lib de UI. Visual de papel/campus: fundo creme, cards brancos, laranja queimado nos botões, tipografia limpa.

A listagem em grid de cards, responsiva (1 coluna no celular, várias no desktop). Filtro por categoria em chips. Formulário com labels em cima, preço e estoque na mesma linha no desktop. Estados de loading e aviso visíveis, mas sem exagero. Header fixo no fluxo da página, não precisa ser sticky.

Não usa gradiente chamativo nem animação. Só hover leve no card e no botão.

---

## Prompt 3 — Serviço de dados e cadastro local

Separa a lógica do localStorage num `itensService.js`. Chave tipo `pjbl-itens-extras`. Função pra ler os extras, cadastrar (id com Date.now()) e formatar preço em pt-BR (R$). Na listagem, junta o que veio da Azure Function com o que o usuário cadastrou no navegador. No detalhe, se o id for de um extra, nem chama a API.

---

## Prompt 4 — Ajuste da URL da API pro Azure

No frontend, não deixa a URL da Function hardcoded em localhost. Se estiver em dev, usa `http://localhost:7071/api`. Em produção no Static Web Apps, usa `/api` relativo, porque o Azure faz o proxy sozinho. Aceita `VITE_API_URL` se a gente precisar sobrescrever.
