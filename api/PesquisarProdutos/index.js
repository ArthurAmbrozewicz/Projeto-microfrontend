const { getCollection, toProduto, parseObjectId } = require("../shared/mongo")
const { ok, fail, handleOptions } = require("../shared/http")

module.exports = async function (context, req) {
  if (handleOptions(context, req)) return

  try {
    const col = await getCollection()
    const id = req.params.id

    if (id) {
      const objectId = parseObjectId(id)
      if (!objectId) {
        fail(context, 400, "Id inválido")
        return
      }
      const doc = await col.findOne({ _id: objectId })
      if (!doc) {
        fail(context, 404, "Produto não encontrado")
        return
      }
      ok(context, toProduto(doc))
      return
    }

    const q = (req.query.q || "").trim()
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
    ok(context, docs.map(toProduto))
  } catch (err) {
    context.log.error(err)
    fail(context, 500, err.message || "Erro ao pesquisar produtos")
  }
}
