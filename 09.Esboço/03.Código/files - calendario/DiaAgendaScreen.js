import React from 'react';
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
  white: '#FFFFFF',
  pageBg: '#F6F5F1',
  cardBg: '#FFFFFF',
  border: '#E4E2DA',
  textPrimary: '#1A1A18',
  textSecondary: '#6B6A66',
  textHint: '#B4B2A9',
  accent: '#791F1F',
  aulaBg: '#FCEBEB',
  aulaBorder: '#791F1F',
  aulaConfirmadaBg: '#EAF3DE',
  aulaConfirmadaBorder: '#27500A',
  eventoBg: '#FFF8E8',
  eventoBorder: '#E8B339',
  eventoText: '#92660E',
};

const HORA_INICIO = 9;
const HORA_FIM = 20;
const DURACAO_PADRAO_HORAS = 4; // todos os eventos/aulas duram 4h, por regra atual

const NOMES_DIA_SEMANA = [
  'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira',
  'quinta-feira', 'sexta-feira', 'sábado',
];
const NOMES_MES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

// -----------------------------------------------------------------------
// Dados de exemplo para o dia selecionado. Substituir por chamada real:
// GET /agenda?data=AAAA-MM-DD
// -----------------------------------------------------------------------
const itensExemploDoDia = [
  {
    id: 'aula-1',
    tipo: 'aula',
    titulo: 'aula de surf',
    modalidade: 'surf',
    horaInicio: 17,
    confirmada: false,
    confirmados: 6,
    totalVagas: 8,
  },
];

function formatarHora(h) {
  return `${String(h).padStart(2, '0')}h00`;
}

export default function DiaAgendaScreen({
  data = new Date(2026, 5, 24),
  itens = itensExemploDoDia,
  papel = 'aluno', // 'aluno' | 'instrutor'
  onVoltar,
  onCriarAtividade, // abre escolha entre 'criar aula' / 'criar evento' — aqui simplificado para 'criarAula'
  onAbrirItem,
}) {
  const horas = [];
  for (let h = HORA_INICIO; h <= HORA_FIM; h++) horas.push(h);

  // Mapeia cada hora para o item que começa nela, se existir.
  const itemPorHoraInicio = {};
  itens.forEach((item) => {
    itemPorHoraInicio[item.horaInicio] = item;
  });

  const tituloData = `${NOMES_DIA_SEMANA[data.getDay()]}, ${data.getDate()} de ${NOMES_MES[data.getMonth()]}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ---------- Cabeçalho ---------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onVoltar} accessibilityLabel="voltar" accessibilityRole="button">
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{tituloData}</Text>

        {papel === 'instrutor' ? (
          <TouchableOpacity onPress={onCriarAtividade} accessibilityLabel="criar aula ou evento" accessibilityRole="button">
            <Text style={styles.addIcon}>+</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 22 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {horas.map((hora) => {
          const item = itemPorHoraInicio[hora];

          if (!item) {
            return (
              <View key={hora} style={styles.horaRow}>
                <Text style={styles.horaLabel}>{String(hora).padStart(2, '0')}h</Text>
                <View style={styles.horaSlotVazio} />
              </View>
            );
          }

          const isEvento = item.tipo === 'evento';
          const corBg = isEvento
            ? styles.blocoEvento
            : item.confirmada
            ? styles.blocoAulaConfirmada
            : styles.blocoAulaPendente;

          const horaFim = item.horaInicio + (item.duracaoHoras || DURACAO_PADRAO_HORAS);

          return (
            <View key={hora} style={styles.horaRow}>
              <Text style={styles.horaLabel}>{String(hora).padStart(2, '0')}h</Text>
              <TouchableOpacity
                style={[styles.bloco, corBg]}
                onPress={() => onAbrirItem && onAbrirItem(item)}
              >
                <View style={styles.blocoConteudo}>
                  {isEvento ? (
                    <Text style={styles.blocoIconeTexto}>🏆</Text>
                  ) : (
                    <ModalidadeIcon modalidade={item.modalidade} size={18} color={colors.accent} />
                  )}
                  <View style={styles.blocoTextoWrap}>
                    <Text style={styles.blocoTitulo}>{item.titulo}</Text>
                    <Text
                      style={[
                        styles.blocoSubtitulo,
                        isEvento && { color: colors.eventoText },
                      ]}
                    >
                      {formatarHora(item.horaInicio)} – {formatarHora(horaFim)} ·{' '}
                      {isEvento
                        ? 'evento'
                        : papel === 'instrutor'
                        ? `${item.confirmados} de ${item.totalVagas} confirmados`
                        : item.confirmada
                        ? 'confirmada'
                        : 'por confirmar'}
                    </Text>
                  </View>
                </View>
                {papel === 'instrutor' && <Text style={styles.blocoChevron}>›</Text>}
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
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
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  addIcon: {
    fontSize: 24,
    color: colors.accent,
    fontWeight: '300',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  horaRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  horaLabel: {
    fontSize: 11,
    color: colors.textHint,
    width: 30,
    marginTop: 2,
  },
  horaSlotVazio: {
    flex: 1,
    minHeight: 28,
  },
  bloco: {
    flex: 1,
    borderRadius: 12,
    borderLeftWidth: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  blocoAulaPendente: {
    backgroundColor: colors.aulaBg,
    borderLeftColor: colors.aulaBorder,
  },
  blocoAulaConfirmada: {
    backgroundColor: colors.aulaConfirmadaBg,
    borderLeftColor: colors.aulaConfirmadaBorder,
  },
  blocoEvento: {
    backgroundColor: colors.eventoBg,
    borderLeftColor: colors.eventoBorder,
  },
  blocoConteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  blocoIconeTexto: {
    fontSize: 16,
  },
  blocoTextoWrap: {
    flex: 1,
  },
  blocoTitulo: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  blocoSubtitulo: {
    fontSize: 10.5,
    color: colors.accent,
    marginTop: 1,
  },
  blocoChevron: {
    fontSize: 15,
    color: colors.textHint,
    marginLeft: 6,
  },
});
