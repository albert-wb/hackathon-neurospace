# Neurospace Hackathon App 🚀

Um aplicativo web moderno, progressivo (PWA) e interativo focado em mapeamento de espaços, perfis de usuários e geolocalização. Desenvolvido como parte do Hackathon Neurospace.

---

## 🛠️ Tecnologias e Linguagens Utilizadas

Este projeto foi construído utilizando as seguintes linguagens, frameworks e bibliotecas:

### Linguagens
- **[TypeScript](https://www.typescriptlang.org/)**: Linguagem principal do projeto. Adiciona tipagem estática ao JavaScript, garantindo maior segurança, autocompletar eficiente e menos bugs em tempo de execução.
- **[JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)**: Utilizado internamente por dependências e scripts auxiliares (como `test-geocode.js`).
- **HTML5 & CSS3**: Para estruturação semântica e estilização base da aplicação.

### Core Framework
- **[Next.js (v14)](https://nextjs.org/)**: Framework React utilizado para construção da interface e rotas. Utiliza o moderno `App Router` (`src/app`), suportando Server-Side Rendering (SSR) e Static Site Generation (SSG).
- **[React 18](https://react.dev/)**: Biblioteca principal para construção de interfaces de usuário reativas e componentizadas.

### Estilização e UI
- **[Tailwind CSS](https://tailwindcss.com/)**: Framework de CSS utilitário para estilização rápida, responsiva e customizável diretamente no JSX.
- **[Lucide React](https://lucide.dev/)**: Biblioteca de ícones elegantes, consistentes e leves.

### Funcionalidades de Mapa e Geolocalização
- **[Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)**: Bibliotecas de código aberto para a criação de mapas interativos, mobile-friendly e plotagem de pontos de interesse.

### Backend as a Service (BaaS) & Autenticação
- **[Supabase](https://supabase.com/)**: Alternativa open-source ao Firebase, provê banco de dados PostgreSQL, autenticação completa de usuários e armazenamento.
- **`@supabase/ssr`**: Utilizado para gerenciar a autenticação de forma segura no lado do servidor com o Next.js App Router.

### Ferramentas Adicionais
- **[Next PWA](https://github.com/shadowwalker/next-pwa)**: Transforma a aplicação web em um Progressive Web App (PWA), permitindo instalação no celular/desktop e uso offline.
- **ESLint & Prettier**: Ferramentas para garantir a padronização e qualidade do código.

---

## 📁 Arquitetura e Estrutura de Pastas

O projeto adota uma estrutura modular e escalável, focada no ecossistema moderno do Next.js:

```text
📦 hackathon-neurospace
 ┣ 📂 public/            # Ativos estáticos (imagens, ícones, manifestos do PWA)
 ┣ 📂 supabase/          # Configurações e migrações locais do Supabase
 ┣ 📂 src/               # Código-fonte principal da aplicação
 ┃ ┣ 📂 app/             # Rotas principais (App Router do Next.js)
 ┃ ┃ ┣ 📂 adicionar/     # Rota para cadastro de novos espaços
 ┃ ┃ ┣ 📂 login/         # Página de autenticação
 ┃ ┃ ┣ 📂 mapa/          # Interface principal do mapa interativo
 ┃ ┃ ┣ 📂 perfil/        # Área do usuário
 ┃ ┃ ┗ 📂 local/         # Detalhes de um local/espaço específico
 ┃ ┣ 📂 components/      # Componentes React reutilizáveis (Form, Layout, Map, Space, UI)
 ┃ ┣ 📂 contexts/        # Gerenciamento de estado global (AddSpace, Auth, Theme)
 ┃ ┣ 📂 lib/             # Funções utilitárias e clientes (Supabase clients, helpers)
 ┃ ┣ 📂 types/           # Definições de tipos e interfaces do TypeScript
 ┃ ┗ 📜 middleware.ts    # Interceptador de rotas (ex: proteção de rotas privadas)
 ┣ 📜 package.json       # Dependências e scripts do projeto
 ┣ 📜 tailwind.config.ts # Configuração de temas e cores do Tailwind
 ┗ 📜 next.config.mjs    # Configurações do compilador Next.js
```

---

## 🚀 Funcionalidades Principais

1. **Mapa Interativo**: Visualização de pontos e espaços diretamente em um mapa construído com Leaflet.
2. **Autenticação Segura**: Fluxo completo de login e registro protegido pelo Supabase (com suporte a SSR).
3. **Gerenciamento de Espaços**: Capacidade de adicionar, listar e detalhar espaços físicos (`/adicionar` e `/local`).
4. **Perfil de Usuário**: Área logada para o usuário gerenciar suas informações (`/perfil`).
5. **Progressive Web App (PWA)**: Pode ser instalado no dispositivo do usuário como um aplicativo nativo.
6. **Modo Escuro (Dark Mode)**: Suporte a múltiplos temas visuais utilizando Context API (`ThemeContext.tsx`).

---

## ⚙️ Variáveis de Ambiente

Para rodar este projeto, você precisará adicionar as seguintes variáveis de ambiente no seu arquivo `.env.local`. Use o arquivo `.env.local.example` como base.

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase_aqui
```

---

## 💻 Como Executar o Projeto Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/hackathon-neurospace.git
   cd hackathon-neurospace
   ```

2. **Instale as dependências:**
   Você pode utilizar o gerenciador de pacotes de sua preferência (`npm`, `yarn`, `pnpm`, `bun`).
   ```bash
   npm install
   ```

3. **Configure o `.env.local`:**
   Preencha as chaves do Supabase conforme mencionado acima.

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acesse no navegador:**
   Abra [http://localhost:3000](http://localhost:3000) e explore a aplicação!

---

Desenvolvido com 🩵 e ☕ durante o Hackathon Neurospace.
