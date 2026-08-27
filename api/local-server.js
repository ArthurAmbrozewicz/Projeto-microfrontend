const http = require("http")
const itens = require("./shared/itens")

const PORTA = 7071

function json(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  })
  res.end(JSON.stringify(body))
}

const servidor = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORTA}`)

  if (req.method === "OPTIONS") {
    json(res, 204, {})
    return
  }

  if (req.method === "GET" && url.pathname === "/api/GetItens") {
    json(res, 200, itens)
    return
  }

  const detalhe = url.pathname.match(/^\/api\/GetItemPorId\/([^/]+)$/)
  if (req.method === "GET" && detalhe) {
    const item = itens.find((produto) => String(produto.id) === detalhe[1])
    if (!item) {
      json(res, 404, { erro: "Produto não encontrado" })
      return
    }
    json(res, 200, item)
    return
  }

  json(res, 404, { erro: "Rota não encontrada" })
})

servidor.listen(PORTA, () => {
  console.log(`API mock em http://localhost:${PORTA}/api/GetItens`)
})
