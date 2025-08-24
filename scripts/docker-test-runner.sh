#!/bin/bash

# Docker-based Responsive Design Test Runner
# Runs all responsive design tests in isolated Docker containers

set -e

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

# Cleanup function
cleanup() {
    print_status "Cleaning up Docker containers..."
    docker-compose -f docker-compose.test.yml down --volumes --remove-orphans 2>/dev/null || true
}

# Set trap for cleanup on exit
trap cleanup EXIT

echo "🐳 Docker-based Responsive Design Testing"
echo "=========================================="

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose >/dev/null 2>&1; then
    print_error "docker-compose is not installed. Please install docker-compose and try again."
    exit 1
fi

# Create test results directory
mkdir -p test-results

print_status "Building Docker test environment..."
docker-compose -f docker-compose.test.yml build --no-cache

print_status "Running unit tests for responsive design utilities..."
docker-compose -f docker-compose.test.yml run --rm responsive-tests

if [ $? -eq 0 ]; then
    print_success "Unit tests passed!"
else
    print_error "Unit tests failed!"
    exit 1
fi

print_status "Running performance tests..."
docker-compose -f docker-compose.test.yml run --rm performance-tests

if [ $? -eq 0 ]; then
    print_success "Performance tests passed!"
else
    print_error "Performance tests failed!"
    exit 1
fi

print_status "Running E2E responsive design tests..."
docker-compose -f docker-compose.test.yml run --rm e2e-tests

if [ $? -eq 0 ]; then
    print_success "E2E tests passed!"
else
    print_error "E2E tests failed!"
    exit 1
fi

print_status "Running comprehensive test suite..."
docker-compose -f docker-compose.test.yml run --rm test-runner

if [ $? -eq 0 ]; then
    print_success "All tests passed!"
else
    print_error "Some tests failed!"
    exit 1
fi

# Generate test summary
print_status "Generating test summary..."

echo ""
echo "📊 Docker Test Results Summary"
echo "=============================="

# Check for test result files
if [ -f "test-results/performance-results.json" ]; then
    PERF_TESTS=$(grep -o '"numPassedTests":[0-9]*' test-results/performance-results.json | cut -d':' -f2)
    print_success "Performance Tests: $PERF_TESTS passed"
fi

if [ -f "test-results/responsive-chrome.json" ]; then
    CHROME_TESTS=$(grep -o '"status":"passed"' test-results/responsive-chrome.json | wc -l)
    print_success "Chrome E2E Tests: $CHROME_TESTS passed"
fi

if [ -f "test-results/responsive-firefox.json" ]; then
    FIREFOX_TESTS=$(grep -o '"status":"passed"' test-results/responsive-firefox.json | wc -l)
    print_success "Firefox E2E Tests: $FIREFOX_TESTS passed"
fi

if [ -f "test-results/responsive-webkit.json" ]; then
    WEBKIT_TESTS=$(grep -o '"status":"passed"' test-results/responsive-webkit.json | wc -l)
    print_success "Safari E2E Tests: $WEBKIT_TESTS passed"
fi

# List all test result files
print_status "Test artifacts generated:"
find test-results -name "*.json" -o -name "*.xml" -o -name "*.html" | while read file; do
    echo "  - $file"
done

echo ""
print_success "Docker-based testing complete!"
echo ""
echo "Next steps:"
echo "1. Review test results in the test-results/ directory"
echo "2. Check any failed tests for issues"
echo "3. View screenshots/videos for visual verification"
echo "4. Run individual test suites if needed:"
echo "   docker-compose -f docker-compose.test.yml run --rm responsive-tests"
echo "   docker-compose -f docker-compose.test.yml run --rm performance-tests"
echo "   docker-compose -f docker-compose.test.yml run --rm e2e-tests"
echo ""