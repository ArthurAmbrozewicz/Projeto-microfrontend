const itens = require("../shared/itens")

module.exports = async function (context, req) {
  const id = req.params.id
  const item = itens.find((produto) => String(produto.id) === String(id))

  if (!item) {
    context.res = {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: { erro: "Produto não encontrado" },
    }
    return
  }

  context.res = {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: item,
  }
}
