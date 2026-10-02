import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = ({ clubeId, perfil }) => {
    // perfil vem da base de dados do clube: { nome, modalidade, foto }
    console.log('Login efetuado:', clubeId, perfil);
    setUser({ clubeId, perfil });
  };

  const handleLogout = () => setUser(null);

  const handleNavigate = (destino) => {
    // Ligar aqui à navegação real (ex: React Navigation) quando as
    // páginas de calendário, news e inbox existirem.
    console.log('Navegar para:', destino);
  };

  return (
    <>
      <StatusBar barStyle={user ? 'dark-content' : 'light-content'} />
      {!user ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      ) : (
        <HomeScreen
          utilizador={user.perfil}
          onAbrirMenu={handleLogout /* placeholder: trocar por abrir menu real */}
          onVerMaisAulas={() => handleNavigate('calendario')}
          onVerMaisEventos={() => handleNavigate('news')}
          onConfirmarAula={(aulaId) => console.log('Aula confirmada:', aulaId)}
          onNavigate={handleNavigate}
        />
      )}
    </>
  );
}
