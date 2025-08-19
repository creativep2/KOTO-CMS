import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  console.log('Adding column grouping feature to Pages collection...')

  // Check if pages_content_headers table exists
  const tableExists = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = 'pages_content_headers'
    )
  `)

  if (!tableExists.rows[0].exists) {
    console.log('pages_content_headers table does not exist, skipping migration')
    return
  }

  // Check if group_id column already exists
  const columnExists = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_name = 'pages_content_headers' AND column_name = 'group_id'
    )
  `)

  if (columnExists.rows[0].exists) {
    console.log('group_id column already exists in pages_content_headers table')
    return
  }

  // Add group_id column to pages_content_headers table
  await db.execute(sql`
    ALTER TABLE pages_content_headers 
    ADD COLUMN group_id VARCHAR(100) DEFAULT 'default'
  `)

  // Create pages_content_groups table for column groups
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS pages_content_groups (
      id SERIAL PRIMARY KEY,
      _parent_id INTEGER NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
      _locale VARCHAR(10) NOT NULL,
      _order INTEGER NOT NULL,
      group_id VARCHAR(100) NOT NULL,
      group_name VARCHAR(255) NOT NULL,
      group_description TEXT,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `)

  // Create indexes for better performance
  await db.execute(sql`CREATE INDEX IF NOT EXISTS pages_content_groups_parent_idx ON pages_content_groups(_parent_id)`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS pages_content_groups_locale_idx ON pages_content_groups(_locale)`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS pages_content_groups_id_idx ON pages_content_groups(group_id)`)

  // Insert default group for existing data
  const existingPages = await db.execute(sql`
    SELECT DISTINCT _parent_id, _locale FROM pages_content_headers
  `)

  for (const page of existingPages.rows) {
    // Insert default group
    await db.execute(sql`
      INSERT INTO pages_content_groups (_parent_id, _locale, _order, group_id, group_name, group_description)
      VALUES (
        ${page._parent_id}, 
        ${page._locale}, 
        0, 
        'default', 
        'Default Group', 
        'Default column group for existing data'
      )
    `)

    // Update existing headers to use default group
    await db.execute(sql`
      UPDATE pages_content_headers 
      SET group_id = 'default' 
      WHERE _parent_id = ${page._parent_id} AND _locale = ${page._locale}
    `)
  }

  console.log('Successfully added column grouping feature')
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  console.log('Rolling back column grouping feature...')

  // Drop indexes first
  await db.execute(sql`DROP INDEX IF EXISTS pages_content_groups_id_idx`)
  await db.execute(sql`DROP INDEX IF EXISTS pages_content_groups_locale_idx`)
  await db.execute(sql`DROP INDEX IF EXISTS pages_content_groups_parent_idx`)

  // Drop the groups table
  await db.execute(sql`DROP TABLE IF EXISTS pages_content_groups`)

  // Remove group_id column from headers table
  try {
    await db.execute(sql`
      ALTER TABLE pages_content_headers 
      DROP COLUMN group_id
    `)
    console.log('Removed group_id column from pages_content_headers table')
  } catch (error) {
    console.log('group_id column might not exist, skipping removal')
  }

  console.log('Successfully rolled back column grouping feature')
} 