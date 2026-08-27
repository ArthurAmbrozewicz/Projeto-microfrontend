import { ITENS_MOCK } from "./mockItens"

const STORAGE_KEY = "pjbl-itens-extras"

export function lerExtras() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function salvarExtras(extras) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(extras))
}

export function cadastrarItem(dados) {
  const extras = lerExtras()
  const novo = {
    id: Date.now(),
    nome: dados.nome.trim(),
    descricao: dados.descricao.trim(),
    categoria: dados.categoria.trim(),
    preco: Number(dados.preco),
    estoque: Number(dados.estoque),
    unidade: "un",
  }

  extras.push(novo)
  salvarExtras(extras)
  return novo
}

export function formatarPreco(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export { ITENS_MOCK }
