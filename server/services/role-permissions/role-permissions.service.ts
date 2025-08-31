import type { H3Event } from 'h3';
import { and, eq, isNull } from 'drizzle-orm';

const createOrUpdate = async (event: H3Event, payload: any) => {
  const rolePermissionId: number | null = payload.id || null;

  if (rolePermissionId) {
    await findOneOrError(event, rolePermissionId);

    await $drizzle(event)
      .update(rolePermissionsSchema)
      .set({
        role: payload.role,
        permissions: payload.permissions,
        updated_at: $dayjs(event).tz().toDate(),
      })
      .where(eq(rolePermissionsSchema.id, rolePermissionId));

    return findOne(event, rolePermissionId);
  } else {
    const rolePermissionQuery = await $drizzle(event)
      .insert(rolePermissionsSchema)
      .values({
        role: payload.role,
        permissions: payload.permissions,
        created_at: $dayjs(event).tz().toDate(),
      })
      .$returningId();

    return findOne(event, rolePermissionQuery?.[0]?.id);
  }
};

const findOne = async (event: H3Event, id: number) => {
  const rolePermissionQuery = await $drizzle(event)
    .select({
      id: rolePermissionsSchema.id,
      role: rolePermissionsSchema.role,
      permissions: rolePermissionsSchema.permissions,
    })
    .from(rolePermissionsSchema)
    .where(
      and(
        eq(rolePermissionsSchema.id, id),
        isNull(rolePermissionsSchema.deleted_at),
      ),
    );

  const rolePermission = rolePermissionMapping(event, rolePermissionQuery?.[0]);

  if (!rolePermission) {
    throw createError({
      statusCode: 404,
      message: $i18n(event).t('validator.not_found', {
        value: $i18n(event).t('common.role_permission'),
      }),
    });
  }

  return rolePermission;
};

const findByRole = async (event: H3Event, payload: any) => {
  const role = payload.role || null;

  if (!role) {
    throw createError({
      statusCode: 404,
      message: $i18n(event).t('validator.not_found', {
        value: $i18n(event).t('common.role'),
      }),
    });
  }

  const rolePermissionQuery = await $drizzle(event)
    .select({
      id: rolePermissionsSchema.id,
      role: rolePermissionsSchema.role,
      permissions: rolePermissionsSchema.permissions,
    })
    .from(rolePermissionsSchema)
    .where(
      and(
        eq(rolePermissionsSchema.role, role),
        isNull(rolePermissionsSchema.deleted_at),
      ),
    );

  const rolePermission = rolePermissionMapping(event, rolePermissionQuery?.[0]);

  return rolePermission;
};

const findOneOrError = async (event: H3Event, id: number) => {
  const rolePermissionQuery = await $drizzle(event)
    .select()
    .from(rolePermissionsSchema)
    .where(
      and(
        eq(rolePermissionsSchema.id, id),
        isNull(rolePermissionsSchema.deleted_at),
      ),
    );

  const rolePermission = rolePermissionQuery?.[0];

  if (!rolePermission) {
    throw createError({
      statusCode: 404,
      message: $i18n(event).t('validator.not_found', {
        value: $i18n(event).t('common.role_permission'),
      }),
    });
  }

  return rolePermission;
};

export default {
  createOrUpdate,
  findByRole,
};
