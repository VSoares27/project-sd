import { useState } from 'react';
import api from '../services/api';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [step, setStep] = useState('email'); // 'email' | 'login' | 'register' | 'confirm'
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  if (!isOpen) return null;

  function handleClose() {
    setStep('email');
    setErro('');
    setMensagem('');
    setSenha('');
    setNome('');
    setCodigo('');
    onClose();
  }

  // Validação simples de email
  function handleEmailSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErro('Por favor, insira um e-mail válido.');
      return;
    }
    setErro('');
    // No Sympla real ele checa se o email existe. Aqui vamos direto pro formulário de login.
    setStep('login');
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const response = await api.post('/login', { email, senha });
      let dados = response.data;
      
      // Tratamento robusto herdado do Login.jsx original caso retorne string com comentários CORS
      if (typeof dados === 'string') {
        const jsonMatch = dados.match(/\{.*\}/s);
        if (jsonMatch) {
          try {
            dados = JSON.parse(jsonMatch[0]);
          } catch (errParse) {
            console.error('Erro parse JSON:', errParse);
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

      if (onLoginSuccess) {
        onLoginSuccess();
      }
      handleClose();
    } catch (err) {
      console.error(err);
      const backendError = err.response?.data?.error;
      if (backendError === 'User is not confirmed.') {
        setErro(
          <span>
            Sua conta ainda não foi confirmada.{' '}
            <a
              href="#confirm"
              style={{ color: '#0082f4', textDecoration: 'underline', fontWeight: 'bold' }}
              onClick={(e) => {
                e.preventDefault();
                setErro('');
                setMensagem('Insira o código de verificação enviado para o seu e-mail.');
                setStep('confirm');
              }}
            >
              Clique aqui para confirmar.
            </a>
          </span>
        );
      } else {
        setErro(err.response?.data?.message || 'E-mail ou senha incorretos.');
      }
    } finally {
      setCarregando(false);
    }
  }

  async function handleCadastroSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await api.post('/cadastro', { nome, email, senha });
      setMensagem('Cadastro realizado! Enviamos um código de verificação para o seu e-mail.');
      setSenha('');
      setStep('confirm');
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.message || 'Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  async function handleConfirmSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await api.post('/confirmar', { email, codigo });
      setMensagem('Conta confirmada com sucesso! Você já pode fazer login.');
      setCodigo('');
      setStep('login');
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.message || 'Erro ao confirmar código. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>&times;</button>
        
        <div style={{ padding: '32px 24px' }}>
          
          {/* Logo do Modal */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#0082f4', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 28, height: 28, backgroundColor: '#0082f4', color: '#fff', borderRadius: 4,
                display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 900
              }}>C</span>
              CertiEvent
            </span>
          </div>

          {erro && (
            <div style={{
              backgroundColor: '#ffebee', color: '#c62828', padding: '12px', borderRadius: 8,
              fontSize: '14px', marginBottom: '16px', fontWeight: '500', border: '1px solid #ffcdd2'
            }}>
              {erro}
            </div>
          )}

          {mensagem && (
            <div style={{
              backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '12px', borderRadius: 8,
              fontSize: '14px', marginBottom: '16px', fontWeight: '500', border: '1px solid #c8e6c9'
            }}>
              {mensagem}
            </div>
          )}

          {/* PASSO 1: Solicitar Email */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', backgroundColor: '#eef5fc',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0082f4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#2c2c2c', marginBottom: 8 }}>
                  Qual é o seu e-mail?
                </h3>
                <p style={{ fontSize: '14px', color: '#6a6a6a' }}>
                  Vamos usar seu e-mail pra identificar sua conta ou criar uma nova.
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <input
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>
                Continuar
              </button>
            </form>
          )}

          {/* PASSO 2: Formulário de Login */}
          {step === 'login' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#2c2c2c', marginBottom: 4 }}>
                  Que bom ter você aqui!
                </h3>
                <p style={{ fontSize: '13px', color: '#6a6a6a' }}>
                  Identificamos sua conta ou você pode prosseguir com as opções abaixo.
                </p>
              </div>


              <form onSubmit={handleLoginSubmit}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ backgroundColor: '#f8fafc', color: '#64748b' }}
                  />
                </div>

                <div style={{ marginBottom: 12 }}>
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
                  <a href="#forgot" style={{ fontSize: '13px', fontWeight: 500 }} onClick={(e) => { e.preventDefault(); alert('Recuperação de senha não disponível. Por favor, crie uma nova conta.'); }}>
                    Esqueceu sua senha?
                  </a>
                </div>

                <button type="submit" className="btn-primary" disabled={carregando} style={{ width: '100%', padding: '12px' }}>
                  {carregando ? 'Entrando...' : 'ENTRAR'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: 24, fontSize: '14px', color: '#475569' }}>
                Não possui uma conta?{' '}
                <a href="#register" style={{ fontWeight: '600' }} onClick={(e) => { e.preventDefault(); setErro(''); setStep('register'); }}>
                  Cadastre-se
                </a>
              </div>
            </div>
          )}

          {/* PASSO 3: Formulário de Cadastro */}
          {step === 'register' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#2c2c2c', marginBottom: 4 }}>
                  Crie sua conta
                </h3>
                <p style={{ fontSize: '13px', color: '#6a6a6a' }}>
                  Cadastre-se rapidamente para obter e gerenciar seus certificados.
                </p>
              </div>

              <form onSubmit={handleCadastroSubmit}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Nome completo</label>
                  <input
                    type="text"
                    placeholder="Como quer ser chamado no certificado"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div style={{ marginBottom: 12 }}>
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

                <button type="submit" className="btn-primary" disabled={carregando} style={{ width: '100%', padding: '12px', marginTop: 8 }}>
                  {carregando ? 'Criando conta...' : 'CADASTRAR'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: 24, fontSize: '14px', color: '#475569' }}>
                Já tem uma conta?{' '}
                <a href="#login" style={{ fontWeight: '600' }} onClick={(e) => { e.preventDefault(); setErro(''); setStep('login'); }}>
                  Entrar
                </a>
              </div>
            </div>
          )}

          {/* PASSO 4: Tela de Confirmação de Código */}
          {step === 'confirm' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', backgroundColor: '#eef5fc',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0082f4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#2c2c2c', marginBottom: 4 }}>
                  Confirmação de Conta
                </h3>
                <p style={{ fontSize: '13px', color: '#6a6a6a' }}>
                  Digite o código de verificação enviado para o seu e-mail: <strong>{email}</strong>
                </p>
              </div>

              <form onSubmit={handleConfirmSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Código de Verificação</label>
                  <input
                    type="text"
                    placeholder="Digite o código de 6 dígitos"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    required
                    autoFocus
                    style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '18px', fontWeight: 'bold' }}
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={carregando} style={{ width: '100%', padding: '12px' }}>
                  {carregando ? 'Confirmando...' : 'CONFIRMAR'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: 24, fontSize: '14px', color: '#475569' }}>
                Não recebeu o código?{' '}
                <a href="#register" style={{ fontWeight: '600' }} onClick={(e) => { e.preventDefault(); setErro(''); setStep('register'); }}>
                  Voltar para o cadastro
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
