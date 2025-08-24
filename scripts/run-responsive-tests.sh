#!/bin/bash

# Responsive Design Test Runner
# Runs all responsive design tests for dark theme implementation

set -e

echo "🧪 Running Responsive Design Tests for Dark Theme"
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

# Change to frontend directory
cd frontend

print_status "Checking if frontend dependencies are installed..."
if [ ! -d "node_modules" ]; then
    print_warning "Node modules not found. Installing dependencies..."
    npm install
fi

print_status "Running unit tests for responsive design utilities..."
npm test -- --testPathPattern="responsiveDesignUtils" --verbose --coverage=false

print_status "Running performance tests for responsive features..."
npm run test:performance -- --testPathPattern="responsivePerformance" --verbose

print_status "Starting development server for E2E tests..."
# Start the development server in the background
npm start &
SERVER_PID=$!

# Function to cleanup server on exit
cleanup() {
    print_status "Cleaning up development server..."
    kill $SERVER_PID 2>/dev/null || true
    wait $SERVER_PID 2>/dev/null || true
}
trap cleanup EXIT

# Wait for server to start
print_status "Waiting for development server to start..."
sleep 10

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    print_error "Development server failed to start"
    exit 1
fi

print_success "Development server is running"

print_status "Running E2E responsive design tests..."
npm run test:e2e -- responsiveDesignTests.test.js --reporter=list

print_status "Running cross-browser responsive tests..."
npm run test:e2e -- responsiveDesignTests.test.js --project=chromium --reporter=json > test-results/responsive-chrome.json
npm run test:e2e -- responsiveDesignTests.test.js --project=firefox --reporter=json > test-results/responsive-firefox.json
npm run test:e2e -- responsiveDesignTests.test.js --project=webkit --reporter=json > test-results/responsive-webkit.json

print_status "Running mobile-specific tests..."
npm run test:e2e -- responsiveDesignTests.test.js --project="Mobile Chrome" --reporter=json > test-results/responsive-mobile-chrome.json
npm run test:e2e -- responsiveDesignTests.test.js --project="Mobile Safari" --reporter=json > test-results/responsive-mobile-safari.json

print_success "All responsive design tests completed!"

# Generate test summary
print_status "Generating test summary..."

echo ""
echo "📊 Test Results Summary"
echo "======================"

# Count test results
if [ -f "test-results/responsive-chrome.json" ]; then
    CHROME_TESTS=$(grep -o '"status":"passed"' test-results/responsive-chrome.json | wc -l)
    print_success "Chrome Desktop: $CHROME_TESTS tests passed"
fi

if [ -f "test-results/responsive-firefox.json" ]; then
    FIREFOX_TESTS=$(grep -o '"status":"passed"' test-results/responsive-firefox.json | wc -l)
    print_success "Firefox Desktop: $FIREFOX_TESTS tests passed"
fi

if [ -f "test-results/responsive-webkit.json" ]; then
    WEBKIT_TESTS=$(grep -o '"status":"passed"' test-results/responsive-webkit.json | wc -l)
    print_success "Safari Desktop: $WEBKIT_TESTS tests passed"
fi

if [ -f "test-results/responsive-mobile-chrome.json" ]; then
    MOBILE_CHROME_TESTS=$(grep -o '"status":"passed"' test-results/responsive-mobile-chrome.json | wc -l)
    print_success "Mobile Chrome: $MOBILE_CHROME_TESTS tests passed"
fi

if [ -f "test-results/responsive-mobile-safari.json" ]; then
    MOBILE_SAFARI_TESTS=$(grep -o '"status":"passed"' test-results/responsive-mobile-safari.json | wc -l)
    print_success "Mobile Safari: $MOBILE_SAFARI_TESTS tests passed"
fi

echo ""
print_status "Test artifacts saved in test-results/ directory"
print_status "Screenshots and videos available for failed tests"

echo ""
echo "🎉 Responsive Design Testing Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Review any failed tests in the test-results/ directory"
echo "2. Check screenshots/videos for visual regressions"
echo "3. Verify performance metrics meet requirements"
echo "4. Test on real devices for final validation"
echo ""