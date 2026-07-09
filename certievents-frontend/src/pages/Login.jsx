/**
 * Página de Login de Usuário
 * 
 * Permite que usuários existentes façam login no sistema.
 * Após autenticação bem-sucedida, salva o token e redireciona para o evento.
 * 
 * Fluxo:
 * 1. Usuário informa e-mail e senha
 * 2. Envia requisição para o backend (Laravel + Cognito)
 * 3. Se sucesso : salva token no localStorage e redireciona
 * 4. Se erro : exibe mensagem de erro
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const response = await api.post('/login', { email, senha });
      console.log('Resposta do login:', response.data);
      
      // EXTRAI O JSON DA RESPOSTA (que vem como string)
      let dados = response.data;
      
      // Se for string, tenta extrair o JSON
      if (typeof dados === 'string') {
        console.log('Resposta é string, extraindo JSON...');
        // Remove o texto "# CORS Configuration..." e extrai o JSON
        const jsonMatch = dados.match(/\{.*\}/s);
        if (jsonMatch) {
          try {
            dados = JSON.parse(jsonMatch[0]);
            console.log('JSON extraído com sucesso:', dados);
          } catch (e) {
            console.error('Erro ao fazer parse do JSON:', e);
          }
        }
      }
      
      // Agora dados é um objeto
      console.log('Dados processados:', dados);
      
      // Salva os dados
      if (dados.accessToken) {
        localStorage.setItem('accessToken', dados.accessToken);
        console.log('AccessToken salvo com sucesso');
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
      
      // Verifica se salvou
      console.log('Token salvo:', localStorage.getItem('accessToken') ? 'SIM' : 'NAO');
      console.log('UserId salvo:', localStorage.getItem('userId'));
      console.log('Nome salvo:', localStorage.getItem('userNome'));
      
      // Se não tiver userId, tenta extrair do token
      if (!localStorage.getItem('userId')) {
        try {
          const token = localStorage.getItem('accessToken');
          if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.sub) {
              localStorage.setItem('userId', payload.sub);
            }
            if (payload.name) {
              localStorage.setItem('userNome', payload.name);
            }
          }
        } catch (e) {
          console.error('Erro ao decodificar token:', e);
        }
      }
      
      navigate('/evento');
    } catch (err) {
      console.error('Erro no login:', err);
      setErro(err.response?.data?.message || 'Erro ao entrar.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', fontFamily: 'sans-serif' }}>
      <h2>Login — CertiEvents</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: 10, marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          style={{ width: '100%', padding: 10, marginBottom: 10 }}
        />
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
        <button type="submit" disabled={carregando} style={{ width: '100%', padding: 10 }}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p>Não tem conta? <Link to="/cadastro">Cadastre-se</Link></p>
    </div>
  );
}