import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Check if blogs_locales table exists and get its current structure
  const tableExists = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = 'blogs_locales'
    )
  `)

  if (tableExists.rows[0].exists) {
    // Table exists, check and add missing columns
    console.log('blogs_locales table already exists, checking structure...')
    
    // Check which columns exist
    const columns = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'blogs_locales'
    `)
    
    const existingColumns = columns.rows.map(row => row.column_name)
    
    // Add missing columns if they don't exist
    if (!existingColumns.includes('title')) {
      await db.execute(sql`ALTER TABLE blogs_locales ADD COLUMN title TEXT`)
    }
    if (!existingColumns.includes('paragraph')) {
      await db.execute(sql`ALTER TABLE blogs_locales ADD COLUMN paragraph JSONB`)
    }
    if (!existingColumns.includes('meta_description')) {
      await db.execute(sql`ALTER TABLE blogs_locales ADD COLUMN meta_description TEXT`)
    }
    if (!existingColumns.includes('meta_title')) {
      await db.execute(sql`ALTER TABLE blogs_locales ADD COLUMN meta_title TEXT`)
    }
    if (!existingColumns.includes('created_at')) {
      await db.execute(sql`ALTER TABLE blogs_locales ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`)
    }
    if (!existingColumns.includes('updated_at')) {
      await db.execute(sql`ALTER TABLE blogs_locales ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`)
    }
    
    // Add unique constraint if it doesn't exist
    try {
      await db.execute(sql`ALTER TABLE blogs_locales ADD CONSTRAINT blogs_locales_parent_locale_unique UNIQUE(_parent_id, _locale)`)
    } catch (error) {
      // Constraint might already exist, ignore error
      console.log('Unique constraint might already exist')
    }
  } else {
    // Table doesn't exist, create it with full structure
    await db.execute(sql`
      CREATE TABLE blogs_locales (
        id SERIAL PRIMARY KEY,
        _parent_id INTEGER NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
        _locale VARCHAR(10) NOT NULL,
        title TEXT,
        paragraph JSONB,
        meta_description TEXT,
        meta_title TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(_parent_id, _locale)
      )
    `)
  }

  // Create index for better performance if it doesn't exist
  try {
    await db.execute(sql`
      CREATE INDEX idx_blogs_locales_parent_locale 
      ON blogs_locales(_parent_id, _locale)
    `)
  } catch (error) {
    // Index might already exist, ignore error
      console.log('Index might already exist')
  }

  // First, let's clean up any existing null values in blogs_locales
  console.log('Cleaning up null values in blogs_locales...')
  await db.execute(sql`
    DELETE FROM blogs_locales 
    WHERE title IS NULL OR _parent_id IS NULL OR _locale IS NULL
  `)

  // Get all existing blogs that need localization
  const blogsToLocalize = await db.execute(sql`
    SELECT b.id, b.title, b.paragraph, b.meta_description, b.meta_title
    FROM blogs b
    WHERE b.title IS NOT NULL
  `)

  console.log(`Found ${blogsToLocalize.rows.length} blogs to localize`)

  // For each blog, create or update localized versions
  for (const blog of blogsToLocalize.rows) {
    // Upsert English version (default locale)
    await db.execute(sql`
      INSERT INTO blogs_locales (_parent_id, _locale, title, paragraph, meta_description, meta_title)
      VALUES (${blog.id}, 'en', ${blog.title || 'Untitled'}, ${blog.paragraph || '{}'}, ${blog.meta_description || ''}, ${blog.meta_title || blog.title || 'Untitled'})
      ON CONFLICT (_parent_id, _locale) DO UPDATE SET
        title = EXCLUDED.title,
        paragraph = EXCLUDED.paragraph,
        meta_description = EXCLUDED.meta_description,
        meta_title = EXCLUDED.meta_title,
        updated_at = CURRENT_TIMESTAMP
    `)

    // Upsert Vietnamese version (copy from English for now)
    await db.execute(sql`
      INSERT INTO blogs_locales (_parent_id, _locale, title, paragraph, meta_description, meta_title)
      VALUES (${blog.id}, 'vi', ${blog.title || 'Untitled'}, ${blog.paragraph || '{}'}, ${blog.meta_description || ''}, ${blog.meta_title || blog.title || 'Untitled'})
      ON CONFLICT (_parent_id, _locale) DO UPDATE SET
        title = EXCLUDED.title,
        paragraph = EXCLUDED.paragraph,
        meta_description = EXCLUDED.meta_description,
        meta_title = EXCLUDED.meta_title,
        updated_at = CURRENT_TIMESTAMP
    `)
  }

  // Verify all records have proper data
  const nullCheck = await db.execute(sql`
    SELECT COUNT(*) as null_count
    FROM blogs_locales 
    WHERE title IS NULL OR _parent_id IS NULL OR _locale IS NULL
  `)
  
  const nullCount = (nullCheck.rows[0] as { null_count: string }).null_count
  console.log(`Null values after cleanup: ${nullCount}`)

  if (parseInt(nullCount) > 0) {
    throw new Error('Still have null values in blogs_locales table')
  }

  // Now remove the old localized columns from the main blogs table
  // This is safe because we've already moved the data to blogs_locales
  console.log('Removing old localized columns from blogs table...')
  
  try {
    // Check if columns exist before trying to remove them
    const blogsColumns = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'blogs'
    `)
    
    const blogsExistingColumns = blogsColumns.rows.map(row => row.column_name)
    
    if (blogsExistingColumns.includes('title')) {
      await db.execute(sql`ALTER TABLE blogs DROP COLUMN title`)
      console.log('Removed title column from blogs table')
    }
    
    if (blogsExistingColumns.includes('paragraph')) {
      await db.execute(sql`ALTER TABLE blogs DROP COLUMN paragraph`)
      console.log('Removed paragraph column from blogs table')
    }
    
    if (blogsExistingColumns.includes('meta_description')) {
      await db.execute(sql`ALTER TABLE blogs DROP COLUMN meta_description`)
      console.log('Removed meta_description column from blogs table')
    }
    
    if (blogsExistingColumns.includes('meta_title')) {
      await db.execute(sql`ALTER TABLE blogs DROP COLUMN meta_title`)
      console.log('Removed meta_title column from blogs table')
    }
  } catch (error) {
    console.log('Error removing columns:', error)
  }

  // IMPORTANT: Update the payload config to disable push mode to prevent data loss
  console.log('Migration completed successfully. Please ensure your payload.config.ts has push: false for production.')
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Restore the old columns and move data back
  console.log('Restoring old columns in blogs table...')
  
  try {
    // Add back the old columns
    await db.execute(sql`ALTER TABLE blogs ADD COLUMN title TEXT`)
    await db.execute(sql`ALTER TABLE blogs ADD COLUMN paragraph JSONB`)
    await db.execute(sql`ALTER TABLE blogs ADD COLUMN meta_description TEXT`)
    await db.execute(sql`ALTER TABLE blogs ADD COLUMN meta_title TEXT`)
    
    // Copy data back from blogs_locales (English locale)
    await db.execute(sql`
      UPDATE blogs b 
      SET 
        title = bl.title,
        paragraph = bl.paragraph,
        meta_description = bl.meta_description,
        meta_title = bl.meta_title,
      FROM blogs_locales bl 
      WHERE bl._parent_id = b.id AND bl._locale = 'en'
    `)
    
    console.log('Restored data to blogs table')
  } catch (error) {
    console.log('Error in down migration:', error)
  }
  
  // Remove the unique constraint and index
  try {
    await db.execute(sql`DROP INDEX IF EXISTS idx_blogs_locales_parent_locale`)
    await db.execute(sql`ALTER TABLE blogs_locales DROP CONSTRAINT IF EXISTS blogs_locales_parent_locale_unique`)
  } catch (error) {
    console.log('Error removing constraints:', error)
  }
}

