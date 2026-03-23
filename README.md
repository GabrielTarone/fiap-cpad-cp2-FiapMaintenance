#  FIAP Maintenance

> Aplicativo mobile para gerenciamento de manutenção de salas e laboratórios da FIAP.

---

##  Sobre o Projeto

A FIAP possui diversos laboratórios e salas de aula com computadores e equipamentos que, frequentemente, apresentam problemas técnicos. Na prática, esses problemas muitas vezes são ignorados ou demoram muito tempo para serem resolvidos — o que prejudica professores e alunos durante as aulas.

O **FIAP Maintenance** foi criado para resolver exatamente isso. O app permite que professores e responsáveis registrem problemas nos equipamentos de forma rápida, indicando o nível de urgência, e que os problemas mais críticos sejam priorizados e comunicados para os técnicos de manutenção.

### Operação escolhida

Escolhemos trabalhar com o **gerenciamento de salas e chamados de manutenção**, pois é uma dor real e cotidiana dentro da instituição. A proposta é simples: substituir processos informais (como mandar mensagem no WhatsApp ou falar pessoalmente) por um sistema centralizado e visual, onde qualquer pessoa responsável pela sala consiga registrar e acompanhar os problemas.

### Funcionalidades implementadas

- ✅ Cadastro de salas e laboratórios
- ✅ Registro de problemas por computador, com descrição e nível de urgência (Alta, Média ou Baixa)
- ✅ Dashboard principal com salas priorizadas pelo problema mais urgente
- ✅ Visualização detalhada dos problemas de cada sala
- ✅ Remoção de problemas resolvidos
- ✅ Remoção de salas
- ✅ Botão de contato direto com o técnico via WhatsApp, com o problema mais urgente já preenchido na mensagem

---

##  Integrantes do Grupo

| Nome Completo |
|---------------|
| *(insira aqui o nome completo do integrante 1)* |
| *(insira aqui o nome completo do integrante 2)* |
| *(insira aqui o nome completo do integrante 3)* |

---

##  Como Rodar o Projeto

### Pré-requisitos

Antes de começar, você precisa ter instalado na sua máquina:

- [Node.js](https://nodejs.org/) — versão 18 ou superior
- [Expo Go](https://expo.dev/go) — app no seu celular para visualizar o projeto (disponível na App Store e Google Play)
- Git — para clonar o repositório

### Passo a passo

**1. Clone o repositório**

```bash
git clone https://github.com/GabrielTarone/fiap-cpad-cp1-FiapMaintenance-.git
```

**2. Acesse a pasta do projeto**

```bash
cd fiap-maintenance
```

**3. Instale as dependências**

```bash
npm install
```

**4. Inicie o projeto**

```bash
npx expo start
```

**5. Abra no seu dispositivo**

Após rodar o comando acima, um QR Code vai aparecer no terminal. Basta escanear com o app **Expo Go** no seu celular (Android ou iOS) e o app vai abrir automaticamente.

> Também é possível rodar em emuladores Android ou simuladores iOS, caso tenha o ambiente configurado.

---
## Caso queira conhecer o app:
youtube: https://youtube.com/shorts/nE_-UOeD_BI?feature=share

##  Decisões Técnicas

### Como o projeto foi estruturado

O projeto foi organizado em pastas com responsabilidades bem definidas:

- **`app/`** — contém todas as telas do aplicativo. Usamos o **Expo Router**, que cria as rotas automaticamente com base nos arquivos dessa pasta (cada arquivo vira uma tela).
- **`components/`** — componentes visuais reutilizáveis, como o card de sala (`SalaCard`) e o item de problema (`ProblemaItem`), usados em múltiplas telas.
- **`context/`** — onde fica o gerenciamento de estado global da aplicação.
- **`constants/`** — cores e fontes usadas em todo o app.
- **`hooks/`** — utilitários para tema e esquema de cores.

### Hooks utilizados e para quê

| Hook | Onde é usado | Para quê |
|------|-------------|----------|
| `useState` | Telas de formulário | Controla os campos digitados pelo usuário (nome da sala, descrição do problema, urgência selecionada) |
| `useContext` | Todas as telas | Acessa o estado global de salas e problemas sem precisar passar props manualmente |
| `useLocalSearchParams` | Telas de detalhe | Lê os parâmetros da rota (ex: ID e nome da sala) para saber qual sala foi selecionada |
| `useColorScheme` | Hooks de tema | Detecta se o dispositivo está em modo claro ou escuro |

### Como a navegação foi organizada

Usamos o **Expo Router** com navegação em pilha (**Stack Navigator**). O fluxo funciona assim:

```
Home (Dashboard)
  ├── Detalhes da Sala
  │     ├── Reportar Problema
  │     └── Remover Problema
  ├── Cadastrar Nova Sala
  └── Remover Sala
```

Cada tela é um arquivo dentro da pasta `app/`, e a navegação entre elas é feita com `router.push()` (avançar), `router.back()` (voltar) e `router.replace()` (substituir a tela atual). Parâmetros como o ID da sala são passados diretamente na URL da rota.

### Gerenciamento de estado

Optamos pelo **Context API** do próprio React, sem bibliotecas externas. Criamos um `SalasContext` que armazena a lista de salas e seus problemas, e disponibiliza funções para adicionar e remover dados. Todas as telas acessam esse contexto diretamente, o que mantém o código simples e sem repetição.

> **Observação:** os dados são mantidos em memória enquanto o app está aberto. Ao fechar o aplicativo, as informações são resetadas (não há banco de dados ou armazenamento local nesta versão).
