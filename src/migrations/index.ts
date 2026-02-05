
// import * as migration_localize_blogs from './localize-blogs';
// import * as migration_localize_collections from './localize-collections';
// //import * as migration_localize_pages from './localize-pages';
// import * as migration_add_editor_roles from './add-editor-roles';
import * as migration_add_hero_banner_color_fields from './add-hero-banner-color-fields';
import * as migration_add_hero_banner_button_text from './add-hero-banner-button-text';
import * as migration_remove_hero_banner_button_text from './remove-hero-banner-button-text';
import * as migration_create_pages_collection from './create-pages-collection';
import * as migration_recreate_pages_collection from './recreate-pages-collection';
import * as migration_fix_pages_created_by_column from './fix-pages-created-by-column';

export const migrations = [
  // {
  //   up: migration_localize_blogs.up,
  //   down: migration_localize_blogs.down,
  //   name: 'localize-blogs',
  // },
  // {
  //   up: migration_localize_collections.up,
  //   down: migration_localize_collections.down,
  //   name: 'localize_collections'
  // },
  // {
  //   up: migration_add_editor_roles.up,
  //   down: migration_add_editor_roles.down,
  //   name: 'add_editor_roles'
  // },
  {
    up: migration_add_hero_banner_color_fields.up,
    down: migration_add_hero_banner_color_fields.down,
    name: 'add_hero_banner_color_fields'
  },
  {
    up: migration_add_hero_banner_button_text.up,
    down: migration_add_hero_banner_button_text.down,
    name: 'add_hero_banner_button_text'
  },
  {
    up: migration_remove_hero_banner_button_text.up,
    down: migration_remove_hero_banner_button_text.down,
    name: 'remove_hero_banner_button_text'
  },
  {
    up: migration_create_pages_collection.up,
    down: migration_create_pages_collection.down,
    name: 'create_pages_collection'
  },
  {
    up: migration_recreate_pages_collection.up,
    down: migration_recreate_pages_collection.down,
    name: 'recreate_pages_collection'
  },
  {
    up: migration_fix_pages_created_by_column.up,
    down: migration_fix_pages_created_by_column.down,
    name: 'fix_pages_created_by_column'
  },
];
