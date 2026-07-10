import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [step, setStep] = useState('email'); // 'email' | 'password'
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  function handleEmailSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErro('Por favor, insira um e-mail válido.');
      return;
    }
    setErro('');
    setStep('password');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const response = await api.post('/login', { email, senha });
      let dados = response.data;
      
      // Tratamento para extrair JSON caso o response do backend venha com lixo CORS
      if (typeof dados === 'string') {
        const jsonMatch = dados.match(/\{.*\}/s);
        if (jsonMatch) {
          try {
            dados = JSON.parse(jsonMatch[0]);
          } catch (errParse) {
            console.error(errParse);
          }
        }
      }
      
      if (dados.accessToken) {
        localStorage.setItem('accessToken', dados.accessToken);
      }
      if (dados.refreshToken) {
        localStorage.setItem('refreshToken', dados.refreshToken);
      }
      if (dados.userId) {
        localStorage.setItem('userId', dados.userId);
      }
      if (dados.nome) {
        localStorage.setItem('userNome', dados.nome);
      }
      localStorage.setItem('userEmail', email);

      // Decodificação adicional de segurança caso não retorne userId/nome explícito
      if (!localStorage.getItem('userId') && dados.accessToken) {
        try {
          const payload = JSON.parse(atob(dados.accessToken.split('.')[1]));
          if (payload.sub) localStorage.setItem('userId', payload.sub);
          if (payload.name) localStorage.setItem('userNome', payload.name);
        } catch (eDec) {
          console.error(eDec);
        }
      }
      
      navigate('/evento/demo-week');
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.message || 'E-mail ou senha incorretos.');
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

          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#eef5fc',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0082f4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>

              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#2c2c2c', marginBottom: 8 }}>
                Qual é o seu e-mail?
              </h2>
              <p style={{ fontSize: '14px', color: '#6a6a6a', marginBottom: 24 }}>
                Vamos usar seu e-mail pra identificar sua conta.
              </p>

              <div style={{ marginBottom: 16 }}>
                <input
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  style={{ textAlign: 'left' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>
                Continuar
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#2c2c2c', marginBottom: 6 }}>
                Que bom ter você aqui!
              </h2>
              <p style={{ fontSize: '14px', color: '#6a6a6a', marginBottom: 24 }}>
                Digite sua senha abaixo para acessar sua conta.
              </p>

              {/* Botões sociais mockup */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                <button type="button" className="btn-secondary" style={{ width: '100%', fontSize: '13px', padding: '10px' }} onClick={() => alert('Login social demonstrativo!')}>
                  <svg style={{ marginRight: 6 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2h-2a5 5 0 0 0-5 5v3H9v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  Continuar com o Facebook
                </button>
                <button type="button" className="btn-secondary" style={{ width: '100%', fontSize: '13px', padding: '10px' }} onClick={() => alert('Login social demonstrativo!')}>
                  <svg style={{ marginRight: 6 }} width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.92 1 12s4.92 11 11.24 11c6.6 0 11-4.65 11-11.2 0-.756-.08-1.33-.18-1.815H12.24z"></path></svg>
                  Continuar com o Google
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#cbd5e1' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
                <span style={{ padding: '0 10px', fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>OU USE SUA SENHA</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
              </div>

              <div style={{ marginBottom: 12, textAlign: 'left' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>E-mail</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  style={{ backgroundColor: '#f8fafc', color: '#64748b' }}
                />
              </div>

              <div style={{ marginBottom: 16, textAlign: 'left' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Senha</label>
                <input
                  type="password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'stretch', justifyContent: 'space-between', marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', color: '#475569', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ width: 'auto', margin: 0 }} defaultChecked />
                  Mantenha-me conectado
                </label>
                <a href="#forgot" style={{ fontSize: '13px', fontWeight: 500 }} onClick={(e) => { e.preventDefault(); alert('Esquecimento de senha desativado na versão local.'); }}>
                  Esqueceu a senha?
                </a>
              </div>

              <button type="submit" className="btn-primary" disabled={carregando} style={{ width: '100%', padding: '12px' }}>
                {carregando ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          )}

          <div style={{ marginTop: 24, fontSize: '14px', color: '#475569' }}>
            {step === 'password' && (
              <div style={{ marginBottom: 8 }}>
                <a href="#back" style={{ color: 'var(--text-muted)' }} onClick={(e) => { e.preventDefault(); setStep('email'); }}>
                  Voltar para e-mail
                </a>
              </div>
            )}
            Não possui uma conta?{' '}
            <Link to="/cadastro" style={{ fontWeight: '600' }}>
              Cadastre-se
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}