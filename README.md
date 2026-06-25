<p align="center">
  <img src="src/app/icon.svg" width="72" height="72" alt="Weekster Hub" />
</p>

<h1 align="center">Weekster Hub</h1>

<p align="center">
  <strong>Seu universo musical Last.fm — dashboard, grades, cápsulas e discovery.</strong><br />
  <sub>Projeto independente · Open source · PT-BR</sub>
</p>

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://www.last.fm/api"><img src="https://img.shields.io/badge/Last.fm-API-D51007?style=for-the-badge&logo=last.fm&logoColor=white" alt="Last.fm API" /></a>
</p>

<p align="center">
  <a href="#-avisos-importantes">Aviso legal</a> ·
  <a href="#-funcionalidades">Funcionalidades</a> ·
  <a href="#-começando">Começando</a> ·
  <a href="#-rotas">Rotas</a> ·
  <a href="./CONTRIBUTING.md">Contribuir</a> ·
  <a href="./LICENSE">Licença</a>
</p>

---

## ⚠️ Avisos importantes

> **Weekster Hub é um projeto independente, feito por fãs, e não é afiliado, endossado ou mantido pela [Last.fm Ltd.](https://www.last.fm)**
>
> - **Last.fm®** e o logotipo Last.fm são marcas registradas da Last.fm Ltd. Todos os direitos reservados à Last.fm e aos seus respectivos titulares.
> - Nomes de artistas, álbuns, faixas, capas, tags e demais metadados exibidos pertencem aos seus respectivos proprietários.
> - Scrobbles e estatísticas são fornecidos pela API oficial Last.fm, sujeitos aos [Termos de Uso da API](https://www.last.fm/api/terms).
> - Este software é distribuído **sem garantias**, apenas para fins educacionais e de uso pessoal.
> - O uso comercial de marcas, dados ou assets da Last.fm **não é autorizado** por este repositório.

Se você representa a Last.fm e tiver alguma preocupação, abra uma issue ou entre em contato.

---

## ✨ Sobre

**Weekster Hub** transforma seu perfil Last.fm em uma experiência visual completa: dashboard dos últimos 7 dias, collage de álbuns exportável, cápsula semanal estilo stories, wrapped por período, comparação de taste entre usuários e discovery global por charts e tags.

Interface em português, tema escuro com accent vermelho, tipografia **Outfit** + **DM Sans**.

---

## 🎛 Funcionalidades

| Módulo | Descrição |
| ------ | --------- |
| **Dashboard** | Perfil, scrobbles, now playing, tags da semana, digest e previews |
| **Grade semanal** | Collage 3×3–10×10 de capas, export PNG, controles de layout |
| **Cápsula** | Wrapped semanal em formato stories, exportável |
| **Wrapped** | Top 10 por período (1 mês · 3 · 6 · 12 meses) |
| **Social** | Amigos Last.fm e comparador de overlap de artistas |
| **Discovery** | Charts globais, explorar tags, páginas de artista e tag |

### Destaques técnicos

- API key **100% server-side** (BFF com Next.js App Router)
- Resolução inteligente de capas (Last.fm → Deezer → iTunes)
- Proxy de imagens com whitelist de domínios
- Cache com `revalidate` e tags por usuário
- Export PNG via `modern-screenshot`

---

## 🛠 Stack

<p>
  <img src="https://img.shields.io/badge/Framer_Motion-animations-0055FF?logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/date--fns-datas-770C56" alt="date-fns" />
  <img src="https://img.shields.io/badge/Recharts-gráficos-22C55E" alt="Recharts" />
  <img src="https://img.shields.io/badge/ESLint-lint-4B32C3?logo=eslint&logoColor=white" alt="ESLint" />
</p>

| Camada | Tecnologia |
| ------ | ---------- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| UI | [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/) |
| Animação | [Framer Motion](https://www.framer.com/motion/) |
| Dados | [Last.fm API](https://www.last.fm/api) |
| Linguagem | TypeScript 5 |

---

## 🚀 Começando

### Pré-requisitos

- Node.js **20+**
- Conta Last.fm e [API key](https://www.last.fm/api/account/create)

### Instalação

```bash
git clone https://github.com/igordmouraa/lastfm-weekly.git
cd lastfm-weekly
npm install
cp .env.example .env
```

Edite `.env`:

```env
LASTFM_API_KEY=sua_chave_aqui
```

> **Nunca** commite `.env` nem use `NEXT_PUBLIC_` para a chave da API.

```bash
npm run dev
```

Acesse **http://localhost:3000**, digite um username Last.fm e explore.

### Scripts

| Script | Ação |
| ------ | ---- |
| `npm run dev` | Dev server com Turbopack |
| `npm run build` | Build de produção |
| `npm run start` | Servir build |
| `npm run lint` | Verificar ESLint |

---

## 🗺 Rotas

| Rota | Descrição |
| ---- | --------- |
| `/` | Landing + busca de usuário |
| `/{username}` | Dashboard (últimos 7 dias) |
| `/{username}/semaninha` | Gerador de grade de álbuns |
| `/{username}/week` | Cápsula semanal (export) |
| `/{username}/wrapped` | Wrapped por período |
| `/{username}/friends` | Amigos |
| `/compare` | Comparar taste entre dois usuários |
| `/charts` | Charts globais Last.fm |
| `/tags` | Explorar tags |
| `/artist/{nome}` | Página de artista |
| `/tag/{nome}` | Artistas e álbuns por tag |

---

## 📁 Estrutura

```
src/
├── app/
│   ├── (marketing)/     # Landing
│   ├── (app)/           # App autenticado por username na URL
│   └── api/             # BFF (proxy, now-playing, …)
├── components/
│   ├── dashboard/       # Dashboard hub
│   ├── discovery/       # Charts, tags, artistas
│   ├── shell/           # Sidebar, topbar, layout
│   ├── social/          # Amigos, comparar
│   └── wrapped/         # Cápsula, wrapped período
├── lib/lastfm/
│   ├── aggregators/     # Camada de dados
│   ├── client.ts        # Cliente API Last.fm
│   └── resolve-image.ts # Pipeline de capas
└── types/lastfm.ts      # Tipos da API
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Leia o guia completo em **[CONTRIBUTING.md](./CONTRIBUTING.md)**.

Resumo:

1. Fork → branch → commit → PR
2. `npm run lint` e `npm run build` devem passar
3. Sem secrets no código
4. Respeite o aviso legal e os termos da API Last.fm

---

## 📄 Licença

Este projeto está sob a licença **[MIT](./LICENSE)**.

```
Copyright (c) 2026 Igor Moura
```

O código-fonte é livre para uso, modificação e distribuição conforme os termos da MIT. **Isso não concede direitos sobre marcas, logotipos, dados ou conteúdo da Last.fm** — apenas sobre o código deste repositório.

---

## 👤 Autor

<p>
  <a href="https://github.com/igordmouraa">
    <img src="https://img.shields.io/badge/GitHub-igordmouraa-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
</p>

**Igor Moura** — desenvolvedor independente

---

<p align="center">
  <sub>
    Weekster Hub · Powered by <a href="https://www.last.fm">Last.fm API</a> · Não afiliado à Last.fm Ltd.
  </sub>
</p>
