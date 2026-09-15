# BI BVGarantia — Dashboard Financeiro

Dashboard de indicadores financeiros para o grupo BV Garantia, construído com Next.js 14.

## Stack
- **Next.js 14** (App Router + TypeScript)
- **Tailwind CSS 4** (tema laranja + verde claríssimo)
- **Prisma 5 + SQLite** (cache local)
- **MySQL 8** (Novacorp — fonte de dados)
- **NextAuth v5** (autenticação JWT)
- **Recharts** (gráficos)

## Configuração Local

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Crie o arquivo `.env.local` na raiz com:
```env
MYSQL_HOST=sistemasnovacorp.com.br
MYSQL_PORT=5643
MYSQL_DATABASE=novacorpconect
MYSQL_USER=Intelligence
MYSQL_PASSWORD=@bv2026@
MYSQL_TIMEZONE=America/Sao_Paulo
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=bvgarantia-bi-secret-2026-ultra-seguro
DATABASE_URL="file:./local.db"
ID_EMPRESA=75
```

### 3. Criar banco local e usuário admin
```bash
# Cria o SQLite e sincroniza o schema
$env:DATABASE_URL="file:./local.db"; node node_modules/prisma/build/index.js db push

# Cria o usuário admin
node prisma/seed.mjs
```

### 4. Rodar em desenvolvimento
```bash
npm run dev
```
Acesse: http://localhost:3000
Login: `admin@bvgarantia.com.br` / `123456`

---

## Deploy — Vercel + GitHub

### 1. GitHub
```bash
git init
git remote add origin https://github.com/SEU_USUARIO/bi-bvgarantia.git
git add .
git commit -m "chore: projeto inicial BI BVGarantia"
git push -u origin main
```

### 2. Vercel
1. Acesse [vercel.com](https://vercel.com) → Import Git Repository
2. Selecione o repositório `bi-bvgarantia`
3. Configure as **Environment Variables** (mesmas do `.env.local`, sem o `DATABASE_URL`)
4. Deploy!

### 3. Subdomínio no cPanel (ValueHost)
1. No cPanel → **Subdomínios** → Criar `bi.bvgarantia.com.br`
2. Em **DNS Zone Editor** → Adicionar registro CNAME:
   - Nome: `bi`
   - Valor: `cname.vercel-dns.com`
3. Na Vercel → Settings → Domains → Adicionar `bi.bvgarantia.com.br`

---

## Snapshot (Foto do banco)
O sistema usa SQLite local como cache para performance máxima.
Para atualizar os dados:
1. Acesse **Configurações → Snapshot**
2. Clique em **"Tirar Foto Agora"**
3. Aguarde a conclusão (normalmente < 30s)

Recomenda-se fazer o snapshot diariamente pela manhã.

---

## Usuários
| Email | Senha | Perfil |
|-------|-------|--------|
| admin@bvgarantia.com.br | 123456 | ADMIN |

**Segurança**: Altere a senha padrão após o primeiro login em Configurações → Alterar Senha.

---

## Logout automático
O sistema desconecta automaticamente após **10 minutos de inatividade**.
