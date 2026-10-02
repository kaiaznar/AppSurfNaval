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

## Página de perfil (`PerfilScreen.js`)

Acedida ao tocar na foto/avatar do cabeçalho da página inicial.

- Modo apenas leitura: nome, data de nascimento, telemóvel, email, instagram e morada.
- Bloco "responsável" — aparece **apenas se o utilizador for menor de idade**. A função `calcularIdade()` faz esse cálculo a partir da data de nascimento (`dataNascimentoISO`). Suporta múltiplos responsáveis (`perfil.responsaveis`, um array); se houver mais do que um, os blocos passam a chamar-se "responsável 1", "responsável 2", etc.
- Botão "editar" no canto superior direito abre o `EditarPerfilScreen`.

## Página de edição de perfil (`EditarPerfilScreen.js`)

Página separada (não é edição inline), conforme decidido.

- Todos os campos de dados pessoais e de responsável são **obrigatórios**, exceto o **instagram** (marcado como opcional). A validação acontece em `validar()`, chamada ao tocar em "guardar".
- Gestão de múltiplos responsáveis: botão "+ adicionar responsável" cria um novo bloco vazio; cada bloco tem um ícone de lixo para o remover. Não há mínimo obrigatório de responsáveis — podem ficar 0.
- Ao guardar, devolve o objeto atualizado via `onGuardar({ ...form, responsaveis })`, que deve ser ligado à chamada real da API (ex: `PUT /utilizador/perfil`).



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

## Página "as minhas aulas" (`TodasAulasScreen.js`)

Aberta a partir do "ver mais..." da caixa de próximas aulas.

- Lista **agrupada por mês** (ex: "junho 2026", "julho 2026"), com um cabeçalho de secção entre cada grupo.
- **Scroll infinito**: usa `FlatList` com `onEndReached`, que carrega blocos de `PAGE_SIZE` aulas de cada vez (simulado com `gerarAulasExemplo(pagina)` e um `setTimeout` a imitar latência de rede). Mostra um indicador "a carregar mais aulas..." no fundo da lista enquanto busca a página seguinte, e "não há mais aulas marcadas" quando chega ao fim.
- Cada linha mantém o botão confirmar/confirmado já usado na página inicial, e é tocável (`onAbrirAula`) para abrir o detalhe da aula — ecrã a definir na próxima iteração.

## Página "eventos do clube" (`TodosEventosScreen.js`)

Aberta a partir do "ver mais..." da caixa de eventos.

- Lista separada em duas secções: **"próximos eventos"** e **"eventos passados"**, sempre por esta ordem.
- Os eventos passados aparecem com **opacidade reduzida**, mas são **tocáveis** como os próximos (todos têm `onAbrirEvento` e a seta `›` indicando que levam a uma página de detalhe).
- **Scroll infinito** igual ao das aulas: `FlatList` com `onEndReached`, que neste caso vai buscando mais eventos passados (histórico) à medida que o utilizador desce.

## Página de detalhe da aula (`DetalheAulaScreen.js`)

Aberta ao tocar numa aula (na página inicial ou em "as minhas aulas"). Tem **duas versões controladas pela prop `papel`** (`'aluno'` ou `'instrutor'`):

**Versão aluno:**
- Cabeçalho com modalidade, dia da semana, data e hora.
- Local + botão "confirmar presença".
- "alunos confirmados X de Y" com barra de progresso, e "+W vagas extra disponíveis".
- Botão "solicitar vaga extra" — só fica ativo quando `podeSolicitarVagaExtra()` retorna verdadeiro (passou das 17h00 do dia anterior à aula **e** há vagas extra livres). Caso contrário aparece desativado com um cadeado e uma explicação por baixo.
- Lista de alunos já confirmados (foto + nome).

