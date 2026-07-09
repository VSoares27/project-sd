/**
 * Ponto de entrada da aplicação React
 * 
 * Este é o arquivo inicial que renderiza toda a aplicação no DOM.
 * Configura o React e o StrictMode para ajudar na identificação de problemas
 * durante o desenvolvimento.
 * 
 * Fluxo:
 * 1. Encontra o elemento <div id="root"> no HTML
 * 2. Cria um "root" React para gerenciar a renderização
 * 3. Renderiza a aplicação dentro do StrictMode
 * 4. O componente App contém todas as rotas e lógica principal
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);