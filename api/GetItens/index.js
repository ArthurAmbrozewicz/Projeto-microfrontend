const { getCollection, toProduto } = require("../shared/mongo")
const { ok, fail, handleOptions } = require("../shared/http")

// Mantida por compatibilidade — prefira PesquisarProdutos
module.exports = async function (context, req) {
  if (handleOptions(context, req)) return

  try {
    const col = await getCollection()
    const docs = await col.find({}).sort({ nome: 1 }).toArray()
    ok(context, docs.map(toProduto))
  } catch (err) {
    context.log.error(err)
    fail(context, 500, err.message || "Erro ao listar produtos")
  }
}
