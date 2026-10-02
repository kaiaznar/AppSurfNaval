import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { ModalidadeIcon } from '../components/icons/ModalidadeIcons';

// -----------------------------------------------------------------------
// Cores do Clube Naval do Funchal
// -----------------------------------------------------------------------
const colors = {
  navy: '#0A1F3D',
  navyLight: '#12305A',
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
  confirmarBg: '#FCEBEB',
  confirmadoBg: '#EAF3DE',
  confirmadoText: '#27500A',
  pendenteBg: '#FFF8E8',
  pendenteText: '#92660E',
  disabledBg: '#EAEAE6',
  disabledText: '#B4B2A9',
  blue: '#185FA5',
};

// -----------------------------------------------------------------------
// Dados de exemplo. Substituir por chamada real à API:
// GET /aulas/:id
// -----------------------------------------------------------------------
const aulaExemplo = {
  id: 'aula-1',
  modalidade: 'surf',
  diaSemana: 'quarta-feira',
  dataCurta: '24/06',
  hora: '17h00',
  local: 'praia formosa, funchal',
  totalVagas: 8,
  vagasExtra: 2,
  alunos: [
    { id: 'a1', nome: 'Maria Sousa', confirmado: true, pendenteReconfirmacao: false, extra: false },
    { id: 'a2', nome: 'Tiago Freitas', confirmado: false, pendenteReconfirmacao: false, extra: false },
    { id: 'a3', nome: 'Sofia Câmara', confirmado: false, pendenteReconfirmacao: true, extra: false },
    { id: 'a4', nome: 'Hugo Pestana', confirmado: true, pendenteReconfirmacao: false, extra: false },
    { id: 'a5', nome: 'Beatriz Andrade', confirmado: true, pendenteReconfirmacao: false, extra: false },
    { id: 'a6', nome: 'Rita Nóbrega', confirmado: true, pendenteReconfirmacao: false, extra: false },
  ],
  alunosExtra: [
    { id: 'e1', nome: 'Diogo Abreu', confirmado: true, pendenteReconfirmacao: false, extra: true },
  ],
};

// Verifica se já passaram as 17h00 do dia anterior à aula.
// Substituir `agora` pela hora real do sistema em produção.
function podeSolicitarVagaExtra(dataAulaISO, vagasExtraDisponiveis) {
  if (vagasExtraDisponiveis <= 0) return false;
  const agora = new Date();
  const dataAula = new Date(dataAulaISO);
  const limite = new Date(dataAula);
  limite.setDate(limite.getDate() - 1);
  limite.setHours(17, 0, 0, 0);
  return agora >= limite;
}

