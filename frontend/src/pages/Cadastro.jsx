import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { cadastrarItem } from "../data/itensService"

const ESTADO_INICIAL = {
  nome: "",
  descricao: "",
  categoria: "Papelaria",
  preco: "",
  estoque: "",
}

function Cadastro() {
  const navigate = useNavigate()
  const [form, setForm] = useState(ESTADO_INICIAL)

  function atualizar(evento) {
    const { name, value } = evento.target
    setForm((atual) => ({ ...atual, [name]: value }))
  }

  function enviar(evento) {
    evento.preventDefault()

    if (!form.nome.trim() || !form.descricao.trim()) return

    const novo = cadastrarItem(form)
    navigate(`/item/${novo.id}`)
  }

  return (
    <section className="painel">
      <p className="eyebrow">Tela 2 · Formulário</p>
      <h1>Cadastrar produto</h1>
      <p className="lead">
        Simula um cadastro e grava o item no navegador (localStorage). Na
        próxima etapa isso pode ir para a Azure Function ou para o Apidog.
      </p>

      <form className="form" onSubmit={enviar}>
        <label>
          Nome
          <input
            name="nome"
            value={form.nome}
            onChange={atualizar}
            placeholder="Ex.: Estojo compacto"
            required
          />
        </label>

        <label>
          Descrição
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={atualizar}
            placeholder="Conte o que o produto inclui"
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
              placeholder="29.90"
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
              placeholder="10"
              required
            />
          </label>
        </div>

        <div className="acoes">
          <button className="btn btn-primary" type="submit">
            Salvar no mock local
          </button>
          <Link className="btn btn-ghost" to="/">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  )
}

export default Cadastro
