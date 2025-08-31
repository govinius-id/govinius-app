import argon2 from 'argon2';
import type { H3Event } from 'h3';
import { and, eq, count, isNull, like, or, not, desc } from 'drizzle-orm';

const create = async (event: H3Event, payload: any) => {
  await validateUnique(event, null, payload);

  const userUuid = $uuidv4();

  if (payload.file_picture) {
    payload.picture = await uploadPicture(event, payload, userUuid);
  }

  let passwordHashed;
  try {
    passwordHashed = await argon2.hash(payload.password!);
  } catch (error: any) {
    throw createError({
      statusCode: 422,
      message: error,
    });
  }

  const userQuery = await $drizzle(event)
    .insert(usersSchema)
    .values({
      uuid: userUuid,
      name: payload.name,
      username: payload.username,
      email: payload.email,
      password: passwordHashed,
      role: payload.role,
      picture: payload.picture,
      is_active: payload.is_active,
      created_at: $dayjs(event).tz().toDate(),
    })
    .$returningId();

  const user = await findOne(event, userQuery?.[0]?.id);

  return user;
};

const findAll = async (event: H3Event, payload: any) => {
  const page = +payload.page || 1;
  const perPage = +payload.per_page || 10;
  const offset = (page - 1) * perPage;
  const whereClause = [];

  whereClause.push(isNull(usersSchema.deleted_at));

  if (payload.search) {
    whereClause.push(
      or(
        like(usersSchema.name, `%${payload.search}%`),
        like(usersSchema.email, `%${payload.search}%`),
      ),
    );
  }

  if (payload.role) {
    whereClause.push(eq(usersSchema.role, payload.role));
  }

  if (payload.active_status === 'ACTIVE') {
    whereClause.push(eq(usersSchema.is_active, true));
  } else if (payload.active_status === 'INACTIVE') {
    whereClause.push(eq(usersSchema.is_active, false));
  }

  const usersQuery = await $drizzle(event)
    .select({
      id: usersSchema.id,
      uuid: usersSchema.uuid,
      name: usersSchema.name,
      username: usersSchema.username,
      email: usersSchema.email,
      role: usersSchema.role,
      picture: usersSchema.picture,
      email_verified_at: usersSchema.email_verified_at,
      is_email_verified: usersSchema.is_email_verified,
      is_active: usersSchema.is_active,
      created_at: usersSchema.created_at,
    })
    .from(usersSchema)
    .where(and(...whereClause))
    .orderBy(desc(usersSchema.id))
    .limit(perPage)
    .offset(offset);

  const users = usersQuery?.map((obj: any) => {
    return userMapping(event, obj);
  });

  const userCountQuery = await $drizzle(event)
    .select({
      count: count(usersSchema.id),
    })
    .from(usersSchema)
    .where(and(...whereClause));

  const userCount = userCountQuery?.[0]?.count;

  const data = {
    rows: users,
    count: userCount,
  };

  return data;
};

const findOne = async (event: H3Event, id: number) => {
  const whereClause = [];
  whereClause.push(eq(usersSchema.id, id));
  whereClause.push(isNull(usersSchema.deleted_at));

  const userQuery = await $drizzle(event)
    .select({
      id: usersSchema.id,
      uuid: usersSchema.uuid,
      name: usersSchema.name,
      username: usersSchema.username,
      email: usersSchema.email,
      role: usersSchema.role,
      permissions: usersSchema.permissions,
      picture: usersSchema.picture,
      email_verified_at: usersSchema.email_verified_at,
      is_email_verified: usersSchema.is_email_verified,
      is_active: usersSchema.is_active,
      is_role_permission_custom: usersSchema.is_role_permission_custom,
      created_at: usersSchema.created_at,
    })
    .from(usersSchema)
    .where(and(...whereClause));

  const user = userMapping(event, userQuery?.[0]);

  if (!user) {
    throw createError({
      statusCode: 404,
      message: $i18n(event).t('validator.not_found', {
        value: $i18n(event).t('common.user'),
      }),
    });
  }

  return user;
};

