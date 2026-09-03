const { getCollection, toProduto } = require("../shared/mongo")
const { ok, fail, handleOptions, lerBody } = require("../shared/http")

module.exports = async function (context, req) {
  if (handleOptions(context, req)) return

  try {
    const body = lerBody(req)
    const nome = String(body.nome || "").trim()
    const descricao = String(body.descricao || "").trim()
    const categoria = String(body.categoria || "Geral").trim()
    const preco = Number(body.preco)
    const estoque = Number(body.estoque)

    if (!nome || !descricao) {
      fail(context, 400, "Informe nome e descrição")
      return
    }
    if (Number.isNaN(preco) || preco < 0) {
      fail(context, 400, "Preço inválido")
      return
    }
    if (Number.isNaN(estoque) || estoque < 0) {
      fail(context, 400, "Estoque inválido")
      return
    }

    const doc = {
      nome,
      descricao,
      categoria,
      preco,
      estoque,
      unidade: body.unidade || "un",
      criadoEm: new Date(),
    }

    const col = await getCollection()
    const result = await col.insertOne(doc)
    const salvo = await col.findOne({ _id: result.insertedId })
    ok(context, toProduto(salvo), 201)
  } catch (err) {
    context.log.error(err)
    fail(context, 500, err.message || "Erro ao inserir produto")
  }
}
