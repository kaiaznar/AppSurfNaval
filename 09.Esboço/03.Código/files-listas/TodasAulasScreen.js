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
import { ModalidadeIcon } from '../components/icons/ModalidadeIcons';

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
  modalidadeBg: '#FAECE7',
  modalidadeText: '#791F1F',
  confirmarBg: '#FCEBEB',
  confirmarText: '#791F1F',
  confirmadoBg: '#EAF3DE',
  confirmadoText: '#27500A',
};

const PAGE_SIZE = 8;

// -----------------------------------------------------------------------
// Geração de dados de exemplo. Substituir por chamada paginada à API:
// GET /aulas?idAtleta=...&page=...&pageSize=...
// -----------------------------------------------------------------------
function gerarAulasExemplo(pagina) {
  const meses = ['junho 2026', 'julho 2026', 'agosto 2026'];
  const aulas = [];
  for (let i = 0; i < PAGE_SIZE; i++) {
    const indiceGlobal = pagina * PAGE_SIZE + i;
    if (indiceGlobal > 22) break; // simula fim da lista
    const mesIndex = Math.min(Math.floor(indiceGlobal / 8), meses.length - 1);
    aulas.push({
      id: `aula-${indiceGlobal}`,
      mes: meses[mesIndex],
      diaSemana: ['segunda-feira', 'quarta-feira', 'sábado'][indiceGlobal % 3],
      dataCurta: `${(indiceGlobal % 28) + 1}`.padStart(2, '0') + '/' + ['06', '07', '08'][mesIndex],
      hora: indiceGlobal % 2 === 0 ? '17h00' : '10h00',
      modalidade: 'surf',
      confirmada: indiceGlobal % 3 === 1,
    });
  }
  return aulas;
}

// Agrupa a lista plana de aulas em secções por mês, no formato que o
// SectionList-like (aqui simulado com FlatList + headers) precisa.
function agruparPorMes(aulas) {
  const grupos = [];
  let grupoAtual = null;

  for (const aula of aulas) {
    if (!grupoAtual || grupoAtual.mes !== aula.mes) {
      grupoAtual = { tipo: 'header', mes: aula.mes, id: `header-${aula.mes}` };
      grupos.push(grupoAtual);
    }
    grupos.push({ tipo: 'aula', ...aula });
  }
  return grupos;
}

export default function TodasAulasScreen({ onVoltar, onAbrirFiltro, onAbrirAula }) {
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [aulasBrutas, setAulasBrutas] = useState(() => gerarAulasExemplo(0));
  const [aCarregar, setACarregar] = useState(false);
  const [temMais, setTemMais] = useState(true);

  const handleConfirmar = (aulaId) => {
    setAulasBrutas((prev) =>
      prev.map((a) => (a.id === aulaId ? { ...a, confirmada: true } : a))
    );
  };

  const carregarMais = useCallback(() => {
    if (aCarregar || !temMais) return;
    setACarregar(true);

    // Simula latência de rede. Substituir por fetch real e concatenar resultado.
    setTimeout(() => {
      const proximaPagina = paginaAtual + 1;
      const novasAulas = gerarAulasExemplo(proximaPagina);

      if (novasAulas.length === 0) {
        setTemMais(false);
      } else {
        setAulasBrutas((prev) => [...prev, ...novasAulas]);
        setPaginaAtual(proximaPagina);
      }
      setACarregar(false);
    }, 700);
  }, [paginaAtual, aCarregar, temMais]);

  const dadosAgrupados = agruparPorMes(aulasBrutas);

  const renderItem = ({ item }) => {
    if (item.tipo === 'header') {
      return <Text style={styles.mesHeader}>{item.mes}</Text>;
    }

    return (
      <TouchableOpacity
        style={styles.aulaRow}
        onPress={() => onAbrirAula && onAbrirAula(item)}
        accessibilityRole="button"
      >
        <View style={styles.aulaLeft}>
          <View style={styles.aulaIconBox}>
            <ModalidadeIcon modalidade={item.modalidade} size={20} color={colors.modalidadeText} />
          </View>
          <View>
            <Text style={styles.aulaData}>
              {item.diaSemana} - {item.dataCurta}
            </Text>
            <Text style={styles.aulaHora}>{item.hora}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.confirmButton,
            item.confirmada ? styles.confirmadoButton : styles.confirmarButton,
          ]}
          onPress={(e) => {
            e.stopPropagation && e.stopPropagation();
            if (!item.confirmada) handleConfirmar(item.id);
          }}
          disabled={item.confirmada}
        >
          <Text
            style={[
              styles.confirmButtonText,
              item.confirmada ? styles.confirmadoButtonText : styles.confirmarButtonText,
            ]}
          >
            {item.confirmada ? 'confirmado' : 'confirmar'}
          </Text>
        </TouchableOpacity>
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
        <Text style={styles.headerTitle}>as minhas aulas</Text>
        <TouchableOpacity onPress={onAbrirFiltro} accessibilityLabel="filtrar" accessibilityRole="button">
          <Text style={styles.filterIcon}>▤</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={dadosAgrupados}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onEndReached={carregarMais}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          aCarregar ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator size="small" color={colors.textHint} />
              <Text style={styles.loadingText}>a carregar mais aulas...</Text>
            </View>
          ) : !temMais ? (
            <Text style={styles.endText}>não há mais aulas marcadas</Text>
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
  filterIcon: {
    fontSize: 19,
    color: colors.textSecondary,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  mesHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.4,
    marginTop: 14,
    marginBottom: 8,
    paddingLeft: 2,
  },
  aulaRow: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  aulaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aulaIconBox: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: colors.modalidadeBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aulaData: {
    fontSize: 13.5,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  aulaHora: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  confirmButton: {
    borderRadius: 9,
    paddingVertical: 6,
    paddingHorizontal: 11,
  },
  confirmarButton: {
    backgroundColor: colors.confirmarBg,
  },
  confirmadoButton: {
    backgroundColor: colors.confirmadoBg,
  },
  confirmButtonText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  confirmarButtonText: {
    color: colors.confirmarText,
  },
  confirmadoButtonText: {
    color: colors.confirmadoText,
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
