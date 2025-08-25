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
└── docker-compose.test.yml # Test environment configuration
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
