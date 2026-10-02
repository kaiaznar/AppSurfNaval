import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';

// -----------------------------------------------------------------------
// Cores do Clube Naval do Funchal
// -----------------------------------------------------------------------
const colors = {
  navy: '#0A1F3D',
  gold: '#C9A24B',
  white: '#FFFFFF',
  pageBg: '#F6F5F1',
  border: '#E4E2DA',
  textPrimary: '#1A1A18',
  textSecondary: '#6B6A66',
  textHint: '#B4B2A9',
  accent: '#791F1F',
  overlay: 'rgba(0,0,0,0.35)',
};

// =========================================================================
// Bottom sheet genérico — base usada pelos modais de data e hora
// =========================================================================
function BottomSheet({ visible, onClose, children }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.sheet} onPress={() => {}}>
          <View style={styles.sheetHandle} />
          {children}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// =========================================================================
// Modal: alterar data (calendário simples de um mês)
// =========================================================================
export function DatePickerModal({ visible, dataAtual, onClose, onConfirmar }) {
  const [diaSelecionado, setDiaSelecionado] = useState(
    dataAtual ? dataAtual.getDate() : new Date().getDate()
  );

  // Gera os dias do mês corrente para o exemplo (substituir por lógica de
  // calendário completa / biblioteca como react-native-calendars em produção).
  const hoje = dataAtual || new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();
  const nomesMes = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
  ];
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const dias = Array.from({ length: diasNoMes }, (_, i) => i + 1);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={styles.sheetTitle}>alterar data</Text>

      <View style={styles.calendarHeader}>
        <Text style={styles.calendarNav}>‹</Text>
        <Text style={styles.calendarMonth}>{nomesMes[mes]} {ano}</Text>
        <Text style={styles.calendarNav}>›</Text>
      </View>

      <View style={styles.calendarWeekRow}>
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
          <Text key={i} style={styles.calendarWeekLabel}>{d}</Text>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {dias.map((dia) => (
          <TouchableOpacity
            key={dia}
            style={[
              styles.calendarDay,
              dia === diaSelecionado && styles.calendarDaySelected,
            ]}
            onPress={() => setDiaSelecionado(dia)}
          >
            <Text
              style={[
                styles.calendarDayText,
                dia === diaSelecionado && styles.calendarDayTextSelected,
              ]}
            >
              {dia}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => onConfirmar && onConfirmar(new Date(ano, mes, diaSelecionado))}
      >
        <Text style={styles.confirmButtonText}>confirmar data</Text>
      </TouchableOpacity>
    </BottomSheet>
  );
}

// =========================================================================
// Modal: alterar hora (seletor tipo roda simplificado)
// =========================================================================
export function TimePickerModal({ visible, horaAtual = 17, minutoAtual = 0, onClose, onConfirmar }) {
  const [hora, setHora] = useState(horaAtual);
  const [minuto, setMinuto] = useState(minutoAtual);

  const ajustarHora = (delta) => setHora((h) => (h + delta + 24) % 24);
  const ajustarMinuto = (delta) => setMinuto((m) => (m + delta + 60) % 60);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={styles.sheetTitle}>alterar hora</Text>

      <View style={styles.timeRow}>
        <View style={styles.timeColumn}>
          <TouchableOpacity onPress={() => ajustarHora(1)}>
            <Text style={styles.timeChevron}>⌃</Text>
          </TouchableOpacity>
          <Text style={styles.timeValueMain}>{String(hora).padStart(2, '0')}</Text>
          <TouchableOpacity onPress={() => ajustarHora(-1)}>
            <Text style={styles.timeChevron}>⌄</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.timeSeparator}>:</Text>

        <View style={styles.timeColumn}>
          <TouchableOpacity onPress={() => ajustarMinuto(15)}>
            <Text style={styles.timeChevron}>⌃</Text>
          </TouchableOpacity>
          <Text style={styles.timeValueMain}>{String(minuto).padStart(2, '0')}</Text>
          <TouchableOpacity onPress={() => ajustarMinuto(-15)}>
            <Text style={styles.timeChevron}>⌄</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => onConfirmar && onConfirmar({ hora, minuto })}
      >
        <Text style={styles.confirmButtonText}>confirmar hora</Text>
      </TouchableOpacity>
    </BottomSheet>
  );
}

