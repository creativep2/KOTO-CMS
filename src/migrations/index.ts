import * as migration_20250707_080430 from './20250707_080430';

export const migrations = [
  {
    up: migration_20250707_080430.up,
    down: migration_20250707_080430.down,
    name: '20250707_080430'
  },
];
