import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  console.log('Removing button_text field from hero_banners_locales table...')
  
  try {
    // Check if hero_banners_locales table exists
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'hero_banners_locales'
      )
    `)
    
    if (!tableExists.rows[0].exists) {
      console.log('hero_banners_locales table does not exist, nothing to remove')
      return
    }
    
    // Check if button_text column exists before dropping
    const columnExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'hero_banners_locales' 
        AND column_name = 'button_text'
      )
    `)
    
    if (columnExists.rows[0].exists) {
      await db.execute(sql`
        ALTER TABLE hero_banners_locales 
        DROP COLUMN button_text
      `)
      console.log('Removed button_text column from hero_banners_locales table')
    } else {
      console.log('button_text column does not exist, nothing to remove')
    }
    
    console.log('Successfully removed button_text field from hero_banners_locales table')
  } catch (error: any) {
    console.error('Error removing button_text field:', error)
    throw error
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  console.log('Restoring button_text field to hero_banners_locales table...')
  
  try {
    // Check if hero_banners_locales table exists
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'hero_banners_locales'
      )
    `)
    
    if (!tableExists.rows[0].exists) {
      console.log('hero_banners_locales table does not exist. Creating it with button_text column...')
      // Create hero_banners_locales table with button_text column
      await db.execute(sql`
        CREATE TABLE hero_banners_locales (
          id SERIAL PRIMARY KEY,
          _parent_id INTEGER NOT NULL REFERENCES hero_banners(id) ON DELETE CASCADE,
          _locale VARCHAR(10) NOT NULL,
          title TEXT,
          tagline TEXT,
          description TEXT,
          button TEXT,
          button_text TEXT,
          button_link TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(_parent_id, _locale)
        )
      `)
      
      // Create index
      await db.execute(sql`
        CREATE INDEX idx_hero_banners_locales_parent_locale 
        ON hero_banners_locales(_parent_id, _locale)
      `)
      
      console.log('Created hero_banners_locales table with button_text column')
      return
    }
    
    // Check if button_text column already exists
    const columnExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'hero_banners_locales' 
        AND column_name = 'button_text'
      )
    `)
    
    if (!columnExists.rows[0].exists) {
      // Add button_text column back to hero_banners_locales table
      await db.execute(sql`
        ALTER TABLE hero_banners_locales 
        ADD COLUMN button_text TEXT
      `)
      console.log('Restored button_text column to hero_banners_locales table')
    } else {
      console.log('button_text column already exists, skipping...')
    }
    
    console.log('Successfully restored button_text field to hero_banners_locales table')
  } catch (error: any) {
    console.error('Error restoring button_text field:', error)
    throw error
  }
}

