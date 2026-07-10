import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import LoginModal from '../components/LoginModal';

export default function Evento() {
  const [evento, setEvento] = useState({
    nome: 'Demo Week',
    instituicao: 'IFPE - Campus Igarassu',
    descricao: 'O futuro não está chegando, ele já está AQUI. Prepare-se para uma imersão total no ecossistema que está moldando o amanhã. Vem aí a DEMO WEEK no IFPE Campus Igarassu! Nos dias 15 e 16 de julho, vamos hackear o presente e desbloquear o próximo nível da tecnologia e da inovação. Esqueça o básico: prepare-se para códigos, inteligência artificial, robótica e insights que vão explodir a sua mente! 🧠💥 Tech, ideias e muita inovação!',
    data: '2026-07-15',
    horario: '14:00'
  });
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userNome, setUserNome] = useState('');
  const [userEmail, setUserEmail] = useState('');
  
  const [gerando, setGerando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [certificadoUrl, setCertificadoUrl] = useState('');
  const [erro, setErro] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    checkLoginState();
    carregarInfosEvento();
  }, []);

  function checkLoginState() {
    const token = localStorage.getItem('accessToken');
    const nome = localStorage.getItem('userNome') || localStorage.getItem('userEmail');
    const email = localStorage.getItem('userEmail') || '';
    
    if (token) {
      setIsLoggedIn(true);
      setUserNome(nome || 'Participante');
      setUserEmail(email);
    } else {
      setIsLoggedIn(false);
      setUserNome('');
      setUserEmail('');
    }
  }

  async function carregarInfosEvento() {
    const token = localStorage.getItem('accessToken');
    if (!token) return; // Se deslogado, usa o mockup padrão

    try {
      const res = await api.get('/evento');
      let dados = res.data;
      if (typeof dados === 'string') {
        const jsonMatch = dados.match(/\{.*\}/s);
        if (jsonMatch) dados = JSON.parse(jsonMatch[0]);
      }
      if (dados.nome) {
        setEvento(dados);
      }
    } catch (error) {
      console.error('Erro ao carregar informações reais do evento:', error);
    }
  }

  function handleLogout() {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserNome('');
    setUserEmail('');
    setCertificadoUrl('');
    setMensagem('');
    setErro('');
  }

  async function handleGerarCertificado() {
    setGerando(true);
    setMensagem('');
    setErro('');
    setCertificadoUrl('');

    try {
      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId') || 'userId-temporario';
      const nome = localStorage.getItem('userNome') || 'Participante';
      const email = localStorage.getItem('userEmail');

      if (!email) {
        setErro('Erro: E-mail do usuário não encontrado. Por favor, faça login novamente.');
        setGerando(false);
        return;
      }
      
      const response = await api.post('/gerar-certificado', 
        { userId, nome, email },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      let dados = response.data;
      if (typeof dados === 'string') {
        const jsonMatch = dados.match(/\{.*\}/s);
        if (jsonMatch) dados = JSON.parse(jsonMatch[0]);
      }
      
      setMensagem('Certificado gerado com sucesso!');
      if (dados.urlS3) {
        setCertificadoUrl(dados.urlS3);
      }
    } catch (err) {
      console.error('Erro ao gerar certificado:', err);
      let msg = 'Erro ao gerar certificado. Tente novamente.';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          try {
            const jsonMatch = err.response.data.match(/\{.*\}/s);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              msg = parsed.message || parsed.error || msg;
            }
          } catch (e) {
            msg = err.response.data;
          }
        } else {
          msg = err.response.data.message || err.response.data.error || msg;
        }
      }
      setErro(msg);
    } finally {
      setGerando(false);
    }
  }

  // Formata data ISO para Pt-Br
  function formatarData(dataStr) {
    if (!dataStr) return '';
    const partes = dataStr.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataStr;
  }

  return (
    <div>
      {/* Header Estilo Sympla */}
      <header className="sympla-header">
        <div className="container header-container">
          <Link to="/" className="logo-link">
            <span className="logo-s">C</span>
            <span>CertiEvent</span>
          </Link>

          <div style={{ flexGrow: 1 }}></div>

          <nav className="header-nav">
            <Link to="/" className="nav-link">Página Inicial</Link>
            {isLoggedIn && (
              <Link to="/meus-certificados" className="nav-link">Meus ingressos</Link>
            )}
            
            {isLoggedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="user-profile-menu" onClick={() => navigate('/meus-certificados')}>
                  <div className="avatar">{userNome.charAt(0).toUpperCase()}</div>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{userNome.split(' ')[0]}</span>
                </div>
                <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 13 }} onClick={handleLogout}>Sair</button>
              </div>
            ) : (
              <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 14 }} onClick={() => setIsLoginOpen(true)}>
                Entrar
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Seção do Banner - Estilo Neon Tecnológico (Fiel ao Anexo do Usuário) */}
      <section style={{
        background: 'linear-gradient(180deg, #0e021a 0%, #17052f 50%, #0e021a 100%)',
        padding: '60px 20px',
        color: '#ffffff',
        borderBottom: '1px solid #2d1847',
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow Effects */}
        <div style={{
          position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '80%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none'
        }}></div>
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '80%',
          background: 'radial-gradient(circle, rgba(217, 70, 239, 0.15) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none'
        }}></div>

        {/* Banner Card */}
        <div style={{
          width: '100%',
          maxWidth: '600px',
          background: 'radial-gradient(circle at center, #1b0c36 0%, #0d041e 100%)',
          border: '3px solid #8b5cf6',
          boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <img 
            src="/demoweek_banner.png" 
            alt="Demo Week Banner" 
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </section>

      {/* Conteúdo Principal */}
      <main className="container" style={{ padding: '40px 20px', display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        
        {/* Lado Esquerdo: Detalhes do Evento */}
        <section style={{ flex: '2 1 500px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: 16 }}>{evento.nome}</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '14px', marginBottom: 24 }}>
            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Organizado por:</span>
            <span>{evento.instituicao}</span>
          </div>

          <div style={{ borderBottom: '1px solid var(--border-color)', marginBottom: 24 }}></div>

          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: 12 }}>Sobre o evento</h3>
          <p style={{ color: '#4a5568', fontSize: '15px', lineHeight: '1.7', marginBottom: 24 }}>
            {evento.descricao}
          </p>

          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: 12 }}>Cronograma e Infraestrutura AWS</h3>
          <p style={{ color: '#4a5568', fontSize: '15px', lineHeight: '1.7', marginBottom: 20 }}>
            Este projeto conta com uma arquitetura inovadora na AWS. A infraestrutura de backend em EC2 é provisionada e escalada de forma 100% automatizada e agendada:
          </p>
          <ul style={{ paddingLeft: 20, color: '#4a5568', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
            <li><strong>AWS EventBridge Scheduler:</strong> Detecta o horário de início e ativa a máquina.</li>
            <li><strong>AWS Step Functions & Lambda:</strong> Orquestram o setup sem intervenção manual.</li>
            <li><strong>Amazon SES & S3:</strong> Geração de arquivos PDF de alta fidelidade enviados diretamente ao seu e-mail cadastrado.</li>
          </ul>

          {/* Preview Virtual do Certificado */}
          {isLoggedIn && (
            <div style={{
              background: '#ffffff',
              border: '1px dashed #cbd5e1',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative'
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>
                Pré-visualização do seu Certificado
              </h4>
              <div style={{
                background: '#f8fafc',
                border: '8px double #cbd5e1',
                padding: '24px',
                textAlign: 'center',
                fontFamily: 'serif',
                position: 'relative'
              }}>
                <h2 style={{ fontSize: '20px', fontFamily: 'var(--font-family)', color: '#334155', margin: '0 0 10px' }}>CERTIFICADO DE PARTICIPAÇÃO</h2>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px', fontFamily: 'var(--font-family)' }}>DECLARAMOS QUE</p>
                <p style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', textDecoration: 'underline', margin: '0 0 16px', fontFamily: 'var(--font-family)' }}>
                  {userNome}
                </p>
                <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: '0 0 16px', fontFamily: 'var(--font-family)' }}>
                  participou com êxito da <strong>{evento.nome}</strong> promovida pelo <strong>{evento.instituicao}</strong> em {formatarData(evento.data)}.
                </p>
                <div style={{ borderTop: '1px solid #e2e8f0', width: '120px', margin: '20px auto 4px' }}></div>
                <span style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'var(--font-family)' }}>Organização TSI</span>
              </div>
            </div>
          )}
        </section>

        {/* Lado Direito: Box de Ingressos/Certificado (Sympla style) */}
        <aside style={{ flex: '1 1 300px' }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-color)',
            position: 'sticky',
            top: '90px',
            overflow: 'hidden'
          }}>
            <div style={{ backgroundColor: '#f8f9fa', padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ingresso Digital</span>
              <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#2c2c2c' }}>Certificado Oficial</span>
                <span style={{ color: '#10b981', fontWeight: 700, fontSize: '14px' }}>Gratuito</span>
              </div>
            </div>

            <div style={{ padding: '24px 20px' }}>
              {!isLoggedIn ? (
                <div>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: 20 }}>
                    Para solicitar e receber o certificado em PDF gerado automaticamente pela AWS, faça login na sua conta.
                  </p>
                  <button 
                    className="btn-primary" 
                    style={{ width: '100%', padding: '12px' }}
                    onClick={() => setIsLoginOpen(true)}
                  >
                    Entrar para emitir certificado
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', backgroundColor: 'rgba(0,130,244,0.1)',
                      color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 13
                    }}>
                      ✓
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>Logado como</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>{userNome}</p>
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: 20 }}>
                    Seu certificado será gerado no backend, carregado para o AWS S3 e enviado anexado para: <strong>{userEmail}</strong>.
                  </p>

                  {erro && (
                    <div style={{
                      backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: 8,
                      fontSize: '13px', marginBottom: '16px', fontWeight: '500'
                    }}>
                      {erro}
                    </div>
                  )}

                  {mensagem && (
                    <div style={{
                      backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: 8,
                      fontSize: '13px', marginBottom: '16px', fontWeight: '500'
                    }}>
                      {mensagem}
                    </div>
                  )}

                  {certificadoUrl && (
                    <div style={{ marginBottom: 16 }}>
                      <a 
                        href={certificadoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-outline"
                        style={{
                          width: '100%', padding: '10px', display: 'flex', justifyContent: 'center',
                          alignItems: 'center', fontSize: '14px', borderRadius: '8px'
                        }}
                      >
                        <svg style={{ marginRight: 6 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Baixar Certificado (PDF)
                      </a>
                    </div>
                  )}

                  <button 
                    className="btn-primary" 
                    style={{ width: '100%', padding: '12px' }}
                    onClick={handleGerarCertificado}
                    disabled={gerando}
                  >
                    {gerando ? 'GOLS DA AWS... GERANDO...' : 'Emitir Certificado'}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <a href="#sair" style={{ fontSize: '12px', color: 'var(--text-muted)' }} onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                      Entrar com outra conta
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div style={{ backgroundColor: '#f8f9fa', padding: '12px 20px', borderTop: '1px solid var(--border-color)', fontSize: '12px', color: 'var(--text-muted)' }}>
              Suporte técnico disponível durante o evento.
            </div>
          </div>
        </aside>

      </main>

      {/* Modal de Autenticação */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={() => {
          checkLoginState();
          carregarInfosEvento();
        }}
      />
    </div>
  );
}