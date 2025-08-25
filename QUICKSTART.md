# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Option 1: Using Docker (Recommended)

1. **Clone and start the platform**
   ```bash
   git clone <your-repo-url>
   cd trustml-platform
   docker-compose up -d
   ```

2. **Access the application**
   - Frontend: http://localhost:8081
   - Backend API: http://localhost:8000

### Option 2: Local Development

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

Run the comprehensive test suite:
```bash
./scripts/run-all-tests.sh
```

## 🐳 Docker Commands

### Build for Production (AMD64)
```bash
# Frontend
docker build --platform linux/amd64 -t trustml-frontend:latest -f frontend/Dockerfile ./frontend

# Backend
docker build --platform linux/amd64 -t trustml-backend:latest -f backend/Dockerfile ./backend
```

### Development
```bash
docker-compose build
docker-compose up -d
```

## 📚 What's Included

- ✅ **AI-Powered Fraud Detection Platform**
- ✅ **Responsive React Frontend**
- ✅ **Flask Backend API**
- ✅ **MongoDB Database**
- ✅ **Comprehensive Test Suite**
- ✅ **Docker Containerization**
- ✅ **Resource Management System**
- ✅ **Professional Documentation**

## 🎯 Next Steps

1. Customize the platform for your specific use case
2. Add your own AI models and algorithms
3. Configure authentication and authorization
4. Set up monitoring and logging
5. Deploy to your preferred cloud platform

---

**Need help?** Check out the full [README.md](README.md) for detailed documentation.
