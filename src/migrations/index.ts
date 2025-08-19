
import * as migration_localize_blogs from './localize-blogs';
import * as migration_localize_collections from './localize-collections';
import * as migration_remove_header_image_constraint from './remove-header-image-constraint';
import * as migration_create_pages_collection from './create-pages-collection';
import * as migration_add_column_grouping from './add-column-grouping';

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
    up: migration_create_pages_collection.up,
    down: migration_create_pages_collection.down,
    name: 'create-pages-collection'
  },
  {
    up: migration_add_column_grouping.up,
    down: migration_add_column_grouping.down,
    name: 'add-column-grouping'
  },
];
