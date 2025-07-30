# Form Integration Guide for Webstudio

This guide explains how to connect your Webstudio forms to the KOTO CMS backend using the API endpoints we've created.

## API Endpoints

### 1. Contact Form
**Endpoint:** `POST /api/forms/contact`
**Purpose:** "Send us a message" form

**Required Fields:**
- `fullName` (string)
- `email` (string, valid email format)
- `message` (string)

**Example Request:**
```javascript
const response = await fetch('/api/forms/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fullName: 'John Doe',
    email: 'john@example.com',
    message: 'Hello, I would like to inquire about...'
  })
});

const result = await response.json();
```

### 2. Donation Form
**Endpoint:** `POST /api/forms/donation`
**Purpose:** "Support our cause" form

**Required Fields:**
- `fullName` (string)
- `email` (string, valid email format)
- `donationAmount` (number, > 0)
- `paymentMethod` (string: 'credit-card', 'paypal', 'bank-transfer', 'check', 'cash', 'other')
- `howDidYouHearAboutUs` (string: 'social-media', 'website', 'friend-family', 'search-engine', 'advertisement', 'event', 'other')

**Example Request:**
```javascript
const response = await fetch('/api/forms/donation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    donationAmount: 50.00,
    paymentMethod: 'credit-card',
    howDidYouHearAboutUs: 'social-media'
  })
});

const result = await response.json();
```

### 3. In-Kind Support Form
**Endpoint:** `POST /api/forms/in-kind-support`
**Purpose:** "Give in-kind support" form

**Required Fields:**
- `fullName` (string)
- `email` (string, valid email format)
- `phoneNumber` (string)
- `deliveryPreference` (string: 'delivery', 'pickup', 'either')
- `message` (string)

**Optional Fields:**
- `itemType` (string)
- `estimatedValue` (number)

**Example Request:**
```javascript
const response = await fetch('/api/forms/in-kind-support', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fullName: 'Bob Johnson',
    email: 'bob@example.com',
    phoneNumber: '+1234567890',
    deliveryPreference: 'delivery',
    message: 'I would like to donate kitchen equipment...',
    itemType: 'Kitchen Equipment',
    estimatedValue: 500.00
  })
});

const result = await response.json();
```

### 4. Booking Form
**Endpoint:** `POST /api/forms/booking`
**Purpose:** Restaurant reservation form

**Required Fields:**
- `fullName` (string)
- `email` (string, valid email format)
- `phoneNumber` (string)
- `nationality` (string)
- `restaurant` (string: 'koto-restaurant', 'koto-cafe', 'koto-bar', 'koto-rooftop', 'other')
- `reservationDate` (string, ISO date format, must be in the future)
- `reservationTime` (string: '11:00', '11:30', '12:00', etc. - see full list below)
- `numberOfGuests` (string: '1', '2', '3', '4', '5', '6', '7', '8', '9', '10')

**Optional Fields:**
- `specialOccasion` (boolean)
- `specialOccasionType` (string: 'birthday', 'anniversary', 'business-meeting', 'date-night', 'family-gathering', 'other') - only if specialOccasion is true
- `specialRequests` (string)

**Valid Reservation Times:**
- 11:00 AM, 11:30 AM, 12:00 PM, 12:30 PM
- 1:00 PM, 1:30 PM, 2:00 PM, 2:30 PM
- 3:00 PM, 3:30 PM, 4:00 PM, 4:30 PM
- 5:00 PM, 5:30 PM, 6:00 PM, 6:30 PM
- 7:00 PM, 7:30 PM, 8:00 PM, 8:30 PM
- 9:00 PM, 9:30 PM, 10:00 PM

