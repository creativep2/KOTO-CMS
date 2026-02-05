import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  console.log('Fixing pages created_by column name...')
  
  try {
    // Check if pages table exists
    const pagesTableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'pages'
      )
    `)
    
    if (!pagesTableExists.rows[0].exists) {
      console.log('pages table does not exist, skipping...')
      return
    }
    
    // Check if created_by column exists
    const createdByExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'pages' 
        AND column_name = 'created_by'
      )
    `)
    
    // Check if created_by_id column exists
    const createdByIdExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'pages' 
        AND column_name = 'created_by_id'
      )
    `)
    
    if (createdByExists.rows[0].exists && !createdByIdExists.rows[0].exists) {
      // Rename created_by to created_by_id
      await db.execute(sql`
        ALTER TABLE pages 
        RENAME COLUMN created_by TO created_by_id
      `)
      
      // Recreate index with new name
      await db.execute(sql`
        DROP INDEX IF EXISTS idx_pages_created_by
      `)
      await db.execute(sql`
        CREATE INDEX idx_pages_created_by_id ON pages(created_by_id)
      `)
      
      console.log('Renamed created_by to created_by_id')
    } else if (createdByIdExists.rows[0].exists) {
      console.log('created_by_id column already exists, skipping...')
    } else {
      console.log('Neither created_by nor created_by_id exists, adding created_by_id...')
      // Add created_by_id column if neither exists
      await db.execute(sql`
        ALTER TABLE pages 
        ADD COLUMN created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL
      `)
      await db.execute(sql`
        CREATE INDEX idx_pages_created_by_id ON pages(created_by_id)
      `)
      console.log('Added created_by_id column')
    }
    
    console.log('Successfully fixed pages created_by column')
  } catch (error) {
    console.error('Error fixing pages created_by column:', error)
    throw error
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  console.log('Reverting pages created_by_id column name...')
  
  try {
    // Check if created_by_id column exists
    const createdByIdExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'pages' 
        AND column_name = 'created_by_id'
      )
    `)
    
    if (createdByIdExists.rows[0].exists) {
      // Rename created_by_id back to created_by
      await db.execute(sql`
        ALTER TABLE pages 
        RENAME COLUMN created_by_id TO created_by
      `)
      
      // Recreate index with old name
      await db.execute(sql`
        DROP INDEX IF EXISTS idx_pages_created_by_id
      `)
      await db.execute(sql`
        CREATE INDEX idx_pages_created_by ON pages(created_by)
      `)
      
      console.log('Renamed created_by_id back to created_by')
    }
    
    console.log('Successfully reverted pages created_by column')
  } catch (error) {
    console.error('Error reverting pages created_by column:', error)
    throw error
  }
}
