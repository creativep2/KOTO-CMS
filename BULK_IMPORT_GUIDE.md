# Bulk Import Feature Guide

The KOTO CMS now includes a comprehensive bulk import feature that allows administrators to import large amounts of data from CSV files into various collections.

## 🚀 Features

### Supported Collections
The bulk import feature works with all content collections (excluding forms):

- **Blogs** - Import blog posts with titles, content, categories, and metadata
- **Job Posts** - Import job listings with descriptions and requirements
- **Hero Banners** - Import banner content for homepage and landing pages
- **Partners** - Import partner organizations and collaborations
- **Merchandise** - Import product catalog and merchandise
- **YouTube Embeds** - Import video content references
- **Categories** - Import content categories and tags
- **Media** - Import media file references (not the actual files)

### Import Capabilities
- **CSV Template Generation** - Download pre-formatted templates for each collection
- **Field Validation** - Automatic validation of required fields and data types
- **Error Handling** - Detailed error reporting with row-by-row feedback
- **Import Options** - Configurable import behavior (dry run, update existing, skip errors)
- **CSV Preview** - Preview CSV data before import
- **Drag & Drop** - Easy file upload with drag and drop support

## 📋 How to Use

### 1. Access the Import Feature
1. Navigate to `/admin/csv` in your admin dashboard
2. Click on the **"Import Data"** tab
3. Select the collection you want to import data into

### 2. Download Template
1. Click **"Download Template"** to get the CSV template
2. The template includes all available fields with proper headers
3. Required fields are marked with `[Required: field_type]`
4. Optional fields are marked with `[Optional: field_type]`

### 3. Prepare Your CSV File
1. Open the downloaded template in Excel, Google Sheets, or any CSV editor
2. Fill in your data following the template structure
3. Ensure required fields are populated
4. Save as CSV format

### 4. Import Your Data
1. Drag and drop your CSV file or click "Choose File"
2. Review the CSV preview to ensure data looks correct
3. Configure import options:
   - **Dry Run**: Validate data without importing (recommended for first-time users)
   - **Update Existing**: Update existing records if found
   - **Skip Errors**: Continue importing even if some rows have errors
4. Click **"Start Import"**

### 5. Review Results
- Check the import summary for success/failure counts
- Review any error messages for failed rows
- Use the information to fix your CSV file if needed

## 🔧 Import Options

### Dry Run Mode
- **Purpose**: Validate CSV data without actually importing
- **Use Case**: Test your CSV format before running the actual import
- **Result**: Shows validation results without creating/updating records

### Update Existing Records
- **Purpose**: Update existing records instead of creating duplicates
- **Matching**: Records are matched by title, name, or product name
- **Use Case**: Updating existing content with new information

### Skip Errors
- **Purpose**: Continue importing even when some rows fail
- **Behavior**: Failed rows are logged but don't stop the import process
- **Use Case**: Importing large datasets where some records may have issues

## 📊 CSV Format Requirements

### General Guidelines
- Use UTF-8 encoding for proper character support
- Include a header row with field names
- Separate values with semicolons (;) for better compatibility
- Enclose text values in quotes if they contain semicolons
- Use consistent date formats (YYYY-MM-DD recommended)

### Slug Auto-Generation
Slug fields are automatically generated from titles or names to ensure uniqueness:

- **Blogs**: Slugs are generated from the `title` field
- **Job Posts**: Slugs are generated from the `title` field  
- **Partners**: Slugs are generated from the `name` field
- **Categories**: Slugs are generated from the `name` field

**How it works:**
1. The system converts the title/name to a URL-friendly format
2. If a slug already exists, it appends a number suffix (e.g., `my-title-1`, `my-title-2`)
3. If uniqueness checking fails, it appends a timestamp to ensure uniqueness
4. You don't need to include slug columns in your CSV - they're generated automatically

**Example:**
- Title: "My Amazing Blog Post" → Slug: "my-amazing-blog-post"
- Title: "My Amazing Blog Post" (if first exists) → Slug: "my-amazing-blog-post-1"

### Rich Text Formatting
For rich text fields (like blog content), you can use simple HTML-like tags:

**Simple Text:**
```
This is just plain text that will be converted to a single paragraph.
```

**Multiple Paragraphs:**
```
<p>This is the first paragraph.</p><p>This is the second paragraph with more content.</p>
```

**Mixed Content:**
```
<p>Introduction paragraph here.</p><p>Main content with lots of details about the topic.</p><p>Conclusion paragraph.</p>
```

The system automatically converts these simple tags to the proper Lexical format that Payload CMS expects.

### Field Types
- **Text**: Plain text strings
- **Number**: Numeric values (integers or decimals)
- **Date**: Date values in ISO format
- **Checkbox**: Boolean values (true/false, 1/0, yes/no)
- **Select**: Predefined option values from the collection schema
  - **Blog Status**: `draft`, `review`, `published`, `archived`
  - **Blog Category**: `taste-the-story`, `jimmys-letters`, `jimmys-bio`, `behind-the-bar`, `her-turn`, `koto-foundation`
  - **Job Status**: `draft`, `published`
  - **Partner Status**: `active`, `inactive`
  - **Merchandise Status**: `available`, `out_of_stock`, `discontinued`