**Versão instrutor:**
- Mesmo cabeçalho, mas o botão principal é "✎ editar aula" (abre `EditarAulaScreen`).
- Mesma barra de progresso "X de Y".
- "lista de alunos" com 3 ações em lote ao lado do título (✓ confirmar todos, ✕ remover todos, 🔔 notificar todos) — afetam **alunos normais e extra em conjunto**, conforme decidido.
- Cada aluno tem as mesmas 3 ações individualmente.
- Alunos com `pendenteReconfirmacao: true` aparecem destacados (fundo amarelo) com a legenda "pendente de reconfirmação" — é o estado que aparece quando o instrutor altera data/hora.
- Secção "extra" separada da lista principal, com as mesmas ações. Um aluno extra **não sobe automaticamente** para a lista principal mesmo havendo vaga livre — isso é sempre uma ação manual do instrutor (mover/remover e adicionar de novo na lista principal).

## Página de edição da aula (`EditarAulaScreen.js`)

Aberta a partir do botão "editar aula" da versão instrutor.

- Bloco "detalhes da aula": data, hora e local, cada um abrindo um **modal/bottom sheet** próprio (`DatePickerModal`, `TimePickerModal`).
- Aviso fixo a explicar que alterar data/hora exige reconfirmação de todos os alunos já confirmados, e que alterar o local notifica todos.
- Ao confirmar uma nova data ou hora (`avisarReconfirmacaoNecessaria`), todos os alunos com `confirmado: true` passam para `confirmado: false, pendenteReconfirmacao: true` — refletido depois na página de detalhe.
- "alunos (N)" com botão "+ alunos", e "alunos extra (N)" com botão "+ extra", cada um abrindo o `AdicionarAlunosModal` filtrado pela modalidade e excluindo quem já está na aula.
- Remover ou adicionar um aluno deve disparar uma notificação (pontos já marcados no código onde ligar a chamada real à API).

## Modais reutilizáveis (`src/components/AulaModals.js`)

- `DatePickerModal` — bottom sheet com calendário simples de um mês.
- `TimePickerModal` — bottom sheet com seletor de hora/minuto tipo "roda".
- `AdicionarAlunosModal` — modal centrado com campo de pesquisa e seleção múltipla (usado tanto por "+ alunos" como "+ extra", com título e lista adaptados via props).



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

## Página do calendário (`CalendarioScreen.js`)

Aberta a partir do botão "calendário" da barra de navegação inferior.

- Cabeçalho do mês tocável (com setas laterais para navegar entre meses).
- Grelha de domingo a sábado, com os dias fora do mês atual esbatidos.
- Cada dia tem um **bullet point colorido** calculado por `corPrioritariaDoDia()`, seguindo a prioridade definida: 🔴 aula não confirmada > 🟡 evento > 🟢 aula confirmada > ⚪ vazio (cinza, para não se confundir com o verde).
- O dia de hoje aparece destacado com fundo azul-marinho.
- Tocar num dia chama `onSelecionarDia`, que abre a `DiaAgendaScreen` correspondente.

## Página do dia / agenda por horas (`DiaAgendaScreen.js`)

- Lista de horas de **09h a 20h** (intervalo definido), com os blocos de aula/evento sobrepostos na hora de início e a ocupar visualmente a duração (4 horas por padrão, via `DURACAO_PADRAO_HORAS`).
- **Versão aluno**: vê os blocos, sem ação de criação.
- **Versão instrutor**: tem o **"+"** no cabeçalho como **único ponto de entrada** para criar aula ou evento (tocar numa hora vazia não faz nada, conforme decidido). Cada bloco mostra também a contagem "X de Y confirmados" em vez de "confirmada/por confirmar".
- Tocar num bloco existente chama `onAbrirItem`, que leva ao detalhe da aula ou do evento.

## Páginas "criar aula" e "criar evento" (`CriarAulaScreen.js`, `CriarEventoScreen.js`)

Duas páginas distintas desde o início (sem ecrã de escolha intermédio).

