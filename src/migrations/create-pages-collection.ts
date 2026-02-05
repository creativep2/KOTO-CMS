import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  console.log('Creating Pages collection tables...')
  
  try {
    // Check if pages table already exists
    const pagesTableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'pages'
      )
    `)
    
    if (!pagesTableExists.rows[0].exists) {
      // Create main pages table
      await db.execute(sql`
        CREATE TABLE pages (
          id SERIAL PRIMARY KEY,
          content JSONB,
          status TEXT NOT NULL DEFAULT 'draft',
          created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
          slug TEXT UNIQUE,
          slug_lock BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)
      
      // Create indexes for pages table
      await db.execute(sql`
        CREATE INDEX idx_pages_slug ON pages(slug)
      `)
      await db.execute(sql`
        CREATE INDEX idx_pages_status ON pages(status)
      `)
      await db.execute(sql`
        CREATE INDEX idx_pages_created_by ON pages(created_by)
      `)
      
      console.log('Created pages table')
    } else {
      console.log('pages table already exists, skipping creation...')
    }
    
    // Check if pages_locales table exists
    const pagesLocalesExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'pages_locales'
      )
    `)
    
    if (!pagesLocalesExists.rows[0].exists) {
      // Create pages_locales table for localized fields
      await db.execute(sql`
        CREATE TABLE pages_locales (
          id SERIAL PRIMARY KEY,
          _parent_id INTEGER NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
          _locale VARCHAR(10) NOT NULL,
          title TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(_parent_id, _locale)
        )
      `)
      
      // Create index for pages_locales table
      await db.execute(sql`
        CREATE INDEX idx_pages_locales_parent_locale 
        ON pages_locales(_parent_id, _locale)
      `)
      
      console.log('Created pages_locales table')
    } else {
      console.log('pages_locales table already exists, skipping creation...')
      
      // Check if title column exists, add it if missing
      const columns = await db.execute(sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'pages_locales'
      `)
      
      const existingColumns = columns.rows.map(row => row.column_name)
      
      if (!existingColumns.includes('title')) {
        await db.execute(sql`
          ALTER TABLE pages_locales ADD COLUMN title TEXT
        `)
        console.log('Added title column to pages_locales table')
      }
    }
    
    console.log('Successfully created Pages collection tables')
  } catch (error) {
    console.error('Error creating Pages collection tables:', error)
    throw error
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  console.log('Dropping Pages collection tables...')
  
  try {
    // Drop pages_locales table first (due to foreign key constraint)
    await db.execute(sql`DROP TABLE IF EXISTS pages_locales CASCADE`)
    console.log('Dropped pages_locales table')
    
    // Drop main pages table
    await db.execute(sql`DROP TABLE IF EXISTS pages CASCADE`)
    console.log('Dropped pages table')
    
    console.log('Successfully dropped Pages collection tables')
  } catch (error) {
    console.error('Error dropping Pages collection tables:', error)
    throw error
  }
}
