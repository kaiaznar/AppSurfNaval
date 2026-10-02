import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
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
  textHint: '#B4B2A9',
  pastIcon: '#888780',
  pastText: '#5F5E5A',
  chevron: '#B4B2A9',
  trofeu: '#854F0B',
  viagem: '#185FA5',
  aviso: '#5F5E5A',
};

const PAGE_SIZE = 6;

const tipoIconMap = {
  campeonato: { icon: '🏆', color: colors.trofeu },
  viagem: { icon: '✈️', color: colors.viagem },
  aviso: { icon: '📣', color: colors.aviso },
  natacao: { icon: '🏊', color: colors.viagem },
};

// -----------------------------------------------------------------------
// Dados de exemplo. Substituir por chamada paginada à API:
// GET /eventos?status=futuro|passado&page=...&pageSize=...
// -----------------------------------------------------------------------
const eventosFuturosBase = [
  { id: 'fut-1', tipo: 'campeonato', titulo: 'campeonato regional de surf', subtitulo: '12 de julho · praia formosa' },
  { id: 'fut-2', tipo: 'viagem', titulo: 'viagem ao porto santo', subtitulo: 'inscrições até 30 de junho' },
  { id: 'fut-3', tipo: 'aviso', titulo: 'novo horário de inverno', subtitulo: 'atualização do clube' },
  { id: 'fut-4', tipo: 'natacao', titulo: 'torneio interclubes de natação', subtitulo: '20 de julho · piscinas paulo camacho' },
];

const eventosPassadosBase = [
  { id: 'pas-1', tipo: 'campeonato', titulo: 'festival de fim de época', subtitulo: '2 de junho · quinta calaça' },
  { id: 'pas-2', tipo: 'aviso', titulo: 'reunião de pais e treinadores', subtitulo: '25 de maio' },
  { id: 'pas-3', tipo: 'viagem', titulo: 'estágio de pré-temporada', subtitulo: '14 de maio · calheta' },
];

function gerarMaisEventos(base, pagina, prefixo) {
  // Simula paginação repetindo/variando a base, até um limite.
  if (pagina * PAGE_SIZE >= base.length + PAGE_SIZE * 2) return [];
  const inicio = pagina * PAGE_SIZE;
  return base
    .slice(0, PAGE_SIZE)
    .map((ev, i) => ({ ...ev, id: `${prefixo}-${inicio + i}` }))
    .slice(0, Math.max(0, base.length - inicio % (base.length || 1)));
}

export default function TodosEventosScreen({ onVoltar, onAbrirEvento }) {
  const [eventosFuturos, setEventosFuturos] = useState(eventosFuturosBase);
  const [eventosPassados, setEventosPassados] = useState(eventosPassadosBase);
  const [pagina, setPagina] = useState(0);
  const [aCarregar, setACarregar] = useState(false);
  const [temMais, setTemMais] = useState(true);

  // Lista combinada para o FlatList: cabeçalhos + itens, na ordem
  // próximos eventos -> eventos passados.
  const dados = [
    { tipo: 'header', id: 'header-futuros', titulo: 'próximos eventos' },
    ...eventosFuturos.map((e) => ({ ...e, secao: 'futuro' })),
    { tipo: 'header', id: 'header-passados', titulo: 'eventos passados' },
    ...eventosPassados.map((e) => ({ ...e, secao: 'passado' })),
  ];

  const carregarMais = useCallback(() => {
    if (aCarregar || !temMais) return;
    setACarregar(true);

    setTimeout(() => {
      const proximaPagina = pagina + 1;
      const maisPassados = gerarMaisEventos(eventosPassadosBase, proximaPagina, 'pas-mais');

      if (maisPassados.length === 0) {
        setTemMais(false);
      } else {
        setEventosPassados((prev) => [...prev, ...maisPassados]);
        setPagina(proximaPagina);
      }
      setACarregar(false);
    }, 700);
  }, [pagina, aCarregar, temMais]);

  const renderItem = ({ item }) => {
    if (item.tipo === 'header') {
      return <Text style={styles.sectionHeader}>{item.titulo}</Text>;
    }

    const isPassado = item.secao === 'passado';
    const iconInfo = tipoIconMap[item.tipo] || tipoIconMap.aviso;

    return (
      <TouchableOpacity
        style={[styles.eventoRow, isPassado && styles.eventoRowPassado]}
        onPress={() => onAbrirEvento && onAbrirEvento(item)}
        accessibilityRole="button"
      >
        <View style={styles.eventoLeft}>
          <Text style={[styles.eventoIcon, isPassado && styles.eventoIconPassado]}>
            {iconInfo.icon}
          </Text>
          <View style={styles.eventoTextWrap}>
            <Text style={[styles.eventoTitulo, isPassado && styles.eventoTituloPassado]}>
              {item.titulo}
            </Text>
            <Text style={[styles.eventoSubtitulo, isPassado && styles.eventoSubtituloPassado]}>
              {item.subtitulo}
            </Text>
          </View>
        </View>
        <Text style={styles.chevron}>›</Text>
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
        <Text style={styles.headerTitle}>eventos do clube</Text>
        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={dados}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onEndReached={carregarMais}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          aCarregar ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator size="small" color={colors.textHint} />
              <Text style={styles.loadingText}>a carregar mais eventos...</Text>
            </View>
          ) : !temMais ? (
            <Text style={styles.endText}>não há mais eventos</Text>
          ) : null
        }
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
  eventoRow: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  eventoRowPassado: {
    opacity: 0.65,
  },
  eventoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  eventoIcon: {
    fontSize: 18,
  },
  eventoIconPassado: {
    opacity: 0.8,
  },
  eventoTextWrap: {
    flex: 1,
  },
  eventoTitulo: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  eventoTituloPassado: {
    color: colors.pastText,
  },
  eventoSubtitulo: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  eventoSubtituloPassado: {
    color: colors.pastIcon,
  },
  chevron: {
    fontSize: 18,
    color: colors.chevron,
    marginLeft: 6,
  },
  loadingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  loadingText: {
    fontSize: 11.5,
    color: colors.textHint,
  },
  endText: {
    fontSize: 11.5,
    color: colors.textHint,
    textAlign: 'center',
    paddingVertical: 14,
  },
});
