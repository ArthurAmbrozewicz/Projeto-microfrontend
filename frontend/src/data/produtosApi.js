import { API_BASE } from "./api"

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  })

  let data = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { erro: text }
    }
  }

  if (!res.ok) {
    throw new Error(data?.erro || `Falha na API (${res.status})`)
  }

  return data
}

export function pesquisarProdutos(q = "") {
  const query = q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""
  return request(`/PesquisarProdutos${query}`)
}

export function obterProduto(id) {
  return request(`/PesquisarProdutos/${id}`)
}

export function inserirProduto(dados) {
  return request("/InserirProduto", {
    method: "POST",
    body: JSON.stringify(dados),
  })
}

export function alterarProduto(id, dados) {
  return request(`/AlterarProduto/${id}`, {
    method: "PUT",
    body: JSON.stringify(dados),
  })
}

export function excluirProduto(id) {
  return request(`/ExcluirProduto/${id}`, {
    method: "DELETE",
  })
}

export function formatarPreco(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}
