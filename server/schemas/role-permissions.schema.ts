import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  json,
} from 'drizzle-orm/mysql-core';
import type { H3Event } from 'h3';

export const rolePermissionsSchema = mysqlTable('role_permissions', {
  id: int().primaryKey().autoincrement(),
  role: varchar('role', { length: 100 }),
  permissions: json('permissions').default([]),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp(),
  deleted_at: timestamp(),
});

export const rolePermissionMapping = (event: H3Event, obj: any) => {
  if (!obj) return null;

  return {
    ...obj,
    role_detail: $arrayFindObject(constItemsUserRole(event), obj.role, 'value'),
  };
};
