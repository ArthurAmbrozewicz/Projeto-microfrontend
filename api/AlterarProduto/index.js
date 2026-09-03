const { getCollection, toProduto, parseObjectId } = require("../shared/mongo")
const { ok, fail, handleOptions, lerBody } = require("../shared/http")

module.exports = async function (context, req) {
  if (handleOptions(context, req)) return

  try {
    const objectId = parseObjectId(req.params.id)
    if (!objectId) {
      fail(context, 400, "Id inválido")
      return
    }

    const body = lerBody(req)
    const atualizacao = {}

    if (body.nome !== undefined) atualizacao.nome = String(body.nome).trim()
    if (body.descricao !== undefined)
      atualizacao.descricao = String(body.descricao).trim()
    if (body.categoria !== undefined)
      atualizacao.categoria = String(body.categoria).trim()
    if (body.preco !== undefined) {
      const preco = Number(body.preco)
      if (Number.isNaN(preco) || preco < 0) {
        fail(context, 400, "Preço inválido")
        return
      }
      atualizacao.preco = preco
    }
    if (body.estoque !== undefined) {
      const estoque = Number(body.estoque)
      if (Number.isNaN(estoque) || estoque < 0) {
        fail(context, 400, "Estoque inválido")
        return
      }
      atualizacao.estoque = estoque
    }
    if (body.unidade !== undefined) atualizacao.unidade = body.unidade

    if (Object.keys(atualizacao).length === 0) {
      fail(context, 400, "Nenhum campo para alterar")
      return
    }

    atualizacao.atualizadoEm = new Date()

    const col = await getCollection()
    const result = await col.findOneAndUpdate(
      { _id: objectId },
      { $set: atualizacao },
      { returnDocument: "after" },
    )

    if (!result) {
      fail(context, 404, "Produto não encontrado")
      return
    }

    ok(context, toProduto(result))
  } catch (err) {
    context.log.error(err)
    fail(context, 500, err.message || "Erro ao alterar produto")
  }
}
