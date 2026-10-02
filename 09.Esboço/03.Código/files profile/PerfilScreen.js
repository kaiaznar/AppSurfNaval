import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';

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
  textHint: '#888780',
  accent: '#791F1F',
  accentBg: '#FAECE7',
};

// -----------------------------------------------------------------------
// Calcula se o utilizador é menor de idade a partir da data de nascimento.
// -----------------------------------------------------------------------
function calcularIdade(dataNascimentoISO) {
  if (!dataNascimentoISO) return null;
  const nascimento = new Date(dataNascimentoISO);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
  if (aindaNaoFezAniversario) idade -= 1;
  return idade;
}

// -----------------------------------------------------------------------
// Dados de exemplo. Substituir pela informação real vinda da API
// (ex: GET /utilizador/perfil?idAtleta=...)
// -----------------------------------------------------------------------
const perfilExemplo = {
  nome: 'Maria Sousa',
  modalidade: 'surf',
  clubeId: 'CNF-2381',
  foto: null,
  dataNascimentoISO: '2014-03-14',
  dataNascimentoExibicao: '14/03/2014',
  telemovel: '+351 912 345 678',
  email: 'maria.sousa@email.com',
  instagram: '@maria.surf',
  morada: 'Rua das Maravilhas, nº12, Funchal',
  responsaveis: [
    {
      id: 'resp-1',
      nome: 'Carla Sousa',
      telefone: '+351 963 210 987',
      email: 'carla.sousa@email.com',
    },
  ],
};

export default function PerfilScreen({
  perfil = perfilExemplo,
  onVoltar,
  onEditar,
  onAlterarFoto,
}) {
  const idade = calcularIdade(perfil.dataNascimentoISO);
  const isMenor = idade !== null && idade < 18;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ---------- Cabeçalho ---------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onVoltar} accessibilityLabel="voltar" accessibilityRole="button">
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>o meu perfil</Text>
        <TouchableOpacity onPress={onEditar} accessibilityRole="button">
          <Text style={styles.editLink}>editar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ---------- Avatar ---------- */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarCircle}>
              {perfil.foto ? (
                <Image source={{ uri: perfil.foto }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarPlaceholderIcon}>⚓</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.cameraBadge}
              onPress={onAlterarFoto}
              accessibilityLabel="alterar foto"
              accessibilityRole="button"
            >
              <Text style={styles.cameraIcon}>📷</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.nome}>{perfil.nome}</Text>
          <Text style={styles.badge}>
            {perfil.modalidade} · {perfil.clubeId}
          </Text>
        </View>

        {/* ---------- Dados pessoais ---------- */}
        <Text style={styles.sectionLabel}>dados pessoais</Text>
        <View style={styles.card}>
          <InfoRow icon="👤" label="nome" valor={perfil.nome} />
          <InfoRow icon="🎂" label="data de nascimento" valor={perfil.dataNascimentoExibicao} divider />
          <InfoRow icon="📱" label="telemóvel" valor={perfil.telemovel} divider />
          <InfoRow icon="✉️" label="email" valor={perfil.email} divider />
          <InfoRow icon="📷" label="instagram" valor={perfil.instagram} divider />
          <InfoRow icon="📍" label="morada" valor={perfil.morada} divider />
        </View>

        {/* ---------- Responsáveis (só se menor de idade) ---------- */}
        {isMenor && perfil.responsaveis && perfil.responsaveis.length > 0 && (
          <>
            {perfil.responsaveis.map((resp, index) => (
              <View key={resp.id}>
                <Text style={styles.sectionLabel}>
                  {perfil.responsaveis.length > 1
                    ? `responsável ${index + 1}`
                    : 'responsável'}
                </Text>
                <View style={styles.card}>
                  <InfoRow icon="🛡️" label="nome do responsável" valor={resp.nome} />
                  <InfoRow icon="📱" label="telefone do responsável" valor={resp.telefone} divider />
                  <InfoRow icon="✉️" label="email do responsável" valor={resp.email} divider />
                </View>
              </View>
            ))}

            <Text style={styles.infoNote}>
              ℹ️ os campos de responsável aparecem porque o atleta é menor de idade
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, valor, divider }) {
  return (
    <View style={[styles.infoRow, divider && styles.infoRowDivider]}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <View style={styles.infoTextWrap}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{valor}</Text>
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
  editLink: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.navy,
    borderWidth: 2.5,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholderIcon: {
    fontSize: 36,
    color: colors.gold,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    fontSize: 12,
    color: colors.white,
  },
  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 12,
  },
  badge: {
    fontSize: 12,
    color: colors.accent,
    backgroundColor: colors.accentBg,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 6,
    overflow: 'hidden',
  },
  sectionLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 18,
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
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  infoRowDivider: {
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  infoIcon: {
    fontSize: 16,
    width: 20,
    textAlign: 'center',
  },
  infoTextWrap: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10.5,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 13.5,
    color: colors.textPrimary,
    marginTop: 1,
  },
  infoNote: {
    fontSize: 11,
    color: colors.textHint,
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 4,
  },
});
