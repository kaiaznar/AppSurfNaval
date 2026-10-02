import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { AdicionarAlunosModal } from './AulaModals';

// -----------------------------------------------------------------------
// Cores do Clube Naval do Funchal
// -----------------------------------------------------------------------
const colors = {
  navy: '#0A1F3D',
  white: '#FFFFFF',
  pageBg: '#F6F5F1',
  border: '#E4E2DA',
  textPrimary: '#1A1A18',
  textSecondary: '#6B6A66',
  textHint: '#B4B2A9',
  accent: '#791F1F',
  overlay: 'rgba(0,0,0,0.35)',
  grupoBg: '#E8F0FA',
  grupoText: '#185FA5',
  modalidadeBg: '#FFF8E8',
  modalidadeText: '#92660E',
  aulaBg: '#EAF3DE',
  aulaText: '#27500A',
  utilizadorBg: '#FAECE7',
};

// -----------------------------------------------------------------------
// Dados de exemplo. Substituir por chamadas reais:
// GET /utilizadores  GET /modalidades  GET /aulas?futuras=true
// -----------------------------------------------------------------------
const utilizadoresExemplo = [
  { id: 'u1', nome: 'Maria Sousa' },
  { id: 'u2', nome: 'Tiago Freitas' },
  { id: 'u3', nome: 'treinador Rui Abreu' },
  { id: 'u4', nome: 'Sofia Câmara' },
];

const modalidadesExemplo = [
  { id: 'mod-surf', nome: 'surf' },
  { id: 'mod-natacao', nome: 'natação' },
  { id: 'mod-judo', nome: 'judo' },
];

const aulasExemplo = [
  { id: 'aula-1', titulo: 'aula de surf · 24/06 · 17h00' },
  { id: 'aula-2', titulo: 'aula de surf · 27/06 · 10h00' },
];

