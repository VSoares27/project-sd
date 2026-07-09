/**
 * Configuração de Rotas da Aplicação
 * 
 * Define todas as rotas disponíveis no frontend React.
 * Utiliza React Router DOM para navegação entre páginas.
 * 
 * Rotas disponíveis:
 * - /         : Redireciona para /login
 * - /login    : Página de login
 * - /cadastro : Página de cadastro
 * - /evento   : Página do evento (área logada)
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Evento from './pages/Evento';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/evento" element={<Evento />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;