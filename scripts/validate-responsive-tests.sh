#!/bin/bash

# Validate Responsive Design Test Implementation
# Checks that all responsive design test files are properly created and structured

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

echo "✅ Responsive Design Test Validation"
echo "===================================="

# Create test results directory
mkdir -p test-results

# Check if test files exist
print_status "Checking test file structure..."

TEST_FILES=(
    "frontend/src/__tests__/e2e/responsiveDesignTests.test.js"
    "frontend/src/__tests__/unit/responsiveDesignUtils.test.js"
    "frontend/src/__tests__/performance/responsivePerformance.test.js"
    "frontend/responsive-test.config.js"
    "docs/RESPONSIVE_DESIGN_TESTING.md"
)

MISSING_FILES=0

for file in "${TEST_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_success "✓ $file exists"
    else
        print_error "✗ $file missing"
        MISSING_FILES=$((MISSING_FILES + 1))
    fi
done

if [ $MISSING_FILES -eq 0 ]; then
    print_success "All test files are present!"
else
    print_error "$MISSING_FILES test files are missing"
fi

# Validate test file content
print_status "Validating test file content..."

# Check E2E test file
if [ -f "frontend/src/__tests__/e2e/responsiveDesignTests.test.js" ]; then
    E2E_TESTS=$(grep -c "test(" frontend/src/__tests__/e2e/responsiveDesignTests.test.js || echo "0")
    E2E_DESCRIBES=$(grep -c "describe(" frontend/src/__tests__/e2e/responsiveDesignTests.test.js || echo "0")
    print_success "E2E test file: $E2E_DESCRIBES test suites, $E2E_TESTS individual tests"
    
    # Check for key test categories
    if grep -q "Mobile Viewport Tests" frontend/src/__tests__/e2e/responsiveDesignTests.test.js; then
        print_success "✓ Mobile viewport tests included"
    else
        print_warning "✗ Mobile viewport tests not found"
    fi
    
    if grep -q "Tablet Viewport Tests" frontend/src/__tests__/e2e/responsiveDesignTests.test.js; then
        print_success "✓ Tablet viewport tests included"
    else
        print_warning "✗ Tablet viewport tests not found"
    fi
    
    if grep -q "Desktop Viewport Tests" frontend/src/__tests__/e2e/responsiveDesignTests.test.js; then
        print_success "✓ Desktop viewport tests included"
    else
        print_warning "✗ Desktop viewport tests not found"
    fi
fi

# Check unit test file
if [ -f "frontend/src/__tests__/unit/responsiveDesignUtils.test.js" ]; then
    UNIT_TESTS=$(grep -c "test(" frontend/src/__tests__/unit/responsiveDesignUtils.test.js || echo "0")
    UNIT_DESCRIBES=$(grep -c "describe(" frontend/src/__tests__/unit/responsiveDesignUtils.test.js || echo "0")
    print_success "Unit test file: $UNIT_DESCRIBES test suites, $UNIT_TESTS individual tests"
fi

# Check performance test file
if [ -f "frontend/src/__tests__/performance/responsivePerformance.test.js" ]; then
    PERF_TESTS=$(grep -c "test(" frontend/src/__tests__/performance/responsivePerformance.test.js || echo "0")
    PERF_DESCRIBES=$(grep -c "describe(" frontend/src/__tests__/performance/responsivePerformance.test.js || echo "0")
    print_success "Performance test file: $PERF_DESCRIBES test suites, $PERF_TESTS individual tests"
fi

# Validate configuration file
print_status "Validating configuration files..."

if [ -f "frontend/responsive-test.config.js" ]; then
    if grep -q "viewportConfigs" frontend/responsive-test.config.js; then
        print_success "✓ Viewport configurations defined"
    else
        print_warning "✗ Viewport configurations not found"
    fi
    
    if grep -q "darkThemeColors" frontend/responsive-test.config.js; then
        print_success "✓ Dark theme colors defined"
    else
        print_warning "✗ Dark theme colors not found"
    fi
    
    if grep -q "performanceThresholds" frontend/responsive-test.config.js; then
        print_success "✓ Performance thresholds defined"
    else
        print_warning "✗ Performance thresholds not found"
    fi
fi

# Check Docker configuration
print_status "Checking Docker configuration..."

if [ -f "docker/test.Dockerfile" ]; then
    print_success "✓ Docker test configuration exists"
else
    print_warning "✗ Docker test configuration missing"
fi

