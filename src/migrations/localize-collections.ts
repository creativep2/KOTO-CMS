import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  console.log('Starting localization migration for HeroBanner, JobPosts, and Merchandise...')

  // ========================================
  // HERO BANNER LOCALIZATION
  // ========================================
  console.log('Processing HeroBanner collection...')
  
  // Check if hero_banners_locales table exists
  const heroBannerLocalesExists = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = 'hero_banners_locales'
    )
  `)

  if (!heroBannerLocalesExists.rows[0].exists) {
    // Create hero_banners_locales table
    await db.execute(sql`
      CREATE TABLE hero_banners_locales (
        id SERIAL PRIMARY KEY,
        _parent_id INTEGER NOT NULL REFERENCES hero_banners(id) ON DELETE CASCADE,
        _locale VARCHAR(10) NOT NULL,
        title TEXT,
        tagline TEXT,
        description TEXT,
        button TEXT,
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
  }

  // Get all existing hero banners
  const heroBanners = await db.execute(sql`
    SELECT id, title, tagline, description, button, button_link
    FROM hero_banners 
    WHERE title IS NOT NULL
  `)

  console.log(`Found ${heroBanners.rows.length} hero banners to localize`)

  // Create localized versions for each hero banner
  for (const banner of heroBanners.rows) {
    // Insert English version
    await db.execute(sql`
      INSERT INTO hero_banners_locales (_parent_id, _locale, title, tagline, description, button, button_link)
      VALUES (${banner.id}, 'en', ${banner.title || 'Untitled'}, ${banner.tagline || ''}, ${banner.description || ''}, ${banner.button || ''}, ${banner.button_link || ''})
      ON CONFLICT (_parent_id, _locale) DO UPDATE SET
        title = EXCLUDED.title,
        tagline = EXCLUDED.tagline,
        description = EXCLUDED.description,
        button = EXCLUDED.button,
        button_link = EXCLUDED.button_link,
        updated_at = CURRENT_TIMESTAMP
    `)

    // Insert Vietnamese version
    await db.execute(sql`
      INSERT INTO hero_banners_locales (_parent_id, _locale, title, tagline, description, button, button_link)
      VALUES (${banner.id}, 'vi', ${banner.title || 'Untitled'}, ${banner.tagline || ''}, ${banner.description || ''}, ${banner.button || ''}, ${banner.button_link || ''})
      ON CONFLICT (_parent_id, _locale) DO UPDATE SET
        title = EXCLUDED.title,
        tagline = EXCLUDED.tagline,
        description = EXCLUDED.description,
        button = EXCLUDED.button,
        button_link = EXCLUDED.button_link,
        updated_at = CURRENT_TIMESTAMP
    `)
  }

  // Remove old localized columns from hero_banners table
  const heroBannerColumns = await db.execute(sql`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'hero_banners'
  `)
  
  const heroBannerExistingColumns = heroBannerColumns.rows.map(row => row.column_name)
  
  if (heroBannerExistingColumns.includes('title')) {
    await db.execute(sql`ALTER TABLE hero_banners DROP COLUMN title`)
    console.log('Removed title column from hero_banners table')
  }
  if (heroBannerExistingColumns.includes('tagline')) {
    await db.execute(sql`ALTER TABLE hero_banners DROP COLUMN tagline`)
    console.log('Removed tagline column from hero_banners table')
  }
  if (heroBannerExistingColumns.includes('description')) {
    await db.execute(sql`ALTER TABLE hero_banners DROP COLUMN description`)
    console.log('Removed description column from hero_banners table')
  }
  if (heroBannerExistingColumns.includes('button')) {
    await db.execute(sql`ALTER TABLE hero_banners DROP COLUMN button`)
    console.log('Removed button column from hero_banners table')
  }
  if (heroBannerExistingColumns.includes('button_link')) {
    await db.execute(sql`ALTER TABLE hero_banners DROP COLUMN button_link`)
    console.log('Removed button_link column from hero_banners table')
  }

  // ========================================
  // JOB POSTS LOCALIZATION
  // ========================================
  console.log('Processing JobPosts collection...')
  
  // Check if job_posts_locales table exists
  const jobPostsLocalesExists = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = 'job_posts_locales'
    )
  `)

  if (!jobPostsLocalesExists.rows[0].exists) {
    // Create job_posts_locales table
    await db.execute(sql`
      CREATE TABLE job_posts_locales (
        id SERIAL PRIMARY KEY,
        _parent_id INTEGER NOT NULL REFERENCES job_posts(id) ON DELETE CASCADE,
        _locale VARCHAR(10) NOT NULL,
        title TEXT,
        location TEXT,
        summary TEXT,
        description JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(_parent_id, _locale)
      )
    `)
    
    // Create index
    await db.execute(sql`
      CREATE INDEX idx_job_posts_locales_parent_locale 
      ON job_posts_locales(_parent_id, _locale)
    `)
  }

  // Get all existing job posts
  const jobPosts = await db.execute(sql`
    SELECT id, title, location, summary, description
    FROM job_posts 
    WHERE title IS NOT NULL
  `)

  console.log(`Found ${jobPosts.rows.length} job posts to localize`)

  // Create localized versions for each job post
  for (const job of jobPosts.rows) {
    // Insert English version
    await db.execute(sql`
      INSERT INTO job_posts_locales (_parent_id, _locale, title, location, summary, description)
      VALUES (${job.id}, 'en', ${job.title || 'Untitled'}, ${job.location || ''}, ${job.summary || ''}, ${job.description || '{}'})
      ON CONFLICT (_parent_id, _locale) DO UPDATE SET
        title = EXCLUDED.title,
        location = EXCLUDED.location,
        summary = EXCLUDED.summary,
        description = EXCLUDED.description,
        updated_at = CURRENT_TIMESTAMP
    `)

    // Insert Vietnamese version
    await db.execute(sql`
      INSERT INTO job_posts_locales (_parent_id, _locale, title, location, summary, description)
      VALUES (${job.id}, 'vi', ${job.title || 'Untitled'}, ${job.location || ''}, ${job.summary || ''}, ${job.description || '{}'})
      ON CONFLICT (_parent_id, _locale) DO UPDATE SET
        title = EXCLUDED.title,
        location = EXCLUDED.location,
        summary = EXCLUDED.summary,
        description = EXCLUDED.description,
        updated_at = CURRENT_TIMESTAMP
    `)
  }

  // Remove old localized columns from job_posts table
  const jobPostsColumns = await db.execute(sql`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'job_posts'
  `)
  
  const jobPostsExistingColumns = jobPostsColumns.rows.map(row => row.column_name)
  
  if (jobPostsExistingColumns.includes('title')) {
    await db.execute(sql`ALTER TABLE job_posts DROP COLUMN title`)
    console.log('Removed title column from job_posts table')
  }
  if (jobPostsExistingColumns.includes('location')) {
    await db.execute(sql`ALTER TABLE job_posts DROP COLUMN location`)
    console.log('Removed location column from job_posts table')
  }
  if (jobPostsExistingColumns.includes('summary')) {
    await db.execute(sql`ALTER TABLE job_posts DROP COLUMN summary`)
    console.log('Removed summary column from job_posts table')
  }
  if (jobPostsExistingColumns.includes('description')) {
    await db.execute(sql`ALTER TABLE job_posts DROP COLUMN description`)
    console.log('Removed description column from job_posts table')
  }

  // ========================================
  // MERCHANDISE LOCALIZATION
  // ========================================
  console.log('Processing Merchandise collection...')
  
  // Check if merchandise_locales table exists
  const merchandiseLocalesExists = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = 'merchandise_locales'
    )
  `)

  if (!merchandiseLocalesExists.rows[0].exists) {
    // Create merchandise_locales table
    await db.execute(sql`
      CREATE TABLE merchandise_locales (
        id SERIAL PRIMARY KEY,
        _parent_id INTEGER NOT NULL REFERENCES merchandise(id) ON DELETE CASCADE,
        _locale VARCHAR(10) NOT NULL,
        organization_name TEXT,
        product_name TEXT,
        price NUMERIC,
        description TEXT,
        status TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(_parent_id, _locale)
      )
    `)
    
    // Create index
    await db.execute(sql`
      CREATE INDEX idx_merchandise_locales_parent_locale 
      ON merchandise_locales(_parent_id, _locale)
    `)
  }

  // Get all existing merchandise
  const merchandise = await db.execute(sql`
    SELECT id, organization_name, product_name, price, description, status
    FROM merchandise 
    WHERE product_name IS NOT NULL
  `)

  console.log(`Found ${merchandise.rows.length} merchandise items to localize`)

  // Create localized versions for each merchandise item
  for (const item of merchandise.rows) {
    // Insert English version
    await db.execute(sql`
      INSERT INTO merchandise_locales (_parent_id, _locale, organization_name, product_name, price, description, status)
      VALUES (${item.id}, 'en', ${item.organization_name || ''}, ${item.product_name || 'Untitled'}, ${item.price || 0}, ${item.description || ''}, ${item.status || 'available'})
      ON CONFLICT (_parent_id, _locale) DO UPDATE SET
        organization_name = EXCLUDED.organization_name,
        product_name = EXCLUDED.product_name,
        price = EXCLUDED.price,
        description = EXCLUDED.description,
        status = EXCLUDED.status,
        updated_at = CURRENT_TIMESTAMP
    `)

    // Insert Vietnamese version
    await db.execute(sql`
      INSERT INTO merchandise_locales (_parent_id, _locale, organization_name, product_name, price, description, status)
      VALUES (${item.id}, 'vi', ${item.organization_name || ''}, ${item.product_name || 'Untitled'}, ${item.price || 0}, ${item.description || ''}, ${item.status || 'available'})
      ON CONFLICT (_parent_id, _locale) DO UPDATE SET
        organization_name = EXCLUDED.organization_name,
        product_name = EXCLUDED.product_name,
        price = EXCLUDED.price,
        description = EXCLUDED.description,
        status = EXCLUDED.status,
        updated_at = CURRENT_TIMESTAMP
    `)
  }

  // Remove old localized columns from merchandise table
  const merchandiseColumns = await db.execute(sql`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'merchandise'
  `)
  
  const merchandiseExistingColumns = merchandiseColumns.rows.map(row => row.column_name)
  
  if (merchandiseExistingColumns.includes('organization_name')) {
    await db.execute(sql`ALTER TABLE merchandise DROP COLUMN organization_name`)
    console.log('Removed organization_name column from merchandise table')
  }
  if (merchandiseExistingColumns.includes('product_name')) {
    await db.execute(sql`ALTER TABLE merchandise DROP COLUMN product_name`)
    console.log('Removed product_name column from merchandise table')
  }
  if (merchandiseExistingColumns.includes('price')) {
    await db.execute(sql`ALTER TABLE merchandise DROP COLUMN price`)
    console.log('Removed price column from merchandise table')
  }
  if (merchandiseExistingColumns.includes('description')) {
    await db.execute(sql`ALTER TABLE merchandise DROP COLUMN description`)
    console.log('Removed description column from merchandise table')
  }
  if (merchandiseExistingColumns.includes('status')) {
    await db.execute(sql`ALTER TABLE merchandise DROP COLUMN status`)
    console.log('Removed status column from merchandise table')
  }

  console.log('Localization migration completed successfully for all collections!')
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  console.log('Rolling back localization changes...')

  // ========================================
  // RESTORE HERO BANNER COLUMNS
  // ========================================
  try {
    await db.execute(sql`ALTER TABLE hero_banners ADD COLUMN title TEXT`)
    await db.execute(sql`ALTER TABLE hero_banners ADD COLUMN tagline TEXT`)
    await db.execute(sql`ALTER TABLE hero_banners ADD COLUMN description TEXT`)
    await db.execute(sql`ALTER TABLE hero_banners ADD COLUMN button TEXT`)
    await db.execute(sql`ALTER TABLE hero_banners ADD COLUMN button_link TEXT`)
    
    // Copy data back from hero_banners_locales (English locale)
    await db.execute(sql`
      UPDATE hero_banners hb 
      SET 
        title = hbl.title,
        tagline = hbl.tagline,
        description = hbl.description,
        button = hbl.button,
        button_link = hbl.button_link
      FROM hero_banners_locales hbl 
      WHERE hbl._parent_id = hb.id AND hbl._locale = 'en'
    `)
    
    console.log('Restored hero_banners columns')
  } catch (error) {
    console.log('Error restoring hero_banners:', error)
  }

  // ========================================
  // RESTORE JOB POSTS COLUMNS
  // ========================================
  try {
    await db.execute(sql`ALTER TABLE job_posts ADD COLUMN title TEXT`)
    await db.execute(sql`ALTER TABLE job_posts ADD COLUMN location TEXT`)
    await db.execute(sql`ALTER TABLE job_posts ADD COLUMN summary TEXT`)
    await db.execute(sql`ALTER TABLE job_posts ADD COLUMN description JSONB`)
    
    // Copy data back from job_posts_locales (English locale)
    await db.execute(sql`
      UPDATE job_posts jp 
      SET 
        title = jpl.title,
        location = jpl.location,
        summary = jpl.summary,
        description = jpl.description
      FROM job_posts_locales jpl 
      WHERE jpl._parent_id = jp.id AND jpl._locale = 'en'
    `)
    
    console.log('Restored job_posts columns')
  } catch (error) {
    console.log('Error restoring job_posts:', error)
  }

  // ========================================
  // RESTORE MERCHANDISE COLUMNS
  // ========================================
  try {
    await db.execute(sql`ALTER TABLE merchandise ADD COLUMN organization_name TEXT`)
    await db.execute(sql`ALTER TABLE merchandise ADD COLUMN product_name TEXT`)
    await db.execute(sql`ALTER TABLE merchandise ADD COLUMN price NUMERIC`)
    await db.execute(sql`ALTER TABLE merchandise ADD COLUMN description TEXT`)
    await db.execute(sql`ALTER TABLE merchandise ADD COLUMN status TEXT`)
    
    // Copy data back from merchandise_locales (English locale)
    await db.execute(sql`
      UPDATE merchandise m 
      SET 
        organization_name = ml.organization_name,
        product_name = ml.product_name,
        price = ml.price,
        description = ml.description,
        status = ml.status
      FROM merchandise_locales ml 
      WHERE ml._parent_id = m.id AND ml._locale = 'en'
    `)
    
    console.log('Restored merchandise columns')
  } catch (error) {
    console.log('Error restoring merchandise:', error)
  }

  // Drop the locales tables
  try {
    await db.execute(sql`DROP TABLE IF EXISTS hero_banners_locales`)
    await db.execute(sql`DROP TABLE IF EXISTS job_posts_locales`)
    await db.execute(sql`DROP TABLE IF EXISTS merchandise_locales`)
    console.log('Dropped locales tables')
  } catch (error) {
    console.log('Error dropping tables:', error)
  }
} 