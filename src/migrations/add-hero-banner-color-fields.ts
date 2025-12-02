import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  console.log('Adding taglineColor and buttonColor fields to hero_banners table...')
  
  try {
    // Check if columns already exist
    const columns = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'hero_banners' 
      AND column_name IN ('tagline_color', 'button_color')
    `)
    
    const existingColumns = columns.rows.map(row => row.column_name)
    
    // Add taglineColor column if it doesn't exist
    if (!existingColumns.includes('tagline_color')) {
      await db.execute(sql`
        ALTER TABLE hero_banners 
        ADD COLUMN tagline_color VARCHAR(50)
      `)
      console.log('Added tagline_color column to hero_banners table')
    } else {
      console.log('tagline_color column already exists, skipping...')
    }
    
    // Add buttonColor column if it doesn't exist
    if (!existingColumns.includes('button_color')) {
      await db.execute(sql`
        ALTER TABLE hero_banners 
        ADD COLUMN button_color VARCHAR(50)
      `)
      console.log('Added button_color column to hero_banners table')
    } else {
      console.log('button_color column already exists, skipping...')
    }
    
    console.log('Successfully added color fields to hero_banners table')
  } catch (error: any) {
    console.error('Error adding color fields:', error)
    throw error
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  console.log('Removing taglineColor and buttonColor fields from hero_banners table...')
  
  try {
    // Check if columns exist before dropping
    const columns = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'hero_banners' 
      AND column_name IN ('tagline_color', 'button_color')
    `)
    
    const existingColumns = columns.rows.map(row => row.column_name)
    
    // Remove taglineColor column if it exists
    if (existingColumns.includes('tagline_color')) {
      await db.execute(sql`
        ALTER TABLE hero_banners 
        DROP COLUMN tagline_color
      `)
      console.log('Removed tagline_color column from hero_banners table')
    }
    
    // Remove buttonColor column if it exists
    if (existingColumns.includes('button_color')) {
      await db.execute(sql`
        ALTER TABLE hero_banners 
        DROP COLUMN button_color
      `)
      console.log('Removed button_color column from hero_banners table')
    }
    
    console.log('Successfully removed color fields from hero_banners table')
  } catch (error: any) {
    console.error('Error removing color fields:', error)
    throw error
  }
}

