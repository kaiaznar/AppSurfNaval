import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

// -----------------------------------------------------------------------
// Cores do Clube Naval do Funchal
// -----------------------------------------------------------------------
const colors = {
  navy: '#0A1F3D',
  navyLight: '#12305A',
  gold: '#C9A24B',
  white: '#FFFFFF',
  greenBg: '#EAF3DE',
  greenBorder: '#639922',
  greenText: '#173404',
  greenHint: '#3B6D11',
  redBg: '#FCEBEB',
  redBorder: '#E24B4A',
  redText: '#501313',
  grayBorder: '#D3D1C7',
  grayBg: '#F1EFE8',
  textSecondary: '#5F5E5A',
  textTertiary: '#888780',
};

// -----------------------------------------------------------------------
// Função simulada de validação do ID do clube.
// Numa versão real, isto seria uma chamada à API/base de dados do clube.
// -----------------------------------------------------------------------
async function lookupClubeId(clubeId) {
  await new Promise((resolve) => setTimeout(resolve, 600)); // simula latência de rede

  // Base de dados simulada — substituir por chamada real à API
  const mockDatabase = {
    'CNF-2381': { nome: 'Maria Sousa', modalidade: 'surf', foto: null },
    'CNF-1190': { nome: 'João Pereira', modalidade: 'natação', foto: null },
    'CNF-0044': { nome: 'Treinador Rui Abreu', modalidade: 'judo', foto: null },
  };

  return mockDatabase[clubeId.toUpperCase()] || null;
}

