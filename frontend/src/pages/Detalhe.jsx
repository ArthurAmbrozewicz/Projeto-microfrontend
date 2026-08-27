import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { API_BASE } from "../data/api"
import { formatarPreco, lerExtras } from "../data/itensService"

function Detalhe() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const extra = lerExtras().find((produto) => String(produto.id) === String(id))
    if (extra) {
      setItem(extra)
      setCarregando(false)
      return
    }

    fetch(`${API_BASE}/GetItemPorId/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Produto não encontrado")
        return res.json()
      })
      .then((data) => {
        setItem(data)
      })
      .catch((err) => {
        console.error(err)
        setItem(null)
      })
      .finally(() => {
        setCarregando(false)
      })
  }, [id])

  if (carregando) {
    return <p className="estado">Carregando detalhes...</p>
  }

  if (!item) {
    return (
      <section className="painel">
        <p className="eyebrow">Tela 2 · Detalhe</p>
        <h1>Produto não encontrado</h1>
        <p className="lead">
          Esse item não veio da Azure Function. Volte para a listagem e escolha
          outro produto.
        </p>
        <Link className="btn btn-primary" to="/">
          Voltar ao catálogo
        </Link>
      </section>
    )
  }

  return (
    <section className="detalhe">
      <Link className="voltar" to="/">
        ← Voltar ao catálogo
      </Link>

      <div className="painel">
        <p className="eyebrow">Tela 2 · Detalhe</p>
        <span className="card-cat">{item.categoria}</span>
        <h1>{item.nome}</h1>
        <p className="lead">{item.descricao}</p>

        <dl className="specs">
          <div>
            <dt>Preço</dt>
            <dd>{formatarPreco(item.preco)}</dd>
          </div>
          <div>
            <dt>Estoque</dt>
            <dd>
              {item.estoque} {item.unidade || "un"}
            </dd>
          </div>
          <div>
            <dt>Código</dt>
            <dd>#{item.id}</dd>
          </div>
        </dl>

        <div className="acoes">
          <Link className="btn btn-primary" to="/novo">
            Cadastrar outro produto
          </Link>
          <Link className="btn btn-ghost" to="/">
            Ver todos
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Detalhe
