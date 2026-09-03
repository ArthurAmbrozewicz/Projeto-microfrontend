const CORS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

function ok(context, body, status = 200) {
  context.res = { status, headers: CORS, body }
}

function fail(context, status, mensagem) {
  context.res = {
    status,
    headers: CORS,
    body: { erro: mensagem },
  }
}

function handleOptions(context, req) {
  if (req.method === "OPTIONS") {
    context.res = { status: 204, headers: CORS }
    return true
  }
  return false
}

function lerBody(req) {
  if (!req.body) return {}
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }
  return req.body
}

module.exports = { CORS, ok, fail, handleOptions, lerBody }
