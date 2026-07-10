import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoginModal from '../components/LoginModal';

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userNome, setUserNome] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Recife');
  const navigate = useNavigate();

  useEffect(() => {
    checkLoginState();
  }, []);

  function checkLoginState() {
    const token = localStorage.getItem('accessToken');
    const nome = localStorage.getItem('userNome') || localStorage.getItem('userEmail');
    if (token) {
      setIsLoggedIn(true);
      setUserNome(nome || 'Participante');
    } else {
      setIsLoggedIn(false);
      setUserNome('');
    }
  }

  function handleLogout() {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserNome('');
  }

  function handleMeusIngressos() {
    if (isLoggedIn) {
      navigate('/meus-certificados');
    } else {
      setIsLoginOpen(true);
    }
  }

  // Eventos fake + evento oficial Demo Week
  const events = [
    {
      id: 'demo-week',
      title: 'Demo Week - Evento de Tecnologia e Inovação',
      organizer: 'IFPE Campus Igarassu',
      date: '15 e 16 de Julho',
      location: 'Campus Igarassu - PE',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
      isOfficial: true,
      price: 'Grátis'
    },
    {
      id: 'react-19',
      title: 'React 19 & Vite Bootcamp',
      organizer: 'DevCommunity Nordeste',
      date: '20 de Julho às 19:00',
      location: 'Recife, PE',
      imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
      price: 'R$ 29,90'
    },
    {
      id: 'laravel-aws',
      title: 'Workshop Laravel & AWS Cloud',
      organizer: 'TSI Alumni',
      date: '28 de Out a 02 de Nov',
      location: 'Online',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
      price: 'Grátis'
    },
    {
      id: 'metal-fest',
      title: 'Metal Fest Recife 2026',
      organizer: 'Darkside Studio',
      date: 'Sábado, 15 de Ago às 19:00',
      location: 'Recife, PE',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60',
      price: 'R$ 45,00'
    }
  ];

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.organizer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header Estilo Sympla */}
      <header className="sympla-header">
        <div className="container header-container">
          <Link to="/" className="logo-link">
            <span className="logo-s">C</span>
            <span>CertiEvent</span>
          </Link>

          <div className="search-bar-container">
            <span className="search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input
              type="text"
              placeholder="Buscar eventos, workshops, shows..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="location-selector" onClick={() => {
            const city = prompt("Digite a cidade:", selectedCity);
            if (city) setSelectedCity(city);
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>{selectedCity}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>

          <nav className="header-nav">
            <a href="#criar" className="nav-link" onClick={(e) => { e.preventDefault(); alert("Em breve: Criação de eventos!"); }}>Criar evento</a>
            <span className="nav-link" style={{ cursor: 'pointer' }} onClick={handleMeusIngressos}>Meus ingressos</span>
            
            {isLoggedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="user-profile-menu" onClick={handleMeusIngressos}>
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

      {/* Main Hero / Banner */}
      <section style={{ backgroundColor: '#ffffff', padding: '32px 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          
          <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              DESTAQUE DA SEMANA
            </span>
            <h1 style={{ fontSize: '38px', fontWeight: '800', lineHeight: '1.2', color: '#2c2c2c', margin: '12px 0 16px' }}>
              Participe da Demo Week no IFPE Campus Igarassu
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: '24px', maxWidth: '540px' }}>
              Venha ver os projetos de Sistemas para Internet (TSI), assista a palestras exclusivas e gere seu certificado de participação diretamente na plataforma.
            </p>
            <div>
              <button className="btn-primary" style={{ padding: '14px 28px' }} onClick={() => navigate('/evento/demo-week')}>
                Ver Detalhes do Evento
              </button>
            </div>
          </div>

          <div style={{ flex: '1 1 300px', minHeight: '260px', borderRadius: '16px', overflow: 'hidden', position: 'relative', boxShadow: 'var(--shadow-md)', cursor: 'pointer' }} onClick={() => navigate('/evento/demo-week')}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'url(/demoweek_banner.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}></div>
          </div>

        </div>
      </section>

      {/* Grid de Eventos */}
      <main className="container" style={{ padding: '48px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#2c2c2c' }}>
              Eventos e atividades em {selectedCity}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Descubra workshops, maratonas, palestras acadêmicas e certificados.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <select style={{ padding: '8px 12px', fontSize: 13, width: 'auto' }} defaultValue="relevancia">
              <option value="relevancia">Relevância</option>
              <option value="data">Data</option>
              <option value="preco">Preço</option>
            </select>
          </div>
        </div>

        {/* Filtros em Chip */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 32, overflowX: 'auto', paddingBottom: 8 }}>
          {['Todos', 'Hoje', 'Amanhã', 'Este fim de semana', 'Esta semana', 'Eventos Gratuitos'].map((filter, index) => (
            <button
              key={filter}
              className={index === 0 ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '13px' }}
              onClick={() => index === 5 ? setSearchQuery('Grátis') : index === 0 ? setSearchQuery('') : null}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Lista de Cards */}
        {filteredEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: 'var(--text-muted)' }}>Nenhum evento encontrado para sua busca.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 30
          }}>
            {filteredEvents.map(event => (
              <div
                key={event.id}
                onClick={() => navigate(event.id === 'demo-week' ? '/evento/demo-week' : '#')}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer',
                  border: event.isOfficial ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  transition: 'var(--transition)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                {event.isOfficial && (
                  <span style={{
                    position: 'absolute', top: 12, left: 12,
                    backgroundColor: 'var(--primary)', color: '#fff',
                    padding: '4px 8px', fontSize: 10, fontWeight: 700,
                    borderRadius: 4, textTransform: 'uppercase', zIndex: 5
                  }}>
                    Evento Oficial
                  </span>
                )}

                {/* Banner do card */}
                {event.id === 'demo-week' ? (
                  <div style={{
                    height: 160,
                    backgroundImage: 'url(/demoweek_banner.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}></div>
                ) : (
                  <div style={{
                    height: 160,
                    backgroundImage: `url(${event.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}></div>
                )}

                {/* Info do card */}
                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)', marginBottom: 6 }}>
                    {event.date}
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#2c2c2c', margin: '0 0 8px', minHeight: '44px', lineHeight: '1.4' }}>
                    {event.title}
                  </h3>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: 4 }}>
                    {event.organizer}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    {event.location}
                  </div>
                  <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f3f5', paddingTop: 12 }}>
                    <span style={{ fontSize: 13, color: '#94a3b8' }}>Ingresso</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#10b981' }}>{event.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#2c2c2c', color: '#a0aec0', padding: '40px 0', marginTop: 'auto', borderTop: '1px solid #1a1a1a' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 30, fontSize: 13 }}>
          <div>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 24, height: 24, backgroundColor: '#0082f4', color: '#fff', borderRadius: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16
              }}>C</span>
              CertiEvent
            </span>
            <p style={{ marginTop: 12, maxWidth: 280 }}>
              Área de demonstração de projetos práticos desenvolvidos para a Demo Week 2026.1 do IFPE Campus Igarassu.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: 12 }}>Tecnologias Utilizadas</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>React 19 & Vite</li>
              <li>Laravel 11 API</li>
              <li>AWS Cognito & DynamoDB</li>
              <li>AWS S3 & Amazon SES</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: 12 }}>Desenvolvedores</h4>
            <p>Diego Nunes, Viktor Soares e Viktor Gustavo</p>
            <p style={{ marginTop: 8 }}>IFPE TSI 2026</p>
          </div>
        </div>
      </footer>

      {/* Modal de Autenticação */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={checkLoginState}
      />
    </div>
  );
}