const update = async (event: H3Event, id: number, payload: any) => {
  await validateUnique(event, id, payload);

  const userOld = await findOneOrError(event, id);

  if (payload.file_picture) {
    payload.picture = await uploadPicture(event, payload, userOld.uuid!);
  }

  let emailVerifiedAt = userOld.email_verified_at;
  let isEmailVerified = userOld.is_email_verified;
  if (payload.email !== userOld.email) {
    emailVerifiedAt = null;
    isEmailVerified = false;
  }

  let passwordHashed = userOld.password;
  if (payload.password) {
    try {
      passwordHashed = await argon2.hash(payload.password);
    } catch (error: any) {
      throw createError({
        statusCode: 422,
        message: error,
      });
    }
  }

  await $drizzle(event)
    .update(usersSchema)
    .set({
      name: payload.name,
      username: payload.username,
      email: payload.email,
      password: passwordHashed,
      role: payload.role,
      picture: payload.picture,
      email_verified_at: emailVerifiedAt,
      is_email_verified: isEmailVerified,
      is_active: payload.is_active,
      updated_at: $dayjs(event).tz().toDate(),
    })
    .where(eq(usersSchema.id, id));

  const user = await findOne(event, id);

  return user;
};

const remove = async (event: H3Event, id: number) => {
  await findOneOrError(event, id);

  await $drizzle(event)
    .update(usersSchema)
    .set({
      deleted_at: $dayjs(event).tz().toDate(),
    })
    .where(eq(usersSchema.id, id));

  return true;
};

const uploadPicture = async (
  event: H3Event,
  payload: any,
  userUuid: string,
) => {
  const [compressedImagePath, compressedSmallImagePath] = await Promise.all([
    $sharpCompressImage({
      file_src_path: payload.file_picture.filepath,
      size: 'md',
    }),
    $sharpCompressImage({
      file_src_path: payload.file_picture.filepath,
      size: 'sm',
    }),
  ]);

  const [picturePath] = await Promise.all([
    $fileUploadSaveToStorage({
      file_name: 'default.webp',
      file_src_path: compressedImagePath,
      save_directory: `user/picture/${userUuid}`,
      is_private: true,
    }),
    $fileUploadSaveToStorage({
      file_name: 'sm.webp',
      file_src_path: compressedSmallImagePath,
      save_directory: `user/picture/${userUuid}`,
      is_private: true,
    }),
  ]);

  $garbageCollection();

  return picturePath;
};

const rolePermission = async (event: H3Event, id: number, payload: any) => {
  $validateRolePermission(event, $userPermissionMatch(event, ['USER_UPDATE']));

  let permissions = [];
  if (payload.is_role_permission_custom) {
    permissions = payload.permissions;
  }

  await $drizzle(event)
    .update(usersSchema)
    .set({
      permissions: permissions,
      is_role_permission_custom: payload.is_role_permission_custom,
      updated_at: $dayjs(event).tz().toDate(),
    })
    .where(eq(usersSchema.id, id));

  const user = await findOne(event, id);

  return user;
};

const findOneOrError = async (event: H3Event, id: number) => {
  const whereClause = [];
  whereClause.push(eq(usersSchema.id, id));
  whereClause.push(isNull(usersSchema.deleted_at));

  const userQuery = await $drizzle(event)
    .select()
    .from(usersSchema)
    .where(and(...whereClause));

  const user = userQuery?.[0];

  if (!user) {
    throw createError({
      statusCode: 404,
      message: $i18n(event).t('validator.not_found', {
        value: $i18n(event).t('common.user'),
      }),
    });
  }

  return user;
};

const validateUnique = async (
  event: H3Event,
  excludeId?: number | null,
  payload?: any,
) => {
  const whereClause = [];

  whereClause.push(isNull(usersSchema.deleted_at));

  if (excludeId) {
    whereClause.push(not(eq(usersSchema.id, excludeId)));
  }

  if (payload.email) {
    const userQuery = await $drizzle(event)
      .select({ id: usersSchema.id })
      .from(usersSchema)
      .where(and(eq(usersSchema.email, payload.email), ...whereClause))
      .limit(1);

    const user = userQuery?.[0];

    if (user) {
      throw createError({
        statusCode: 422,
        message: $i18n(event).t('validator.already_exists', {
          value: `${$i18n(event).t('common.email')} ${payload.email}`,
        }),
      });
    }
  }

  if (payload.username) {
    const userQuery = await $drizzle(event)
      .select({ id: usersSchema.id })
      .from(usersSchema)
      .where(and(eq(usersSchema.username, payload.username), ...whereClause))
      .limit(1);

    const user = userQuery?.[0];

    if (user) {
      throw createError({
        statusCode: 422,
        message: $i18n(event).t('validator.already_exists', {
          value: `${$i18n(event).t('common.username')} ${payload.username}`,
        }),
      });
    }
  }
};

export default {
  create,
  findAll,
  findOne,
  update,
  remove,
  rolePermission,
  findOneOrError,
  validateUnique,
  uploadPicture,
};
