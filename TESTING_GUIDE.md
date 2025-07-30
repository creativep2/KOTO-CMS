# KOTO CMS Form Testing Guide

This guide provides multiple ways to test the KOTO CMS form endpoints to ensure they're working correctly.

## Prerequisites

1. **Start the development server:**
   ```bash
   npm run dev
   ```
   The server should be running on `http://localhost:3000`

2. **Ensure the database is connected** and the admin panel is accessible at `http://localhost:3000/admin`

## Testing Methods

### 1. Interactive HTML Testing Dashboard

**File:** `test-forms.html`

This is the most user-friendly way to test the forms. It provides a visual interface with all four forms and real-time feedback.

**How to use:**
1. Open `test-forms.html` in your web browser
2. Click the "Fill Test Data" button to auto-populate all forms with valid test data
3. Submit each form individually to see the results
4. Try modifying the data to test validation

**Features:**
- ✅ Visual form interface for all endpoints
- ✅ Real-time success/error feedback
- ✅ Auto-fill test data button
- ✅ Form validation
- ✅ JSON response display
- ✅ Responsive design

### 2. Node.js Automated Testing

**File:** `test-forms.js`

This script runs comprehensive automated tests including valid data, invalid data, and edge cases.

**How to use:**
```bash
# Install node-fetch if not already installed
npm install node-fetch

# Run the tests
node test-forms.js
```

**Features:**
- ✅ Automated testing of all endpoints
- ✅ Valid and invalid data testing
- ✅ Edge case testing (malformed JSON, CORS)
- ✅ Colored console output
- ✅ Detailed test results
- ✅ Success rate calculation

### 3. Bash Script Testing (Linux/Mac)

**File:** `test-forms-curl.sh`

A bash script that uses curl to test all endpoints.

**How to use:**
```bash
# Make the script executable
chmod +x test-forms-curl.sh

# Run the tests
./test-forms-curl.sh
```

**Features:**
- ✅ Uses curl for HTTP requests
- ✅ Colored output
- ✅ Tests all endpoints
- ✅ CORS preflight testing
- ✅ Edge case testing

### 4. PowerShell Script Testing (Windows)

**File:** `test-forms.ps1`

A PowerShell script for Windows users to test all endpoints.

**How to use:**
```powershell
# Run the script
.\test-forms.ps1
```

**Features:**
- ✅ Uses PowerShell's Invoke-RestMethod
- ✅ Colored output
- ✅ Windows-compatible
- ✅ Tests all endpoints
- ✅ Error handling

### 5. Manual Testing with curl

You can also test individual endpoints manually using curl:

```bash
# Test Contact Form
curl -X POST http://localhost:3000/api/forms/contact \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","email":"john@example.com","message":"Test message"}'

# Test Donation Form
curl -X POST http://localhost:3000/api/forms/donation \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Jane Smith","email":"jane@example.com","donationAmount":50.00,"paymentMethod":"credit-card","howDidYouHearAboutUs":"social-media"}'

# Test In-Kind Support Form
curl -X POST http://localhost:3000/api/forms/in-kind-support \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Bob Johnson","email":"bob@example.com","phoneNumber":"+1234567890","deliveryPreference":"delivery","message":"Test message"}'

# Test Booking Form
curl -X POST http://localhost:3000/api/forms/booking \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Alice Brown","email":"alice@example.com","phoneNumber":"+1234567890","nationality":"American","restaurant":"koto-restaurant","reservationDate":"2024-12-25","reservationTime":"19:00","numberOfGuests":"4"}'
```

## Test Scenarios

### Valid Data Tests
- ✅ All required fields provided
- ✅ Valid email format
- ✅ Valid date formats (future dates for booking)
- ✅ Valid enum values (payment methods, restaurants, etc.)
- ✅ Positive numbers for amounts

### Invalid Data Tests
- ❌ Missing required fields
- ❌ Invalid email format
- ❌ Past dates for reservations
- ❌ Invalid enum values
- ❌ Negative amounts
- ❌ Empty strings

### Edge Case Tests
- 🔍 Malformed JSON
- 🔍 CORS preflight requests
- 🔍 Large data payloads
- 🔍 Special characters in text fields

## Expected Responses

### Success Response (201)
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "id": "generated-submission-id"
}
```

### Error Response (400/500)
```json
{
  "error": "Error description"
}
```

## Verification

After running tests, verify the results by:

1. **Checking the admin panel** at `http://localhost:3000/admin`
2. **Looking for new entries** in the respective collections:
   - Contact Forms
   - Donation Forms
   - In-Kind Support Forms
   - Booking Forms

3. **Checking server logs** for any errors or warnings

## Troubleshooting

### Common Issues

1. **Server not running:**
   - Make sure `npm run dev` is running
   - Check if port 3000 is available

2. **Database connection issues:**
   - Check your database configuration
   - Ensure the database is running

3. **CORS errors:**
   - The endpoints include CORS headers
   - If testing from a different domain, check CORS configuration

4. **Validation errors:**
   - Check the field requirements in the FORM_INTEGRATION_GUIDE.md
   - Ensure all required fields are provided
   - Verify data formats (email, dates, etc.)

### Debug Tips

1. **Check browser console** for JavaScript errors
2. **Check server logs** for API errors
3. **Use browser network tab** to see actual requests/responses
4. **Test endpoints individually** to isolate issues

## Test Data Examples

### Contact Form
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "message": "This is a test message for the contact form."
}
```

### Donation Form
```json
{
  "fullName": "Jane Smith",
  "email": "jane.smith@example.com",
  "donationAmount": 50.00,
  "paymentMethod": "credit-card",
  "howDidYouHearAboutUs": "social-media"
}
```

### In-Kind Support Form
```json
{
  "fullName": "Bob Johnson",
  "email": "bob.johnson@example.com",
  "phoneNumber": "+1234567890",
  "deliveryPreference": "delivery",
  "itemType": "Kitchen Equipment",
  "estimatedValue": 500.00,
  "message": "I would like to donate kitchen equipment to support your cause."
}
```

### Booking Form
```json
{
  "fullName": "Alice Brown",
  "email": "alice.brown@example.com",
  "phoneNumber": "+1234567890",
  "nationality": "American",
  "restaurant": "koto-restaurant",
  "reservationDate": "2024-12-25",
  "reservationTime": "19:00",
  "numberOfGuests": "4",
  "specialOccasion": true,
  "specialOccasionType": "birthday",
  "specialRequests": "Window seat preferred, gluten-free options needed"
}
```

## Next Steps

After successful testing:

1. **Integrate with Webstudio** using the FORM_INTEGRATION_GUIDE.md
2. **Set up email notifications** for form submissions
3. **Configure admin notifications** for new submissions
4. **Add form analytics** to track submission rates
5. **Implement spam protection** if needed

## Support

If you encounter issues:

1. Check the server logs for detailed error messages
2. Verify all required dependencies are installed
3. Ensure the database is properly configured
4. Test with the provided test files to isolate issues
5. Check the FORM_INTEGRATION_GUIDE.md for field requirements 