**Example Request:**
```javascript
const response = await fetch('/api/forms/booking', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fullName: 'Alice Brown',
    email: 'alice@example.com',
    phoneNumber: '+1234567890',
    nationality: 'American',
    restaurant: 'koto-restaurant',
    reservationDate: '2024-02-15',
    reservationTime: '19:00',
    numberOfGuests: '4',
    specialOccasion: true,
    specialOccasionType: 'birthday',
    specialRequests: 'Window seat preferred, gluten-free options needed'
  })
});

const result = await response.json();
```

## Response Format

All endpoints return JSON responses with the following format:

**Success Response (201):**
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "id": "generated-submission-id"
}
```

**Error Response (400/500):**
```json
{
  "error": "Error description"
}
```

## Webstudio Integration

### Method 1: Using Webstudio's Form Action

1. **In Webstudio, create your form with the appropriate fields**
2. **Set the form action to the corresponding API endpoint:**
   - Contact Form: `/api/forms/contact`
   - Donation Form: `/api/forms/donation`
   - In-Kind Support Form: `/api/forms/in-kind-support`
   - Booking Form: `/api/forms/booking`

3. **Set the method to `POST`**

4. **Make sure your form field names match the API field names exactly**

### Method 2: Using Custom JavaScript

If you need more control over the form submission, you can use custom JavaScript:

```javascript
// Example for Contact Form
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = {
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    message: formData.get('message')
  };

  try {
    const response = await fetch('/api/forms/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    
    if (result.success) {
      // Show success message
      alert('Thank you! Your message has been sent successfully.');
      e.target.reset(); // Clear form
    } else {
      // Show error message
      alert('Error: ' + result.error);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
});
```

### Method 3: Using Webstudio's Custom Code Block

You can add a custom code block in Webstudio with the JavaScript above and connect it to your form's submit event.

## Field Mapping Examples

### Contact Form Field Mapping
```html
<input name="fullName" type="text" required>
<input name="email" type="email" required>
<textarea name="message" required></textarea>
```

### Donation Form Field Mapping
```html
<input name="fullName" type="text" required>
<input name="email" type="email" required>
<input name="donationAmount" type="number" min="0" step="0.01" required>
<select name="paymentMethod" required>
  <option value="credit-card">Credit Card</option>
  <option value="paypal">PayPal</option>
  <option value="bank-transfer">Bank Transfer</option>
  <option value="check">Check</option>
  <option value="cash">Cash</option>
  <option value="other">Other</option>
</select>
<select name="howDidYouHearAboutUs" required>
  <option value="social-media">Social Media</option>
  <option value="website">Website</option>
  <option value="friend-family">Friend/Family</option>
  <option value="search-engine">Search Engine</option>
  <option value="advertisement">Advertisement</option>
  <option value="event">Event</option>
  <option value="other">Other</option>
</select>
```

## Testing the Integration

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test the API endpoints directly using tools like Postman or curl:**
   ```bash
   curl -X POST http://localhost:3000/api/forms/contact \
     -H "Content-Type: application/json" \
     -d '{"fullName":"Test User","email":"test@example.com","message":"Test message"}'
   ```

3. **Check the admin panel** at `/admin` to see if submissions are being created in the respective collections.

## Security Considerations

- All endpoints include input validation
- CORS is configured to allow cross-origin requests
- Form submissions are stored securely in the database
- Only authorized users (editors/admins) can view submissions in the admin panel

## Troubleshooting

### Common Issues:

1. **CORS Errors:** Make sure your Webstudio domain is allowed in the CORS configuration
2. **Field Name Mismatches:** Ensure form field names exactly match the API field names
3. **Validation Errors:** Check that all required fields are present and in the correct format
4. **Date Format Issues:** Use ISO date format (YYYY-MM-DD) for reservation dates

### Debug Tips:

1. Check the browser's developer console for JavaScript errors
2. Check the server logs for API errors
3. Test the API endpoints directly to isolate issues
4. Verify that your form is sending the correct data format

## Support

If you encounter any issues with the form integration, check:
1. The server logs for detailed error messages
2. The browser's network tab to see the actual request/response
3. The admin panel to verify if submissions are being created 