import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import EditarPerfilScreen from './src/screens/EditarPerfilScreen';
import TodasAulasScreen from './src/screens/TodasAulasScreen';
import TodosEventosScreen from './src/screens/TodosEventosScreen';
import DetalheAulaScreen from './src/screens/DetalheAulaScreen';
import EditarAulaScreen from './src/screens/EditarAulaScreen';

// Telas possíveis depois do login:
// 'home' | 'perfil' | 'editarPerfil' | 'todasAulas' | 'todosEventos'
// | 'detalheAula' | 'editarAula'
export default function App() {
  const [user, setUser] = useState(null);
  const [tela, setTela] = useState('home');
  const [aulaSelecionada, setAulaSelecionada] = useState(null);

  // 'aluno' ou 'instrutor' — em produção, vem do papel real do utilizador
  // autenticado (ex: user.perfil.tipo), não de uma escolha manual.
  const papelUtilizador = user?.perfil?.tipo || 'aluno';

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
    console.log('Navegar para:', destino);
  };

  const handleGuardarPerfil = (dadosAtualizados) => {
    setUser((prev) => ({
      ...prev,
      perfil: { ...prev.perfil, ...dadosAtualizados },
    }));
    setTela('perfil');
  };

  const handleAbrirAula = (aula) => {
    setAulaSelecionada(aula);
    setTela('detalheAula');
  };

  const handleGuardarAula = (aulaAtualizada) => {
    // Substituir por chamada real à API (ex: PUT /aulas/:id)
    setAulaSelecionada(aulaAtualizada);
    setTela('detalheAula');
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
          onAbrirAula={handleAbrirAula}
        />
      )}

      {user && tela === 'todosEventos' && (
        <TodosEventosScreen
          onVoltar={() => setTela('home')}
          onAbrirEvento={(evento) => console.log('Abrir detalhe do evento:', evento)}
        />
      )}

      {user && tela === 'detalheAula' && (
        <DetalheAulaScreen
          aula={aulaSelecionada}
          papel={papelUtilizador}
          onVoltar={() => setTela('home')}
          onConfirmarPresenca={(aulaId) => console.log('Presença confirmada:', aulaId)}
          onSolicitarVagaExtra={(aulaId) => console.log('Vaga extra solicitada:', aulaId)}
          onEditarAula={() => setTela('editarAula')}
          onConfirmarAluno={(alunoId) => console.log('Aluno confirmado:', alunoId)}
          onRemoverAluno={(alunoId) => console.log('Aluno removido:', alunoId)}
          onNotificarAluno={(alunoId) => console.log('Notificação enviada a:', alunoId)}
          onConfirmarTodos={() => console.log('Todos confirmados')}
          onRemoverTodos={() => console.log('Todos removidos')}
          onNotificarTodos={() => console.log('Notificação enviada a todos')}
        />
      )}

      {user && tela === 'editarAula' && (
        <EditarAulaScreen
          aula={aulaSelecionada}
          onCancelar={() => setTela('detalheAula')}
          onGuardar={handleGuardarAula}
        />
      )}
    </>
  );
}
