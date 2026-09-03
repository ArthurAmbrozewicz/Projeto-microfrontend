import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { excluirProduto, formatarPreco, obterProduto } from "../data/produtosApi"

function Detalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [excluindo, setExcluindo] = useState(false)

  useEffect(() => {
    setCarregando(true)
    obterProduto(id)
      .then((data) => {
        setItem(data)
        setErro("")
      })
      .catch((err) => {
        console.error(err)
        setItem(null)
        setErro("Esse produto não está mais no catálogo.")
      })
      .finally(() => setCarregando(false))
  }, [id])

  async function confirmarExclusao() {
    if (!window.confirm(`Remover "${item.nome}" do catálogo?`)) return
    setExcluindo(true)
    try {
      await excluirProduto(id)
      navigate("/")
    } catch (err) {
      console.error(err)
      setErro("Não deu para remover agora. Tente de novo.")
      setExcluindo(false)
    }
  }

  if (carregando) {
    return <p className="estado">Abrindo produto…</p>
  }

  if (!item) {
    return (
      <section className="painel">
        <h1>Produto não encontrado</h1>
        <p className="lead">{erro || "Volte ao catálogo e escolha outro item."}</p>
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
        <span className="detalhe-cat">{item.categoria}</span>
        <h1>{item.nome}</h1>
        <p className="lead">{item.descricao}</p>

        {erro ? <p className="aviso">{erro}</p> : null}

        <dl className="specs">
          <div>
            <dt>Preço</dt>
            <dd>{formatarPreco(item.preco)}</dd>
          </div>
          <div>
            <dt>Em estoque</dt>
            <dd>
              {item.estoque} {item.estoque === 1 ? "un." : "un."}
            </dd>
          </div>
        </dl>

        <div className="acoes">
          <Link className="btn btn-primary" to={`/editar/${item.id}`}>
            Editar
          </Link>
          <button
            className="btn btn-danger"
            type="button"
            onClick={confirmarExclusao}
            disabled={excluindo}
          >
            {excluindo ? "Removendo…" : "Remover"}
          </button>
        </div>
      </div>
    </section>
  )
}

export default Detalhe