// =========================================================================
// Modal: adicionar alunos (lista de pesquisa, usado por "+ alunos" e "+ extra")
// -----------------------------------------------------------------------
// `atletasDisponiveis`: array de atletas do clube/modalidade que ainda não
// estão na aula. Substituir por chamada real:
// GET /atletas?modalidade=surf&excluirIds=...
// =========================================================================
export function AdicionarAlunosModal({
  visible,
  titulo = 'adicionar à lista',
  modalidade = 'surf',
  atletasDisponiveis = [],
  onClose,
  onAdicionar,
}) {
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [selecionados, setSelecionados] = useState([]);

  const toggleSelecionado = (id) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const atletasFiltrados = atletasDisponiveis.filter((a) =>
    a.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  const handleAdicionar = () => {
    const escolhidos = atletasDisponiveis.filter((a) => selecionados.includes(a.id));
    onAdicionar && onAdicionar(escolhidos);
    setSelecionados([]);
    setTermoPesquisa('');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.centeredOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} accessibilityLabel="fechar">
              <Text style={styles.modalCloseIcon}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{titulo}</Text>
            <TouchableOpacity onPress={handleAdicionar} disabled={selecionados.length === 0}>
              <Text
                style={[
                  styles.modalConfirmText,
                  selecionados.length === 0 && styles.modalConfirmTextDisabled,
                ]}
              >
                adicionar ({selecionados.length})
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder={`pesquisar atleta da modalidade ${modalidade}...`}
              placeholderTextColor={colors.textSecondary}
              value={termoPesquisa}
              onChangeText={setTermoPesquisa}
            />
          </View>

          <ScrollView style={styles.athleteList}>
            {atletasFiltrados.map((atleta) => {
              const isSelecionado = selecionados.includes(atleta.id);
              return (
                <TouchableOpacity
                  key={atleta.id}
                  style={styles.athleteRow}
                  onPress={() => toggleSelecionado(atleta.id)}
                >
                  <View style={styles.athleteLeft}>
                    <View style={styles.athleteAvatar}>
                      <Text style={styles.athleteAvatarIcon}>⚓</Text>
                    </View>
                    <Text style={styles.athleteName}>{atleta.nome}</Text>
                  </View>
                  <View
                    style={[
                      styles.checkCircle,
                      isSelecionado && styles.checkCircleSelected,
                    ]}
                  >
                    {isSelecionado && <Text style={styles.checkCircleIcon}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}

            {atletasFiltrados.length === 0 && (
              <Text style={styles.emptyText}>nenhum atleta encontrado</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// -----------------------------------------------------------------------
// Estilos
// -----------------------------------------------------------------------
const styles = StyleSheet.create({
  // Bottom sheet (data/hora)
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 18,
    paddingBottom: 28,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 14,
  },

  // Calendário
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  calendarNav: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  calendarMonth: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  calendarWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  calendarWeekLabel: {
    fontSize: 10,
    color: colors.textHint,
    width: 32,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  calendarDay: {
    width: '14.28%',
    paddingVertical: 6,
    alignItems: 'center',
  },
  calendarDaySelected: {
    backgroundColor: colors.navy,
    borderRadius: 100,
  },
  calendarDayText: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  calendarDayTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },

  // Seletor de hora
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  timeColumn: {
    alignItems: 'center',
    gap: 6,
  },
  timeChevron: {
    fontSize: 18,
    color: colors.textHint,
  },
  timeValueMain: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.navy,
  },
  timeSeparator: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  confirmButton: {
    backgroundColor: colors.navy,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // Modal de adicionar alunos
  centeredOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    maxHeight: '80%',
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  modalCloseIcon: {
    fontSize: 18,
    color: colors.navy,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  modalConfirmText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
  },
  modalConfirmTextDisabled: {
    color: colors.textHint,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.pageBg,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    margin: 16,
    marginBottom: 8,
  },
  searchIcon: {
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  athleteList: {
    paddingHorizontal: 16,
  },
  athleteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
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
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkCircleIcon: {
    fontSize: 11,
    color: colors.white,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 12,
    color: colors.textHint,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
