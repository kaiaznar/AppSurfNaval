# Clube Naval do Funchal — Ecrã de login (React Native)

Componente do ecrã de login conforme o esboço aprovado:

- Cabeçalho com logo do clube, nome do clube (fixo) e modalidade (aparece só depois do id ser validado).
- Campo de id do atleta/treinador com validação em tempo real:
  - vazio → estado neutro
  - a verificar → spinner
  - válido → borda e fundo verdes, ✓, mensagem de confirmação
  - inválido → borda e fundo vermelhos, ✕, mensagem de erro
- Campo de palavra-passe com mostrar/ocultar.
- Botão "entrar" em azul-marinho.
- Rodapé "não tens conta? faça sign in".

## Instalação

```bash
npm install
# ou
yarn install
```

Dependências mínimas (já incluídas no React Native standard):
- react
- react-native

> Nota sobre ícones: o componente usa emojis simples como placeholder visual (⚓ ✓ ✕ 🔒 👁ㅤ→) para que o ficheiro funcione sem dependências extra. Em produção, recomenda-se substituir as funções `AnchorIcon`, `CheckIcon`, `XIcon`, `LockIcon`, `EyeIcon` e `ArrowRightIcon` por uma biblioteca de ícones, por exemplo:

```bash
npm install @tabler/icons-react-native
# ou
npm install react-native-vector-icons
```

## Ligação à base de dados real

A função `lookupClubeId(clubeId)` em `src/screens/LoginScreen.js` está atualmente simulada com um objeto local (`mockDatabase`). Para ligar à base de dados real do clube, substituir por uma chamada à API, por exemplo:

```javascript
async function lookupClubeId(clubeId) {
  const response = await fetch(`https://api.clubenavaldofunchal.com/membros/${clubeId}`);
  if (!response.ok) return null;
  return await response.json(); // { nome, modalidade, foto }
}
```

O mesmo se aplica ao envio do login em `handleSubmit`, que deve chamar o endpoint de autenticação real do clube em vez do `setTimeout` simulado.

## Estrutura de ficheiros

```
clube-naval-app/
├── App.js                      # Exemplo de integração
└── src/
    └── screens/
        └── LoginScreen.js      # Componente do ecrã de login
```

## Próximos passos sugeridos

- Ligar `onLoginSuccess` à navegação real (React Navigation) para a página principal do app.
- Adicionar persistência de sessão (ex: `AsyncStorage` ou `SecureStore`) para manter o utilizador autenticado.
- Validar formato do id do clube antes mesmo de consultar a base de dados (ex: regex `CNF-\d{4}`).
