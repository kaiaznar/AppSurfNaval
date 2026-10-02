import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
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
};

let nextResponsavelId = 100; // contador simples para novos blocos de responsável

function novoResponsavelVazio() {
  nextResponsavelId += 1;
  return {
    id: `resp-${nextResponsavelId}`,
    nome: '',
    telefone: '',
    email: '',
  };
}

export default function EditarPerfilScreen({ perfil, onCancelar, onGuardar }) {
  const [form, setForm] = useState({
    nome: perfil?.nome || '',
    dataNascimentoExibicao: perfil?.dataNascimentoExibicao || '',
    telemovel: perfil?.telemovel || '',
    email: perfil?.email || '',
    instagram: perfil?.instagram || '', // único campo opcional
    morada: perfil?.morada || '',
  });

  const [responsaveis, setResponsaveis] = useState(
    perfil?.responsaveis && perfil.responsaveis.length > 0
      ? perfil.responsaveis
      : [] // por defeito começa sem nenhum; pode adicionar com o botão
  );

  const atualizarCampo = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const atualizarResponsavel = (id, campo, valor) => {
    setResponsaveis((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [campo]: valor } : r))
    );
  };

  const adicionarResponsavel = () => {
    setResponsaveis((prev) => [...prev, novoResponsavelVazio()]);
  };

  const removerResponsavel = (id) => {
    setResponsaveis((prev) => prev.filter((r) => r.id !== id));
  };

  // ---- Validação: todos os campos são obrigatórios, exceto o instagram ----
  const validar = () => {
    const camposObrigatoriosPessoais = [
      'nome',
      'dataNascimentoExibicao',
      'telemovel',
      'email',
      'morada',
    ];

    for (const campo of camposObrigatoriosPessoais) {
      if (!form[campo] || form[campo].trim().length === 0) {
        return `o campo "${labelDoCampo(campo)}" é obrigatório`;
      }
    }

    for (let i = 0; i < responsaveis.length; i++) {
      const r = responsaveis[i];
      if (!r.nome.trim() || !r.telefone.trim() || !r.email.trim()) {
        return `preenche todos os campos do responsável ${i + 1}`;
      }
    }

    return null;
  };

  const handleGuardar = () => {
    const erro = validar();
    if (erro) {
      Alert.alert('falta preencher', erro);
      return;
    }
    onGuardar && onGuardar({ ...form, responsaveis });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ---------- Cabeçalho ---------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancelar} accessibilityLabel="fechar edição" accessibilityRole="button">
          <Text style={styles.headerIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>editar perfil</Text>
        <TouchableOpacity onPress={handleGuardar} accessibilityRole="button">
          <Text style={styles.saveLink}>guardar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ---------- Avatar ---------- */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarPlaceholderIcon}>⚓</Text>
            </View>
            <View style={styles.cameraBadge}>
              <Text style={styles.cameraIcon}>📷</Text>
            </View>
          </View>
          <Text style={styles.changePhotoLabel}>alterar foto</Text>
        </View>

        {/* ---------- Dados pessoais ---------- */}
        <Text style={styles.sectionLabel}>dados pessoais</Text>
        <View style={styles.card}>
          <EditableRow
            label="nome"
            required
            value={form.nome}
            onChangeText={(v) => atualizarCampo('nome', v)}
          />
          <EditableRow
            label="data de nascimento"
            required
            divider
            value={form.dataNascimentoExibicao}
            onChangeText={(v) => atualizarCampo('dataNascimentoExibicao', v)}
            placeholder="DD/MM/AAAA"
          />
          <EditableRow
            label="telemóvel"
            required
            divider
            value={form.telemovel}
            onChangeText={(v) => atualizarCampo('telemovel', v)}
            keyboardType="phone-pad"
          />
          <EditableRow
            label="email"
            required
            divider
            value={form.email}
            onChangeText={(v) => atualizarCampo('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <EditableRow
            label="instagram"
            divider
            optional
            value={form.instagram}
            onChangeText={(v) => atualizarCampo('instagram', v)}
            autoCapitalize="none"
          />
          <EditableRow
            label="morada"
            required
            divider
            value={form.morada}
            onChangeText={(v) => atualizarCampo('morada', v)}
          />
        </View>

        {/* ---------- Responsáveis ---------- */}
        {responsaveis.map((resp, index) => (
          <View key={resp.id}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>
                {responsaveis.length > 1 ? `responsável ${index + 1}` : 'responsável'}
              </Text>
              <TouchableOpacity
                onPress={() => removerResponsavel(resp.id)}
                accessibilityLabel="remover responsável"
                accessibilityRole="button"
              >
                <Text style={styles.removeIcon}>🗑</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.card}>
              <EditableRow
                label="nome do responsável"
                required
                value={resp.nome}
                onChangeText={(v) => atualizarResponsavel(resp.id, 'nome', v)}
              />
              <EditableRow
                label="telefone do responsável"
                required
                divider
                value={resp.telefone}
                onChangeText={(v) => atualizarResponsavel(resp.id, 'telefone', v)}
                keyboardType="phone-pad"
              />
              <EditableRow
                label="email do responsável"
                required
                divider
                value={resp.email}
                onChangeText={(v) => atualizarResponsavel(resp.id, 'email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={adicionarResponsavel}>
          <Text style={styles.addButtonText}>+ adicionar responsável</Text>
        </TouchableOpacity>

        <Text style={styles.infoNote}>
          * campos obrigatórios — apenas o instagram é opcional
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function labelDoCampo(campo) {
  const labels = {
    nome: 'nome',
    dataNascimentoExibicao: 'data de nascimento',
    telemovel: 'telemóvel',
    email: 'email',
    morada: 'morada',
  };
  return labels[campo] || campo;
}

function EditableRow({
  label,
  value,
  onChangeText,
  required,
  optional,
  divider,
  placeholder,
  keyboardType,
  autoCapitalize,
}) {
  return (
    <View style={[styles.fieldRow, divider && styles.fieldRowDivider]}>
      <Text style={styles.fieldLabel}>
        {label}{' '}
        {required && <Text style={styles.requiredMark}>*</Text>}
        {optional && <Text style={styles.optionalMark}>(opcional)</Text>}
      </Text>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textHint}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
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
  saveLink: {
    fontSize: 13,
    fontWeight: '700',
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
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: colors.navy,
    borderWidth: 2.5,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholderIcon: {
    fontSize: 32,
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
  changePhotoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
    marginTop: 10,
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
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  removeIcon: {
    fontSize: 15,
    color: '#B4B2A9',
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 4,
  },
  fieldRow: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  fieldRowDivider: {
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  fieldLabel: {
    fontSize: 10.5,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  requiredMark: {
    color: colors.accent,
  },
  optionalMark: {
    color: '#B4B2A9',
    fontSize: 10,
  },
  fieldInput: {
    fontSize: 13.5,
    color: colors.textPrimary,
    padding: 0,
  },
  addButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gold,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 4,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
  },
  infoNote: {
    fontSize: 11,
    color: colors.textHint,
    textAlign: 'center',
    marginTop: 16,
  },
});