export default function LoginScreen({ onLoginSuccess }) {
  const [clubeId, setClubeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Estados possíveis: 'idle' | 'checking' | 'valid' | 'invalid'
  const [idStatus, setIdStatus] = useState('idle');
  const [perfil, setPerfil] = useState(null); // { nome, modalidade, foto }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  const debounceTimer = useRef(null);

  // Valida o ID do clube com debounce, à medida que o utilizador escreve.
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (clubeId.trim().length === 0) {
      setIdStatus('idle');
      setPerfil(null);
      return;
    }

    setIdStatus('checking');

    debounceTimer.current = setTimeout(async () => {
      const resultado = await lookupClubeId(clubeId.trim());
      if (resultado) {
        setPerfil(resultado);
        setIdStatus('valid');
      } else {
        setPerfil(null);
        setIdStatus('invalid');
      }
    }, 500);

    return () => clearTimeout(debounceTimer.current);
  }, [clubeId]);

  const handleSubmit = async () => {
    setLoginError('');

    if (idStatus !== 'valid') {
      setLoginError('Introduz um id de clube válido antes de continuar.');
      return;
    }
    if (password.trim().length === 0) {
      setLoginError('Introduz a tua palavra-passe.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Substituir por chamada real de autenticação à API do clube.
      await new Promise((resolve) => setTimeout(resolve, 700));
      onLoginSuccess && onLoginSuccess({ clubeId, perfil });
    } catch (err) {
      setLoginError('Não foi possível entrar. Tenta novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---- Estilo dinâmico do campo de ID, conforme o estado de validação ----
  const idFieldStyle = [
    styles.fieldBox,
    idStatus === 'valid' && styles.fieldBoxValid,
    idStatus === 'invalid' && styles.fieldBoxInvalid,
  ];

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {/* ---------- Cabeçalho ---------- */}
          <View style={styles.header}>
            <View style={styles.avatarCircle}>
              {perfil && perfil.foto ? (
                <Image source={{ uri: perfil.foto }} style={styles.avatarImage} />
              ) : (
                <AnchorIcon size={36} color={colors.gold} />
              )}
            </View>

            <Text style={styles.clubName}>clube naval do funchal</Text>

            {idStatus === 'valid' && perfil ? (
              <Text style={styles.modalidade}>{perfil.modalidade}</Text>
            ) : (
              <Text style={styles.headerHint}>introduz o id para continuar</Text>
            )}
          </View>

          {/* ---------- Formulário ---------- */}
          <View style={styles.form}>
            <Text style={styles.label}>id do atleta ou treinador</Text>
            <View style={idFieldStyle}>
              <AnchorIcon
                size={17}
                color={
                  idStatus === 'valid'
                    ? colors.greenText
                    : idStatus === 'invalid'
                    ? colors.redText
                    : colors.navy
                }
              />
              <TextInput
                style={styles.input}
                placeholder="ex: CNF-2381"
                placeholderTextColor={colors.textTertiary}
                value={clubeId}
                onChangeText={setClubeId}
                autoCapitalize="characters"
                autoCorrect={false}
              />
              {idStatus === 'checking' && (
                <ActivityIndicator size="small" color={colors.navy} />
              )}
              {idStatus === 'valid' && (
                <CheckIcon size={17} color={colors.greenText} />
              )}
              {idStatus === 'invalid' && (
                <XIcon size={17} color={colors.redText} />
              )}
            </View>

            {idStatus === 'valid' && (
              <Text style={styles.hintValid}>✓ id válido — a carregar perfil</Text>
            )}
            {idStatus === 'invalid' && (
              <Text style={styles.hintInvalid}>id não encontrado. confirma com o teu treinador.</Text>
            )}

            <Text style={[styles.label, { marginTop: 18 }]}>palavra-passe</Text>
            <View style={styles.fieldBox}>
              <LockIcon size={17} color={colors.navy} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                accessibilityLabel={showPassword ? 'ocultar palavra-passe' : 'mostrar palavra-passe'}
              >
                <EyeIcon size={16} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>

            {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              accessibilityRole="button"
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>entrar</Text>
                  <ArrowRightIcon size={17} color={colors.white} />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>não tens conta? </Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>faça sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// -----------------------------------------------------------------------
// Ícones simples em SVG-like via View/Text (substituir por
// react-native-vector-icons ou @tabler/icons-react-native em produção)
// -----------------------------------------------------------------------
function AnchorIcon({ size, color }) {
  return <Text style={{ fontSize: size, color }}>⚓</Text>;
}
function CheckIcon({ size, color }) {
  return <Text style={{ fontSize: size, color, fontWeight: '600' }}>✓</Text>;
}
function XIcon({ size, color }) {
  return <Text style={{ fontSize: size, color, fontWeight: '600' }}>✕</Text>;
}
function LockIcon({ size, color }) {
  return <Text style={{ fontSize: size, color }}>🔒</Text>;
}
function EyeIcon({ size, color }) {
  return <Text style={{ fontSize: size, color }}>👁</Text>;
}
function ArrowRightIcon({ size, color }) {
  return <Text style={{ fontSize: size, color }}>→</Text>;
}

// -----------------------------------------------------------------------
// Estilos
// -----------------------------------------------------------------------
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.grayBg,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.white,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: colors.grayBorder,
  },
  header: {
    backgroundColor: colors.navy,
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.navyLight,
    borderWidth: 2.5,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  clubName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.white,
  },
  headerHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    marginTop: 4,
  },
  modalidade: {
    fontSize: 13,
    color: colors.gold,
    marginTop: 4,
    textTransform: 'lowercase',
  },
  form: {
    padding: 24,
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 6,
    paddingLeft: 2,
  },
  fieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 0.5,
    borderColor: colors.grayBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 4,
    backgroundColor: colors.grayBg,
  },
  fieldBoxValid: {
    borderWidth: 1.5,
    borderColor: colors.greenBorder,
    backgroundColor: colors.greenBg,
  },
  fieldBoxInvalid: {
    borderWidth: 1.5,
    borderColor: colors.redBorder,
    backgroundColor: colors.redBg,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.navy,
    paddingVertical: 4,
  },
  hintValid: {
    fontSize: 11,
    color: colors.greenHint,
    marginTop: 5,
    paddingLeft: 2,
  },
  hintInvalid: {
    fontSize: 11,
    color: colors.redText,
    marginTop: 5,
    paddingLeft: 2,
  },
  errorText: {
    fontSize: 12,
    color: colors.redText,
    marginTop: 10,
    textAlign: 'center',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.navy,
    borderRadius: 14,
    paddingVertical: 13,
    marginTop: 22,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 12.5,
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: 12.5,
    color: colors.gold,
    fontWeight: '600',
  },
});
