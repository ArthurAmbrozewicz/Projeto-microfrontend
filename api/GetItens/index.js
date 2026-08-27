const itens = require("../shared/itens")

module.exports = async function (context) {
  context.res = {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: itens,
  }
}
