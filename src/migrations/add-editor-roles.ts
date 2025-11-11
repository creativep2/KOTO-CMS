import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  console.log('Adding blogs-editor and job-posts-editor roles to enum_users_role...')
  
  try {
    // Add the new enum values to the existing enum
    await db.execute(sql`
      ALTER TYPE enum_users_role 
      ADD VALUE IF NOT EXISTS 'blogs-editor'
    `)
    
    await db.execute(sql`
      ALTER TYPE enum_users_role 
      ADD VALUE IF NOT EXISTS 'job-posts-editor'
    `)
    
    console.log('Successfully added blogs-editor and job-posts-editor to enum_users_role')
  } catch (error: any) {
    // If the enum values already exist, that's okay
    if (error?.message?.includes('already exists')) {
      console.log('Enum values already exist, skipping...')
    } else {
      throw error
    }
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  console.log('Removing blogs-editor and job-posts-editor roles from enum_users_role...')
  
  // Note: PostgreSQL doesn't support removing enum values directly
  // We would need to recreate the enum, but that's complex and risky
  // For now, we'll just log a warning
  console.warn('PostgreSQL does not support removing enum values. Manual intervention may be required.')
  console.warn('If you need to remove these values, you would need to:')
  console.warn('1. Create a new enum without these values')
  console.warn('2. Update the users table to use the new enum')
  console.warn('3. Drop the old enum')
  console.warn('This is a destructive operation and should be done carefully.')
}

