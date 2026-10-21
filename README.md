# JV SaaS Dashboard

Dashboard SaaS com cadastro, login com JWT, rota protegida, métricas, gráficos e lista de clientes.

**Stack:** React + TypeScript + Vite (front-end) · Node.js + Express + TypeScript (API) · MongoDB + Mongoose · JWT · bcrypt

## Deploy

| Parte | Onde | URL |
| --- | --- | --- |
| Front-end | Vercel | _adicione aqui a URL da Vercel_ |
| API | Render | https://saas-backend-q4qp.onrender.com |

## Estrutura

```
Frontend/                 React + TypeScript (Vite)
  src/
    types/api.ts          tipos das respostas da API
    api.ts                cliente HTTP tipado
    components/           ProtectedRoute, gráficos, listas
    pages/                Login, Dashboard
    sections/             abas do dashboard
  vercel.json             rewrite de SPA (evita 404 em /dashboard)

saas-app/backend/         API Node.js + Express + TypeScript
  src/
    config/env.ts         valida as variáveis de ambiente
    models/User.ts        model do Mongoose tipado (Schema<IUser>)
    middleware/auth.ts    verifica o JWT e preenche req.user
    routes/               /register, /login, /dashboard, /customers
    types/                IUser, AuthPayload, tipos de resposta,
                          extensão do Request do Express
```

## Como rodar localmente

Requisitos: Node.js 20+ e uma URI do MongoDB (Atlas ou local).

### API

```bash
cd saas-app/backend
cp .env.example .env      # preencha MONGO_URI e JWT_SECRET
npm install
npm run dev               # http://localhost:3000, recarrega ao salvar
```

Outros scripts:

- `npm run build`: compila o TypeScript para `dist/`
- `npm start`: roda a versão compilada (`node dist/server.js`)
- `npm run typecheck`: só checa os tipos

### Front-end

```bash
cd Frontend
npm install
npm run dev               # http://localhost:5173
```

Por padrão o front usa a API do Render. Para usar a API local, crie `Frontend/.env.local`:

```
VITE_API_URL=http://localhost:3000
```

## Rotas da API

| Método | Rota | Auth | Resposta |
| --- | --- | --- | --- |
| GET | `/` | não | `{ message }` |
| POST | `/register` | não | `{ message }` (201) |
| POST | `/login` | não | `{ token }` |
| GET | `/dashboard` | JWT | `{ message, data: { name, value }[] }` |
| GET | `/customers` | JWT | `{ _id, email, createdAt, updatedAt }[]` |

As rotas com JWT esperam o token no header `Authorization`.

## Configuração de deploy

**Render (API):** Root Directory `saas-app/backend`

- Build Command: `npm install --include=dev && npm run build`
- Start Command: `npm start`
- Variáveis de ambiente: `MONGO_URI` e `JWT_SECRET`

O `--include=dev` é necessário porque o `typescript` e os `@types` são devDependencies e precisam estar instalados durante o build.

**Vercel (front-end):** Root Directory `Frontend`, Framework Preset **Vite**. O build command (`npm run build`) e o output directory (`dist`) são detectados automaticamente.
