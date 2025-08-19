import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  console.log('Starting migration: remove header_image_id not-null constraint')
  
  try {
    // Check if the blogs table exists
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'blogs'
      )
    `)

    if (!tableExists.rows[0].exists) {
      console.log('blogs table does not exist, skipping migration')
      return
    }

    // Check if the header_image_id column exists
    const columnExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'blogs' AND column_name = 'header_image_id'
      )
    `)

    if (!columnExists.rows[0].exists) {
      console.log('header_image_id column does not exist, skipping migration')
      return
    }

    // Check if the column is currently NOT NULL
    const columnInfo = await db.execute(sql`
      SELECT is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'blogs' AND column_name = 'header_image_id'
    `)

    if (columnInfo.rows[0].is_nullable === 'NO') {
      console.log('Removing NOT NULL constraint from header_image_id column...')
      
      // Remove the NOT NULL constraint
      await db.execute(sql`
        ALTER TABLE blogs 
        ALTER COLUMN header_image_id DROP NOT NULL
      `)
      
      console.log('Successfully removed NOT NULL constraint from header_image_id column')
    } else {
      console.log('header_image_id column is already nullable, no changes needed')
    }

    // Also check if there are any foreign key constraints that might be causing issues
    const foreignKeyConstraints = await db.execute(sql`
      SELECT 
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = 'blogs' 
        AND kcu.column_name = 'header_image_id'
    `)

    if (foreignKeyConstraints.rows.length > 0) {
      console.log('Found foreign key constraints on header_image_id:')
      for (const constraint of foreignKeyConstraints.rows) {
        console.log(`- ${constraint.constraint_name}: ${constraint.table_name}.${constraint.column_name} -> ${constraint.foreign_table_name}.${constraint.foreign_column_name}`)
      }
      
      // Check if we need to handle the foreign key constraint
      // For now, we'll just log it - the foreign key constraint itself shouldn't prevent NULL values
      // unless it's set to CASCADE DELETE or similar
    }

    console.log('Migration completed successfully')
    
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  console.log('Rolling back migration: restore header_image_id not-null constraint')
  
  try {
    // Check if the blogs table exists
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'blogs'
      )
    `)

    if (!tableExists.rows[0].exists) {
      console.log('blogs table does not exist, skipping rollback')
      return
    }

    // Check if the header_image_id column exists
    const columnExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'blogs' AND column_name = 'header_image_id'
      )
    `)

    if (!columnExists.rows[0].exists) {
      console.log('header_image_id column does not exist, skipping rollback')
      return
    }

    // Check if the column is currently nullable
    const columnInfo = await db.execute(sql`
      SELECT is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'blogs' AND column_name = 'header_image_id'
    `)

    if (columnInfo.rows[0].is_nullable === 'YES') {
      console.log('Restoring NOT NULL constraint to header_image_id column...')
      
      // First, ensure there are no NULL values in the column
      const nullCount = await db.execute(sql`
        SELECT COUNT(*) as count
        FROM blogs 
        WHERE header_image_id IS NULL
      `)
      
      const count = parseInt(nullCount.rows[0].count as string)
      if (count > 0) {
        console.log(`Found ${count} NULL values in header_image_id column`)
        console.log('Cannot restore NOT NULL constraint while NULL values exist')
        console.log('Please update these records with valid header_image_id values first')
        return
      }
      
      // Restore the NOT NULL constraint
      await db.execute(sql`
        ALTER TABLE blogs 
        ALTER COLUMN header_image_id SET NOT NULL
      `)
      
      console.log('Successfully restored NOT NULL constraint to header_image_id column')
    } else {
      console.log('header_image_id column is already NOT NULL, no changes needed')
    }

    console.log('Rollback completed successfully')
    
  } catch (error) {
    console.error('Rollback failed:', error)
    throw error
  }
} 