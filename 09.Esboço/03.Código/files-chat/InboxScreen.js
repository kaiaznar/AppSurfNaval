import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';

// -----------------------------------------------------------------------
// Cores do Clube Naval do Funchal
// -----------------------------------------------------------------------
const colors = {
  navy: '#0A1F3D',
  gold: '#C9A24B',
  white: '#FFFFFF',
  pageBg: '#F6F5F1',
  cardBg: '#FFFFFF',
  unreadBg: '#FAF7F0',
  border: '#E4E2DA',
  textPrimary: '#1A1A18',
  textSecondary: '#6B6A66',
  accent: '#791F1F',
  avisoBg: '#92660E',
  eventoBg: '#92660E',
};

// -----------------------------------------------------------------------
// Dados de exemplo. Substituir por chamada real à API:
// GET /chats?utilizadorId=...  (ordenado por ultimaAtividade desc)
// -----------------------------------------------------------------------
const chatsExemplo = [
  {
    id: 'chat-avisos',
    tipo: 'avisos', // chat de sistema, só leitura
    nome: 'avisos',
    ultimaMensagem: 'a aula de quarta mudou de local',
    ultimaAtividade: '2026-06-24T11:05:00',
    lida: false,
    icone: '🔔',
    iconeBg: colors.avisoBg,
  },
  {
    id: 'chat-1',
    tipo: 'individual',
    nome: 'treinador Rui Abreu',
    ultimaMensagem: 'lembra-te de trazer a prancha nova',
    ultimaAtividade: '2026-06-24T14:32:00',
    lida: false,
    icone: '⚓',
    iconeBg: colors.navy,
  },
  {
    id: 'chat-evento-1',
    tipo: 'evento',
    nome: 'campeonato regional de surf',
    ultimaMensagem: 'Tiago: alguém sabe a que horas é a inscrição?',
    ultimaAtividade: '2026-06-23T18:40:00',
    lida: false,
    icone: '🏆',
    iconeBg: colors.eventoBg,
  },
  {
    id: 'chat-2',
    tipo: 'individual',
    nome: 'Maria Sousa',
    ultimaMensagem: 'obrigada treinador!',
    ultimaAtividade: '2026-06-22T10:12:00',
    lida: true,
    icone: '⚓',
    iconeBg: colors.navy,
  },
  {
    id: 'chat-evento-2',
    tipo: 'evento',
    nome: 'viagem ao porto santo',
    ultimaMensagem: 'Sofia: já fiz a inscrição 🎉',
    ultimaAtividade: '2026-06-21T09:00:00',
    lida: true,
    icone: '✈️',
    iconeBg: colors.eventoBg,
  },
  {
    id: 'chat-3',
    tipo: 'individual',
    nome: 'Hugo Pestana',
    ultimaMensagem: 'boa aula hoje 👍',
    ultimaAtividade: '2026-06-18T16:00:00',
    lida: true,
    icone: '⚓',
    iconeBg: colors.navy,
  },
];

function formatarHoraOuData(isoString) {
  const data = new Date(isoString);
  const hoje = new Date();
  const ehHoje = data.toDateString() === hoje.toDateString();

  const ontem = new Date(hoje);
  ontem.setDate(ontem.getDate() - 1);
  const ehOntem = data.toDateString() === ontem.toDateString();

  const diasDaSemana = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const diffDias = Math.floor((hoje - data) / (1000 * 60 * 60 * 24));

  if (ehHoje) {
    return `${String(data.getHours()).padStart(2, '0')}h${String(data.getMinutes()).padStart(2, '0')}`;
  }
  if (ehOntem) return 'ontem';
  if (diffDias < 7) return diasDaSemana[data.getDay()];
  return `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}`;
}

export default function InboxScreen({
  chats = chatsExemplo,
  onVoltar,
  onAbrirChat,
  onCriarNovaConversa,
}) {
  // Ordena por atividade mais recente, depois separa em não lidas / lidas.
  const { naoLidas, lidas } = useMemo(() => {
    const ordenados = [...chats].sort(
      (a, b) => new Date(b.ultimaAtividade) - new Date(a.ultimaAtividade)
    );
    return {
      naoLidas: ordenados.filter((c) => !c.lida),
      lidas: ordenados.filter((c) => c.lida),
    };
  }, [chats]);

  const secoes = [
    { tipo: 'header', id: 'header-naoLidas', titulo: 'não lidas', visivel: naoLidas.length > 0 },
    ...naoLidas.map((c) => ({ ...c, secao: 'naoLida' })),
    { tipo: 'header', id: 'header-lidas', titulo: 'lidas', visivel: lidas.length > 0 },
    ...lidas.map((c) => ({ ...c, secao: 'lida' })),
  ].filter((item) => item.tipo !== 'header' || item.visivel);

  const renderItem = ({ item }) => {
    if (item.tipo === 'header') {
      return <Text style={styles.sectionHeader}>{item.titulo}</Text>;
    }

    const naoLida = item.secao === 'naoLida';

    return (
      <TouchableOpacity
        style={[styles.chatRow, naoLida && styles.chatRowNaoLida]}
        onPress={() => onAbrirChat && onAbrirChat(item)}
      >
        <View style={[styles.avatar, { backgroundColor: item.iconeBg }]}>
          <Text style={styles.avatarIcon}>{item.icone}</Text>
        </View>

        <View style={styles.chatTextWrap}>
          <View style={styles.chatHeaderRow}>
            <Text style={[styles.chatNome, naoLida && styles.chatNomeNaoLida]} numberOfLines={1}>
              {item.nome}
            </Text>
            <Text style={[styles.chatHora, naoLida && styles.chatHoraNaoLida]}>
              {formatarHoraOuData(item.ultimaAtividade)}
            </Text>
          </View>
          <Text
            style={[styles.chatPreview, naoLida && styles.chatPreviewNaoLida]}
            numberOfLines={1}
          >
            {item.ultimaMensagem}
          </Text>
        </View>

        {naoLida && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ---------- Cabeçalho ---------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onVoltar} accessibilityLabel="voltar" accessibilityRole="button">
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>mensagens</Text>
        <TouchableOpacity onPress={onCriarNovaConversa} accessibilityLabel="nova conversa" accessibilityRole="button">
          <Text style={styles.newChatIcon}>✎</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={secoes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

// -----------------------------------------------------------------------
// Estilos
// -----------------------------------------------------------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.pageBg,
  },
  header: {
    backgroundColor: colors.cardBg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  headerIcon: {
    fontSize: 22,
    color: colors.navy,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  newChatIcon: {
    fontSize: 19,
    color: colors.accent,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.4,
    marginTop: 14,
    marginBottom: 8,
    paddingLeft: 2,
  },
  chatRow: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 6,
  },
  chatRowNaoLida: {
    backgroundColor: colors.unreadBg,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarIcon: {
    fontSize: 18,
  },
  chatTextWrap: {
    flex: 1,
  },
  chatHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatNome: {
    fontSize: 13.5,
    fontWeight: '500',
    color: colors.textPrimary,
    flex: 1,
  },
  chatNomeNaoLida: {
    fontWeight: '700',
  },
  chatHora: {
    fontSize: 10.5,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  chatHoraNaoLida: {
    color: colors.accent,
    fontWeight: '600',
  },
  chatPreview: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chatPreviewNaoLida: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    flexShrink: 0,
  },
});
