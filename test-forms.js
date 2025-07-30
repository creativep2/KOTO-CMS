import fetch from 'node-fetch';

// Test configuration
const BASE_URL = 'http://localhost:3000';
const ENDPOINTS = {
  contact: '/api/forms/contact',
  donation: '/api/forms/donation',
  inKindSupport: '/api/forms/in-kind-support',
  booking: '/api/forms/booking'
};

// Test data
const testData = {
  valid: {
    contact: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      message: 'This is a test message for the contact form.'
    },
    donation: {
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      donationAmount: 50.00,
      paymentMethod: 'credit-card',
      howDidYouHearAboutUs: 'social-media'
    },
    inKindSupport: {
      fullName: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      phoneNumber: '+1234567890',
      deliveryPreference: 'delivery',
      itemType: 'Kitchen Equipment',
      estimatedValue: 500.00,
      message: 'I would like to donate kitchen equipment to support your cause.'
    },
    booking: {
      fullName: 'Alice Brown',
      email: 'alice.brown@example.com',
      phoneNumber: '+1234567890',
      nationality: 'American',
      restaurant: 'koto-restaurant',
      reservationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      reservationTime: '19:00',
      numberOfGuests: '4',
      specialOccasion: true,
      specialOccasionType: 'birthday',
      specialRequests: 'Window seat preferred, gluten-free options needed'
    }
  },
  invalid: {
    contact: {
      fullName: '',
      email: 'invalid-email',
      message: ''
    },
    donation: {
      fullName: 'Test',
      email: 'test@example.com',
      donationAmount: -10,
      paymentMethod: 'invalid-method',
      howDidYouHearAboutUs: 'invalid-source'
    },
    inKindSupport: {
      fullName: 'Test',
      email: 'test@example.com',
      phoneNumber: '',
      deliveryPreference: 'invalid-preference',
      message: ''
    },
    booking: {
      fullName: 'Test',
      email: 'test@example.com',
      phoneNumber: '+1234567890',
      nationality: 'Test',
      restaurant: 'invalid-restaurant',
      reservationDate: '2020-01-01', // Past date
      reservationTime: '25:00', // Invalid time
      numberOfGuests: '15' // Invalid number
    }
  }
};

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const colors = {
    info: '\x1b[36m', // Cyan
    success: '\x1b[32m', // Green
    error: '\x1b[31m', // Red
    warning: '\x1b[33m', // Yellow
    reset: '\x1b[0m' // Reset
  };
  console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
}

