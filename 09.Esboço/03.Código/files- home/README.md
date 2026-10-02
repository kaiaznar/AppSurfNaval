# Clube Naval do Funchal — Login + página inicial (React Native)

## Ecrã de login (`LoginScreen.js`)

Conforme o esboço aprovado:

- Cabeçalho com logo do clube, nome do clube (fixo) e modalidade (aparece só depois do id ser validado).
- Campo de id do atleta/treinador com validação em tempo real:
  - vazio → estado neutro
  - a verificar → spinner
  - válido → borda e fundo verdes, ✓, mensagem de confirmação
  - inválido → borda e fundo vermelhos, ✕, mensagem de erro
- Campo de palavra-passe com mostrar/ocultar.
- Botão "entrar" em azul-marinho.
- Rodapé "não tens conta? faça sign in".

## Página inicial (`HomeScreen.js`)

- Cabeçalho: foto do utilizador com anel estilo "stories" (dourado + azul-marinho), nome do clube pequeno, modalidade em destaque, botão de menu (3 linhas) à direita.
- Caixa "próximas aulas": mostra as 2 próximas aulas no formato `dia da semana - DD/MM`, hora por baixo, ícone da modalidade (prancha de surf incluída como exemplo) e botão de confirmação que alterna entre vermelho ("confirmar") e verde ("confirmado"). Link "ver mais..." para o calendário completo.
- Caixa "eventos": lista de eventos do clube (campeonatos, viagens, avisos) com ícone + texto. Link "ver mais...".
- Barra de navegação inferior fixa: home, calendário, news, inbox (com indicador de notificação).

### Ícones de modalidade (`src/components/icons/ModalidadeIcons.js`)

Contém o `SurfIcon` (esboço de prancha de surf em SVG) e um `modalidadeIconMap` que liga o nome da modalidade (ex: `'surf'`) ao ícone correspondente. Para adicionar outras modalidades (natação, judo, karaté...), criar o respetivo componente de ícone e registar no mapa:

```javascript
export const modalidadeIconMap = {
  surf: SurfIcon,
  natacao: NatacaoIcon,
  judo: JudoIcon,
};
```

## Instalação

```bash
npm install
# ou
yarn install
```

Dependências:
- react
- react-native
- react-native-svg (para os ícones de modalidade da página inicial)

```bash
npm install react-native-svg
```

> Nota sobre ícones: o login e a barra de navegação usam emojis/caracteres simples como placeholder visual para funcionar sem dependências extra. Em produção, recomenda-se substituir por uma biblioteca de ícones, por exemplo:

```bash
npm install @tabler/icons-react-native
# ou
npm install react-native-vector-icons
```

## Ligação à base de dados real

A função `lookupClubeId(clubeId)` em `src/screens/LoginScreen.js` está atualmente simulada com um objeto local (`mockDatabase`). Substituir por uma chamada à API real, por exemplo:

```javascript
async function lookupClubeId(clubeId) {
  const response = await fetch(`https://api.clubenavaldofunchal.com/membros/${clubeId}`);
  if (!response.ok) return null;
  return await response.json(); // { nome, modalidade, foto }
}
```

Na `HomeScreen.js`, os dados `proximasAulasExemplo` e `eventosExemplo` devem ser substituídos por chamadas reais, por exemplo:

```javascript
const aulas = await fetch(`https://api.clubenavaldofunchal.com/aulas/proximas?idAtleta=${clubeId}`);
const eventos = await fetch(`https://api.clubenavaldofunchal.com/eventos/ativos`);
```

O botão "confirmar" (`onConfirmarAula`) deve também chamar o endpoint real de confirmação de presença em vez de apenas atualizar o estado local.

## Estrutura de ficheiros

```
clube-naval-app/
├── App.js                                 # Navegação entre Login e Home
└── src/
    ├── screens/
    │   ├── LoginScreen.js                 # Ecrã de login
    │   └── HomeScreen.js                  # Página inicial
    └── components/
        └── icons/
            └── ModalidadeIcons.js         # Ícones de modalidade (surf, etc.)
```

## Próximos passos sugeridos

- Ligar `onNavigate` e `onAbrirMenu` à navegação real (React Navigation) para as páginas de calendário, news, inbox e menu de opções.
- Adicionar persistência de sessão (ex: `AsyncStorage` ou `SecureStore`) para manter o utilizador autenticado.
- Validar formato do id do clube antes mesmo de consultar a base de dados (ex: regex `CNF-\d{4}`).
- Substituir os ícones de evento (🏆 ✈️ 📣) e da barra de navegação por uma biblioteca de ícones vetorial.

