const { getCollection, parseObjectId } = require("../shared/mongo")
const { ok, fail, handleOptions } = require("../shared/http")

module.exports = async function (context, req) {
  if (handleOptions(context, req)) return

  try {
    const objectId = parseObjectId(req.params.id)
    if (!objectId) {
      fail(context, 400, "Id inválido")
      return
    }

    const col = await getCollection()
    const result = await col.deleteOne({ _id: objectId })

    if (result.deletedCount === 0) {
      fail(context, 404, "Produto não encontrado")
      return
    }

    ok(context, { ok: true, id: req.params.id })
  } catch (err) {
    context.log.error(err)
    fail(context, 500, err.message || "Erro ao excluir produto")
  }
}