async function testEndpoint(endpoint, data, testName) {
  try {
    log(`Testing ${testName}...`, 'info');
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    
    if (response.ok) {
      log(`✅ ${testName} - SUCCESS (${response.status})`, 'success');
      log(`   Response: ${JSON.stringify(result, null, 2)}`, 'info');
      return { success: true, status: response.status, data: result };
    } else {
      log(`❌ ${testName} - FAILED (${response.status})`, 'error');
      log(`   Error: ${JSON.stringify(result, null, 2)}`, 'error');
      return { success: false, status: response.status, data: result };
    }
  } catch (error) {
    log(`💥 ${testName} - NETWORK ERROR`, 'error');
    log(`   Error: ${error.message}`, 'error');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log('🚀 Starting KOTO CMS Form Endpoint Tests', 'info');
  log('=' * 50, 'info');
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    details: []
  };

  // Test Contact Form
  log('\n📝 Testing Contact Form Endpoint', 'info');
  log('-'.repeat(30), 'info');
  
  // Valid contact form
  let result = await testEndpoint(
    ENDPOINTS.contact,
    testData.valid.contact,
    'Contact Form - Valid Data'
  );
  results.total++;
  if (result.success) results.passed++; else results.failed++;
  results.details.push(result);

  // Invalid contact form
  result = await testEndpoint(
    ENDPOINTS.contact,
    testData.invalid.contact,
    'Contact Form - Invalid Data'
  );
  results.total++;
  if (!result.success) results.passed++; else results.failed++;
  results.details.push(result);

  // Test Donation Form
  log('\n💰 Testing Donation Form Endpoint', 'info');
  log('-'.repeat(30), 'info');
  
  // Valid donation form
  result = await testEndpoint(
    ENDPOINTS.donation,
    testData.valid.donation,
    'Donation Form - Valid Data'
  );
  results.total++;
  if (result.success) results.passed++; else results.failed++;
  results.details.push(result);

  // Invalid donation form
  result = await testEndpoint(
    ENDPOINTS.donation,
    testData.invalid.donation,
    'Donation Form - Invalid Data'
  );
  results.total++;
  if (!result.success) results.passed++; else results.failed++;
  results.details.push(result);

  // Test In-Kind Support Form
  log('\n🎁 Testing In-Kind Support Form Endpoint', 'info');
  log('-'.repeat(30), 'info');
  
  // Valid in-kind support form
  result = await testEndpoint(
    ENDPOINTS.inKindSupport,
    testData.valid.inKindSupport,
    'In-Kind Support Form - Valid Data'
  );
  results.total++;
  if (result.success) results.passed++; else results.failed++;
  results.details.push(result);

  // Invalid in-kind support form
  result = await testEndpoint(
    ENDPOINTS.inKindSupport,
    testData.invalid.inKindSupport,
    'In-Kind Support Form - Invalid Data'
  );
  results.total++;
  if (!result.success) results.passed++; else results.failed++;
  results.details.push(result);

  // Test Booking Form
  log('\n🍽️ Testing Booking Form Endpoint', 'info');
  log('-'.repeat(30), 'info');
  
  // Valid booking form
  result = await testEndpoint(
    ENDPOINTS.booking,
    testData.valid.booking,
    'Booking Form - Valid Data'
  );
  results.total++;
  if (result.success) results.passed++; else results.failed++;
  results.details.push(result);

  // Invalid booking form
  result = await testEndpoint(
    ENDPOINTS.booking,
    testData.invalid.booking,
    'Booking Form - Invalid Data'
  );
  results.total++;
  if (!result.success) results.passed++; else results.failed++;
  results.details.push(result);

  // Test Edge Cases
  log('\n🔍 Testing Edge Cases', 'info');
  log('-'.repeat(30), 'info');

  // Test with missing required fields
  result = await testEndpoint(
    ENDPOINTS.contact,
    { fullName: 'Test' }, // Missing email and message
    'Contact Form - Missing Required Fields'
  );
  results.total++;
  if (!result.success) results.passed++; else results.failed++;
  results.details.push(result);

  // Test with malformed JSON
  try {
    log('Testing with malformed JSON...', 'info');
    const response = await fetch(`${BASE_URL}${ENDPOINTS.contact}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: '{"invalid": json}'
    });
    log(`✅ Malformed JSON handled correctly (${response.status})`, 'success');
    results.total++;
    results.passed++;
  } catch (error) {
    log(`❌ Malformed JSON test failed: ${error.message}`, 'error');
    results.total++;
    results.failed++;
  }

  // Test CORS preflight
  try {
    log('Testing CORS preflight...', 'info');
    const response = await fetch(`${BASE_URL}${ENDPOINTS.contact}`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    if (response.status === 200) {
      log('✅ CORS preflight successful', 'success');
      results.total++;
      results.passed++;
    } else {
      log(`❌ CORS preflight failed (${response.status})`, 'error');
      results.total++;
      results.failed++;
    }
  } catch (error) {
    log(`❌ CORS preflight test failed: ${error.message}`, 'error');
    results.total++;
    results.failed++;
  }

  // Summary
  log('\n📊 Test Summary', 'info');
  log('=' * 50, 'info');
  log(`Total Tests: ${results.total}`, 'info');
  log(`Passed: ${results.passed}`, 'success');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'error' : 'success');
  log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`, 'info');

  if (results.failed > 0) {
    log('\n❌ Failed Tests:', 'error');
    results.details.forEach((detail, index) => {
      if (!detail.success) {
        log(`   Test ${index + 1}: ${detail.error || 'Unknown error'}`, 'error');
      }
    });
  }

  log('\n🎉 Testing completed!', 'success');
  
  return results;
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(error => {
    log(`💥 Test runner failed: ${error.message}`, 'error');
    process.exit(1);
  });
}

export { runTests, testEndpoint, testData }; 