/**
 * Página do Evento (Área Logada)
 * 
 * Exibe as informações do evento e permite que o usuário gere seu certificado.
 * Esta página é protegida - apenas usuários autenticados têm acesso.
 * 
 * Fluxo:
 * 1. Verifica se o usuário está autenticado (token no localStorage)
 * 2. Se não estiver : redireciona para o login
 * 3. Se estiver : carrega as informações do evento
 * 4. Usuário pode clicar em "Gerar Certificado" para emitir seu PDF
 * 5. O certificado é gerado e enviado por e-mail (SES)
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Evento() {
  const [evento, setEvento] = useState(null);
  const [gerando, setGerando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    console.log('Token no Evento.jsx:', token);

    if (!token) {
      navigate('/login');
      return;
    }

    api.get('/evento', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => setEvento(res.data))
      .catch((error) => {
        console.error('Erro ao carregar evento:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          navigate('/login');
        } else {
          navigate('/login');
        }
      });
  }, [navigate]);

  async function handleGerarCertificado() {
    setGerando(true);
    setMensagem('');

    try {
      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId') || 'userId-temporario';
      const nome = localStorage.getItem('userNome') || 'Participante';
      const email = localStorage.getItem('userEmail');

      console.log('Dados para certificado:', { userId, nome, email });
      
      const response = await api.post('/gerar-certificado', 
        { userId, nome, email },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Resposta:', response.data);
      setMensagem('Certificado gerado! Confira seu e-mail.');
    } catch (err) {
      console.error('Erro detalhado:', err);
      console.error('Response do erro:', err.response?.data);
      
      // Tenta extrair a mensagem de erro do backend
      let mensagemErro = 'Erro ao gerar certificado. Tente novamente.';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          // Se for string, tenta extrair JSON
          try {
            const jsonMatch = err.response.data.match(/\{.*\}/s);
            if (jsonMatch) {
              const dados = JSON.parse(jsonMatch[0]);
              mensagemErro = dados.message || dados.error || mensagemErro;
            }
          } catch (e) {
            mensagemErro = err.response.data;
          }
        } else if (typeof err.response.data === 'object') {
          mensagemErro = err.response.data.message || 
                        err.response.data.error || 
                        err.response.data.erro ||
                        mensagemErro;
        }
      }
      
      setMensagem(`Erro ${mensagemErro}`);
    } finally {
      setGerando(false);
    }
  }

  if (!evento) return <p style={{ textAlign: 'center', marginTop: 80 }}>Carregando...</p>;

  return (
    <div style={{ maxWidth: 500, margin: '80px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h2>{evento.nome}</h2>
      <p>{evento.instituicao}</p>
      <p>{evento.descricao}</p>
      <p><strong>Data:</strong> {evento.data} às {evento.horario}</p>

      <button
        onClick={handleGerarCertificado}
        disabled={gerando}
        style={{ padding: '12px 24px', marginTop: 20, fontSize: 16 }}
      >
        {gerando ? 'Gerando...' : 'Gerar Certificado'}
      </button>

      {mensagem && <p style={{ marginTop: 20 }}>{mensagem}</p>}
    </div>
  );
}