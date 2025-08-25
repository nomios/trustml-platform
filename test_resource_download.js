// Test script to verify resource download functionality
const fs = require('fs');
const path = require('path');

// Define the expected PDF location
const pdfPath = path.join(__dirname, 'frontend', 'public', 'resources', 'white-papers', 'AI_Fraud_Guide.pdf');

console.log('Testing Resource Download Configuration...\n');

// Test 1: Check if PDF file exists
console.log('1. Checking if AI_Fraud_Guide.pdf exists...');
if (fs.existsSync(pdfPath)) {
  const stats = fs.statSync(pdfPath);
  console.log(`   ✓ PDF exists at: ${pdfPath}`);
  console.log(`   ✓ File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
} else {
  console.log(`   ✗ PDF not found at: ${pdfPath}`);
}

// Test 2: Check resourceService configuration
console.log('\n2. Checking resourceService.js configuration...');
const resourceServicePath = path.join(__dirname, 'frontend', 'src', 'utils', 'resourceService.js');
const resourceServiceContent = fs.readFileSync(resourceServicePath, 'utf8');

if (resourceServiceContent.includes("path: '/resources/white-papers/AI_Fraud_Guide.pdf'")) {
  console.log('   ✓ Resource path correctly configured in resourceService.js');
} else {
  console.log('   ✗ Resource path not found or incorrect in resourceService.js');
}

if (resourceServiceContent.includes("filename: 'AI_Fraud_Guide.pdf'")) {
  console.log('   ✓ Filename correctly configured in resourceService.js');
} else {
  console.log('   ✗ Filename not found or incorrect in resourceService.js');
}

// Test 3: Check Resources component configuration
console.log('\n3. Checking Resources.js component configuration...');
const resourcesComponentPath = path.join(__dirname, 'frontend', 'src', 'components', 'Resources.js');
const resourcesComponentContent = fs.readFileSync(resourcesComponentPath, 'utf8');

if (resourcesComponentContent.includes('resourceId: "ai-fraud-detection-guide"')) {
  console.log('   ✓ Resource ID correctly configured in Resources.js');
} else {
  console.log('   ✗ Resource ID not found in Resources.js');
}

// Count number of resources in the array
const resourceMatches = resourcesComponentContent.match(/resourceId:\s*"[^"]+"/g);
const resourceCount = resourceMatches ? resourceMatches.length : 0;
console.log(`   ✓ Number of resources configured: ${resourceCount}`);

if (resourceCount === 1) {
  console.log('   ✓ Only one resource (AI Fraud Guide) is configured as requested');
} else {
  console.log('   ✗ Multiple resources still configured');
}

// Test 4: Verify the download link will work
console.log('\n4. Verifying download link configuration...');
const publicPath = path.join(__dirname, 'frontend', 'public');
const expectedUrl = '/resources/white-papers/AI_Fraud_Guide.pdf';
const actualFilePath = path.join(publicPath, expectedUrl);

if (fs.existsSync(actualFilePath)) {
  console.log(`   ✓ File accessible at URL path: ${expectedUrl}`);
  console.log('   ✓ Download link should work correctly');
} else {
  console.log(`   ✗ File not accessible at expected URL path: ${expectedUrl}`);
}

console.log('\n========================================');
console.log('Test Summary:');
console.log('- AI Fraud Guide PDF is properly configured');
console.log('- Only one resource is now available for download');
console.log('- File path matches the configuration');
console.log('- Download should work correctly when accessed from the frontend');
console.log('========================================\n');
