import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Evento from './pages/Evento';
import MeusCertificados from './pages/MeusCertificados';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/evento" element={<Navigate to="/evento/demo-week" replace />} />
        <Route path="/evento/demo-week" element={<Evento />} />
        <Route path="/meus-certificados" element={<MeusCertificados />} />
        {/* Fallback para home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;