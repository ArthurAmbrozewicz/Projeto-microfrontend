import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { alterarProduto, obterProduto } from "../data/produtosApi"

function Editar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [erro, setErro] = useState("")
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    obterProduto(id)
      .then((item) => {
        setForm({
          nome: item.nome,
          descricao: item.descricao,
          categoria: item.categoria,
          preco: String(item.preco),
          estoque: String(item.estoque),
        })
      })
      .catch((err) => {
        console.error(err)
        setErro("Não encontramos esse produto para editar.")
      })
  }, [id])

  function atualizar(evento) {
    const { name, value } = evento.target
    setForm((atual) => ({ ...atual, [name]: value }))
  }

  async function enviar(evento) {
    evento.preventDefault()
    setSalvando(true)
    setErro("")
    try {
      await alterarProduto(id, {
        nome: form.nome,
        descricao: form.descricao,
        categoria: form.categoria,
        preco: Number(form.preco),
        estoque: Number(form.estoque),
      })
      navigate(`/item/${id}`)
    } catch (err) {
      console.error(err)
      setErro("Não foi possível salvar as alterações.")
    } finally {
      setSalvando(false)
    }
  }

  if (!form && !erro) {
    return <p className="estado">Carregando…</p>
  }

  if (!form) {
    return (
      <section className="painel">
        <h1>Não foi possível editar</h1>
        <p className="lead">{erro}</p>
        <Link className="btn btn-primary" to="/">
          Voltar ao catálogo
        </Link>
      </section>
    )
  }

  return (
    <section className="painel">
      <h1>Editar produto</h1>
      <p className="lead">Ajuste o que precisar e salve quando estiver pronto.</p>

      {erro ? <p className="aviso">{erro}</p> : null}

      <form className="form" onSubmit={enviar}>
        <label>
          Nome
          <input name="nome" value={form.nome} onChange={atualizar} required />
        </label>

        <label>
          Descrição
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={atualizar}
            rows="4"
            required
          />
        </label>

        <div className="form-row">
          <label>
            Categoria
            <select name="categoria" value={form.categoria} onChange={atualizar}>
              <option>Papelaria</option>
              <option>Kits</option>
              <option>Vestuário</option>
              <option>Acessórios</option>
              <option>Eletrônicos</option>
            </select>
          </label>

          <label>
            Preço (R$)
            <input
              name="preco"
              type="number"
              min="0"
              step="0.01"
              value={form.preco}
              onChange={atualizar}
              required
            />
          </label>

          <label>
            Estoque
            <input
              name="estoque"
              type="number"
              min="0"
              step="1"
              value={form.estoque}
              onChange={atualizar}
              required
            />
          </label>
        </div>

        <div className="acoes">
          <button className="btn btn-primary" type="submit" disabled={salvando}>
            {salvando ? "Salvando…" : "Salvar"}
          </button>
          <Link className="btn btn-ghost" to={`/item/${id}`}>
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  )
}

export default Editar