// Passos possíveis: 'opcoes' | 'grupoOuAviso' | 'escolherPessoas'
//                  | 'escolherModalidade' | 'escolherAula'
export default function NovaConversaModal({
  visible,
  onClose,
  onCriarChat, // ({ tipo: 'individual'|'grupo'|'aviso', destinatarios, nome }) => void
  utilizadoresDoClube = utilizadoresExemplo,
  modalidades = modalidadesExemplo,
  aulasDisponiveis = aulasExemplo,
}) {
  const [passo, setPasso] = useState('opcoes');
  const [origemSelecionada, setOrigemSelecionada] = useState(null); // 'modalidade' | 'aula'
  const [itemSelecionado, setItemSelecionado] = useState(null); // a modalidade ou aula escolhida

  const resetar = () => {
    setPasso('opcoes');
    setOrigemSelecionada(null);
    setItemSelecionado(null);
  };

  const handleClose = () => {
    resetar();
    onClose && onClose();
  };

  // ---- Passo 1: escolher "com quem" ----
  const handleEscolherUmUtilizador = () => {
    setPasso('escolherPessoaUnica');
  };

  const handleEscolherGrupoDePessoas = () => {
    setPasso('escolherPessoasGrupo');
  };

  const handleEscolherModalidade = () => {
    setPasso('escolherModalidade');
  };

  const handleEscolherAula = () => {
    setPasso('escolherAula');
  };

  // ---- Passo 2 (modalidade/aula/grupo): perguntar grupo vs aviso ----
  const irParaGrupoOuAviso = (origem, item) => {
    setOrigemSelecionada(origem);
    setItemSelecionado(item);
    setPasso('grupoOuAviso');
  };

  // ---- Resultado final ----
  const finalizarComoIndividual = (utilizador) => {
    onCriarChat &&
      onCriarChat({
        tipo: 'individual',
        destinatarios: [utilizador],
        nome: utilizador.nome,
      });
    handleClose();
  };

  const finalizarComoGrupo = (destinatarios, nome) => {
    onCriarChat && onCriarChat({ tipo: 'grupo', destinatarios, nome });
    handleClose();
  };

  const finalizarComoAviso = (destinatarios, nome) => {
    // Avisos vão sempre para o chat de sistema "avisos" (só leitura),
    // independentemente da origem (modalidade, aula ou grupo escolhido).
    onCriarChat && onCriarChat({ tipo: 'aviso', destinatarios, nome });
    handleClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        {/* ---------- Passo: opções principais ---------- */}
        {passo === 'opcoes' && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <TouchableOpacity onPress={handleClose} accessibilityLabel="fechar">
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.cardTitle}>nova conversa</Text>
              <View style={{ width: 20 }} />
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.sectionLabel}>com quem queres falar?</Text>

              <OpcaoBotao
                icone="👤"
                iconeBg={colors.utilizadorBg}
                titulo="um utilizador"
                subtitulo="qualquer atleta ou treinador do clube"
                onPress={handleEscolherUmUtilizador}
              />
              <OpcaoBotao
                icone="👥"
                iconeBg={colors.grupoBg}
                titulo="grupo de pessoas"
                subtitulo="escolher várias pessoas manualmente"
                onPress={handleEscolherGrupoDePessoas}
              />
              <OpcaoBotao
                icone="🏄"
                iconeBg={colors.modalidadeBg}
                titulo="modalidade"
                subtitulo="todos os atletas de uma modalidade"
                onPress={handleEscolherModalidade}
              />
              <OpcaoBotao
                icone="📅"
                iconeBg={colors.aulaBg}
                titulo="pessoas de uma aula"
                subtitulo="alunos confirmados numa aula específica"
                onPress={handleEscolherAula}
                ultimo
              />
            </View>
          </View>
        )}

        {/* ---------- Passo: escolher 1 utilizador (vai direto, sem grupo/aviso) ---------- */}
        {passo === 'escolherPessoaUnica' && (
          <ListaSelecaoUnica
            titulo="escolher pessoa"
            itens={utilizadoresDoClube}
            onVoltar={() => setPasso('opcoes')}
            onEscolher={finalizarComoIndividual}
          />
        )}

        {/* ---------- Passo: escolher modalidade -> depois grupo/aviso ---------- */}
        {passo === 'escolherModalidade' && (
          <ListaSelecaoUnica
            titulo="escolher modalidade"
            itens={modalidades}
            labelKey="nome"
            onVoltar={() => setPasso('opcoes')}
            onEscolher={(modalidade) => irParaGrupoOuAviso('modalidade', modalidade)}
          />
        )}

        {/* ---------- Passo: escolher aula -> depois grupo/aviso ---------- */}
        {passo === 'escolherAula' && (
          <ListaSelecaoUnica
            titulo="escolher aula"
            itens={aulasDisponiveis}
            labelKey="titulo"
            onVoltar={() => setPasso('opcoes')}
            onEscolher={(aula) => irParaGrupoOuAviso('aula', aula)}
          />
        )}

        {/* ---------- Passo: grupo vs aviso (para modalidade / aula) ---------- */}
        {passo === 'grupoOuAviso' && itemSelecionado && (
          <View style={styles.cardNarrow}>
            <View style={styles.cardHeader}>
              <TouchableOpacity onPress={() => setPasso('opcoes')} accessibilityLabel="voltar">
                <Text style={styles.backIcon}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.cardTitle}>
                {origemSelecionada === 'modalidade'
                  ? `modalidade: ${itemSelecionado.nome}`
                  : itemSelecionado.titulo}
              </Text>
              <View style={{ width: 20 }} />
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.sectionLabel}>o que queres criar?</Text>

              <TouchableOpacity
                style={styles.grupoOpcao}
                onPress={() =>
                  finalizarComoGrupo(
                    [itemSelecionado],
                    origemSelecionada === 'modalidade' ? itemSelecionado.nome : itemSelecionado.titulo
                  )
                }
              >
                <View style={styles.grupoOpcaoHeader}>
                  <Text style={styles.grupoOpcaoIcone}>👥</Text>
                  <Text style={styles.grupoOpcaoTitulo}>grupo</Text>
                </View>
                <Text style={styles.grupoOpcaoTexto}>
                  cria uma conversa onde todos podem escrever e ver as mensagens uns dos outros
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.avisoOpcao}
                onPress={() =>
                  finalizarComoAviso(
                    [itemSelecionado],
                    origemSelecionada === 'modalidade' ? itemSelecionado.nome : itemSelecionado.titulo
                  )
                }
              >
                <View style={styles.grupoOpcaoHeader}>
                  <Text style={styles.grupoOpcaoIcone}>📣</Text>
                  <Text style={styles.avisoOpcaoTitulo}>aviso</Text>
                </View>
                <Text style={styles.avisoOpcaoTexto}>
                  envia uma notificação para o chat "avisos"; ninguém pode responder, é só leitura
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ---------- Passo: grupo de pessoas (seleção múltipla) ---------- */}
        {passo === 'escolherPessoasGrupo' && (
          <AdicionarAlunosModal
            visible
            titulo="escolher pessoas"
            atletasDisponiveis={utilizadoresDoClube}
            onClose={() => setPasso('opcoes')}
            onAdicionar={(escolhidos) => finalizarComoGrupo(escolhidos, 'novo grupo')}
          />
        )}
      </View>
    </Modal>
  );
}

