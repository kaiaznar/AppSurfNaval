import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import EditarPerfilScreen from './src/screens/EditarPerfilScreen';

// Telas possíveis depois do login: 'home' | 'perfil' | 'editarPerfil'
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
    // Ligar aqui à navegação real (ex: React Navigation) quando as
    // páginas de calendário, news e inbox existirem.
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
          onVerMaisAulas={() => handleNavigate('calendario')}
          onVerMaisEventos={() => handleNavigate('news')}
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
    </>
  );
}
