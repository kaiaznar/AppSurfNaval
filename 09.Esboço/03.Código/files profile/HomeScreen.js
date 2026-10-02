import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
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
  modalidadeBg: '#FAECE7',
  modalidadeText: '#791F1F',
  confirmarBg: '#FCEBEB',
  confirmarText: '#791F1F',
  confirmadoBg: '#EAF3DE',
  confirmadoText: '#27500A',
  eventoTrofeu: '#854F0B',
  eventoViagem: '#185FA5',
  eventoAviso: '#5F5E5A',
  navInactive: '#6B6A66',
  notificationDot: '#E24B4A',
};

// -----------------------------------------------------------------------
// Dados de exemplo. Substituir pelas chamadas reais à API do clube
// (ex: GET /utilizador/perfil, GET /aulas/proximas?idAtleta=..., GET /eventos)
// -----------------------------------------------------------------------
const utilizadorExemplo = {
  nome: 'Maria Sousa',
  modalidade: 'surf',
  foto: null, // url da foto do utilizador, se existir
};

const proximasAulasExemplo = [
  {
    id: 'aula-1',
    diaSemana: 'quarta-feira',
    dataCurta: '24/06',
    hora: '17h00',
    modalidade: 'surf',
    confirmada: false,
  },
  {
    id: 'aula-2',
    diaSemana: 'sábado',
    dataCurta: '27/06',
    hora: '10h00',
    modalidade: 'surf',
    confirmada: true,
  },
];

const eventosExemplo = [
  {
    id: 'evento-1',
    tipo: 'campeonato',
    titulo: 'campeonato regional de surf',
    subtitulo: '12 de julho · praia formosa',
  },
  {
    id: 'evento-2',
    tipo: 'viagem',
    titulo: 'viagem ao porto santo',
    subtitulo: 'inscrições até 30 de junho',
  },
  {
    id: 'evento-3',
    tipo: 'aviso',
    titulo: 'novo horário de inverno',
    subtitulo: 'atualização do clube',
  },
];

// Mapa de tipo de evento -> ícone e cor (usar @tabler/icons-react-native
// ou react-native-vector-icons em produção; aqui ficam como placeholders).
const eventoIconMap = {
  campeonato: { label: '🏆', color: colors.eventoTrofeu },
  viagem: { label: '✈️', color: colors.eventoViagem },
  aviso: { label: '📣', color: colors.eventoAviso },
};

