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
import CalendarioScreen from './src/screens/CalendarioScreen';
import DiaAgendaScreen from './src/screens/DiaAgendaScreen';
import CriarAulaScreen from './src/screens/CriarAulaScreen';
import CriarEventoScreen from './src/screens/CriarEventoScreen';
import InboxScreen from './src/screens/InboxScreen';
import ChatScreen from './src/screens/ChatScreen';
import { EditarRecorrenciaModal } from './src/components/AulaModals';
import NovaConversaModal from './src/components/NovaConversaModal';

// Telas possíveis depois do login:
// 'home' | 'perfil' | 'editarPerfil' | 'todasAulas' | 'todosEventos'
// | 'detalheAula' | 'editarAula' | 'calendario' | 'diaAgenda'
// | 'criarAula' | 'criarEvento' | 'news' | 'inbox' | 'chat'
export default function App() {
  const [user, setUser] = useState(null);
  const [tela, setTela] = useState('home');
  const [aulaSelecionada, setAulaSelecionada] = useState(null);
  const [diaSelecionado, setDiaSelecionado] = useState(new Date(2026, 5, 24));
  const [horaParaCriar, setHoraParaCriar] = useState(15);
  const [chatSelecionado, setChatSelecionado] = useState(null);

  const [modalRecorrenciaVisivel, setModalRecorrenciaVisivel] = useState(false);
  const [modalNovaConversaVisivel, setModalNovaConversaVisivel] = useState(false);

  const papelUtilizador = user?.perfil?.tipo || 'instrutor';

  const handleLoginSuccess = ({ clubeId, perfil }) => {
    setUser({ clubeId, perfil });
    setTela('home');
  };

  const handleLogout = () => {
    setUser(null);
    setTela('home');
  };

  const handleNavigate = (destino) => {
    if (destino === 'calendario') setTela('calendario');
    else if (destino === 'news') setTela('news');
    else if (destino === 'inbox') setTela('inbox');
    else console.log('Navegar para:', destino);
  };

  const handleGuardarPerfil = (dadosAtualizados) => {
    setUser((prev) => ({ ...prev, perfil: { ...prev.perfil, ...dadosAtualizados } }));
    setTela('perfil');
  };

  const handleAbrirAula = (aula) => {
    setAulaSelecionada(aula);
    setTela('detalheAula');
  };

  const handlePedirEdicaoAula = () => {
    setModalRecorrenciaVisivel(true);
  };

  const handleEscolherEdicaoRecorrencia = (opcao) => {
    console.log('Edição de recorrência escolhida:', opcao);
    setModalRecorrenciaVisivel(false);
    setTela('detalheAula');
  };

  const handleSelecionarDiaCalendario = (data) => {
    setDiaSelecionado(data);
    setTela('diaAgenda');
  };

  const handleCriarAtividade = () => {
    setHoraParaCriar(15);
    setTela('criarAula');
  };

  const handleCriarAula = (novaAula) => {
    console.log('Aula criada:', novaAula);
    setTela('diaAgenda');
  };

  const handleCriarEvento = (novoEvento) => {
    console.log('Evento criado:', novoEvento);
    // Ao criar o evento, o chat de grupo é criado automaticamente com os
    // participantes definidos em `novoEvento.notificar`. Substituir por
    // chamada real: POST /eventos -> trigger POST /chats (tipo 'evento')
    setTela('diaAgenda');
  };

  const handleAbrirChat = (chat) => {
    setChatSelecionado(chat);
    setTela('chat');
  };

  const handleCriarNovaConversa = ({ tipo, destinatarios, nome }) => {
    // tipo: 'individual' | 'grupo' | 'aviso'
    // Substituir por chamada real à API:
    // - individual/grupo: POST /chats { tipo, participantes }
    // - aviso: POST /avisos { destinatarios } -> aparece no chat de sistema "avisos"
    console.log('Nova conversa:', tipo, destinatarios, nome);

    if (tipo === 'aviso') {
      // Avisos não abrem uma janela de chat própria — vão para "avisos".
      setTela('inbox');
      return;
    }

    setChatSelecionado({
      id: `novo-${Date.now()}`,
      tipo: tipo === 'grupo' ? 'grupo' : 'individual',
      nome,
      icone: '⚓',
      iconeBg: '#0A1F3D',
    });
    setTela('chat');
  };

  return (
    <>
      <StatusBar barStyle={user ? 'dark-content' : 'light-content'} />

      {!user && <LoginScreen onLoginSuccess={handleLoginSuccess} />}

      {user && tela === 'home' && (
        <HomeScreen
          utilizador={user.perfil}
          onAbrirMenu={handleLogout}
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

      {user && tela === 'news' && (
        <TodosEventosScreen
          onVoltar={() => setTela('home')}
          onAbrirEvento={(evento) => console.log('Abrir detalhe da notícia:', evento)}
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
          onGuardar={handlePedirEdicaoAula}
        />
      )}

      {user && tela === 'calendario' && (
        <CalendarioScreen
          onVoltar={() => setTela('home')}
          onSelecionarDia={handleSelecionarDiaCalendario}
        />
      )}

      {user && tela === 'diaAgenda' && (
        <DiaAgendaScreen
          data={diaSelecionado}
          papel={papelUtilizador}
          onVoltar={() => setTela('calendario')}
          onCriarAtividade={handleCriarAtividade}
          onAbrirItem={(item) => {
            if (item.tipo === 'aula') handleAbrirAula(item);
            else console.log('Abrir detalhe do evento:', item);
          }}
        />
      )}

      {user && tela === 'criarAula' && (
        <CriarAulaScreen
          dataPreSelecionada={diaSelecionado}
          horaPreSelecionada={horaParaCriar}
          diaSemanaPreSelecionado={diaSelecionado.getDay()}
          onCancelar={() => setTela('diaAgenda')}
          onCriar={handleCriarAula}
        />
      )}

      {user && tela === 'criarEvento' && (
        <CriarEventoScreen
          dataPreSelecionada={diaSelecionado}
          horaPreSelecionada={horaParaCriar}
          onCancelar={() => setTela('diaAgenda')}
          onCriar={handleCriarEvento}
        />
      )}

      {user && tela === 'inbox' && (
        <InboxScreen
          onVoltar={() => setTela('home')}
          onAbrirChat={handleAbrirChat}
          onCriarNovaConversa={() => setModalNovaConversaVisivel(true)}
        />
      )}

      {user && tela === 'chat' && (
        <ChatScreen
          chat={chatSelecionado}
          onVoltar={() => setTela('inbox')}
          onAbrirAula={(aulaId) => {
            setAulaSelecionada({ id: aulaId });
            setTela('detalheAula');
          }}
          onEnviarMensagem={(chatId, mensagem) => console.log('Mensagem enviada:', chatId, mensagem)}
        />
      )}

      <EditarRecorrenciaModal
        visible={modalRecorrenciaVisivel}
        dataDaAula={aulaSelecionada ? `${aulaSelecionada.dataCurta || '24/06'}` : ''}
        onClose={() => setModalRecorrenciaVisivel(false)}
        onEscolher={handleEscolherEdicaoRecorrencia}
      />

      <NovaConversaModal
        visible={modalNovaConversaVisivel}
        onClose={() => setModalNovaConversaVisivel(false)}
        onCriarChat={handleCriarNovaConversa}
      />
    </>
  );
}
