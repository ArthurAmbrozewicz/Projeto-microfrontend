import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { formatarPreco, pesquisarProdutos } from "../data/produtosApi"

function Listagem() {
  const [itens, setItens] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [aviso, setAviso] = useState("")
  const [busca, setBusca] = useState("")
  const [filtro, setFiltro] = useState("Todas")

  async function carregar(termo = "") {
    setCarregando(true)
    try {
      const data = await pesquisarProdutos(termo)
      setItens(data)
      setAviso("")
    } catch (err) {
      console.error(err)
      setAviso(
        "Não deu para carregar o catálogo agora. Confira se a API está ligada e tente de novo.",
      )
      setItens([])
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  function enviarBusca(evento) {
    evento.preventDefault()
    carregar(busca)
  }

  const categorias = useMemo(() => {
    const unicas = [...new Set(itens.map((item) => item.categoria))]
    return ["Todas", ...unicas]
  }, [itens])

  const visiveis =
    filtro === "Todas"
      ? itens
      : itens.filter((item) => item.categoria === filtro)

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Catálogo</h1>
          <p className="lead">
            Cadernos, kits, camisetas e o que mais a loja tiver na prateleira.
          </p>
        </div>
        <Link className="btn btn-primary" to="/novo">
          Adicionar produto
        </Link>
      </div>

      <form className="busca" onSubmit={enviarBusca}>
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar no catálogo"
          aria-label="Buscar produtos"
        />
        <button className="btn btn-primary" type="submit">
          Buscar
        </button>
      </form>

      {aviso ? <p className="aviso">{aviso}</p> : null}

      {categorias.length > 1 ? (
        <div className="filtros" role="tablist" aria-label="Filtrar por categoria">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              type="button"
              className={filtro === categoria ? "chip ativo" : "chip"}
              onClick={() => setFiltro(categoria)}
            >
              {categoria}
            </button>
          ))}
        </div>
      ) : null}

      {carregando ? (
        <p className="estado">Carregando catálogo…</p>
      ) : visiveis.length === 0 ? (
        <div className="vazio">
          <p>Nada por aqui ainda. Que tal cadastrar o primeiro item?</p>
          <Link className="btn btn-primary" to="/novo">
            Adicionar produto
          </Link>
        </div>
      ) : (
        <ul className="grid-produtos">
          {visiveis.map((item) => (
            <li key={item.id}>
              <Link className="produto" to={`/item/${item.id}`}>
                <div>
                  <div className="produto-meta">
                    <span className="produto-cat">{item.categoria}</span>
                  </div>
                  <h2>{item.nome}</h2>
                  <p>{item.descricao}</p>
                </div>
                <div className="produto-side">
                  <strong>{formatarPreco(item.preco)}</strong>
                  <span>
                    {item.estoque} {item.estoque === 1 ? "unidade" : "unidades"}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Listagem
