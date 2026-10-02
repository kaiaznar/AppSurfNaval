import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import {
  DatePickerModal,
  TimePickerModal,
  AdicionarAlunosModal,
} from '../components/AulaModals';

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
  textHint: '#C7C5BC',
  accent: '#791F1F',
};

const DIAS_SEMANA = [
  { letra: 'D', valor: 0 },
  { letra: 'S', valor: 1 },
  { letra: 'T', valor: 2 },
  { letra: 'Q', valor: 3 },
  { letra: 'Q', valor: 4 },
  { letra: 'S', valor: 5 },
  { letra: 'S', valor: 6 },
];

const atletasDisponiveisExemplo = [
  { id: 'd1', nome: 'Beatriz Gouveia' },
  { id: 'd2', nome: 'Rui Vieira' },
  { id: 'd3', nome: 'Inês Mendonça' },
  { id: 'd4', nome: 'Pedro Caldeira' },
  { id: 'd5', nome: 'Ana Luísa Freitas' },
];

// -----------------------------------------------------------------------
// `horaPreSelecionada`: vem do bloco de hora tocado na DiaAgendaScreen.
// `diaSemanaPreSelecionado`: dia da semana do bloco tocado (0=dom..6=sáb),
// já vem marcado por defeito no seletor de recorrência.
// -----------------------------------------------------------------------
export default function CriarAulaScreen({
  dataPreSelecionada = new Date(2026, 5, 24),
  horaPreSelecionada = 15,
  diaSemanaPreSelecionado,
  modalidadePadrao = 'surf',
  atletasDisponiveis = atletasDisponiveisExemplo,
  onCancelar,
  onCriar,
}) {
  const [data, setData] = useState(dataPreSelecionada);
  const [hora, setHora] = useState(horaPreSelecionada);
  const [minuto, setMinuto] = useState(0);
  const [local, setLocal] = useState('');
  const [modalidade] = useState(modalidadePadrao);
  const [totalVagas, setTotalVagas] = useState('8');

  const [recorrenteAtivo, setRecorrenteAtivo] = useState(false);
  const [diasRecorrencia, setDiasRecorrencia] = useState(
    diaSemanaPreSelecionado !== undefined ? [diaSemanaPreSelecionado] : []
  );
  const [dataFimRecorrencia, setDataFimRecorrencia] = useState(null); // null = 6 meses

  const [alunos, setAlunos] = useState([]);

  const [modalAberto, setModalAberto] = useState(null); // 'data' | 'hora' | 'fimRecorrencia' | 'alunos' | null

  const formatarData = (d) =>
    `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

  const toggleDiaRecorrencia = (valor) => {
    setDiasRecorrencia((prev) =>
      prev.includes(valor) ? prev.filter((d) => d !== valor) : [...prev, valor]
    );
  };

  const handleRemoverAluno = (alunoId) => {
    setAlunos((prev) => prev.filter((a) => a.id !== alunoId));
  };

  const handleAdicionarAlunos = (novosAtletas) => {
    const novosRegistos = novosAtletas.map((a) => ({
      id: a.id,
      nome: a.nome,
      confirmado: false,
      pendenteReconfirmacao: false,
      extra: false,
    }));
    setAlunos((prev) => [...prev, ...novosRegistos]);
    setModalAberto(null);
  };

  const handleCriar = () => {
    if (!local.trim()) {
      Alert.alert('falta preencher', 'escolhe um local para a aula');
      return;
    }

    // ---- Modelo de recorrência ----
    // Não cria N aulas reais; cria UM modelo de recorrência que gera as
    // ocorrências dinamicamente até `dataFimRecorrencia` (ou +6 meses se
    // ficar em branco). Substituir por chamada real:
    // POST /aulas-recorrentes  { diasSemana, dataInicio, dataFim, ... }
    const dataFimEfetiva =
      dataFimRecorrencia ||
      (() => {
        const seisMesesDepois = new Date(data);
        seisMesesDepois.setMonth(seisMesesDepois.getMonth() + 6);
        return seisMesesDepois;
      })();

    const novaAula = {
      data,
      hora,
      minuto,
      local,
      modalidade,
      totalVagas: parseInt(totalVagas, 10) || 0,
      alunos,
      recorrencia: recorrenteAtivo
        ? {
            diasSemana: diasRecorrencia,
            dataFim: dataFimEfetiva,
          }
        : null,
    };

    onCriar && onCriar(novaAula);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ---------- Cabeçalho ---------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancelar} accessibilityLabel="fechar" accessibilityRole="button">
          <Text style={styles.headerIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>criar aula</Text>
        <TouchableOpacity onPress={handleCriar} accessibilityRole="button">
          <Text style={styles.saveLink}>guardar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ---------- Detalhes da aula ---------- */}
        <Text style={styles.sectionLabel}>detalhes da aula</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.detailRow} onPress={() => setModalAberto('data')}>
            <Text style={styles.detailIcon}>📅</Text>
            <View style={styles.detailTextWrap}>
              <Text style={styles.detailLabel}>data</Text>
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
              <Text style={styles.detailLabel}>hora</Text>
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
              <Text style={styles.detailLabel}>local</Text>
              <TextInput
                style={styles.detailInput}
                placeholder="escolher local..."
                placeholderTextColor={colors.textHint}
                value={local}
                onChangeText={setLocal}
              />
            </View>
          </View>

          <View style={[styles.detailRow, styles.rowDivider]}>
            <Text style={styles.detailIcon}>🏄</Text>
            <View style={styles.detailTextWrap}>
              <Text style={styles.detailLabel}>modalidade</Text>
              <Text style={styles.detailValue}>{modalidade}</Text>
            </View>
          </View>

          <View style={[styles.detailRow, styles.rowDivider]}>
            <Text style={styles.detailIcon}>👥</Text>
            <View style={styles.detailTextWrap}>
              <Text style={styles.detailLabel}>total de vagas</Text>
              <TextInput
                style={styles.detailInput}
                value={totalVagas}
                onChangeText={setTotalVagas}
                keyboardType="number-pad"
              />
            </View>
          </View>
        </View>

        {/* ---------- Atividade recorrente ---------- */}
        <View style={styles.recurrenceCard}>
          <View style={styles.recurrenceHeaderRow}>
            <View style={styles.recurrenceTitleRow}>
              <Text style={styles.recurrenceIcon}>🔁</Text>
              <Text style={styles.recurrenceTitle}>atividade recorrente</Text>
            </View>
            <Switch
              value={recorrenteAtivo}
              onValueChange={setRecorrenteAtivo}
              trackColor={{ false: colors.border, true: colors.navy }}
              thumbColor={colors.white}
            />
          </View>
          <Text style={styles.recurrenceSubtitle}>
            a aula repete-se automaticamente nos dias escolhidos
          </Text>

          {recorrenteAtivo && (
            <>
              <Text style={styles.recurrenceFieldLabel}>repetir em</Text>
              <View style={styles.weekdayRow}>
                {DIAS_SEMANA.map(({ letra, valor }) => {
                  const selecionado = diasRecorrencia.includes(valor);
                  return (
                    <TouchableOpacity
                      key={valor}
                      style={[styles.weekdayCircle, selecionado && styles.weekdayCircleSelected]}
                      onPress={() => toggleDiaRecorrencia(valor)}
                    >
                      <Text
                        style={[
                          styles.weekdayLetter,
                          selecionado && styles.weekdayLetterSelected,
                        ]}
                      >
                        {letra}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.recurrenceFieldLabel}>termina em</Text>
              <TouchableOpacity
                style={styles.endDateButton}
                onPress={() => setModalAberto('fimRecorrencia')}
              >
                <Text style={styles.endDateIcon}>📆</Text>
                <Text style={styles.endDateText}>
                  {dataFimRecorrencia
                    ? formatarData(dataFimRecorrencia)
                    : 'deixar em branco = 6 meses'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* ---------- Alunos ---------- */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>alunos ({alunos.length})</Text>
          <TouchableOpacity onPress={() => setModalAberto('alunos')}>
            <Text style={styles.addLink}>+ alunos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          {alunos.map((a, index) => (
            <View key={a.id} style={[styles.athleteRow, index > 0 && styles.rowDivider]}>
              <View style={styles.athleteLeft}>
                <View style={styles.athleteAvatar}>
                  <Text style={styles.athleteAvatarIcon}>⚓</Text>
                </View>
                <Text style={styles.athleteName}>{a.nome}</Text>
              </View>
              <TouchableOpacity onPress={() => handleRemoverAluno(a.id)} accessibilityLabel="remover aluno">
                <Text style={styles.removeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          {alunos.length === 0 && (
            <Text style={styles.emptyText}>nenhum aluno adicionado ainda</Text>
          )}
        </View>
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

      <DatePickerModal
        visible={modalAberto === 'fimRecorrencia'}
        dataAtual={dataFimRecorrencia || data}
        onClose={() => setModalAberto(null)}
        onConfirmar={(novaData) => {
          setDataFimRecorrencia(novaData);
          setModalAberto(null);
        }}
      />

      <AdicionarAlunosModal
        visible={modalAberto === 'alunos'}
        titulo="adicionar à lista"
        modalidade={modalidade}
        atletasDisponiveis={atletasDisponiveis.filter(
          (a) => !alunos.some((al) => al.id === a.id)
        )}
        onClose={() => setModalAberto(null)}
        onAdicionar={handleAdicionarAlunos}
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
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  addLink: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 4,
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
  detailLabel: {
    fontSize: 10.5,
    color: colors.textSecondary,
    marginBottom: 2,
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
  detailInput: {
    fontSize: 13.5,
    color: colors.textPrimary,
    padding: 0,
  },
  chevron: {
    fontSize: 16,
    color: colors.textHint,
  },
  rowDivider: {
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },

  recurrenceCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 4,
  },
  recurrenceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recurrenceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recurrenceIcon: {
    fontSize: 16,
  },
  recurrenceTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  recurrenceSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 12,
  },
  recurrenceFieldLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 8,
  },
  weekdayRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  weekdayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.pageBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdayCircleSelected: {
    backgroundColor: colors.navy,
  },
  weekdayLetter: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  weekdayLetterSelected: {
    color: colors.white,
    fontWeight: '700',
  },
  endDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: colors.pageBg,
  },
  endDateIcon: {
    fontSize: 14,
  },
  endDateText: {
    fontSize: 12.5,
    color: colors.textHint,
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
    color: colors.gold,
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