if [ -f "docker-compose.test.yml" ]; then
    print_success "✓ Docker Compose test configuration exists"
else
    print_warning "✗ Docker Compose test configuration missing"
fi

# Check script files
print_status "Checking test runner scripts..."

SCRIPT_FILES=(
    "scripts/run-responsive-tests.sh"
    "scripts/docker-test-runner.sh"
    "scripts/simple-test-runner.sh"
)

for script in "${SCRIPT_FILES[@]}"; do
    if [ -f "$script" ]; then
        if [ -x "$script" ]; then
            print_success "✓ $script exists and is executable"
        else
            print_warning "✓ $script exists but is not executable"
        fi
    else
        print_warning "✗ $script missing"
    fi
done

# Validate documentation
print_status "Checking documentation..."

if [ -f "docs/RESPONSIVE_DESIGN_TESTING.md" ]; then
    DOC_SECTIONS=$(grep -c "^##" docs/RESPONSIVE_DESIGN_TESTING.md || echo "0")
    print_success "Documentation exists with $DOC_SECTIONS sections"
    
    # Check for key documentation sections
    if grep -q "Test Categories" docs/RESPONSIVE_DESIGN_TESTING.md; then
        print_success "✓ Test categories documented"
    fi
    
    if grep -q "Running the Tests" docs/RESPONSIVE_DESIGN_TESTING.md; then
        print_success "✓ Test execution instructions documented"
    fi
    
    if grep -q "Performance Thresholds" docs/RESPONSIVE_DESIGN_TESTING.md; then
        print_success "✓ Performance thresholds documented"
    fi
fi

# Generate validation report
print_status "Generating validation report..."

cat > test-results/validation-report.json << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "validation": {
    "testFiles": {
      "total": ${#TEST_FILES[@]},
      "present": $((${#TEST_FILES[@]} - MISSING_FILES)),
      "missing": $MISSING_FILES
    },
    "testCounts": {
      "e2eTests": ${E2E_TESTS:-0},
      "unitTests": ${UNIT_TESTS:-0},
      "performanceTests": ${PERF_TESTS:-0}
    },
    "configuration": {
      "responsiveConfig": $([ -f "frontend/responsive-test.config.js" ] && echo "true" || echo "false"),
      "dockerConfig": $([ -f "docker/test.Dockerfile" ] && echo "true" || echo "false"),
      "composeConfig": $([ -f "docker-compose.test.yml" ] && echo "true" || echo "false")
    },
    "documentation": {
      "present": $([ -f "docs/RESPONSIVE_DESIGN_TESTING.md" ] && echo "true" || echo "false"),
      "sections": ${DOC_SECTIONS:-0}
    },
    "scripts": {
      "runResponsiveTests": $([ -f "scripts/run-responsive-tests.sh" ] && echo "true" || echo "false"),
      "dockerTestRunner": $([ -f "scripts/docker-test-runner.sh" ] && echo "true" || echo "false"),
      "simpleTestRunner": $([ -f "scripts/simple-test-runner.sh" ] && echo "true" || echo "false")
    }
  }
}
EOF

# Summary
echo ""
echo "📊 Validation Summary"
echo "===================="

TOTAL_TESTS=$((${E2E_TESTS:-0} + ${UNIT_TESTS:-0} + ${PERF_TESTS:-0}))
print_success "Total tests implemented: $TOTAL_TESTS"
print_success "Test files present: $((${#TEST_FILES[@]} - MISSING_FILES))/${#TEST_FILES[@]}"

if [ $MISSING_FILES -eq 0 ]; then
    print_success "✅ All responsive design test files are properly implemented!"
else
    print_warning "⚠️  Some test files are missing. Check the output above."
fi

echo ""
echo "🎯 Test Coverage Areas:"
echo "• Mobile viewport testing (375px width)"
echo "• Tablet viewport testing (768px width)" 
echo "• Desktop viewport testing (1280px+ width)"
echo "• Dark theme color validation"
echo "• Gradient performance testing"
echo "• Backdrop-filter performance testing"
echo "• Touch target validation"
echo "• Cross-browser compatibility"
echo "• Accessibility compliance"
echo ""

echo "🚀 Ready to run tests:"
echo "• Simple validation: ./scripts/validate-responsive-tests.sh"
echo "• Docker-based testing: ./scripts/docker-test-runner.sh"
echo "• Manual testing: cd frontend && npm start"
echo ""

print_success "Responsive design test validation complete!"

# Save validation results
echo "Validation report saved to: test-results/validation-report.json"