export default function HomeScreen({
  utilizador = utilizadorExemplo,
  proximasAulas = proximasAulasExemplo,
  eventos = eventosExemplo,
  onAbrirMenu,
  onAbrirPerfil,
  onVerMaisAulas,
  onVerMaisEventos,
  onConfirmarAula,
  onNavigate, // (destino: 'home' | 'calendario' | 'news' | 'inbox') => void
}) {
  const [aulas, setAulas] = useState(proximasAulas);

  const handleConfirmar = (aulaId) => {
    setAulas((prev) =>
      prev.map((a) => (a.id === aulaId ? { ...a, confirmada: true } : a))
    );
    onConfirmarAula && onConfirmarAula(aulaId);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ---------- Cabeçalho ---------- */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={onAbrirPerfil}
          accessibilityLabel="abrir o meu perfil"
          accessibilityRole="button"
        >
          <View style={styles.avatarRing}>
            <View style={styles.avatarInnerBorder}>
              {utilizador.foto ? (
                <Image source={{ uri: utilizador.foto }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarPlaceholderIcon}>⚓</Text>
                </View>
              )}
            </View>
          </View>

          <View>
            <Text style={styles.clubNameSmall}>clube naval do funchal</Text>
            <Text style={styles.modalidadeGrande}>{utilizador.modalidade}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onAbrirMenu}
          style={styles.menuButton}
          accessibilityLabel="abrir menu"
          accessibilityRole="button"
        >
          <Text style={styles.menuIcon}>≡</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ---------- Caixa: próximas aulas ---------- */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>próximas aulas</Text>
            <TouchableOpacity onPress={onVerMaisAulas}>
              <Text style={styles.verMais}>ver mais...</Text>
            </TouchableOpacity>
          </View>

          {aulas.map((aula, index) => (
            <View
              key={aula.id}
              style={[
                styles.aulaRow,
                index > 0 && styles.aulaRowDivider,
              ]}
            >
              <View style={styles.aulaLeft}>
                <View style={styles.aulaIconBox}>
                  <ModalidadeIcon
                    modalidade={aula.modalidade}
                    size={22}
                    color={colors.modalidadeText}
                  />
                </View>
                <View>
                  <Text style={styles.aulaData}>
                    {aula.diaSemana} - {aula.dataCurta}
                  </Text>
                  <Text style={styles.aulaHora}>{aula.hora}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  aula.confirmada ? styles.confirmadoButton : styles.confirmarButton,
                ]}
                onPress={() => !aula.confirmada && handleConfirmar(aula.id)}
                disabled={aula.confirmada}
                accessibilityRole="button"
                accessibilityLabel={
                  aula.confirmada ? 'presença confirmada' : 'confirmar presença'
                }
              >
                <Text
                  style={[
                    styles.confirmButtonText,
                    aula.confirmada ? styles.confirmadoButtonText : styles.confirmarButtonText,
                  ]}
                >
                  {aula.confirmada ? 'confirmado' : 'confirmar'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* ---------- Caixa: eventos ---------- */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>eventos</Text>
            <TouchableOpacity onPress={onVerMaisEventos}>
              <Text style={styles.verMais}>ver mais...</Text>
            </TouchableOpacity>
          </View>

          {eventos.map((evento, index) => {
            const iconInfo = eventoIconMap[evento.tipo] || eventoIconMap.aviso;
            return (
              <View
                key={evento.id}
                style={[
                  styles.eventoRow,
                  index > 0 && styles.eventoRowDivider,
                ]}
              >
                <Text style={[styles.eventoIcon, { color: iconInfo.color }]}>
                  {iconInfo.label}
                </Text>
                <View style={styles.eventoTextWrap}>
                  <Text style={styles.eventoTitulo}>{evento.titulo}</Text>
                  <Text style={styles.eventoSubtitulo}>{evento.subtitulo}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* ---------- Barra de navegação inferior ---------- */}
      <View style={styles.bottomNav}>
        <NavItem
          label="home"
          icon="⌂"
          active
          onPress={() => onNavigate && onNavigate('home')}
        />
        <NavItem
          label="calendário"
          icon="▦"
          onPress={() => onNavigate && onNavigate('calendario')}
        />
        <NavItem
          label="news"
          icon="▤"
          onPress={() => onNavigate && onNavigate('news')}
        />
        <NavItem
          label="inbox"
          icon="◌"
          hasNotification
          onPress={() => onNavigate && onNavigate('inbox')}
        />
      </View>
    </SafeAreaView>
  );
}

function NavItem({ label, icon, active, hasNotification, onPress }) {
  return (
    <TouchableOpacity
      style={styles.navItem}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View>
        <Text style={[styles.navIcon, active && styles.navIconActive]}>{icon}</Text>
        {hasNotification && <View style={styles.notificationDot} />}
      </View>
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </TouchableOpacity>
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

  // Cabeçalho
  header: {
    backgroundColor: colors.cardBg,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatarRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  avatarInnerBorder: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholderIcon: {
    fontSize: 20,
    color: colors.gold,
  },
  clubNameSmall: {
    fontSize: 10,
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
  modalidadeGrande: {
    fontSize: 19,
    fontWeight: '600',
    color: colors.modalidadeText,
    marginTop: 2,
    textTransform: 'lowercase',
  },
  menuButton: {
    padding: 6,
  },
  menuIcon: {
    fontSize: 26,
    color: colors.navy,
  },

  // Scroll / corpo
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 8,
  },

  // Cartões genéricos
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  verMais: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.modalidadeText,
  },

  // Linhas de aula
  aulaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  aulaRowDivider: {
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  aulaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aulaIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.modalidadeBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aulaData: {
    fontSize: 14.5,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  aulaHora: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  confirmButton: {
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  confirmarButton: {
    backgroundColor: colors.confirmarBg,
  },
  confirmadoButton: {
    backgroundColor: colors.confirmadoBg,
  },
  confirmButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  confirmarButtonText: {
    color: colors.confirmarText,
  },
  confirmadoButtonText: {
    color: colors.confirmadoText,
  },

  // Linhas de evento
  eventoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  eventoRowDivider: {
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  eventoIcon: {
    fontSize: 18,
  },
  eventoTextWrap: {
    flex: 1,
  },
  eventoTitulo: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  eventoSubtitulo: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },

  // Barra de navegação inferior
  bottomNav: {
    backgroundColor: colors.cardBg,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    paddingTop: 10,
    paddingBottom: 14,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navItem: {
    alignItems: 'center',
    gap: 3,
  },
  navIcon: {
    fontSize: 20,
    color: colors.navInactive,
  },
  navIconActive: {
    color: colors.navy,
  },
  navLabel: {
    fontSize: 10.5,
    color: colors.navInactive,
  },
  navLabelActive: {
    color: colors.navy,
    fontWeight: '600',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.notificationDot,
  },
});
