#!/usr/bin/env node

/**
 * Script to remove the header_image_id NOT NULL constraint from the blogs table
 * Run this script to fix the CSV import issue with header_image field
 */

const { Client } = require('pg');

async function removeHeaderImageConstraint() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Check if the blogs table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'blogs'
      )
    `);

    if (!tableExists.rows[0].exists) {
      console.log('blogs table does not exist, nothing to do');
      return;
    }

    // Check if the header_image_id column exists
    const columnExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'blogs' AND column_name = 'header_image_id'
      )
    `);

    if (!columnExists.rows[0].exists) {
      console.log('header_image_id column does not exist, nothing to do');
      return;
    }

    // Check if the column is currently NOT NULL
    const columnInfo = await client.query(`
      SELECT is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'blogs' AND column_name = 'header_image_id'
    `);

    if (columnInfo.rows[0].is_nullable === 'NO') {
      console.log('Removing NOT NULL constraint from header_image_id column...');
      
      // Remove the NOT NULL constraint
      await client.query(`
        ALTER TABLE blogs 
        ALTER COLUMN header_image_id DROP NOT NULL
      `);
      
      console.log('✅ Successfully removed NOT NULL constraint from header_image_id column');
      console.log('You can now import CSV files without header_image errors');
    } else {
      console.log('header_image_id column is already nullable, no changes needed');
    }

    // Check for foreign key constraints
    const foreignKeyConstraints = await client.query(`
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
    `);

    if (foreignKeyConstraints.rows.length > 0) {
      console.log('\n📋 Found foreign key constraints on header_image_id:');
      for (const constraint of foreignKeyConstraints.rows) {
        console.log(`- ${constraint.constraint_name}: ${constraint.table_name}.${constraint.column_name} -> ${constraint.foreign_table_name}.${constraint.foreign_column_name}`);
      }
      console.log('\nNote: Foreign key constraints are preserved and should not prevent NULL values');
    }

    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the migration
if (require.main === module) {
  removeHeaderImageConstraint()
    .then(() => {
      console.log('\n✨ All done! You can now run your CSV imports without header_image constraint errors.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { removeHeaderImageConstraint }; 