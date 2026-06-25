# Contribuindo com o Weekster Hub

Obrigado por considerar contribuir! Este documento explica como participar do projeto de forma segura e alinhada com as regras da comunidade e da Last.fm.

---

## Índice

- [Antes de começar](#antes-de-começar)
- [Configuração local](#configuração-local)
- [Fluxo de trabalho](#fluxo-de-trabalho)
- [Padrões de código](#padrões-de-código)
- [O que contribuir](#o-que-contribuir)
- [Pull requests](#pull-requests)
- [Reportar bugs](#reportar-bugs)
- [Aviso legal](#aviso-legal)

---

## Antes de começar

Leia o [README](./README.md), em especial a seção **Aviso legal e marcas registradas**.

Este é um projeto **independente e não oficial**. Ao contribuir, você concorda que:

- Não representará o projeto como afiliado, endossado ou mantido pela Last.fm Ltd.
- Não incluirá credenciais, chaves de API ou dados pessoais em commits.
- Respeitará os [Termos de Uso da API Last.fm](https://www.last.fm/api/terms).

---

## Configuração local

### Pré-requisitos

- **Node.js** 20+
- **npm** 10+ (ou pnpm/yarn equivalente)
- Conta e **API key** da Last.fm ([criar aqui](https://www.last.fm/api/account/create))

### Passos

```bash
# 1. Fork e clone
git clone https://github.com/SEU_USUARIO/lastfm-weekly.git
cd lastfm-weekly

# 2. Dependências
npm install

# 3. Variáveis de ambiente
cp .env.example .env
# Edite .env e preencha LASTFM_API_KEY

# 4. Desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) e busque um username Last.fm válido.

### Scripts úteis

| Comando         | Descrição                    |
| --------------- | ---------------------------- |
| `npm run dev`   | Servidor de desenvolvimento  |
| `npm run build` | Build de produção            |
| `npm run start` | Servidor após build          |
| `npm run lint`  | ESLint                       |

---

## Fluxo de trabalho

1. Crie uma branch a partir de `main`:
   ```bash
   git checkout -b feat/minha-feature
   # ou: fix/descricao-do-bug
   ```
2. Faça alterações focadas — prefira PRs pequenos e revisáveis.
3. Rode `npm run lint` e `npm run build` antes de abrir o PR.
4. Abra o Pull Request descrevendo **o quê** e **por quê**.

### Convenção de commits

Use mensagens claras em português ou inglês (seja consistente no PR):

```
feat: adiciona preview de tags no dashboard
fix: corrige parser de álbuns em tag.getTopAlbums
docs: atualiza README com novas rotas
refactor: extrai RankedList para discovery
```

---

## Padrões de código

### Arquitetura

- **API key só no servidor** — `LASTFM_API_KEY` nunca em `NEXT_PUBLIC_*`.
- **BFF** — chamadas Last.fm via Server Components, aggregators ou Route Handlers em `src/app/api/`.
- **Sem fetch direto** da API Last.fm no browser.
- **Imagens** — use `CoverImage` + proxy `/api/proxy`; resolução via `enrichWithImages` no servidor.

### UI

- Interface em **português (PT-BR)**.
- Tema **dark** fixo, accent **vermelho** (`red-500` / `#ef4444`).
- Tipografia: **Outfit** (display) + **DM Sans** (corpo).
- Prefira layouts orgânicos; evite cards pesados sem necessidade.

### TypeScript

- Tipos Last.fm em `src/types/lastfm.ts`.
- Aggregators em `src/lib/lastfm/aggregators/`.
- Evite `any`; mantenha funções pequenas e focadas.

---

## O que contribuir

Contribuições bem-vindas:

- Correções de bugs e regressões
- Melhorias de UI/UX e acessibilidade
- Performance e cache
- Documentação e testes
- Traduções (se expandirmos i18n no futuro)

Evite, sem discussão prévia:

- Features que violem os termos da API Last.fm
- Scraping ou bypass de rate limits
- Uso de marcas Last.fm de forma que implique afiliação oficial

---

## Pull requests

### Checklist

- [ ] `npm run lint` passa
- [ ] `npm run build` passa
- [ ] Sem secrets ou `.env` no diff
- [ ] UI testada manualmente nas rotas afetadas
- [ ] README/docs atualizados se necessário
- [ ] Aviso legal preservado em telas públicas (footer, landing)

### Revisão

Mantenedores podem pedir ajustes. PRs que ignorarem segurança (ex.: expor API key) serão fechados.

---

## Reportar bugs

Abra uma [issue](https://github.com/igordmouraa/lastfm-weekly/issues) com:

1. **Descrição** do problema
2. **Passos para reproduzir**
3. **Comportamento esperado** vs. atual
4. **Ambiente** (OS, Node, browser)
5. **Screenshots** se for UI

Não inclua API keys, tokens ou dados privados de usuários.

---

## Aviso legal

Ao contribuir, você confirma que entende que:

- **Last.fm®** é marca registrada da Last.fm Ltd.
- **Weekster Hub** não é produto, serviço ou site oficial da Last.fm.
- Dados musicais, scrobbles, capas e metadados pertencem aos respectivos titulares.
- O código deste repositório é licenciado sob [MIT](./LICENSE); conteúdo de terceiros (APIs, imagens, marcas) permanece sob seus próprios termos.

Dúvidas? Abra uma issue ou fale com [@igordmouraa](https://github.com/igordmouraa).

---

<p align="center">
  <sub>Feito com cuidado por pessoas que amam música e dados.</sub>
</p>
