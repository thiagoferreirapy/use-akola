# Akolá Frontend

Frontend inicial do MVP Akolá, baseado no design system do Figma e no escopo funcional documentado no Notion.

## Stack

- Next.js + TypeScript
- Tailwind CSS
- Geist
- Lucide React
- Axios
- React Hook Form + Zod (dependências já preparadas para formulários conectados ao backend)
- TanStack Query (preparado para consumo da API)
- Capacitor (WebView apontando para URL hospedada)

## Rodando

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Backend local

O MVP usa rotas REST do próprio Next.js em `/api`, com autenticação por token e persistência local em `data/akola.json`. Para produção, defina `AUTH_SECRET` e substitua a implementação de `src/server/db.ts` por PostgreSQL/PostGIS mantendo os mesmos contratos HTTP.

Conta local de demonstração:

```text
demo@useakola.app
akola123
```

## Capacitor

No desenvolvimento:

```bash
CAPACITOR_SERVER_URL=http://SEU_IP:3000 npx cap sync
```

Em produção, a estratégia definida é apontar o WebView para a URL HTTPS hospedada do Next.js.

## Rotas implementadas

### Aplicativo
- `/` Home
- `/mapa`
- `/locais/[id]`
- `/favoritos`
- `/contribuir`
- `/confirmar/[id]`
- `/avaliacoes/[id]`
- `/reportar/[id]`
- `/ofertas/[id]`
- `/minhas-contribuicoes`
- `/perfil`
- `/login`

### Portal do estabelecimento
- `/parceiro`
- `/parceiro/reivindicar`
- `/parceiro/estabelecimento`
- `/parceiro/promocoes`
- `/parceiro/qr`
- `/parceiro/metricas`
- `/parceiro/plano`

### Administração
- `/admin`
- `/admin/locais`
- `/admin/denuncias`
- `/admin/reivindicacoes`
- `/admin/parceiros`
- `/admin/promocoes`
- `/admin/usuarios`
- `/admin/metricas`

## Estado atual

O frontend usa dados mockados. A camada `src/lib/api.ts` já centraliza Axios e será usada na próxima fase quando o backend Node.js + Express + Prisma estiver pronto.

O mapa é um mock visual. A escolha do provedor de mapas ainda precisa ser fechada antes de integrar mapa, geocoding e rotas reais.
# use-akola
