import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

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
  bulletNaoConfirmada: '#791F1F',
  bulletEvento: '#E8B339',
  bulletConfirmada: '#27500A',
  bulletVazio: '#C7C5BC',
};

const NOMES_MES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];
const DIAS_SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

// -----------------------------------------------------------------------
// Prioridade de cor por dia (regra definida):
// 3 = aula não confirmada (vermelho) > 2 = evento (amarelo)
// > 1 = aula confirmada (verde) > 0 = vazio (cinza)
// -----------------------------------------------------------------------
function corPrioritariaDoDia(topicosDoDia) {
  if (!topicosDoDia || topicosDoDia.length === 0) return colors.bulletVazio;

  const temNaoConfirmada = topicosDoDia.some((t) => t.tipo === 'aula' && !t.confirmada);
  if (temNaoConfirmada) return colors.bulletNaoConfirmada;

  const temEvento = topicosDoDia.some((t) => t.tipo === 'evento');
  if (temEvento) return colors.bulletEvento;

  const temConfirmada = topicosDoDia.some((t) => t.tipo === 'aula' && t.confirmada);
  if (temConfirmada) return colors.bulletConfirmada;

  return colors.bulletVazio;
}

// -----------------------------------------------------------------------
// Dados de exemplo: mapa de "AAAA-MM-DD" -> lista de tópicos do dia.
// Substituir por chamada real à API: GET /calendario?ano=...&mes=...
// -----------------------------------------------------------------------
const topicosExemplo = {
  '2026-06-03': [{ tipo: 'aula', confirmada: true }],
  '2026-06-06': [{ tipo: 'aula', confirmada: true }],
  '2026-06-10': [{ tipo: 'evento' }],
  '2026-06-13': [{ tipo: 'aula', confirmada: true }],
  '2026-06-17': [{ tipo: 'aula', confirmada: false }],
  '2026-06-20': [{ tipo: 'aula', confirmada: true }],
  '2026-06-24': [{ tipo: 'aula', confirmada: false }],
  '2026-06-27': [{ tipo: 'aula', confirmada: true }],
  '2026-06-30': [{ tipo: 'aula', confirmada: false }],
};

function gerarGrelhaDoMes(ano, mes) {
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay(); // 0 = domingo
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const diasNoMesAnterior = new Date(ano, mes, 0).getDate();

  const celulas = [];

  // Dias do mês anterior para completar a primeira semana
  for (let i = primeiroDiaSemana - 1; i >= 0; i--) {
    celulas.push({ dia: diasNoMesAnterior - i, foraDoMes: true });
  }
  // Dias do mês atual
  for (let dia = 1; dia <= diasNoMes; dia++) {
    celulas.push({ dia, foraDoMes: false, mes, ano });
  }
  // Dias do mês seguinte para completar a última semana
  while (celulas.length % 7 !== 0) {
    celulas.push({ dia: celulas.length - (diasNoMes + primeiroDiaSemana) + 1, foraDoMes: true });
  }

  return celulas;
}

function formatarChaveData(ano, mes, dia) {
  return `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

export default function CalendarioScreen({
  topicosPorDia = topicosExemplo,
  diaSelecionadoInicial = new Date(2026, 5, 24),
  onVoltar,
  onSelecionarDia,
}) {
  const [mesAtual, setMesAtual] = useState(diaSelecionadoInicial.getMonth());
  const [anoAtual, setAnoAtual] = useState(diaSelecionadoInicial.getFullYear());

  const hoje = diaSelecionadoInicial;

  const celulas = useMemo(() => gerarGrelhaDoMes(anoAtual, mesAtual), [anoAtual, mesAtual]);

  const irParaMesAnterior = () => {
    if (mesAtual === 0) {
      setMesAtual(11);
      setAnoAtual((a) => a - 1);
    } else {
      setMesAtual((m) => m - 1);
    }
  };

  const irParaMesSeguinte = () => {
    if (mesAtual === 11) {
      setMesAtual(0);
      setAnoAtual((a) => a + 1);
    } else {
      setMesAtual((m) => m + 1);
    }
  };

  const handleSelecionarDia = (dia) => {
    const dataSelecionada = new Date(anoAtual, mesAtual, dia);
    onSelecionarDia && onSelecionarDia(dataSelecionada);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ---------- Cabeçalho ---------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onVoltar} accessibilityLabel="voltar" accessibilityRole="button">
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>calendário</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* ---------- Navegação de mês ---------- */}
      <View style={styles.monthNav}>
        <TouchableOpacity onPress={irParaMesAnterior} accessibilityLabel="mês anterior">
          <Text style={styles.monthNavIcon}>‹</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.monthButton} accessibilityLabel="escolher mês e ano">
          <Text style={styles.monthButtonText}>
            {NOMES_MES[mesAtual]} {anoAtual}
          </Text>
          <Text style={styles.monthButtonChevron}>⌄</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={irParaMesSeguinte} accessibilityLabel="mês seguinte">
          <Text style={styles.monthNavIcon}>›</Text>
        </TouchableOpacity>
      </View>

      {/* ---------- Grelha do calendário ---------- */}
      <View style={styles.calendarContainer}>
        <View style={styles.weekRow}>
          {DIAS_SEMANA.map((d) => (
            <Text key={d} style={styles.weekLabel}>{d}</Text>
          ))}
        </View>

        <View style={styles.grid}>
          {celulas.map((celula, index) => {
            if (celula.foraDoMes) {
              return (
                <View key={index} style={styles.dayCell}>
                  <Text style={styles.dayTextForaDoMes}>{celula.dia}</Text>
                </View>
              );
            }

            const chave = formatarChaveData(anoAtual, mesAtual, celula.dia);
            const topicosDoDia = topicosPorDia[chave];
            const cor = corPrioritariaDoDia(topicosDoDia);

            const isHoje =
              celula.dia === hoje.getDate() &&
              mesAtual === hoje.getMonth() &&
              anoAtual === hoje.getFullYear();

            return (
              <TouchableOpacity
                key={index}
                style={[styles.dayCell, isHoje && styles.dayCellHoje]}
                onPress={() => handleSelecionarDia(celula.dia)}
              >
                <Text style={[styles.dayText, isHoje && styles.dayTextHoje]}>{celula.dia}</Text>
                <View style={[styles.bullet, { backgroundColor: cor }]} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ---------- Legenda ---------- */}
      <View style={styles.legend}>
        <LegendItem cor={colors.bulletNaoConfirmada} texto="por confirmar" />
        <LegendItem cor={colors.bulletEvento} texto="evento" />
        <LegendItem cor={colors.bulletConfirmada} texto="confirmada" />
        <LegendItem cor={colors.bulletVazio} texto="vazio" />
      </View>
    </SafeAreaView>
  );
}

function LegendItem({ cor, texto }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: cor }]} />
      <Text style={styles.legendText}>{texto}</Text>
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
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  monthNavIcon: {
    fontSize: 22,
    color: colors.textSecondary,
    paddingHorizontal: 8,
  },
  monthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.cardBg,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  monthButtonText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  monthButtonChevron: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  calendarContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  weekLabel: {
    flex: 1,
    fontSize: 10,
    color: colors.textHint,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  dayCell: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 3,
  },
  dayCellHoje: {
    backgroundColor: colors.navy,
    borderRadius: 10,
  },
  dayText: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  dayTextHoje: {
    color: colors.white,
    fontWeight: '700',
  },
  dayTextForaDoMes: {
    fontSize: 12,
    color: colors.textHint,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    paddingVertical: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
});
