import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  console.log('Creating Pages collection tables...')

  // Create main pages table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS pages (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(255) UNIQUE,
      slug_lock BOOLEAN DEFAULT true,
      meta_image_id INTEGER REFERENCES media(id),
      status VARCHAR(20) DEFAULT 'draft',
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `)

  // Create pages_locales table for localized content
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS pages_locales (
      id SERIAL PRIMARY KEY,
      _parent_id INTEGER NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
      _locale VARCHAR(10) NOT NULL,
      title VARCHAR(255) NOT NULL,
      meta_title VARCHAR(255),
      meta_description TEXT,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(_parent_id, _locale)
    )
  `)

  // Create pages_content_headers table for content headers array
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS pages_content_headers (
      id SERIAL PRIMARY KEY,
      _parent_id INTEGER NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
      _locale VARCHAR(10) NOT NULL,
      _order INTEGER NOT NULL,
      header TEXT NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `)

  // Create pages_content_rows table for content rows array
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS pages_content_rows (
      id SERIAL PRIMARY KEY,
      _parent_id INTEGER NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
      _locale VARCHAR(10) NOT NULL,
      _order INTEGER NOT NULL,
      row TEXT NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `)

  // Create indexes for better performance
  await db.execute(sql`CREATE INDEX IF NOT EXISTS pages_slug_idx ON pages(slug)`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS pages_locales_parent_idx ON pages_locales(_parent_id)`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS pages_locales_locale_idx ON pages_locales(_locale)`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS pages_content_headers_parent_idx ON pages_content_headers(_parent_id)`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS pages_content_headers_locale_idx ON pages_content_headers(_locale)`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS pages_content_rows_parent_idx ON pages_content_rows(_parent_id)`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS pages_content_rows_locale_idx ON pages_content_rows(_locale)`)

  // Check if payload_locked_documents_rels table exists and add pages_id column if needed
  try {
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'payload_locked_documents_rels'
      )
    `)

    if (tableExists.rows[0].exists) {
      // Check if pages_id column already exists
      const columnExists = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'payload_locked_documents_rels' AND column_name = 'pages_id'
        )
      `)

      if (!columnExists.rows[0].exists) {
        // Add pages_id column to payload_locked_documents_rels table
        await db.execute(sql`
          ALTER TABLE payload_locked_documents_rels 
          ADD COLUMN pages_id INTEGER REFERENCES pages(id)
        `)
        console.log('Added pages_id column to payload_locked_documents_rels table')
      } else {
        console.log('pages_id column already exists in payload_locked_documents_rels table')
      }
    } else {
      console.log('payload_locked_documents_rels table does not exist, skipping relationship setup')
    }
  } catch (error) {
    console.error('Error setting up relationship tables:', error)
  }

  console.log('Created pages and pages_locales tables')

  // Insert sample pages data
  try {
    // Create sample home page
    const homePageResult = await db.execute(sql`
      INSERT INTO pages (slug, slug_lock, meta_image_id, status)
      VALUES ('home', true, NULL, 'published')
      RETURNING id
    `)
    
    const homePageId = homePageResult.rows[0]?.id

    if (homePageId) {
      // English version
      await db.execute(sql`
        INSERT INTO pages_locales (_parent_id, _locale, title, meta_title, meta_description)
        VALUES (
          ${homePageId}, 
          'en', 
          'Home Page',
          'Welcome to Our Website',
          'The main landing page with key information and navigation.'
        )
      `)

      // Insert English content headers
      await db.execute(sql`
        INSERT INTO pages_content_headers (_parent_id, _locale, _order, header)
        VALUES 
          (${homePageId}, 'en', 0, 'Section'),
          (${homePageId}, 'en', 1, 'Content'),
          (${homePageId}, 'en', 2, 'Priority')
      `)

      // Insert English content rows
      await db.execute(sql`
        INSERT INTO pages_content_rows (_parent_id, _locale, _order, row)
        VALUES 
          (${homePageId}, 'en', 0, 'Hero Banner|Welcome message and call-to-action|High'),
          (${homePageId}, 'en', 1, 'Features|Key product/service highlights|Medium'),
          (${homePageId}, 'en', 2, 'Testimonials|Customer feedback and reviews|Low')
      `)

      // Vietnamese version
      await db.execute(sql`
        INSERT INTO pages_locales (_parent_id, _locale, title, meta_title, meta_description)
        VALUES (
          ${homePageId}, 
          'vi', 
          'Trang Chủ',
          'Chào Mừng Đến Với Website Của Chúng Tôi',
          'Trang đích chính với thông tin quan trọng và điều hướng.'
        )
      `)

      // Insert Vietnamese content headers
      await db.execute(sql`
        INSERT INTO pages_content_headers (_parent_id, _locale, _order, header)
        VALUES 
          (${homePageId}, 'vi', 0, 'Phần'),
          (${homePageId}, 'vi', 1, 'Nội dung'),
          (${homePageId}, 'vi', 2, 'Ưu tiên')
      `)

      // Insert Vietnamese content rows
      await db.execute(sql`
        INSERT INTO pages_content_rows (_parent_id, _locale, _order, row)
        VALUES 
          (${homePageId}, 'vi', 0, 'Biểu ngữ chính|Thông điệp chào mừng và kêu gọi hành động|Cao'),
          (${homePageId}, 'vi', 1, 'Tính năng|Điểm nổi bật của sản phẩm/dịch vụ|Trung bình'),
          (${homePageId}, 'vi', 2, 'Đánh giá|Phản hồi và đánh giá của khách hàng|Thấp')
      `)
    }

    // Create sample about page
    const aboutPageResult = await db.execute(sql`
      INSERT INTO pages (slug, slug_lock, meta_image_id, status)
      VALUES ('about', true, NULL, 'published')
      RETURNING id
    `)
    
    const aboutPageId = aboutPageResult.rows[0]?.id

    if (aboutPageId) {
      // English version
      await db.execute(sql`
        INSERT INTO pages_locales (_parent_id, _locale, title, meta_title, meta_description)
        VALUES (
          ${aboutPageId}, 
          'en', 
          'About Us',
          'About Our Company',
          'Learn more about our mission, vision, and team.'
        )
      `)

      // Insert English content headers
      await db.execute(sql`
        INSERT INTO pages_content_headers (_parent_id, _locale, _order, header)
        VALUES 
          (${aboutPageId}, 'en', 0, 'Topic'),
          (${aboutPageId}, 'en', 1, 'Description'),
          (${aboutPageId}, 'en', 2, 'Details')
      `)

      // Insert English content rows
      await db.execute(sql`
        INSERT INTO pages_content_rows (_parent_id, _locale, _order, row)
        VALUES 
          (${aboutPageId}, 'en', 0, 'Our Mission|To provide excellent service|We strive to exceed customer expectations'),
          (${aboutPageId}, 'en', 1, 'Our Team|Experienced professionals|Dedicated experts in their fields'),
          (${aboutPageId}, 'en', 2, 'Our Values|Integrity, Innovation, Excellence|Core principles that guide our work')
      `)

      // Vietnamese version
      await db.execute(sql`
        INSERT INTO pages_locales (_parent_id, _locale, title, meta_title, meta_description)
        VALUES (
          ${aboutPageId}, 
          'vi', 
          'Về Chúng Tôi',
          'Về Công Ty Chúng Tôi',
          'Tìm hiểu thêm về sứ mệnh, tầm nhìn và đội ngũ của chúng tôi.'
        )
      `)

      // Insert Vietnamese content headers
      await db.execute(sql`
        INSERT INTO pages_content_headers (_parent_id, _locale, _order, header)
        VALUES 
          (${aboutPageId}, 'vi', 0, 'Chủ đề'),
          (${aboutPageId}, 'vi', 1, 'Mô tả'),
          (${aboutPageId}, 'vi', 2, 'Chi tiết')
      `)

      // Insert Vietnamese content rows
      await db.execute(sql`
        INSERT INTO pages_content_rows (_parent_id, _locale, _order, row)
        VALUES 
          (${aboutPageId}, 'vi', 0, 'Sứ mệnh|Cung cấp dịch vụ xuất sắc|Chúng tôi nỗ lực vượt qua mong đợi của khách hàng'),
          (${aboutPageId}, 'vi', 1, 'Đội ngũ|Chuyên gia giàu kinh nghiệm|Các chuyên gia tận tâm trong lĩnh vực của họ'),
          (${aboutPageId}, 'vi', 2, 'Giá trị|Chính trực, Đổi mới, Xuất sắc|Nguyên tắc cốt lõi hướng dẫn công việc của chúng tôi')
      `)
    }

    console.log('Inserted sample pages data')
  } catch (error) {
    console.error('Error inserting sample data:', error)
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  console.log('Dropping Pages collection tables...')

  // Check if payload_locked_documents_rels table exists and remove pages_id column if needed
  try {
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'payload_locked_documents_rels'
      )
    `)

    if (tableExists.rows[0].exists) {
      // Check if pages_id column exists
      const columnExists = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'payload_locked_documents_rels' AND column_name = 'pages_id'
        )
      `)

      if (columnExists.rows[0].exists) {
        // Remove pages_id column from payload_locked_documents_rels table
        await db.execute(sql`
          ALTER TABLE payload_locked_documents_rels 
          DROP COLUMN pages_id
        `)
        console.log('Removed pages_id column from payload_locked_documents_rels table')
      }
    }
  } catch (error) {
    console.error('Error cleaning up relationship tables:', error)
  }

  // Drop indexes first
  await db.execute(sql`DROP INDEX IF EXISTS pages_content_rows_locale_idx`)
  await db.execute(sql`DROP INDEX IF EXISTS pages_content_rows_parent_idx`)
  await db.execute(sql`DROP INDEX IF EXISTS pages_content_headers_locale_idx`)
  await db.execute(sql`DROP INDEX IF EXISTS pages_content_headers_parent_idx`)
  await db.execute(sql`DROP INDEX IF EXISTS pages_locales_locale_idx`)
  await db.execute(sql`DROP INDEX IF EXISTS pages_locales_parent_idx`)
  await db.execute(sql`DROP INDEX IF EXISTS pages_slug_idx`)

  // Drop tables (foreign key constraints will handle cascading)
  await db.execute(sql`DROP TABLE IF EXISTS pages_content_rows`)
  await db.execute(sql`DROP TABLE IF EXISTS pages_content_headers`)
  await db.execute(sql`DROP TABLE IF EXISTS pages_locales`)
  await db.execute(sql`DROP TABLE IF EXISTS pages`)

  console.log('Dropped pages and pages_locales tables')
} 