import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  console.log('Dropping Pages collection tables...')
  
  try {
    // Drop all Pages-related tables in the correct order (respecting foreign key constraints)
    await db.execute(sql`DROP TABLE IF EXISTS pages_contents_rows CASCADE`)
    // Drop table data related tables first
    await db.execute(sql`DROP TABLE IF EXISTS pages_table_data_rows_values CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS pages_table_data_rows CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS pages_table_data_columns CASCADE`)
    
    // Drop content headers and groups tables
    await db.execute(sql`DROP TABLE IF EXISTS pages_content_groups CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS pages_content_headers CASCADE`)
    
    // Drop localized content tables
    await db.execute(sql`DROP TABLE IF EXISTS pages_locales CASCADE`)
    
    // Finally drop the main pages table
    await db.execute(sql`DROP TABLE IF EXISTS pages CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS pages_contents_rows CASCADE`)
    
    console.log('Successfully dropped all Pages collection tables')
  } catch (error) {
    console.error('Error dropping Pages collection tables:', error)
    throw error
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  console.log('Recreating Pages collection tables...')
  
  try {
    // This is a destructive migration - we cannot recreate the exact structure
    // without knowing the original schema. This is a limitation of dropping collections.
    console.log('Warning: Cannot recreate Pages collection tables in down migration')
    console.log('You would need to restore from a backup or recreate the collection manually')
  } catch (error) {
    console.error('Error in down migration:', error)
    throw error
  }
} 