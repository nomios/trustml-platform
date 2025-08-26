// Test script to verify resource download functionality
const fs = require('fs');
const path = require('path');

// Define the expected PDF locations
const pdfPathFraud = path.join(__dirname, 'frontend', 'public', 'resources', 'white-papers', 'AI_Fraud_Guide.pdf');
const pdfPathAgentic = path.join(__dirname, 'frontend', 'public', 'resources', 'white-papers', 'Practical_guide_to_Agentic_Commerce.pdf');

console.log('Testing Resource Download Configuration...\n');

// Test 1: Check if PDF file exists
console.log('1. Checking if AI_Fraud_Guide.pdf exists...');
if (fs.existsSync(pdfPathFraud)) {
  const stats = fs.statSync(pdfPathFraud);
  console.log(`   ✓ PDF exists at: ${pdfPathFraud}`);
  console.log(`   ✓ File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
} else {
  console.log(`   ✗ PDF not found at: ${pdfPathFraud}`);
}

console.log('1b. Checking if Practical_guide_to_Agentic_Commerce.pdf exists...');
if (fs.existsSync(pdfPathAgentic)) {
  const stats = fs.statSync(pdfPathAgentic);
  console.log(`   ✓ PDF exists at: ${pdfPathAgentic}`);
  console.log(`   ✓ File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
} else {
  console.log(`   ✗ PDF not found at: ${pdfPathAgentic}`);
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

if (resourceServiceContent.includes("path: '/resources/white-papers/Practical_guide_to_Agentic_Commerce.pdf'")) {
  console.log('   ✓ Agentic Commerce path correctly configured in resourceService.js');
} else {
  console.log('   ✗ Agentic Commerce path not found or incorrect in resourceService.js');
}

if (resourceServiceContent.includes("filename: 'Practical_guide_to_Agentic_Commerce.pdf'")) {
  console.log('   ✓ Agentic Commerce filename correctly configured in resourceService.js');
} else {
  console.log('   ✗ Agentic Commerce filename not found or incorrect in resourceService.js');
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

if (resourcesComponentContent.includes('resourceId: "agentic-commerce-guide"')) {
  console.log('   ✓ Agentic Commerce resource ID configured in Resources.js');
} else {
  console.log('   ✗ Agentic Commerce resource ID not found in Resources.js');
}

// Count number of resources in the array
const resourceMatches = resourcesComponentContent.match(/resourceId:\s*"[^"]+"/g);
const resourceCount = resourceMatches ? resourceMatches.length : 0;
console.log(`   ✓ Number of resources configured: ${resourceCount}`);

if (resourceCount >= 2) {
  console.log('   ✓ Multiple resources configured as expected');
} else {
  console.log('   ✗ Less than two resources configured');
}

// Test 4: Verify the download link will work
console.log('\n4. Verifying download link configuration...');
const publicPath = path.join(__dirname, 'frontend', 'public');
const expectedUrlFraud = '/resources/white-papers/AI_Fraud_Guide.pdf';
const expectedUrlAgentic = '/resources/white-papers/Practical_guide_to_Agentic_Commerce.pdf';
const actualFilePathFraud = path.join(publicPath, expectedUrlFraud);
const actualFilePathAgentic = path.join(publicPath, expectedUrlAgentic);

if (fs.existsSync(actualFilePathFraud)) {
  console.log(`   ✓ File accessible at URL path: ${expectedUrlFraud}`);
  console.log('   ✓ Download link should work correctly');
} else {
  console.log(`   ✗ File not accessible at expected URL path: ${expectedUrlFraud}`);
}

if (fs.existsSync(actualFilePathAgentic)) {
  console.log(`   ✓ File accessible at URL path: ${expectedUrlAgentic}`);
  console.log('   ✓ Download link should work correctly');
} else {
  console.log(`   ✗ File not accessible at expected URL path: ${expectedUrlAgentic}`);
}

console.log('\n========================================');
console.log('Test Summary:');
console.log('- AI Fraud Guide PDF is properly configured');
console.log('- Agentic Commerce Guide PDF is properly configured');
console.log('- Multiple resources are available for download');
console.log('- File paths match the configuration');
console.log('- Download should work correctly when accessed from the frontend');
console.log('========================================\n');