- **Rich Text**: Use simple HTML-like tags for formatting
  - Use `<p>` tags to separate paragraphs
  - Example: `<p>First paragraph</p><p>Second paragraph</p>`
  - The system automatically converts this to the proper Lexical format
- **Slug**: Automatically generated from titles/names - do not include in CSV files

### Excluded Fields
The following field types are automatically excluded from CSV imports:
- **Image Fields**: `header_image`, `product_image`, `logo`, etc.
- **File Uploads**: Any file upload fields
- **Relationships**: User relationships, media relationships
- **Complex Arrays**: Gallery fields, nested array structures
- **System Fields**: `id`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`
- **Slug Fields**: `slug` fields are automatically generated from titles/names to ensure uniqueness

### Localized Fields
Collections with localization support (English/Vietnamese) will import data for the default locale. For multi-language imports, you may need to run separate imports for each language.

## ⚠️ Important Notes

### File Upload Limitations
- **File Size**: Maximum 10MB per file
- **Format**: CSV files only (.csv extension)
- **Encoding**: UTF-8 recommended for international characters

### Data Validation
- **Required Fields**: Must be populated for successful import
- **Field Types**: Data is automatically converted to the correct type
- **Image Fields**: Image uploads are not supported in CSV imports (fields are automatically set to undefined)
- **Relationships**: File uploads and relationships are not supported in bulk imports
- **Rich Text**: Rich text fields are imported as plain text

### Performance Considerations
- **Large Files**: Very large CSV files may take time to process
- **Memory Usage**: Import process loads the entire CSV into memory
- **Database**: Each row creates a separate database transaction

## 🛠️ Troubleshooting

### Common Issues

#### "Missing required fields" Error
- **Cause**: CSV is missing columns for required fields
- **Solution**: Download the template and ensure all required fields are present

#### "Invalid data type" Error
- **Cause**: Data doesn't match the expected field type
- **Solution**: Check the field type requirements and format your data accordingly

#### "Import failed" Error
- **Cause**: Network or server error during import
- **Solution**: Check your internet connection and try again

#### "Collection not found" Error
- **Cause**: Invalid collection name in the request
- **Solution**: Ensure you're using the correct collection slug

#### "Rich text format error" Error
- **Cause**: Invalid formatting in rich text fields
- **Solution**: Use simple `<p>` tags for paragraphs, avoid complex HTML

#### "Invalid input value for enum" Error
- **Cause**: Invalid value for select/enum fields (status, category, etc.)
- **Solution**: Use only the valid enum values listed in the template
  - For blog status: use `draft`, `review`, `published`, or `archived`
  - For blog category: use `taste-the-story`, `jimmys-letters`, `jimmys-bio`, `behind-the-bar`, `her-turn`, or `koto-foundation`

#### "null value in column violates not-null constraint" Error
- **Cause**: Database constraint requires a field that's not supported in CSV imports
- **Solution**: The system automatically handles this by setting image fields to undefined
- **Note**: If this error persists, you may need to update your database schema to make the field nullable

### Best Practices

1. **Always use Dry Run first** to validate your data
2. **Backup your data** before running large imports
3. **Test with small datasets** before importing large amounts
4. **Review error logs** to understand and fix data issues
5. **Use consistent formatting** for dates, numbers, and text fields

## 🔒 Security & Access Control

### Authentication Required
- Bulk import requires admin authentication
- Only users with appropriate permissions can access the feature
- Import operations are logged for audit purposes

### Data Validation
- All imported data is validated against collection schemas
- Malicious content is filtered and rejected
- File uploads are restricted to CSV format only

## 📈 Advanced Usage

### Batch Processing
For very large datasets, consider:
- Breaking large CSV files into smaller chunks
- Running imports during off-peak hours
- Using the dry run mode to validate before full import

### Data Transformation
If your source data doesn't match the expected format:
- Use Excel/Google Sheets formulas to transform data
- Create intermediate CSV files with proper formatting
- Use data cleaning tools to standardize formats

### Integration with External Systems
The bulk import feature can be used to:
- Migrate data from other CMS platforms
- Import data from external databases
- Sync content from spreadsheet-based workflows
- Update content from external data sources

## 🆘 Support

If you encounter issues with the bulk import feature:

1. **Check the error messages** for specific guidance
2. **Verify your CSV format** against the template
3. **Test with a small sample** of your data
4. **Contact your system administrator** for technical support

## 🔄 Future Enhancements

Planned improvements for the bulk import feature:
- **Excel file support** (.xlsx format)
- **Bulk update operations** for existing records
- **Scheduled imports** for automated data updates
- **Import history** and rollback capabilities
- **Field mapping** for custom CSV formats
- **API endpoints** for programmatic imports 