**Criar aula:**
- Hora **pré-preenchida** com o valor do bloco tocado no dia.
- Campos extra em relação à edição: modalidade e total de vagas (definidos pela primeira vez).
- Secção **"atividade recorrente"**: toggle, seletor de dias da semana (círculos D-S-T-Q-Q-S-S) e campo "termina em" — vazio equivale a 6 meses de duração.
- Ao guardar, **não cria múltiplas aulas reais**: gera um único objeto com `recorrencia: { diasSemana, dataFim }`, que deve ser enviado a um endpoint de "aula recorrente" (modelo). As ocorrências individuais são geradas dinamicamente a partir desse modelo, não fisicamente duplicadas na base de dados.

**Criar evento:**
- Sem recorrência e sem lista de alunos.
- Bloco **"quem é notificado"**: toggle entre "toda a modalidade" e "lista de pessoas". Ao escolher "lista de pessoas", abre o `AdicionarAlunosModal` reaproveitado para selecionar participantes específicos.
- O evento aparece sempre no feed de todos; apenas a notificação respeita o destinatário escolhido — refletido no objeto final como `notificar: { tipo, modalidade | participantes }`.

## Edição de aula recorrente (`EditarRecorrenciaModal`, em `AulaModals.js`)

Quando o instrutor tenta guardar alterações numa aula que pertence a uma recorrência, este modal aparece com 3 opções:

- **"só esta aula"** — cria uma excepção pontual, sem afetar as outras ocorrências.
- **"todas as aulas desta recorrência"** — aplica a alteração ao modelo inteiro.
- **"criar nova recorrência a partir de hoje"** — fecha a recorrência atual definindo a sua data de fim para o dia anterior, e cria um novo modelo de recorrência com a data de fim escolhida (ou +6 meses, se em branco).

No `App.js`, isto está ligado em `handlePedirEdicaoAula` / `handleEscolherEdicaoRecorrencia` — os pontos exatos onde ligar a lógica real a cada uma das 3 opções estão comentados no código.

## Página "news" (reaproveitamento)

A página de notícias, aberta pelo botão "news" da barra de navegação inferior, **reutiliza o mesmo componente `TodosEventosScreen.js`** da listagem "ver mais..." da caixa de eventos da página inicial, conforme decidido — é a mesma lista (próximos/passados, scroll infinito), sem necessidade de um componente novo.

## Estrutura de ficheiros

```
clube-naval-app/
├── App.js                                 # Navegação entre todas as páginas
└── src/
    ├── screens/
    │   ├── LoginScreen.js                 # Ecrã de login
    │   ├── HomeScreen.js                  # Página inicial
    │   ├── PerfilScreen.js                # Visualização do perfil
    │   ├── EditarPerfilScreen.js          # Edição do perfil (página separada)
    │   ├── TodasAulasScreen.js            # Lista completa de aulas (agrupada por mês)
    │   ├── TodosEventosScreen.js          # Lista completa de eventos / news (próximos/passados)
    │   ├── DetalheAulaScreen.js           # Detalhe da aula (versão aluno e instrutor)
    │   ├── EditarAulaScreen.js            # Edição da aula (instrutor)
    │   ├── CalendarioScreen.js            # Calendário mensal com bullets de prioridade
    │   ├── DiaAgendaScreen.js             # Agenda por horas de um dia (aluno/instrutor)
    │   ├── CriarAulaScreen.js             # Criar aula, com secção de recorrência
    │   └── CriarEventoScreen.js           # Criar evento, com seleção de destinatários
    └── components/
        ├── AulaModals.js                  # Modais: data, hora, adicionar alunos, editar recorrência
        └── icons/
            └── ModalidadeIcons.js         # Ícones de modalidade (surf, etc.)
```

## Próximos passos sugeridos

- Ligar `onNavigate` e `onAbrirMenu` à navegação real (React Navigation) para as páginas de calendário, news, inbox e menu de opções.
- Adicionar persistência de sessão (ex: `AsyncStorage` ou `SecureStore`) para manter o utilizador autenticado.
- Validar formato do id do clube antes mesmo de consultar a base de dados (ex: regex `CNF-\d{4}`).
- Substituir os ícones de evento (🏆 ✈️ 📣) e da barra de navegação por uma biblioteca de ícones vetorial.

