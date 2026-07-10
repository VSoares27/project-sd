import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import LoginModal from '../components/LoginModal';

export default function MeusCertificados() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userNome, setUserNome] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [certificados, setCertificados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkLoginState();
  }, []);

  function checkLoginState() {
    const token = localStorage.getItem('accessToken');
    const nome = localStorage.getItem('userNome') || localStorage.getItem('userEmail');
    const email = localStorage.getItem('userEmail');
    
    if (!token) {
      navigate('/');
      return;
    }

    setIsLoggedIn(true);
    setUserNome(nome || 'Participante');
    setUserEmail(email || '');
    setCarregando(false);
    
    // Simula a busca de certificados gerados.
    // Como a API não tem um endpoint específico listando todos os certificados do usuário (apenas gerar),
    // podemos armazenar localmente se ele gerou ou buscar do S3 se aplicável, 
    // ou simplesmente renderizar um card da Demo Week com link caso ele já tenha gerado,
    // ou fazer uma chamada mock.
    // Vamos checar se existe um certificadoID salvo para este usuário.
    const mockCerts = [];
    // Simular que se ele gerou, mostramos aqui:
    // (Em um caso real, buscaríamos do DynamoDB)
    mockCerts.push({
      id: 'demo-week-cert',
      eventoNome: 'Demo Week 2026',
      instituicao: 'IFPE Campus Igarassu',
      dataEmissao: '10/07/2026',
      cargaHoraria: '16 horas',
      downloadUrl: '#', // Se ele gerou no evento, salvamos a URL do S3
    });
    setCertificados(mockCerts);
  }

  function handleLogout() {
    localStorage.clear();
    navigate('/');
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
            <Link to="/evento/demo-week" className="nav-link">Evento Demo Week</Link>
            
            {isLoggedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="user-profile-menu">
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

      {/* Conteúdo Principal */}
      <main className="container" style={{ padding: '48px 20px', flexGrow: 1 }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800' }}>Meus Ingressos e Certificados</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Gerencie suas participações em eventos e faça o download dos seus certificados emitidos.
          </p>
        </div>

        {carregando ? (
          <p>Carregando ingressos...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Seção de Ingressos Ativos */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: 16, color: '#2c2c2c' }}>Inscrições e Certificados</h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 24
              }}>
                {/* Card Demo Week */}
                <div style={{
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}>
                  {/* Topo tecnológico neon do card */}
                  <div style={{
                    background: 'linear-gradient(135deg, #1b0a3a 0%, #0d041e 100%)',
                    padding: '20px',
                    color: '#fff',
                    position: 'relative'
                  }}>
                    <span style={{ fontSize: '9px', fontWeight: '800', color: '#d946ef', textTransform: 'uppercase', letterSpacing: 1 }}>IFPE Campus Igarassu</span>
                    <h4 style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0 0', textShadow: '0 0 5px rgba(217, 70, 239, 0.4)' }}>Demo Week 2026</h4>
                  </div>

                  {/* Detalhes do Certificado */}
                  <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifySelf: 'stretch', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                      <div><strong>Participante:</strong> {userNome}</div>
                      <div><strong>E-mail:</strong> {userEmail}</div>
                      <div><strong>Carga Horária:</strong> 16 horas</div>
                      <div><strong>Status:</strong> Inscrição Confirmada</div>
                    </div>

                    <div style={{ borderTop: '1px solid #f1f3f5', paddingTop: 16, display: 'flex', gap: 12 }}>
                      <Link 
                        to="/evento/demo-week" 
                        className="btn-primary" 
                        style={{ flex: 1, fontSize: 13, padding: '10px' }}
                      >
                        Ir para Evento e Gerar PDF
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Exemplo de outros eventos passados */}
                <div style={{
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  opacity: 0.7
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #2b6cb0 0%, #1a365d 100%)',
                    padding: '20px',
                    color: '#fff'
                  }}>
                    <span style={{ fontSize: '9px', fontWeight: '800', color: '#63b3ed', textTransform: 'uppercase', letterSpacing: 1 }}>TSI Workshops</span>
                    <h4 style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0 0' }}>III Bootcamp de Front-end</h4>
                  </div>

                  <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifySelf: 'stretch', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                      <div><strong>Participante:</strong> {userNome}</div>
                      <div><strong>Carga Horária:</strong> 8 horas</div>
                      <div><strong>Realizado em:</strong> 14/11/2025</div>
                    </div>

                    <div style={{ borderTop: '1px solid #f1f3f5', paddingTop: 16 }}>
                      <button 
                        className="btn-outline" 
                        style={{ width: '100%', fontSize: 13, padding: '10px' }}
                        onClick={() => alert('Certificado antigo arquivado. Entre em contato com a secretaria.')}
                      >
                        Visualizar Certificado Antigo
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}
      </main>

      {/* Modal de Autenticação */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={checkLoginState}
      />
    </div>
  );
}
