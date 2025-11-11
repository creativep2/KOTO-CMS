
import * as migration_localize_blogs from './localize-blogs';
import * as migration_localize_collections from './localize-collections';
import * as migration_localize_pages from './localize-pages';
import * as migration_add_editor_roles from './add-editor-roles';

export const migrations = [
  {
    up: migration_localize_blogs.up,
    down: migration_localize_blogs.down,
    name: 'localize-blogs',
  },
  {
    up: migration_localize_collections.up,
    down: migration_localize_collections.down,
    name: 'localize_collections'
  },
  {
    up: migration_localize_pages.up,
    down: migration_localize_pages.down,
    name: 'localize_pages'
  },
  {
    up: migration_add_editor_roles.up,
    down: migration_add_editor_roles.down,
    name: 'add_editor_roles'
  },
];
