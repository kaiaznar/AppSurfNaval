import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import EditarPerfilScreen from './src/screens/EditarPerfilScreen';
import TodasAulasScreen from './src/screens/TodasAulasScreen';
import TodosEventosScreen from './src/screens/TodosEventosScreen';

// Telas possíveis depois do login:
// 'home' | 'perfil' | 'editarPerfil' | 'todasAulas' | 'todosEventos'
export default function App() {
  const [user, setUser] = useState(null);
  const [tela, setTela] = useState('home');

  const handleLoginSuccess = ({ clubeId, perfil }) => {
    console.log('Login efetuado:', clubeId, perfil);
    setUser({ clubeId, perfil });
    setTela('home');
  };

  const handleLogout = () => {
    setUser(null);
    setTela('home');
  };

  const handleNavigate = (destino) => {
    // Ligar aqui à navegação real (ex: React Navigation) para news/inbox/calendário.
    console.log('Navegar para:', destino);
  };

  const handleGuardarPerfil = (dadosAtualizados) => {
    // Substituir por chamada real à API (ex: PUT /utilizador/perfil)
    setUser((prev) => ({
      ...prev,
      perfil: { ...prev.perfil, ...dadosAtualizados },
    }));
    setTela('perfil');
  };

  return (
    <>
      <StatusBar barStyle={user ? 'dark-content' : 'light-content'} />

      {!user && <LoginScreen onLoginSuccess={handleLoginSuccess} />}

      {user && tela === 'home' && (
        <HomeScreen
          utilizador={user.perfil}
          onAbrirMenu={handleLogout /* placeholder: trocar por abrir menu real */}
          onAbrirPerfil={() => setTela('perfil')}
          onVerMaisAulas={() => setTela('todasAulas')}
          onVerMaisEventos={() => setTela('todosEventos')}
          onConfirmarAula={(aulaId) => console.log('Aula confirmada:', aulaId)}
          onNavigate={handleNavigate}
        />
      )}

      {user && tela === 'perfil' && (
        <PerfilScreen
          perfil={user.perfil}
          onVoltar={() => setTela('home')}
          onEditar={() => setTela('editarPerfil')}
          onAlterarFoto={() => console.log('Abrir seletor de foto')}
        />
      )}

      {user && tela === 'editarPerfil' && (
        <EditarPerfilScreen
          perfil={user.perfil}
          onCancelar={() => setTela('perfil')}
          onGuardar={handleGuardarPerfil}
        />
      )}

      {user && tela === 'todasAulas' && (
        <TodasAulasScreen
          onVoltar={() => setTela('home')}
          onAbrirFiltro={() => console.log('Abrir filtro de aulas')}
          onAbrirAula={(aula) => console.log('Abrir detalhe da aula:', aula)}
        />
      )}

      {user && tela === 'todosEventos' && (
        <TodosEventosScreen
          onVoltar={() => setTela('home')}
          onAbrirEvento={(evento) => console.log('Abrir detalhe do evento:', evento)}
        />
      )}
    </>
  );
}
