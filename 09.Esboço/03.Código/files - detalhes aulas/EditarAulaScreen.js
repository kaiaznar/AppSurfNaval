import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
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
  textHint: '#B4B2A9',
  accent: '#791F1F',
  warningBg: '#FCEBEB',
  warningText: '#791F1F',
};

// -----------------------------------------------------------------------
// Atletas disponíveis para adicionar (do clube/modalidade, ainda não na
// aula). Substituir por chamada real à API:
// GET /atletas?modalidade=surf&excluirIds=...
// -----------------------------------------------------------------------
const atletasDisponiveisExemplo = [
  { id: 'd1', nome: 'Beatriz Gouveia' },
  { id: 'd2', nome: 'Rui Vieira' },
  { id: 'd3', nome: 'Inês Mendonça' },
  { id: 'd4', nome: 'Pedro Caldeira' },
  { id: 'd5', nome: 'Ana Luísa Freitas' },
];

export default function EditarAulaScreen({
  aula,
  onCancelar,
  onGuardar,
  atletasDisponiveis = atletasDisponiveisExemplo,
}) {
  const [data, setData] = useState(new Date(aula?.dataISO || '2026-06-24'));
  const [hora, setHora] = useState(17);
  const [minuto, setMinuto] = useState(0);
  const [local, setLocal] = useState(aula?.local || 'praia formosa, funchal');

  const [alunos, setAlunos] = useState(aula?.alunos || []);
  const [alunosExtra, setAlunosExtra] = useState(aula?.alunosExtra || []);

  const [modalAberto, setModalAberto] = useState(null); // 'data' | 'hora' | 'alunos' | 'extra' | null

  const formatarData = (d) =>
    `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

  const handleConfirmarData = (novaData) => {
    setData(novaData);
    setModalAberto(null);
    avisarReconfirmacaoNecessaria();
  };

  const handleConfirmarHora = ({ hora: h, minuto: m }) => {
    setHora(h);
    setMinuto(m);
    setModalAberto(null);
    avisarReconfirmacaoNecessaria();
  };

  // Quando data ou hora mudam, todos os alunos já confirmados precisam
  // reconfirmar — refletido aqui como `pendenteReconfirmacao: true`.
  const avisarReconfirmacaoNecessaria = () => {
    setAlunos((prev) =>
      prev.map((a) => (a.confirmado ? { ...a, confirmado: false, pendenteReconfirmacao: true } : a))
    );
    setAlunosExtra((prev) =>
      prev.map((a) => (a.confirmado ? { ...a, confirmado: false, pendenteReconfirmacao: true } : a))
    );
    // Substituir por chamada real: POST /aulas/:id/notificar-mudanca-data-hora
  };

  const handleAlterarLocal = (novoLocal) => {
    setLocal(novoLocal);
    // Ao alterar o local, é enviada notificação a todos os alunos da lista.
    // Substituir por chamada real: POST /aulas/:id/notificar-mudanca-local
  };

  const handleRemoverAluno = (alunoId, isExtra) => {
    if (isExtra) {
      setAlunosExtra((prev) => prev.filter((a) => a.id !== alunoId));
    } else {
      setAlunos((prev) => prev.filter((a) => a.id !== alunoId));
    }
    // Remover um aluno envia-lhe notificação. Substituir por chamada real:
    // POST /alunos/:alunoId/notificar-removido-da-aula
  };

  const handleAdicionarAlunos = (novosAtletas, isExtra) => {
    const novosRegistos = novosAtletas.map((a) => ({
      id: a.id,
      nome: a.nome,
      confirmado: false,
      pendenteReconfirmacao: false,
      extra: isExtra,
    }));

    if (isExtra) {
      setAlunosExtra((prev) => [...prev, ...novosRegistos]);
    } else {
      setAlunos((prev) => [...prev, ...novosRegistos]);
    }
    setModalAberto(null);
    // Adicionar um aluno envia-lhe notificação para confirmar presença.
    // Substituir por chamada real: POST /alunos/notificar-convite-aula
  };

  const handleGuardar = () => {
    const aulaAtualizada = {
      ...aula,
      data,
      hora,
      minuto,
      local,
      alunos,
      alunosExtra,
    };
    onGuardar && onGuardar(aulaAtualizada);
  };

  // IDs já presentes na aula (principal + extra), para excluir da lista de pesquisa.
  const idsJaNaAula = new Set([...alunos, ...alunosExtra].map((a) => a.id));
  const atletasParaPesquisa = atletasDisponiveis.filter((a) => !idsJaNaAula.has(a.id));

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ---------- Cabeçalho ---------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancelar} accessibilityLabel="fechar edição" accessibilityRole="button">
          <Text style={styles.headerIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>editar aula</Text>
        <TouchableOpacity onPress={handleGuardar} accessibilityRole="button">
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
                {String(hora).padStart(2, '0')}h{String(minuto).padStart(2, '0')}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.detailRow, styles.rowDivider]}
            onPress={() =>
              Alert.prompt
                ? Alert.prompt('alterar local', 'novo local da aula', (texto) => handleAlterarLocal(texto))
                : handleAlterarLocal(local) // fallback simples em Android, onde Alert.prompt não existe
            }
          >
            <Text style={styles.detailIcon}>📍</Text>
            <View style={styles.detailTextWrap}>
              <Text style={styles.detailLabel}>local</Text>
              <Text style={styles.detailValue}>{local}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            alterar data ou hora obriga todos os alunos já confirmados a confirmar de novo.
            alterar o local envia notificação a todos.
          </Text>
        </View>

        {/* ---------- Lista de alunos ---------- */}
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
              <TouchableOpacity onPress={() => handleRemoverAluno(a.id, false)} accessibilityLabel="remover aluno">
                <Text style={styles.removeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          {alunos.length === 0 && <Text style={styles.emptyText}>nenhum aluno na lista</Text>}
        </View>

        {/* ---------- Alunos extra ---------- */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>alunos extra ({alunosExtra.length})</Text>
          <TouchableOpacity onPress={() => setModalAberto('extra')}>
            <Text style={styles.addLink}>+ extra</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          {alunosExtra.map((a, index) => (
            <View key={a.id} style={[styles.athleteRow, index > 0 && styles.rowDivider]}>
              <View style={styles.athleteLeft}>
                <View style={styles.athleteAvatar}>
                  <Text style={styles.athleteAvatarIcon}>⚓</Text>
                </View>
                <Text style={styles.athleteName}>{a.nome}</Text>
              </View>
              <TouchableOpacity onPress={() => handleRemoverAluno(a.id, true)} accessibilityLabel="remover aluno extra">
                <Text style={styles.removeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          {alunosExtra.length === 0 && <Text style={styles.emptyText}>nenhum aluno extra</Text>}
        </View>

        <Text style={styles.footerNote}>
          remover ou adicionar um aluno envia-lhe uma notificação para confirmar presença
        </Text>
      </ScrollView>

      {/* ---------- Modais ---------- */}
      <DatePickerModal
        visible={modalAberto === 'data'}
        dataAtual={data}
        onClose={() => setModalAberto(null)}
        onConfirmar={handleConfirmarData}
      />

      <TimePickerModal
        visible={modalAberto === 'hora'}
        horaAtual={hora}
        minutoAtual={minuto}
        onClose={() => setModalAberto(null)}
        onConfirmar={handleConfirmarHora}
      />

      <AdicionarAlunosModal
        visible={modalAberto === 'alunos'}
        titulo="adicionar à lista"
        atletasDisponiveis={atletasParaPesquisa}
        onClose={() => setModalAberto(null)}
        onAdicionar={(escolhidos) => handleAdicionarAlunos(escolhidos, false)}
      />

      <AdicionarAlunosModal
        visible={modalAberto === 'extra'}
        titulo="adicionar como extra"
        atletasDisponiveis={atletasParaPesquisa}
        onClose={() => setModalAberto(null)}
        onAdicionar={(escolhidos) => handleAdicionarAlunos(escolhidos, true)}
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
  chevron: {
    fontSize: 16,
    color: colors.textHint,
  },
  rowDivider: {
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.warningBg,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    marginBottom: 4,
  },
  warningIcon: {
    fontSize: 14,
  },
  warningText: {
    flex: 1,
    fontSize: 11,
    color: colors.warningText,
    lineHeight: 16,
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
  footerNote: {
    fontSize: 10.5,
    color: colors.textHint,
    textAlign: 'center',
    marginTop: 14,
  },
});
