import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { DatePickerModal, TimePickerModal, AdicionarAlunosModal } from '../components/AulaModals';

// -----------------------------------------------------------------------
// Cores do Clube Naval do Funchal
// -----------------------------------------------------------------------
const colors = {
  navy: '#0A1F3D',
  white: '#FFFFFF',
  pageBg: '#F6F5F1',
  cardBg: '#FFFFFF',
  border: '#E4E2DA',
  textPrimary: '#1A1A18',
  textSecondary: '#6B6A66',
  textHint: '#C7C5BC',
  accent: '#791F1F',
};

const atletasDoClubeExemplo = [
  { id: 'd1', nome: 'Beatriz Gouveia' },
  { id: 'd2', nome: 'Rui Vieira' },
  { id: 'd3', nome: 'Inês Mendonça' },
  { id: 'd4', nome: 'Pedro Caldeira' },
  { id: 'd5', nome: 'Ana Luísa Freitas' },
  { id: 'd6', nome: 'Maria Sousa' },
];

export default function CriarEventoScreen({
  dataPreSelecionada = new Date(2026, 5, 24),
  horaPreSelecionada = 15,
  modalidadePadrao = 'surf',
  atletasDoClube = atletasDoClubeExemplo,
  onCancelar,
  onCriar,
}) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState(dataPreSelecionada);
  const [hora, setHora] = useState(horaPreSelecionada);
  const [minuto, setMinuto] = useState(0);
  const [local, setLocal] = useState('');

  // 'modalidade' | 'lista'
  const [tipoDestinatario, setTipoDestinatario] = useState('modalidade');
  const [participantesEscolhidos, setParticipantesEscolhidos] = useState([]);

  const [modalAberto, setModalAberto] = useState(null); // 'data' | 'hora' | 'participantes' | null

  const formatarData = (d) =>
    `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

  const handleAdicionarParticipantes = (escolhidos) => {
    setParticipantesEscolhidos((prev) => {
      const idsExistentes = new Set(prev.map((p) => p.id));
      const novos = escolhidos.filter((p) => !idsExistentes.has(p.id));
      return [...prev, ...novos];
    });
    setModalAberto(null);
  };

  const handleCriar = () => {
    if (!titulo.trim()) {
      Alert.alert('falta preencher', 'dá um título ao evento');
      return;
    }
    if (tipoDestinatario === 'lista' && participantesEscolhidos.length === 0) {
      Alert.alert('falta preencher', 'escolhe pelo menos um participante para notificar');
      return;
    }

    // O evento aparece no feed para todos, independentemente do
    // destinatário escolhido — a notificação é que respeita o grupo.
    // Substituir por chamada real: POST /eventos
    const novoEvento = {
      titulo,
      descricao,
      data,
      hora,
      minuto,
      local,
      notificar:
        tipoDestinatario === 'modalidade'
          ? { tipo: 'modalidade', modalidade: modalidadePadrao }
          : { tipo: 'lista', participantes: participantesEscolhidos },
    };

    onCriar && onCriar(novoEvento);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ---------- Cabeçalho ---------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancelar} accessibilityLabel="fechar" accessibilityRole="button">
          <Text style={styles.headerIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>criar evento</Text>
        <TouchableOpacity onPress={handleCriar} accessibilityRole="button">
          <Text style={styles.saveLink}>guardar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ---------- Detalhes do evento ---------- */}
        <Text style={styles.sectionLabel}>detalhes do evento</Text>
        <View style={styles.card}>
          <View style={styles.textFieldRow}>
            <Text style={styles.fieldLabel}>título do evento</Text>
            <TextInput
              style={styles.textInput}
              placeholder="ex: campeonato regional de surf"
              placeholderTextColor={colors.textHint}
              value={titulo}
              onChangeText={setTitulo}
            />
          </View>

          <View style={[styles.textFieldRow, styles.rowDivider]}>
            <Text style={styles.fieldLabel}>descrição</Text>
            <TextInput
              style={styles.textInput}
              placeholder="detalhes do evento..."
              placeholderTextColor={colors.textHint}
              value={descricao}
              onChangeText={setDescricao}
              multiline
            />
          </View>

          <TouchableOpacity
            style={[styles.detailRow, styles.rowDivider]}
            onPress={() => setModalAberto('data')}
          >
            <Text style={styles.detailIcon}>📅</Text>
            <View style={styles.detailTextWrap}>
              <Text style={styles.fieldLabel}>data</Text>
              <Text style={styles.detailValue}>{formatarData(data)}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.detailRow, styles.rowDivider]}
            onPress={() => setModalAberto('hora')}
          >
            <Text style={styles.detailIcon}>🕐</Text>
            <View style={styles.detailTextWrap}>
              <Text style={styles.fieldLabel}>hora</Text>
              <Text style={styles.detailValue}>
                {String(hora).padStart(2, '0')}h{String(minuto).padStart(2, '0')}{' '}
                <Text style={styles.detailValueHint}>(pré-preenchida)</Text>
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={[styles.detailRow, styles.rowDivider]}>
            <Text style={styles.detailIcon}>📍</Text>
            <View style={styles.detailTextWrap}>
              <Text style={styles.fieldLabel}>local</Text>
              <TextInput
                style={styles.textInput}
                placeholder="escolher local..."
                placeholderTextColor={colors.textHint}
                value={local}
                onChangeText={setLocal}
              />
            </View>
          </View>
        </View>

        {/* ---------- Quem é notificado ---------- */}
        <Text style={styles.sectionLabel}>quem é notificado</Text>
        <View style={styles.toggleCard}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              tipoDestinatario === 'modalidade' && styles.toggleButtonAtivo,
            ]}
            onPress={() => setTipoDestinatario('modalidade')}
          >
            <Text
              style={[
                styles.toggleButtonText,
                tipoDestinatario === 'modalidade' && styles.toggleButtonTextAtivo,
              ]}
            >
              toda a modalidade
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              tipoDestinatario === 'lista' && styles.toggleButtonAtivo,
            ]}
            onPress={() => setTipoDestinatario('lista')}
          >
            <Text
              style={[
                styles.toggleButtonText,
                tipoDestinatario === 'lista' && styles.toggleButtonTextAtivo,
              ]}
            >
              lista de pessoas
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.toggleHint}>
          o evento aparece para todos no feed; a notificação é enviada apenas ao grupo escolhido
        </Text>

        {tipoDestinatario === 'modalidade' ? (
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxText}>
              selecionado: {modalidadePadrao} (todos os atletas)
            </Text>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.addParticipantsButton}
              onPress={() => setModalAberto('participantes')}
            >
              <Text style={styles.addParticipantsText}>+ escolher participantes</Text>
            </TouchableOpacity>

            <View style={styles.card}>
              {participantesEscolhidos.map((p, index) => (
                <View key={p.id} style={[styles.athleteRow, index > 0 && styles.rowDivider]}>
                  <View style={styles.athleteLeft}>
                    <View style={styles.athleteAvatar}>
                      <Text style={styles.athleteAvatarIcon}>⚓</Text>
                    </View>
                    <Text style={styles.athleteName}>{p.nome}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      setParticipantesEscolhidos((prev) => prev.filter((x) => x.id !== p.id))
                    }
                  >
                    <Text style={styles.removeIcon}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {participantesEscolhidos.length === 0 && (
                <Text style={styles.emptyText}>nenhum participante escolhido ainda</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* ---------- Modais ---------- */}
      <DatePickerModal
        visible={modalAberto === 'data'}
        dataAtual={data}
        onClose={() => setModalAberto(null)}
        onConfirmar={(novaData) => {
          setData(novaData);
          setModalAberto(null);
        }}
      />

      <TimePickerModal
        visible={modalAberto === 'hora'}
        horaAtual={hora}
        minutoAtual={minuto}
        onClose={() => setModalAberto(null)}
        onConfirmar={({ hora: h, minuto: m }) => {
          setHora(h);
          setMinuto(m);
          setModalAberto(null);
        }}
      />

      <AdicionarAlunosModal
        visible={modalAberto === 'participantes'}
        titulo="escolher participantes"
        atletasDisponiveis={atletasDoClube.filter(
          (a) => !participantesEscolhidos.some((p) => p.id === a.id)
        )}
        onClose={() => setModalAberto(null)}
        onAdicionar={handleAdicionarParticipantes}
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
  saveLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 8,
    paddingLeft: 2,
    letterSpacing: 0.3,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 4,
  },
  textFieldRow: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  fieldLabel: {
    fontSize: 10.5,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  textInput: {
    fontSize: 13.5,
    color: colors.textPrimary,
    padding: 0,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  detailIcon: {
    fontSize: 16,
  },
  detailTextWrap: {
    flex: 1,
  },
  detailValue: {
    fontSize: 13.5,
    color: colors.textPrimary,
  },
  detailValueHint: {
    fontSize: 11,
    color: colors.textHint,
    fontWeight: '400',
  },
  chevron: {
    fontSize: 16,
    color: colors.textHint,
  },
  rowDivider: {
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },

  toggleCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: 6,
    gap: 6,
    marginBottom: 8,
  },
  toggleButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  toggleButtonAtivo: {
    backgroundColor: colors.navy,
  },
  toggleButtonText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  toggleButtonTextAtivo: {
    color: colors.white,
    fontWeight: '600',
  },
  toggleHint: {
    fontSize: 10.5,
    color: '#888780',
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  infoBox: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: 16,
    alignItems: 'center',
    marginBottom: 4,
  },
  infoBoxText: {
    fontSize: 12,
    color: colors.textHint,
  },
  addParticipantsButton: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.accent,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    marginBottom: 8,
  },
  addParticipantsText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
  },
  athleteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  athleteLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  athleteAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  athleteAvatarIcon: {
    fontSize: 14,
    color: '#C9A24B',
  },
  athleteName: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  removeIcon: {
    fontSize: 17,
    color: colors.textHint,
  },
  emptyText: {
    fontSize: 12,
    color: colors.textHint,
    textAlign: 'center',
    paddingVertical: 16,
  },
});
