# CSV Export Feature Guide

This guide explains how to use the CSV export feature for form collections in the KOTO CMS.

## Overview

The CSV export feature allows you to export form submission data from all form collections to CSV format. This is useful for:
- Data analysis and reporting
- Backup purposes
- Integration with external systems
- Compliance and audit requirements

## Available Form Collections

The following form collections support CSV export:

1. **Contact Forms** (`contact-forms`)
   - Fields: fullName, email, message, status, notes, createdAt, updatedAt
   - Status options: New, In Progress, Replied, Closed

2. **Donation Forms** (`donation-forms`)
   - Fields: fullName, email, donationAmount, paymentMethod, howDidYouHearAboutUs, status, transactionId, notes, createdAt, updatedAt
   - Status options: Pending, Processing, Completed, Failed, Refunded

3. **Booking Forms** (`booking-forms`)
   - Fields: fullName, email, phoneNumber, nationality, restaurant, reservationDate, reservationTime, numberOfGuests, specialOccasion, specialOccasionType, specialRequests, status, confirmationNumber, notes, createdAt, updatedAt
   - Status options: Pending, Confirmed, Seated, Completed, Cancelled, No Show

4. **In-Kind Support Forms** (`in-kind-support-forms`)
   - Fields: fullName, email, phoneNumber, deliveryPreference, message, status, itemType, estimatedValue, notes, createdAt, updatedAt
   - Status options: New, Contacted, Arranged, Completed, Declined

## How to Access the Export Feature

### Method 1: Main Export Center (Recommended)
1. Navigate to `/admin/export` in your browser
2. This is the primary CSV export interface with beautiful UI
3. Features visual collection cards, quick actions, and detailed instructions
4. Provides the best user experience for CSV exports

### Method 2: Floating Action Button
1. Look for the download icon (📥) in the bottom-right corner of any admin page
2. Click to expand the export menu
3. Choose any collection for quick export or access the full dashboard
4. Always accessible from any admin page

### Method 3: Advanced Admin Page
1. Navigate to `/admin/forms-export` in your browser
2. This provides advanced filtering and field selection options
3. Use the tabs to switch between different form collections

### Method 4: Simple Admin Dashboard
1. Navigate to `/admin/csv` in your browser
2. This opens a simplified dashboard with quick export buttons
3. Use the cards to export different form collections

### Method 5: Simple HTML Page
1. Navigate to `/csv-export.html` in your browser
2. This provides a standalone interface that works independently
3. No authentication required - useful for external access

### Method 4: API Endpoint
You can also use the API endpoint directly:

```bash
# Export all contact forms
curl -X POST http://your-domain/api/export/csv \
  -H "Content-Type: application/json" \
  -d '{"collection": "contact-forms"}'

# Export with filters
curl -X POST http://your-domain/api/export/csv \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "donation-forms",
    "filters": {
      "status": {
        "equals": "completed"
      }
    }
  }'
```

## Using the Export Interface

### Step 1: Select Collection
- Choose the form collection you want to export from the tabs
- Each collection has its own set of fields and status options

### Step 2: Filter Data (Optional)
- Use the status filter dropdown to export only specific submissions
- Select "All" to export all submissions regardless of status

### Step 3: Select Fields
- Choose which fields to include in the export
- All fields are selected by default
- Use "Select All" or "Deselect All" buttons for quick selection
- You can individually toggle fields on/off

### Step 4: Export
- Click the "Export CSV" button
- The file will be automatically downloaded to your computer
- The filename will include the collection name and current date

## API Reference

### POST /api/export/csv

Exports form data to CSV format.

**Request Body:**
```json
{
  "collection": "string",     // Required: collection slug
  "fields": ["string"],       // Optional: specific fields to export
  "filters": {                // Optional: filter criteria
    "status": {
      "equals": "string"
    }
  }
}
```

**Response:**
- Success: CSV file with appropriate headers
- Error: JSON error message

### GET /api/export/csv?collection={collection}

Gets information about available fields for a collection.

**Response:**
```json
{
  "collection": "string",
  "availableFields": ["string"],
  "message": "string"
}
```

## File Format

The exported CSV files:
- Include headers for all selected fields
- Use proper CSV escaping for special characters
- Include timestamps in ISO format
- Are named with the pattern: `{collection}_export_{date}.csv`

## Security and Access Control

- Only authenticated users with appropriate permissions can access the export feature
- The feature respects the same access controls as the form collections
- Export is limited to 1000 records per request (configurable)

## Troubleshooting

### Common Issues

1. **Export fails with "No data found"**
   - Check if the collection has any data
   - Verify the collection slug is correct
   - Ensure your filters aren't too restrictive

2. **File doesn't download**
   - Check browser popup blockers
   - Ensure you have proper permissions
   - Try refreshing the page

3. **Incomplete data**
   - Check if you've selected the desired fields
   - Verify the export limit (default 1000 records)
   - Use filters to export data in smaller chunks

### Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your user permissions
3. Contact your system administrator

## Configuration

The export feature can be customized by modifying:

- `src/utilities/csvExport.ts` - CSV formatting and field mappings
- `src/app/api/export/csv/route.ts` - API endpoint configuration
- `src/components/CSVExport/index.tsx` - User interface

## Future Enhancements

Planned improvements:
- Date range filtering
- Custom field ordering
- Export scheduling
- Email delivery of exports
- Additional export formats (Excel, JSON) 