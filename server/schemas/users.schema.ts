import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  char,
  boolean,
  json,
  index,
} from 'drizzle-orm/mysql-core';
import type { H3Event } from 'h3';

export const usersSchema = mysqlTable(
  'users',
  {
    id: int().primaryKey().autoincrement(),
    uuid: char({ length: 36 }),
    name: varchar('name', { length: 255 }).notNull(),
    username: varchar('username', { length: 255 }),
    email: varchar('email', { length: 255 }),
    password: char('password', { length: 97 }).notNull(),
    picture: varchar('picture', { length: 255 }),
    role: varchar('role', { length: 100 }),
    permissions: json('permissions').default([]),
    is_role_permission_custom: boolean().default(false),
    is_email_verified: boolean().default(false),
    is_active: boolean().default(false),
    reset_password_token: char('reset_password_token', { length: 64 }),
    reset_password_expires: timestamp(),
    email_verification_token: char('email_verification_token', { length: 64 }),
    email_verification_expires: timestamp(),
    email_verified_at: timestamp(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp(),
    deleted_at: timestamp(),
  },
  (table) => [index('email').on(table.email)],
);

export const userMapping = (event: H3Event, obj: any) => {
  if (!obj) return null;

  return {
    ...obj,
    picture_url: $fileUploadUrlStorage(obj.picture),
    picture_url_variant: {
      sm: $fileUploadUrlStorage($fileUploadPathImageSize(obj.picture, 'sm')),
    },
    role_detail: $arrayFindObject(constItemsUserRole(event), obj.role, 'value'),
  };
};
