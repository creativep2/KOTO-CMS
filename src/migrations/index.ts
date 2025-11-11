
import * as migration_localize_blogs from './localize-blogs';
import * as migration_localize_collections from './localize-collections';
import * as migration_remove_header_image_constraint from './remove-header-image-constraint';
import * as migration_drop_pages_collection from './drop-pages-collection';

export const migrations = [
  {
    up: migration_localize_blogs.up,
    down: migration_localize_blogs.down,
    name: 'localize-blogs',
  },
  {
    up: migration_localize_collections.up,
    down: migration_localize_collections.down,
    name: 'localize-collections',
  },
  {
    up: migration_remove_header_image_constraint.up,
    down: migration_remove_header_image_constraint.down,
    name: 'remove-header-image-constraint'
  },

  {
    up: migration_drop_pages_collection.up,
    down: migration_drop_pages_collection.down,
    name: 'drop-pages-collection'
  },
];
