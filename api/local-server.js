/**
 * Servidor local equivalente às Azure Functions (quando `func` não está instalado).
 * Uso: npm run start:local
 * Lê MONGODB_URI de local.settings.json ou da variável de ambiente.
 */
const http = require("http")
const fs = require("fs")
const path = require("path")

carregarEnvLocal()

const { getCollection, toProduto, parseObjectId } = require("./shared/mongo")

const PORTA = Number(process.env.PORT) || 7071

function carregarEnvLocal() {
  try {
    const arquivo = path.join(__dirname, "local.settings.json")
    const json = JSON.parse(fs.readFileSync(arquivo, "utf8"))
    for (const [chave, valor] of Object.entries(json.Values || {})) {
      if (process.env[chave] === undefined) process.env[chave] = String(valor)
    }
  } catch {
    // local.settings.json opcional se as envs já estiverem no shell
  }
}

function json(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  })
  res.end(body === undefined ? "" : JSON.stringify(body))
}

function lerBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on("data", (c) => chunks.push(c))
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8")
      if (!raw) return resolve({})
      try {
        resolve(JSON.parse(raw))
      } catch (err) {
        reject(err)
      }
    })
    req.on("error", reject)
  })
}

const servidor = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORTA}`)
  const { pathname } = url

  if (req.method === "OPTIONS") {
    json(res, 204)
    return
  }

  try {
    // GET /api/PesquisarProdutos e /api/PesquisarProdutos/:id
    const pesquisa = pathname.match(/^\/api\/PesquisarProdutos(?:\/([^/]+))?$/)
    if (req.method === "GET" && pesquisa) {
      const col = await getCollection()
      const id = pesquisa[1]
      if (id) {
        const objectId = parseObjectId(id)
        if (!objectId) return json(res, 400, { erro: "Id inválido" })
        const doc = await col.findOne({ _id: objectId })
        if (!doc) return json(res, 404, { erro: "Produto não encontrado" })
        return json(res, 200, toProduto(doc))
      }
      const q = (url.searchParams.get("q") || "").trim()
      const filtro = q
        ? {
            $or: [
              { nome: { $regex: q, $options: "i" } },
              { descricao: { $regex: q, $options: "i" } },
              { categoria: { $regex: q, $options: "i" } },
            ],
          }
        : {}
      const docs = await col.find(filtro).sort({ nome: 1 }).toArray()
      return json(res, 200, docs.map(toProduto))
    }

    // POST /api/InserirProduto
    if (req.method === "POST" && pathname === "/api/InserirProduto") {
      const body = await lerBody(req)
      const nome = String(body.nome || "").trim()
      const descricao = String(body.descricao || "").trim()
      const categoria = String(body.categoria || "Geral").trim()
      const preco = Number(body.preco)
      const estoque = Number(body.estoque)
      if (!nome || !descricao) return json(res, 400, { erro: "Informe nome e descrição" })
      if (Number.isNaN(preco) || preco < 0) return json(res, 400, { erro: "Preço inválido" })
      if (Number.isNaN(estoque) || estoque < 0)
        return json(res, 400, { erro: "Estoque inválido" })

      const col = await getCollection()
      const doc = {
        nome,
        descricao,
        categoria,
        preco,
        estoque,
        unidade: body.unidade || "un",
        criadoEm: new Date(),
      }
      const result = await col.insertOne(doc)
      const salvo = await col.findOne({ _id: result.insertedId })
      return json(res, 201, toProduto(salvo))
    }

    // PUT /api/AlterarProduto/:id
    const alterar = pathname.match(/^\/api\/AlterarProduto\/([^/]+)$/)
    if (req.method === "PUT" && alterar) {
      const objectId = parseObjectId(alterar[1])
      if (!objectId) return json(res, 400, { erro: "Id inválido" })
      const body = await lerBody(req)
      const atualizacao = {}
      if (body.nome !== undefined) atualizacao.nome = String(body.nome).trim()
      if (body.descricao !== undefined)
        atualizacao.descricao = String(body.descricao).trim()
      if (body.categoria !== undefined)
        atualizacao.categoria = String(body.categoria).trim()
      if (body.preco !== undefined) {
        const preco = Number(body.preco)
        if (Number.isNaN(preco) || preco < 0)
          return json(res, 400, { erro: "Preço inválido" })
        atualizacao.preco = preco
      }
      if (body.estoque !== undefined) {
        const estoque = Number(body.estoque)
        if (Number.isNaN(estoque) || estoque < 0)
          return json(res, 400, { erro: "Estoque inválido" })
        atualizacao.estoque = estoque
      }
      if (Object.keys(atualizacao).length === 0)
        return json(res, 400, { erro: "Nenhum campo para alterar" })
      atualizacao.atualizadoEm = new Date()

      const col = await getCollection()
      const result = await col.findOneAndUpdate(
        { _id: objectId },
        { $set: atualizacao },
        { returnDocument: "after" },
      )
      if (!result) return json(res, 404, { erro: "Produto não encontrado" })
      return json(res, 200, toProduto(result))
    }

    // DELETE /api/ExcluirProduto/:id
    const excluir = pathname.match(/^\/api\/ExcluirProduto\/([^/]+)$/)
    if (req.method === "DELETE" && excluir) {
      const objectId = parseObjectId(excluir[1])
      if (!objectId) return json(res, 400, { erro: "Id inválido" })
      const col = await getCollection()
      const result = await col.deleteOne({ _id: objectId })
      if (result.deletedCount === 0)
        return json(res, 404, { erro: "Produto não encontrado" })
      return json(res, 200, { ok: true, id: excluir[1] })
    }

    // Compatibilidade com endpoints antigos
    if (req.method === "GET" && pathname === "/api/GetItens") {
      const col = await getCollection()
      const docs = await col.find({}).sort({ nome: 1 }).toArray()
      return json(res, 200, docs.map(toProduto))
    }

    const detalhe = pathname.match(/^\/api\/GetItemPorId\/([^/]+)$/)
    if (req.method === "GET" && detalhe) {
      const objectId = parseObjectId(detalhe[1])
      if (!objectId) return json(res, 400, { erro: "Id inválido" })
      const col = await getCollection()
      const doc = await col.findOne({ _id: objectId })
      if (!doc) return json(res, 404, { erro: "Produto não encontrado" })
      return json(res, 200, toProduto(doc))
    }

    json(res, 404, { erro: "Rota não encontrada" })
  } catch (err) {
    console.error(err)
    json(res, 500, { erro: err.message || "Erro interno" })
  }
})

servidor.listen(PORTA, () => {
  console.log(`API local (MongoDB) em http://localhost:${PORTA}/api/PesquisarProdutos`)
})
