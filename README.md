# TrustML Platform

A comprehensive platform for AI-powered fraud detection and trust management solutions.

## 🚀 Features

- **AI-Powered Fraud Detection**: Advanced machine learning models for real-time fraud detection
- **Trust & Safety Management**: Comprehensive tools for marketplace trust and safety
- **Real-time Analytics**: Live monitoring and analytics dashboard
- **Resource Management**: Centralized resource library with case studies, guides, and whitepapers
- **Responsive Design**: Mobile-first, responsive web application
- **Docker Support**: Full containerization with Docker and Docker Compose

## 🏗️ Architecture

- **Frontend**: React.js with Tailwind CSS and shadcn/ui components
- **Backend**: Python Flask API with MongoDB
- **Database**: MongoDB for data persistence
- **Containerization**: Docker with multi-stage builds
- **Testing**: Comprehensive test suite with Jest, Playwright, and pytest

## 📁 Project Structure

```
trustml-platform/
├── frontend/          # React.js frontend application
├── backend/           # Python Flask API
├── docs/             # Documentation and guides
├── scripts/          # Utility scripts
├── docker-compose.yml # Main Docker Compose configuration
└── docker-compose.test.yml # Test environment configuration
```

## 🛠️ Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)
- Python 3.8+ (for local development)

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trustml-platform
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:8081
   - Backend API: http://localhost:8000
   - MongoDB: localhost:27017

### Local Development

1. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   python server.py
   ```

## 🧪 Testing

### Run All Tests
```bash
./scripts/run-all-tests.sh
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
pytest
```

### Docker Tests
```bash
docker-compose -f docker-compose.test.yml up --build
```

## 🐳 Docker Commands

### Build for AMD64 Architecture
```bash
# Frontend
docker build --platform linux/amd64 -t trustml-frontend:latest -f frontend/Dockerfile ./frontend

# Backend
docker build --platform linux/amd64 -t trustml-backend:latest -f backend/Dockerfile ./backend
```

### Development Build
```bash
docker-compose build
docker-compose up -d
```

## 📚 Resources

The platform includes a comprehensive resource library:

- **Case Studies**: Real-world implementation examples
- **Guides**: Step-by-step implementation guides
- **Whitepapers**: Research and technical documentation
- **Presentations**: Educational materials and presentations

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB
MONGO_URL=mongodb://localhost:27017
DB_NAME=trustml

# CORS
CORS_ORIGINS=*

# Frontend
REACT_APP_API_URL=http://localhost:8000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.

---

**TrustML Platform** - Building trust in the digital age through AI-powered solutions.
# trustml-platform
