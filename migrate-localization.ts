// scripts/migrate-localization.ts
import payload, { CollectionSlug } from 'payload';
import dotenv from 'dotenv';
import { Blogs } from './src/collections/Blogs';
import config from './src/payload.config';
dotenv.config();

const LOCALES = ['en', 'vi'];
const DEFAULT_LOCALE = 'en';

async function migrateCollection(slug: CollectionSlug, localizedFields: string[]) {
  console.log(`Migrating collection: ${slug}`);
  const { docs } = await payload.find({
    collection: slug,
    limit: 1000, // adjust if needed
    depth: 0
  });

  for (const doc of docs) {
    const updatedData: Record<string, any> = {};

    localizedFields.forEach((field) => {
        const docData = doc as Record<string, any>;
        if (docData[field] && typeof docData[field] !== 'object') {
          updatedData[field] = {
            [DEFAULT_LOCALE]: docData[field]
          };
        }
      });

    if (Object.keys(updatedData).length > 0) {
      await payload.update({
        collection: slug,
        id: doc.id,
        data: updatedData
      });
    }
  }
}

(async () => {
    await payload.init({
      config,
    });

    const migrations: { slug: CollectionSlug; fields: string[] }[] = [
        { slug: 'blogs', fields: ['title'] }
      ];
      
      for (const { slug, fields } of migrations) {
        await migrateCollection(slug, fields);
      }

  console.log('✅ Localization migration complete');
  process.exit(0);
})();
