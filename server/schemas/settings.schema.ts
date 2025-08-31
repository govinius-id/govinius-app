import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  text,
} from 'drizzle-orm/mysql-core';
import type { H3Event } from 'h3';

export const settingsSchema = mysqlTable('settings', {
  id: int().primaryKey().autoincrement(),
  key: varchar('key', { length: 255 }),
  value: varchar('value', { length: 255 }),
  description: text(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp(),
  deleted_at: timestamp(),
});

export const settingMapping = (event: H3Event, obj: any) => {
  if (!obj) return null;

  return {
    ...obj,
  };
};
