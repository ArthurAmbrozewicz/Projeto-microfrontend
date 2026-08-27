import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import Cadastro from "./pages/Cadastro"
import Detalhe from "./pages/Detalhe"
import Listagem from "./pages/Listagem"

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Listagem />} />
          <Route path="/item/:id" element={<Detalhe />} />
          <Route path="/novo" element={<Cadastro />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