export default function DetalheAulaScreen({
  aula = aulaExemplo,
  papel = 'aluno', // 'aluno' | 'instrutor'
  onVoltar,
  onConfirmarPresenca,
  onSolicitarVagaExtra,
  onEditarAula,
  onConfirmarAluno,
  onRemoverAluno,
  onNotificarAluno,
  onConfirmarTodos,
  onRemoverTodos,
  onNotificarTodos,
}) {
  const [alunos, setAlunos] = useState(aula.alunos);
  const [alunosExtra, setAlunosExtra] = useState(aula.alunosExtra);
  const [presencaConfirmada, setPresencaConfirmada] = useState(false);

  const todosOsAlunos = [...alunos, ...alunosExtra];
  const totalConfirmados = todosOsAlunos.filter((a) => a.confirmado).length;
  const totalVagas = aula.totalVagas;
  const vagasOcupadasPrincipais = alunos.length;
  const vagasLivres = totalVagas - vagasOcupadasPrincipais;
  const percentualConfirmado = Math.round((totalConfirmados / totalVagas) * 100);

  const podeSolicitarExtra = podeSolicitarVagaExtra('2026-06-24', aula.vagasExtra);

  const handleConfirmarPresenca = () => {
    setPresencaConfirmada(true);
    onConfirmarPresenca && onConfirmarPresenca(aula.id);
  };

  // ---- Ações do instrutor sobre um único aluno ----
  const atualizarAluno = (lista, setLista, id, alteracoes) => {
    setLista((prev) => prev.map((a) => (a.id === id ? { ...a, ...alteracoes } : a)));
  };

  const handleConfirmarAluno = (alunoId, isExtra) => {
    if (isExtra) {
      atualizarAluno(alunosExtra, setAlunosExtra, alunoId, {
        confirmado: true,
        pendenteReconfirmacao: false,
      });
    } else {
      atualizarAluno(alunos, setAlunos, alunoId, {
        confirmado: true,
        pendenteReconfirmacao: false,
      });
    }
    onConfirmarAluno && onConfirmarAluno(alunoId);
  };

  const handleRemoverAluno = (alunoId, isExtra) => {
    if (isExtra) {
      setAlunosExtra((prev) => prev.filter((a) => a.id !== alunoId));
    } else {
      setAlunos((prev) => prev.filter((a) => a.id !== alunoId));
    }
    onRemoverAluno && onRemoverAluno(alunoId);
  };

  const handleNotificarAluno = (alunoId) => {
    onNotificarAluno && onNotificarAluno(alunoId);
  };

  // ---- Ações em lote (afetam alunos normais + extra) ----
  const handleConfirmarTodosLocal = () => {
    setAlunos((prev) => prev.map((a) => ({ ...a, confirmado: true, pendenteReconfirmacao: false })));
    setAlunosExtra((prev) => prev.map((a) => ({ ...a, confirmado: true, pendenteReconfirmacao: false })));
    onConfirmarTodos && onConfirmarTodos();
  };

  const handleRemoverTodosLocal = () => {
    setAlunos([]);
    setAlunosExtra([]);
    onRemoverTodos && onRemoverTodos();
  };

  const handleNotificarTodosLocal = () => {
    onNotificarTodos && onNotificarTodos();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ---------- Cabeçalho ---------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onVoltar} accessibilityLabel="voltar" accessibilityRole="button">
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>detalhe da aula</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* ---------- Faixa de modalidade / data / hora ---------- */}
      <View style={styles.heroBand}>
        <View style={styles.heroIconBox}>
          <ModalidadeIcon modalidade={aula.modalidade} size={28} color={colors.gold} />
        </View>
        <View>
          <Text style={styles.heroModalidade}>{aula.modalidade}</Text>
          <Text style={styles.heroDataHora}>
            {aula.diaSemana} - {aula.dataCurta} · {aula.hora}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ---------- Local + ação principal (confirmar ou editar) ---------- */}
        <View style={styles.card}>
          <View style={styles.localRow}>
            <Text style={styles.localIcon}>📍</Text>
            <Text style={styles.localTexto}>{aula.local}</Text>
          </View>

          {papel === 'aluno' ? (
            <TouchableOpacity
              style={[
                styles.actionButton,
                presencaConfirmada ? styles.actionButtonConfirmado : styles.actionButtonConfirmar,
              ]}
              onPress={handleConfirmarPresenca}
              disabled={presencaConfirmada}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  presencaConfirmada && { color: colors.confirmadoText },
                ]}
              >
                {presencaConfirmada ? 'presença confirmada' : 'confirmar presença'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => onEditarAula && onEditarAula(aula)}
            >
              <Text style={styles.editButtonText}>✎ editar aula</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ---------- Progresso de confirmação ---------- */}
        <View style={styles.card}>
          <View style={styles.progressHeaderRow}>
            <Text style={styles.progressLabel}>alunos confirmados</Text>
            <Text style={styles.progressCount}>
              {totalConfirmados} <Text style={styles.progressCountTotal}>de {totalVagas}</Text>
            </Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View
              style={[styles.progressBarFill, { width: `${Math.min(percentualConfirmado, 100)}%` }]}
            />
          </View>
          {papel === 'aluno' && (
            <Text style={styles.vagasExtraTexto}>
              +{aula.vagasExtra} vagas extra disponíveis
            </Text>
          )}
        </View>

        {/* ---------- Versão aluno: solicitar vaga extra ---------- */}
        {papel === 'aluno' && (
          <>
            <TouchableOpacity
              style={[
                styles.extraButton,
                !podeSolicitarExtra && styles.extraButtonDisabled,
              ]}
              disabled={!podeSolicitarExtra}
              onPress={() => onSolicitarVagaExtra && onSolicitarVagaExtra(aula.id)}
            >
              <Text
                style={[
                  styles.extraButtonText,
                  !podeSolicitarExtra && styles.extraButtonTextDisabled,
                ]}
              >
                {!podeSolicitarExtra && '🔒 '}solicitar vaga extra
              </Text>
            </TouchableOpacity>
            {!podeSolicitarExtra && (
              <Text style={styles.extraHint}>
                disponível a partir das 17h00 do dia anterior
              </Text>
            )}

            {/* ---------- Lista de alunos confirmados (vista do aluno) ---------- */}
            <Text style={styles.sectionLabel}>alunos confirmados</Text>
            <View style={styles.card}>
              {todosOsAlunos
                .filter((a) => a.confirmado)
                .map((a, index) => (
                  <View
                    key={a.id}
                    style={[styles.simpleAthleteRow, index > 0 && styles.rowDivider]}
                  >
                    <View style={styles.athleteAvatar}>
                      <Text style={styles.athleteAvatarIcon}>⚓</Text>
                    </View>
                    <Text style={styles.athleteName}>{a.nome}</Text>
                  </View>
                ))}
            </View>
          </>
        )}

        {/* ---------- Versão instrutor: gestão da lista ---------- */}
        {papel === 'instrutor' && (
          <>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>lista de alunos</Text>
              <View style={styles.bulkActions}>
                <TouchableOpacity onPress={handleConfirmarTodosLocal} accessibilityLabel="confirmar todos">
                  <Text style={styles.bulkIconCheck}>✓</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRemoverTodosLocal} accessibilityLabel="remover todos">
                  <Text style={styles.bulkIconRemove}>✕</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNotificarTodosLocal} accessibilityLabel="notificar todos">
                  <Text style={styles.bulkIconNotify}>🔔</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.card}>
              {alunos.map((a, index) => (
                <AlunoRowInstrutor
                  key={a.id}
                  aluno={a}
                  divider={index > 0}
                  onConfirmar={() => handleConfirmarAluno(a.id, false)}
                  onRemover={() => handleRemoverAluno(a.id, false)}
                  onNotificar={() => handleNotificarAluno(a.id)}
                />
              ))}
            </View>

            {alunosExtra.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>extra</Text>
                <View style={styles.card}>
                  {alunosExtra.map((a, index) => (
                    <AlunoRowInstrutor
                      key={a.id}
                      aluno={a}
                      divider={index > 0}
                      onConfirmar={() => handleConfirmarAluno(a.id, true)}
                      onRemover={() => handleRemoverAluno(a.id, true)}
                      onNotificar={() => handleNotificarAluno(a.id)}
                    />
                  ))}
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// -----------------------------------------------------------------------
// Linha de aluno na vista do instrutor, com as 3 ações (check, x, sino)
// -----------------------------------------------------------------------
function AlunoRowInstrutor({ aluno, divider, onConfirmar, onRemover, onNotificar }) {
  return (
    <View
      style={[
        styles.instructorAthleteRow,
        divider && styles.rowDivider,
        aluno.pendenteReconfirmacao && styles.instructorAthleteRowPendente,
      ]}
    >
      <View style={styles.athleteLeft}>
        <View style={styles.athleteAvatar}>
          <Text style={styles.athleteAvatarIcon}>⚓</Text>
        </View>
        <View>
          <Text style={styles.athleteName}>{aluno.nome}</Text>
          {aluno.pendenteReconfirmacao && (
            <Text style={styles.pendenteLabel}>pendente de reconfirmação</Text>
          )}
        </View>
      </View>

      <View style={styles.athleteActions}>
        <TouchableOpacity onPress={onConfirmar} disabled={aluno.confirmado} accessibilityLabel="confirmar presença">
          <Text style={[styles.actionIconCheck, aluno.confirmado && styles.actionIconCheckActive]}>✓</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onRemover} accessibilityLabel="remover aluno">
          <Text style={styles.actionIconRemove}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onNotificar} accessibilityLabel="notificar aluno">
          <Text style={styles.actionIconNotify}>🔔</Text>
        </TouchableOpacity>
      </View>
    </View>
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

  heroBand: {
    backgroundColor: colors.navy,
    paddingHorizontal: 18,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.navyLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroModalidade: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
    textTransform: 'lowercase',
  },
  heroDataHora: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 3,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 28,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 14,
  },
  localRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  localIcon: {
    fontSize: 16,
  },
  localTexto: {
    fontSize: 13.5,
    color: colors.textPrimary,
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
  },
  actionButtonConfirmar: {
    backgroundColor: colors.confirmarBg,
  },
  actionButtonConfirmado: {
    backgroundColor: colors.confirmadoBg,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
  },
  editButton: {
    backgroundColor: colors.navy,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },

  progressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  progressCount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
  },
  progressCountTotal: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.confirmadoText,
    borderRadius: 4,
  },
  vagasExtraTexto: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 8,
  },

  extraButton: {
    backgroundColor: colors.confirmarBg,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 4,
  },
  extraButtonDisabled: {
    backgroundColor: colors.disabledBg,
  },
  extraButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.accent,
  },
  extraButtonTextDisabled: {
    color: colors.disabledText,
  },
  extraHint: {
    fontSize: 10.5,
    color: colors.disabledText,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.4,
    marginTop: 14,
    marginBottom: 8,
    paddingLeft: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  bulkActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  bulkIconCheck: {
    fontSize: 17,
    color: colors.confirmadoText,
    fontWeight: '700',
  },
  bulkIconRemove: {
    fontSize: 17,
    color: colors.accent,
    fontWeight: '700',
  },
  bulkIconNotify: {
    fontSize: 15,
  },

  simpleAthleteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  instructorAthleteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 4,
  },
  instructorAthleteRowPendente: {
    backgroundColor: colors.pendenteBg,
  },
  rowDivider: {
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
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
  pendenteLabel: {
    fontSize: 10,
    color: colors.pendenteText,
    marginTop: 1,
  },
  athleteActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIconCheck: {
    fontSize: 17,
    color: colors.disabledText,
    fontWeight: '700',
  },
  actionIconCheckActive: {
    color: colors.confirmadoText,
  },
  actionIconRemove: {
    fontSize: 17,
    color: colors.accent,
    fontWeight: '700',
  },
  actionIconNotify: {
    fontSize: 15,
  },
});
