#!/bin/bash

# Comprehensive Test Runner Script
# Runs all tests for the TrustML Studio project

set -e

echo "🧪 Starting comprehensive test suite for TrustML Studio"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -f "frontend/package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Initialize test results
FRONTEND_UNIT_TESTS=0
FRONTEND_INTEGRATION_TESTS=0
FRONTEND_E2E_TESTS=0
FRONTEND_PERFORMANCE_TESTS=0
BACKEND_TESTS=0

# Frontend Tests
if [ -d "frontend" ]; then
    print_status "Running frontend tests..."
    cd frontend
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    # Unit Tests
    print_status "Running frontend unit tests..."
    if npm run test -- --coverage --watchAll=false --testPathIgnorePatterns="integration|e2e|performance"; then
        print_success "Frontend unit tests passed"
        FRONTEND_UNIT_TESTS=1
    else
        print_error "Frontend unit tests failed"
    fi
    
    # Integration Tests
    print_status "Running frontend integration tests..."
    if npm run test -- --testPathPattern="integration" --watchAll=false; then
        print_success "Frontend integration tests passed"
        FRONTEND_INTEGRATION_TESTS=1
    else
        print_error "Frontend integration tests failed"
    fi
    
    # Performance Tests
    print_status "Running frontend performance tests..."
    if npm run test:performance; then
        print_success "Frontend performance tests passed"
        FRONTEND_PERFORMANCE_TESTS=1
    else
        print_warning "Frontend performance tests failed or skipped"
    fi
    
    # E2E Tests (only if server is running or can be started)
    print_status "Checking if development server is available..."
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_status "Development server is running, executing E2E tests..."
        if npm run test:e2e; then
            print_success "Frontend E2E tests passed"
            FRONTEND_E2E_TESTS=1
        else
            print_error "Frontend E2E tests failed"
        fi
    else
        print_warning "Development server not available, skipping E2E tests"
        print_warning "To run E2E tests, start the dev server with 'npm start' in another terminal"
    fi
    
    cd ..
else
    print_warning "Frontend directory not found, skipping frontend tests"
fi

# Backend Tests
if [ -d "backend" ]; then
    print_status "Running backend tests..."
    cd backend
    
    # Check if virtual environment exists
    if [ ! -d "venv" ] && [ ! -d ".venv" ]; then
        print_warning "No virtual environment found. Creating one..."
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
    else
        # Activate existing virtual environment
        if [ -d "venv" ]; then
            source venv/bin/activate
        elif [ -d ".venv" ]; then
            source .venv/bin/activate
        fi
    fi
    
    # Install dependencies
    print_status "Installing/updating backend dependencies..."
    pip install -r requirements.txt
    
    # Run backend tests
    print_status "Running backend API tests..."
    if python -m pytest tests/ -v --tb=short; then
        print_success "Backend tests passed"
        BACKEND_TESTS=1
    else
        print_error "Backend tests failed"
    fi
    
    cd ..
else
    print_warning "Backend directory not found, skipping backend tests"
fi

# Test Results Summary
echo ""
echo "=================================================="
echo "🏁 Test Results Summary"
echo "=================================================="

if [ $FRONTEND_UNIT_TESTS -eq 1 ]; then
    print_success "✅ Frontend Unit Tests"
else
    print_error "❌ Frontend Unit Tests"
fi

if [ $FRONTEND_INTEGRATION_TESTS -eq 1 ]; then
    print_success "✅ Frontend Integration Tests"
else
    print_error "❌ Frontend Integration Tests"
fi

if [ $FRONTEND_PERFORMANCE_TESTS -eq 1 ]; then
    print_success "✅ Frontend Performance Tests"
else
    print_warning "⚠️  Frontend Performance Tests"
fi

if [ $FRONTEND_E2E_TESTS -eq 1 ]; then
    print_success "✅ Frontend E2E Tests"
else
    print_warning "⚠️  Frontend E2E Tests (may require dev server)"
fi

if [ $BACKEND_TESTS -eq 1 ]; then
    print_success "✅ Backend API Tests"
else
    print_error "❌ Backend API Tests"
fi

# Calculate overall success
TOTAL_CRITICAL_TESTS=$((FRONTEND_UNIT_TESTS + FRONTEND_INTEGRATION_TESTS + BACKEND_TESTS))
TOTAL_TESTS=$((FRONTEND_UNIT_TESTS + FRONTEND_INTEGRATION_TESTS + FRONTEND_PERFORMANCE_TESTS + FRONTEND_E2E_TESTS + BACKEND_TESTS))

echo ""
echo "Critical Tests Passed: $TOTAL_CRITICAL_TESTS/3"
echo "Total Tests Passed: $TOTAL_TESTS/5"

if [ $TOTAL_CRITICAL_TESTS -eq 3 ]; then
    print_success "🎉 All critical tests passed! The application is ready for deployment."
    exit 0
else
    print_error "💥 Some critical tests failed. Please fix the issues before deployment."
    exit 1
fi