import * as migration_localize_blogs from './localize-blogs';
import * as migration_localize_collections from './localize-collections';

export const migrations = [
  {
    up: migration_localize_blogs.up,
    down: migration_localize_blogs.down,
    name: 'localize_blogs'
  },
  {
    up: migration_localize_collections.up,
    down: migration_localize_collections.down,
    name: 'localize_collections'
  },
];