function OpcaoBotao({ icone, iconeBg, titulo, subtitulo, onPress, ultimo }) {
  return (
    <TouchableOpacity
      style={[styles.opcaoBotao, !ultimo && styles.opcaoBotaoMargem]}
      onPress={onPress}
    >
      <View style={[styles.opcaoIconBox, { backgroundColor: iconeBg }]}>
        <Text style={styles.opcaoIcone}>{icone}</Text>
      </View>
      <View style={styles.opcaoTextWrap}>
        <Text style={styles.opcaoTitulo}>{titulo}</Text>
        <Text style={styles.opcaoSubtitulo}>{subtitulo}</Text>
      </View>
      <Text style={styles.opcaoChevron}>›</Text>
    </TouchableOpacity>
  );
}

function ListaSelecaoUnica({ titulo, itens, labelKey = 'nome', onVoltar, onEscolher }) {
  return (
    <View style={styles.cardNarrow}>
      <View style={styles.cardHeader}>
        <TouchableOpacity onPress={onVoltar} accessibilityLabel="voltar">
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.cardTitle}>{titulo}</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.cardBody}>
        {itens.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.listaItem}
            onPress={() => onEscolher(item)}
          >
            <Text style={styles.listaItemTexto}>{item[labelKey]}</Text>
            <Text style={styles.opcaoChevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// -----------------------------------------------------------------------
// Estilos
// -----------------------------------------------------------------------
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: colors.white,
    borderRadius: 22,
    overflow: 'hidden',
  },
  cardNarrow: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: colors.white,
    borderRadius: 22,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  closeIcon: {
    fontSize: 18,
    color: colors.navy,
  },
  backIcon: {
    fontSize: 22,
    color: colors.navy,
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cardBody: {
    padding: 16,
  },
  sectionLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.4,
    marginBottom: 10,
    paddingLeft: 2,
  },
  opcaoBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.pageBg,
    borderRadius: 12,
    padding: 12,
  },
  opcaoBotaoMargem: {
    marginBottom: 8,
  },
  opcaoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opcaoIcone: {
    fontSize: 16,
  },
  opcaoTextWrap: {
    flex: 1,
  },
  opcaoTitulo: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  opcaoSubtitulo: {
    fontSize: 10.5,
    color: colors.textSecondary,
    marginTop: 1,
  },
  opcaoChevron: {
    fontSize: 16,
    color: colors.textHint,
  },
  listaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  listaItemTexto: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  grupoOpcao: {
    backgroundColor: colors.pageBg,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 13,
    marginBottom: 10,
  },
  avisoOpcao: {
    backgroundColor: '#FFF8E8',
    borderWidth: 0.5,
    borderColor: '#EDD9A3',
    borderRadius: 12,
    padding: 13,
  },
  grupoOpcaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  grupoOpcaoIcone: {
    fontSize: 15,
  },
  grupoOpcaoTitulo: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  grupoOpcaoTexto: {
    fontSize: 10.5,
    color: colors.textSecondary,
    lineHeight: 14,
  },
  avisoOpcaoTitulo: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.modalidadeText,
  },
  avisoOpcaoTexto: {
    fontSize: 10.5,
    color: colors.modalidadeText,
    lineHeight: 14,
  },
});
