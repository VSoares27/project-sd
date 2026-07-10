import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setMensagem('');
    setCarregando(true);

    try {
      await api.post('/cadastro', { nome, email, senha });
      setMensagem('Cadastro realizado com sucesso! Redirecionando para login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.message || 'Erro ao realizar o cadastro. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8f9fa' }}>
      
      {/* Header Simplificado (Sympla style) */}
      <header style={{
        height: '64px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px'
      }}>
        <Link to="/" style={{ fontSize: '22px', fontWeight: '800', color: '#0082f4', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
          <span style={{
            width: '28px', height: '28px', backgroundColor: '#0082f4', color: '#fff', borderRadius: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '18px'
          }}>C</span>
          CertiEvent
        </Link>
      </header>

      {/* Main Container */}
      <main style={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative'
      }}>
        {/* Background shapes (fiel à imagem original da Sympla) */}
        <div style={{
          position: 'absolute', right: '5%', bottom: '5%', width: '350px', height: '350px',
          backgroundImage: 'radial-gradient(circle, #e6f3ff 0%, transparent 70%)',
          zIndex: 0, borderRadius: '50%', pointerEvents: 'none'
        }}></div>

        {/* Form Card */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '40px 32px',
          width: '100%',
          maxWidth: '450px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e5e7eb',
          zIndex: 1,
          textAlign: 'center'
        }}>
          {erro && (
            <div style={{
              backgroundColor: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px',
              fontSize: '14px', marginBottom: '20px', textAlign: 'left', border: '1px solid #ffcdd2'
            }}>
              {erro}
            </div>
          )}

          {mensagem && (
            <div style={{
              backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '12px', borderRadius: '8px',
              fontSize: '14px', marginBottom: '20px', textAlign: 'left', border: '1px solid #c8e6c9'
            }}>
              {mensagem}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#eef5fc',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0082f4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#2c2c2c', marginBottom: 6 }}>
              Crie sua conta no CertiEvent
            </h2>
            <p style={{ fontSize: '14px', color: '#6a6a6a', marginBottom: 24 }}>
              Cadastre-se para emitir seus certificados de eventos.
            </p>

            <div style={{ marginBottom: 12, textAlign: 'left' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Nome completo</label>
              <input
                type="text"
                placeholder="Como quer no seu certificado"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div style={{ marginBottom: 12, textAlign: 'left' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>E-mail</label>
              <input
                type="email"
                placeholder="Exemplo: joao@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: 20, textAlign: 'left' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Senha (mínimo 8 caracteres)</label>
              <input
                type="password"
                placeholder="Crie uma senha forte"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={carregando} style={{ width: '100%', padding: '12px' }}>
              {carregando ? 'Criando conta...' : 'Cadastrar'}
            </button>
          </form>

          <div style={{ marginTop: 24, fontSize: '14px', color: '#475569' }}>
            Já possui uma conta?{' '}
            <Link to="/login" style={{ fontWeight: '600' }}>
              Entrar
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}