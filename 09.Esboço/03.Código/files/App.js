import React, { useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';

export default function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = ({ clubeId, perfil }) => {
    // Aqui entras na página principal do app (feed de aulas, calendário, etc.)
    console.log('Login efetuado:', clubeId, perfil);
    setUser({ clubeId, perfil });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      {!user ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      ) : (
        // Substituir pelo componente da página principal quando for criada
        <></>
      )}
    </SafeAreaView>
  );
}
