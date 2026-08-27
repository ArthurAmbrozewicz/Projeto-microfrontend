import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { API_BASE } from "../data/api"
import { ITENS_MOCK, formatarPreco, lerExtras } from "../data/itensService"

function Listagem() {
  const [itens, setItens] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [aviso, setAviso] = useState("")
  const [filtro, setFiltro] = useState("Todas")

  useEffect(() => {
    fetch(`${API_BASE}/GetItens`)
      .then((res) => {
        if (!res.ok) throw new Error("Falha no GET da Azure Function")
        return res.json()
      })
      .then((data) => {
        setItens([...data, ...lerExtras()])
        setAviso("")
      })
      .catch((err) => {
        console.error(err)
        setAviso(
          "Azure Function offline. Suba a API com `func start` na pasta /api. Exibindo mock local.",
        )
        setItens([...ITENS_MOCK, ...lerExtras()])
      })
      .finally(() => {
        setCarregando(false)
      })
  }, [])

  const categorias = useMemo(() => {
    const unicas = [...new Set(itens.map((item) => item.categoria))]
    return ["Todas", ...unicas]
  }, [itens])

  const visiveis =
    filtro === "Todas"
      ? itens
      : itens.filter((item) => item.categoria === filtro)

  if (carregando) {
    return <p className="estado">Carregando...</p>
  }

  return (
    <section>
      <div className="page-head">
        <div>
          <p className="eyebrow">Tela 1 · Listagem</p>
          <h1>Produtos da loja</h1>
          <p className="lead">
            A lista consome o GET da Azure Function
            ({API_BASE}/GetItens). Clique em um item para ver os detalhes.
          </p>
        </div>
        <Link className="btn btn-primary" to="/novo">
          Cadastrar produto
        </Link>
      </div>

      {aviso ? <p className="estado aviso">{aviso}</p> : null}

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

      {visiveis.length === 0 ? (
        <p className="estado">Nenhum produto nesta categoria.</p>
      ) : (
        <ul className="grid-cards">
          {visiveis.map((item) => (
            <li key={item.id}>
              <Link className="card" to={`/item/${item.id}`}>
                <span className="card-cat">{item.categoria}</span>
                <h2>{item.nome}</h2>
                <p>{item.descricao}</p>
                <footer>
                  <strong>{formatarPreco(item.preco)}</strong>
                  <span>{item.estoque} em estoque</span>
                </footer>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Listagem
