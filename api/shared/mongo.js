const { MongoClient, ObjectId } = require("mongodb")

const COLLECTION = "produtos"

let client
let dbPromise

function getUri() {
  const uri = process.env.MONGODB_URI
  if (!uri || uri.includes("<db_password>")) {
    throw new Error(
      "Defina MONGODB_URI em api/local.settings.json (Values) com a senha real do Atlas.",
    )
  }
  return uri
}

async function getDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      client = new MongoClient(getUri())
      await client.connect()
      return client.db()
    })()
  }
  return dbPromise
}

async function getCollection() {
  const db = await getDb()
  return db.collection(COLLECTION)
}

function toProduto(doc) {
  if (!doc) return null
  return {
    id: String(doc._id),
    nome: doc.nome,
    descricao: doc.descricao,
    categoria: doc.categoria,
    preco: doc.preco,
    estoque: doc.estoque,
    unidade: doc.unidade || "un",
  }
}

function parseObjectId(id) {
  if (!id || !ObjectId.isValid(id)) return null
  return new ObjectId(id)
}

module.exports = {
  COLLECTION,
  getCollection,
  toProduto,
  parseObjectId,
  ObjectId,
}
