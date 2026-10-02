import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
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
  border: '#E4E2DA',
  textPrimary: '#1A1A18',
  textSecondary: '#6B6A66',
  textHint: '#B4B2A9',
  accent: '#791F1F',
  accentBg: '#FAECE7',
  bolhaRecebida: '#FFFFFF',
  bolhaEnviada: '#0A1F3D',
};

// -----------------------------------------------------------------------
// Dados de exemplo de mensagens. Substituir por chamada real:
// GET /chats/:id/mensagens
// -----------------------------------------------------------------------
const mensagensExemploIndividual = [
  { id: 'm1', autor: 'outro', texto: 'olá Maria, tudo bem para a aula de quarta?', hora: '14h20' },
  { id: 'm2', autor: 'eu', texto: 'sim! já confirmei 😊', hora: '14h25' },
  { id: 'm3', autor: 'outro', texto: 'lembra-te de trazer a prancha nova', hora: '14h32' },
];

const mensagensExemploAvisos = [
  {
    id: 'a1',
    autor: 'sistema',
    texto: '⚠️ a aula de quarta-feira mudou de local.',
    hora: '11h05',
    linkAula: { titulo: 'aula de surf · 24/06 · 17h00', aulaId: 'aula-1' },
  },
  { id: 'a2', autor: 'sistema', texto: '📣 inscrições para o campeonato regional abrem esta sexta-feira.', hora: 'ontem' },
];

export default function ChatScreen({
  chat = { id: 'chat-1', tipo: 'individual', nome: 'treinador Rui Abreu', icone: '⚓', iconeBg: colors.navy },
  mensagensIniciais,
  onVoltar,
  onAbrirAula,
  onEnviarMensagem,
}) {
  const isApenasLeitura = chat.tipo === 'avisos';

  const [mensagens, setMensagens] = useState(
    mensagensIniciais ||
      (isApenasLeitura ? mensagensExemploAvisos : mensagensExemploIndividual)
  );
  const [textoNovo, setTextoNovo] = useState('');

  const handleEnviar = () => {
    if (!textoNovo.trim() || isApenasLeitura) return;

    const novaMensagem = {
      id: `local-${Date.now()}`,
      autor: 'eu',
      texto: textoNovo.trim(),
      hora: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
    };

    setMensagens((prev) => [...prev, novaMensagem]);
    onEnviarMensagem && onEnviarMensagem(chat.id, novaMensagem);
    setTextoNovo('');
  };

  const renderMensagem = ({ item }) => {
    const ehMinha = item.autor === 'eu';

    return (
      <View style={[styles.mensagemWrap, ehMinha ? styles.mensagemWrapDireita : styles.mensagemWrapEsquerda]}>
        <View
          style={[
            styles.bolha,
            ehMinha ? styles.bolhaEnviada : styles.bolhaRecebida,
          ]}
        >
          <Text style={[styles.textoMensagem, ehMinha && styles.textoMensagemEnviada]}>
            {item.texto}
          </Text>

          {item.linkAula && (
            <TouchableOpacity
              style={styles.linkAulaCard}
              onPress={() => onAbrirAula && onAbrirAula(item.linkAula.aulaId)}
            >
              <Text style={styles.linkAulaIcone}>🏄</Text>
              <View style={styles.linkAulaTextWrap}>
                <Text style={styles.linkAulaTitulo}>{item.linkAula.titulo}</Text>
                <Text style={styles.linkAulaAcao}>ver detalhes da aula ›</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.horaMensagem, ehMinha && styles.horaMensagemDireita]}>
          {item.hora}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ---------- Cabeçalho ---------- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onVoltar} accessibilityLabel="voltar" accessibilityRole="button">
            <Text style={styles.headerIcon}>←</Text>
          </TouchableOpacity>
          <View style={[styles.headerAvatar, { backgroundColor: chat.iconeBg }]}>
            <Text style={styles.headerAvatarIcon}>{chat.icone}</Text>
          </View>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerNome}>{chat.nome}</Text>
            {isApenasLeitura && <Text style={styles.headerSubtitulo}>só leitura</Text>}
          </View>
        </View>

        {/* ---------- Mensagens ---------- */}
        <FlatList
          data={mensagens}
          keyExtractor={(item) => item.id}
          renderItem={renderMensagem}
          contentContainerStyle={styles.listContent}
        />

        {/* ---------- Campo de escrever, ou faixa de só-leitura ---------- */}
        {isApenasLeitura ? (
          <View style={styles.readOnlyBar}>
            <Text style={styles.readOnlyIcon}>🔒</Text>
            <Text style={styles.readOnlyText}>este chat é só de leitura</Text>
          </View>
        ) : (
          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              placeholder="escrever mensagem..."
              placeholderTextColor={colors.textHint}
              value={textoNovo}
              onChangeText={setTextoNovo}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, !textoNovo.trim() && styles.sendButtonDisabled]}
              onPress={handleEnviar}
              disabled={!textoNovo.trim()}
              accessibilityLabel="enviar mensagem"
            >
              <Text style={styles.sendIcon}>➤</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
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
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  headerIcon: {
    fontSize: 20,
    color: colors.navy,
  },
  headerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarIcon: {
    fontSize: 15,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerNome: {
    fontSize: 13.5,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  headerSubtitulo: {
    fontSize: 9.5,
    color: colors.textSecondary,
  },
  listContent: {
    padding: 14,
    paddingBottom: 8,
  },
  mensagemWrap: {
    maxWidth: '85%',
    marginBottom: 10,
  },
  mensagemWrapEsquerda: {
    alignSelf: 'flex-start',
  },
  mensagemWrapDireita: {
    alignSelf: 'flex-end',
  },
  bolha: {
    borderRadius: 14,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  bolhaRecebida: {
    backgroundColor: colors.bolhaRecebida,
  },
  bolhaEnviada: {
    backgroundColor: colors.bolhaEnviada,
  },
  textoMensagem: {
    fontSize: 12.5,
    color: colors.textPrimary,
  },
  textoMensagemEnviada: {
    color: colors.white,
  },
  horaMensagem: {
    fontSize: 9.5,
    color: colors.textHint,
    marginTop: 3,
    marginLeft: 4,
  },
  horaMensagemDireita: {
    textAlign: 'right',
    marginRight: 4,
    marginLeft: 0,
  },
  linkAulaCard: {
    backgroundColor: colors.accentBg,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  linkAulaIcone: {
    fontSize: 16,
  },
  linkAulaTextWrap: {
    flex: 1,
  },
  linkAulaTitulo: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.accent,
  },
  linkAulaAcao: {
    fontSize: 10,
    color: '#92453F',
    marginTop: 1,
  },
  inputBar: {
    backgroundColor: colors.cardBg,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.pageBg,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 12.5,
    color: colors.textPrimary,
    maxHeight: 100,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendIcon: {
    fontSize: 14,
    color: colors.white,
  },
  readOnlyBar: {
    backgroundColor: colors.cardBg,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  readOnlyIcon: {
    fontSize: 13,
  },
  readOnlyText: {
    fontSize: 11,
    color: colors.textHint,
  },
});
