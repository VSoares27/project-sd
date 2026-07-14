import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import LoginModal from '../components/LoginModal';

export default function Evento() {
  const [evento, setEvento] = useState({
    nome: 'Demo Week - Evento de Tecnologia e Inovação',
    instituicao: 'IFPE - Campus Igarassu',
    descricao:
      'O futuro não está chegando, ele já está AQUI. Prepare-se para uma imersão total no ecossistema que está moldando o amanhã. Vem aí a DEMO WEEK no IFPE Campus Igarassu! Nos dias 15 e 16 de julho, vamos hackear o presente e desbloquear o próximo nível da tecnologia e da inovação. Esqueça o básico: prepare-se para códigos, inteligência artificial, robótica e insights que vão explodir a sua mente! 😉 Tech, ideias e muita inovação!',
    data: '2026-07-15',
    horario: '14:00',
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

  // ============================================================
  // FUNÇÕES AUXILIARES
  // ============================================================
  function formatarDataCertificado(dataStr) {
    if (!dataStr) return '';
    const partes = dataStr.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataStr;
  }

  // ============================================================
  // HOOKS E EFFECTS
  // ============================================================
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
    if (!token) return;

    try {
      const res = await api.get('/evento/demo-week');
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

      const response = await api.post(
        '/gerar-certificado',
        { userId, nome, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let dados = response.data;
      if (typeof dados === 'string') {
        const jsonMatch = dados.match(/\{.*\}/s);
        if (jsonMatch) dados = JSON.parse(jsonMatch[0]);
      }

      setMensagem('✅ Certificado gerado com sucesso!');
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
          } catch {
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

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* HEADER */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: '#ffffff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          padding: '8px 0',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 16,
              }}
            >
              C
            </span>
            <span style={{ fontWeight: 700, fontSize: 18, color: '#1a1a2e' }}>CertiEvent</span>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/" style={{ fontSize: 13, color: '#4a5568', textDecoration: 'none' }}>
              Página Inicial
            </Link>
            {isLoggedIn && (
              <Link to="/meus-certificados" style={{ fontSize: 13, color: '#4a5568', textDecoration: 'none' }}>
                Meus ingressos
              </Link>
            )}

            {isLoggedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  onClick={() => navigate('/meus-certificados')}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    {userNome.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#1a1a2e' }}>
                    {userNome.split(' ')[0]}
                  </span>
                </div>
                <button
                  style={{
                    padding: '4px 12px',
                    fontSize: 12,
                    borderRadius: 6,
                    border: '1px solid #e5e7eb',
                    background: 'transparent',
                    color: '#4a5568',
                    cursor: 'pointer',
                  }}
                  onClick={handleLogout}
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                style={{
                  padding: '6px 16px',
                  fontSize: 13,
                  borderRadius: 6,
                  background: 'linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onClick={() => setIsLoginOpen(true)}
              >
                Entrar
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* ============================================================ */}
      {/* BANNER */}
      {/* ============================================================ */}
      <div
        style={{
          width: '100%',
          maxWidth: '1350px',
          margin: '24px auto 0',
          borderRadius: '20px',
          overflow: 'hidden',
          padding: '0 20px',
        }}
      >
        <img
          src="/header_banner.png"
          alt="Demo Week Banner"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            objectFit: 'cover',
            borderRadius: '20px',
          }}
        />
      </div>

      {/* ============================================================ */}
      {/* MAIN - CSS GRID */}
      {/* ============================================================ */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '30px auto',
          padding: '0 20px 60px',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gridTemplateAreas: '"sobre ingresso" "preview ingresso"',
          gap: '30px',
          alignItems: 'start',
        }}
      >
        {/* ============================================================ */}
        {/* ÁREA 1: SOBRE O EVENTO */}
        {/* ============================================================ */}
        <div
          style={{
            gridArea: 'sobre',
            background: '#ffffff',
            borderRadius: '18px',
            border: '1px solid #E5E7EB',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: 6, color: '#1a1a2e' }}>
              {evento.nome}
            </h2>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                color: '#6b7280',
                fontSize: '13px',
              }}
            >
              <span style={{ fontWeight: 600, color: '#2b6cb0' }}>Organizado por:</span>
              <span>{evento.instituicao}</span>
            </div>
          </div>

          <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: 20 }} />

          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: 10, color: '#1a1a2e' }}>
            Sobre o evento
          </h3>
          <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.8', marginBottom: 24 }}>
            {evento.descricao}
          </p>

          {/* ============================================================ */}
          {/* INFRAESTRUTURA AWS - ATUALIZADA */}
          {/* ============================================================ */}
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: 10, color: '#1a1a2e' }}>
            Infraestrutura AWS
          </h3>
          <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.8', marginBottom: 16 }}>
           Este projeto conta com uma arquitetura inovadora na AWS. A infraestrutura de backend em EC2 é provisionada e escalada de forma 100% automatizada e agendada:
          </p>

          <ul
            style={{
              paddingLeft: 0,
              color: '#4b5563',
              fontSize: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              listStyle: 'none',
            }}
          >
            <li style={{ padding: '8px 16px', background: '#f8f9fa', borderRadius: '6px' }}>
              <strong>Amazon Cognito:</strong> Gerencia autenticação e cadastro de usuários com tokens JWT.
            </li>
            <li style={{ padding: '8px 16px', background: '#f8f9fa', borderRadius: '6px' }}>
              <strong>API Gateway &amp; AWS Lambda:</strong> Recebem o acesso do usuário e ativam a instância EC2 automaticamente, sem qualquer ação manual do administrador.
            </li>
            <li style={{ padding: '8px 16px', background: '#f8f9fa', borderRadius: '6px' }}>
              <strong>AWS Lambda &amp; EventBridge Scheduler:</strong> Monitoram a atividade do servidor a cada 30 minutos e o desligam automaticamente após período de inatividade, reduzindo custos de infraestrutura.
            </li>
            <li style={{ padding: '8px 16px', background: '#f8f9fa', borderRadius: '6px' }}>
              <strong>Amazon S3:</strong> Armazena os certificados em PDF gerados pelo backend.
            </li>
            <li style={{ padding: '8px 16px', background: '#f8f9fa', borderRadius: '6px' }}>
              <strong>Amazon SES:</strong> Envia o certificado por e-mail diretamente ao participante, após aprovação do administrador.
            </li>
          </ul>
        </div>

        {/* ============================================================ */}
        {/* ÁREA 2: INGRESSO DIGITAL */}
        {/* ============================================================ */}
        <div
          style={{
            gridArea: 'ingresso',
            width: '100%',
            maxWidth: '360px',
            justifySelf: 'end',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '18px',
              border: '1px solid #E5E7EB',
              padding: '0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)',
                padding: '16px 20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      color: '#bee3f8',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}
                  >
                    Ingresso Digital
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                      Certificado Oficial
                    </span>
                    <span
                      style={{
                        background: '#48bb78',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '10px',
                        padding: '2px 10px',
                        borderRadius: '20px',
                      }}
                    >
                      Gratuito
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: 16,
                  }}
                >
                  ✓
                </div>
              </div>
            </div>

            <div style={{ padding: '20px' }}>
              {!isLoggedIn ? (
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: 16, lineHeight: 1.6 }}>
                    Faça login para emitir seu certificado oficial.
                  </p>
                  <button
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '14px',
                      fontWeight: 600,
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onClick={() => setIsLoginOpen(true)}
                  >
                    Entrar
                  </button>
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginBottom: 14,
                      padding: '10px 14px',
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      border: '1px solid #e9ecef',
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    >
                      {userNome.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <p
                        style={{
                          fontSize: 9,
                          color: '#6b7280',
                          margin: 0,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                        }}
                      >
                        Logado como
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#1a1a2e',
                          margin: 0,
                          textTransform: 'uppercase',
                        }}
                      >
                        {userNome.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      marginBottom: 16,
                      padding: '10px 14px',
                      background: '#ebf8ff',
                      borderRadius: '8px',
                      border: '1px solid #bee3f8',
                    }}
                  >
                    <p style={{ fontSize: '10px', color: '#2b6cb0', margin: 0, textAlign: 'center' }}>
                      Enviado para:
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#1a365d',
                        margin: '2px 0 0',
                        textAlign: 'center',
                        wordBreak: 'break-all',
                      }}
                    >
                      {userEmail}
                    </p>
                  </div>

                  {erro && (
                    <div
                      style={{
                        backgroundColor: '#ffebee',
                        color: '#c62828',
                        padding: '8px',
                        borderRadius: 6,
                        fontSize: '12px',
                        marginBottom: 12,
                        fontWeight: '500',
                        textAlign: 'center',
                      }}
                    >
                      ❌ {erro}
                    </div>
                  )}

                  {mensagem && (
                    <div
                      style={{
                        backgroundColor: '#e8f5e9',
                        color: '#2e7d32',
                        padding: '8px',
                        borderRadius: 6,
                        fontSize: '12px',
                        marginBottom: 12,
                        fontWeight: '500',
                        textAlign: 'center',
                      }}
                    >
                      {mensagem}
                    </div>
                  )}

                  {certificadoUrl && (
                    <div style={{ marginBottom: 12 }}>
                      <a
                        href={certificadoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          width: '100%',
                          padding: '10px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: '13px',
                          borderRadius: '8px',
                          background: '#48bb78',
                          color: '#ffffff',
                          textDecoration: 'none',
                          fontWeight: 600,
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = '#38a169';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = '#48bb78';
                        }}
                      >
                        <svg
                          style={{ marginRight: 6 }}
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Baixar PDF
                      </a>
                    </div>
                  )}

                  <button
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '14px',
                      fontWeight: 600,
                      borderRadius: '8px',
                      background: gerando ? '#94a3b8' : 'linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)',
                      cursor: gerando ? 'not-allowed' : 'pointer',
                      border: 'none',
                      color: '#ffffff',
                      transition: 'all 0.2s',
                    }}
                    onClick={handleGerarCertificado}
                    disabled={gerando}
                  >
                    {gerando ? '⏳ GERANDO...' : '🎓 Emitir Certificado'}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: 10 }}>
                    <a
                      href="#sair"
                      style={{
                        fontSize: '11px',
                        color: '#6b7280',
                        textDecoration: 'none',
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                      }}
                    >
                      Entrar com outra conta
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                backgroundColor: '#f8f9fa',
                padding: '8px 20px',
                borderTop: '1px solid #e5e7eb',
                fontSize: '11px',
                color: '#6b7280',
                textAlign: 'center',
              }}
            >
              🛟 Suporte técnico disponível durante o evento.
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* ÁREA 3: PRÉ-VISUALIZAÇÃO */}
        {/* ============================================================ */}
        <div
          style={{
            gridArea: 'preview',
            background: '#ffffff',
            borderRadius: '18px',
            border: '1px solid #E5E7EB',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          }}
        >
          {isLoggedIn ? (
            <>
              <h4
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#2b6cb0',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  marginBottom: 16,
                  textAlign: 'center',
                }}
              >
                PRÉ-VISUALIZAÇÃO DO SEU CERTIFICADO
              </h4>

              <div
                style={{
                  background: 'linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)',
                  borderRadius: '12px',
                  border: '3px solid #63b3ed',
                  padding: '32px 28px',
                  position: 'relative',
                  boxShadow: '0 8px 32px rgba(43, 108, 176, 0.25)',
                  minHeight: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    right: '8px',
                    bottom: '8px',
                    border: '1px solid rgba(99, 179, 237, 0.2)',
                    borderRadius: '8px',
                    pointerEvents: 'none',
                  }}
                />

                <div style={{ marginBottom: '4px', width: '100%' }}>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#bee3f8',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                    }}
                  >
                    INSTITUTO FEDERAL DE PERNAMBUCO
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      fontWeight: '500',
                      color: '#90cdf4',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      marginTop: '2px',
                    }}
                  >
                    CAMPUS IGARASSU
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '1px',
                      background: 'linear-gradient(to right, transparent, #63b3ed, transparent)',
                      margin: '6px auto 0',
                    }}
                  />
                </div>

                <div style={{ marginTop: '4px' }}>
                  <h2
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: '28px',
                      fontWeight: '700',
                      color: '#f6e05e',
                      letterSpacing: '4px',
                      textTransform: 'uppercase',
                      margin: 0,
                      textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    CERTIFICADO
                  </h2>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: '300',
                      color: '#fbd38d',
                      letterSpacing: '4px',
                      textTransform: 'uppercase',
                      marginTop: '2px',
                      opacity: 0.9,
                    }}
                  >
                    DE PARTICIPAÇÃO
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    marginTop: '8px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#ffffff',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      padding: '0 16px 6px 16px',
                      textShadow: '0 2px 8px rgba(246, 196, 69, 0.15)',
                      display: 'inline-block',
                    }}
                  >
                    {userNome.toUpperCase()}
                  </span>
                  <div
                    style={{
                      width: '160px',
                      height: '2px',
                      background: 'linear-gradient(to right, transparent, #f6e05e, transparent)',
                      margin: '0 auto',
                    }}
                  />
                </div>

                <div style={{ marginTop: '8px' }}>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: '13px',
                      color: '#bee3f8',
                      marginBottom: '2px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Certificamos que
                  </p>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: '14px',
                      color: '#e2e8f0',
                      lineHeight: '1.6',
                      letterSpacing: '0.3px',
                    }}
                  >
                    participou do evento <strong style={{ color: '#f6e05e' }}>{evento.nome}</strong>,
                    <br />
                    realizado em{' '}
                    <span style={{ color: '#fbd38d', fontWeight: '600' }}>
                      {formatarDataCertificado(evento.data)}
                    </span>
                    .
                  </p>
                </div>

                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '8px',
                    paddingTop: '10px',
                    borderTop: '1px solid rgba(99, 179, 237, 0.2)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '8px',
                      fontWeight: '500',
                      color: '#90cdf4',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Código de Autenticação:{' '}
                    <span style={{ color: '#f6e05e', fontWeight: '600' }}>
                      ID XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
                    </span>
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <h4
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#2b6cb0',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  marginBottom: 12,
                }}
              >
                PRÉ-VISUALIZAÇÃO DO SEU CERTIFICADO
              </h4>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Faça login para visualizar a pré-visualização do seu certificado.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL DE AUTENTICAÇÃO */}
      {/* ============================================================ */}
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