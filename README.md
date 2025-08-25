# TrustML Platform

A modern, responsive React web application for TrustML Studio with static resources and client-side integrations.

## 🚀 Features

- **Responsive Web App**: Mobile-first, fast, and accessible
- **Resources Library**: Downloadable whitepapers and materials
- **Scheduling**: Calendly integration
- **Contact**: Web3Forms submission (no backend required)
- **Analytics**: PostHog (client-only)
- **Docker Support**: Build and run with Docker

## 🏗️ Architecture

- **Frontend**: React + Tailwind + shadcn/ui
- **No Backend Required**: Decoupled; all features run client-side
- **Containerization**: Nginx serves the production build
- **Testing**: Jest + Playwright

## 📁 Project Structure

```
trustml-platform/
├── frontend/          # React web app
├── docs/              # Documentation and guides
├── scripts/           # Utility scripts
├── docker-compose.dev.yml # Frontend-only compose for local run
└── scripts/              # Local test scripts (no Docker tests)
```

## 🛠️ Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (optional for local dev without Docker)

### Using Docker (Recommended)

```bash
git clone <repository-url>
cd trustml-platform
# Build and run frontend only (nginx serving build)
docker-compose -f docker-compose.dev.yml up --build -d
# App: http://localhost:3001
```

### Local Development (without Docker)

```bash
cd frontend
npm install
npm start
# App: http://localhost:3000
```

## 🧪 Testing

```bash
./scripts/run-all-tests.sh
# or
cd frontend && npm test
```

## 📚 Resources

Static resources live under `frontend/public/resources` and are deployed with the site.

## 🔧 Configuration

- PostHog snippet is included in `frontend/public/index.html`.
- Contact form uses Web3Forms; set `REACT_APP_WEB3FORMS_ACCESS_KEY` if needed.

## 🐳 Docker Commands

```bash
# Build frontend image
docker build -t trustml-frontend:latest -f frontend/Dockerfile ./frontend

# Run via compose
docker-compose -f docker-compose.dev.yml up -d
```

## 📄 License

MIT

## Deployment (Netlify)

Use Git-based deploys with the included `netlify.toml`.

1) Connect repository
- Create or open your Netlify site for `trustml-platform` and link the GitHub repo.
- Set Production branch to `production` (recommended). Pushes to `production` deploy to https://trustml.studio.

2) Build settings (auto from netlify.toml)
- Base: `frontend`
- Build command: `npm run build`
- Publish: `build`

3) Environment variables
- Add `REACT_APP_WEB3FORMS_ACCESS_KEY` (Builds; context All) with your Web3Forms key.
- Remove any legacy `REACT_APP_BACKEND_URL` values.

4) Deploy
- Push to `production` to deploy. Netlify will build and publish automatically.
- Optional: enable Deploy Previews and Branch Deploys to test PRs/branches.

5) (Optional) Manage via Netlify MCP Server
- You can manage env vars and trigger deploys from your editor using Netlify MCP Server. See docs: https://docs.netlify.com/build/build-with-ai/netlify-mcp-server/

## Docker (local)

Serve the production build locally with Nginx.

Start (build and run):

```bash
docker-compose -f docker-compose.dev.yml up --build -d
# App: http://localhost:3001
```

Rebuild after changes:

```bash
docker-compose -f docker-compose.dev.yml up --build -d
```

Stop:

```bash
docker-compose -f docker-compose.dev.yml down
```

Logs:

```bash
docker logs -f trustml-main-frontend-1
```

## Troubleshooting

- If the container restarts with an Nginx error about `upstream "backend"`, ensure `frontend/nginx.conf` does not proxy `/api` and only serves static files.
- CRA environment variables must start with `REACT_APP_` and are baked at build time. Ensure `REACT_APP_WEB3FORMS_ACCESS_KEY` is set in Netlify before building.

