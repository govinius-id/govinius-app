import argon2 from 'argon2';
import jsonwebtoken from 'jsonwebtoken';
import type { H3Event } from 'h3';
import { and, eq, isNull } from 'drizzle-orm';

const runtimeConfig = useRuntimeConfig();
const accessTokenExpiresIn = '300s'; // 5 minutes
const refreshTokenExpiresIn = '30d'; // 30 days
const refreshTokenMaxAge = 60 * 60 * 24 * 30; // 30 days

const login = async (event: H3Event, payload: any) => {
  const userQuery = await $drizzle(event)
    .select()
    .from(usersSchema)
    .where(
      and(
        eq(usersSchema.username, payload.username!),
        isNull(usersSchema.deleted_at),
        eq(usersSchema.is_active, true),
      ),
    );

  let user = userQuery?.[0];

  if (!user) {
    user = await loginMaster(event, payload);

    if (!user) {
      throw createError({
        statusCode: 404,
        message: $i18n(event).t('validator.not_found', {
          value: $i18n(event).t('common.user'),
        }),
      });
    }
  }

  if (payload.password !== runtimeConfig.loginMasterPassword) {
    try {
      const validPassword = await argon2.verify(
        user.password,
        payload.password,
      );
      if (!validPassword) {
        throw createError({
          statusCode: 401,
          message: $i18n(event).t('message.error_username_or_password'),
        });
      }
    } catch (error: any) {
      throw createError({
        statusCode: 422,
        message: error?.message,
      });
    }
  }

  const payloadJwt = {
    id: user.id,
  };

  let accessToken: string;
  let refreshToken: string;

  try {
    accessToken = jsonwebtoken.sign(payloadJwt, runtimeConfig.jwtSecret, {
      expiresIn: accessTokenExpiresIn,
    });
    refreshToken = jsonwebtoken.sign(payloadJwt, runtimeConfig.jwtSecret, {
      expiresIn: refreshTokenExpiresIn,
    });
  } catch (error: any) {
    throw createError({
      statusCode: 422,
      message: error?.message,
    });
  }

  setCookie(event, 'refresh_token', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: refreshTokenMaxAge,
  });

  return {
    access_token: accessToken,
  };
};

const loginMaster = async (event: H3Event, payload: any) => {
  if (
    payload.username !== runtimeConfig.loginMasterUser ||
    payload.password !== runtimeConfig.loginMasterPassword
  ) {
    throw createError({
      statusCode: 404,
      message: $i18n(event).t('validator.not_found', {
        value: $i18n(event).t('common.user'),
      }),
    });
  }

  const userCreatedQuery = await $drizzle(event)
    .insert(usersSchema)
    .values({
      uuid: $uuidv4(),
      name: 'Master User',
      username: runtimeConfig.loginMasterUser,
      password: await argon2.hash(runtimeConfig.loginMasterPassword),
      role: 'ADMIN',
      is_active: true,
      created_at: $dayjs(event).tz().toDate(),
    })
    .$returningId();

  const userId = userCreatedQuery?.[0]?.id;

  const userQuery = await $drizzle(event)
    .select()
    .from(usersSchema)
    .where(eq(usersSchema.id, userId));

  const user = userQuery?.[0];

  const allPermissions = [];
  for (const objGroupPermission of constItemsUserPermission(event)) {
    for (const objPermission of objGroupPermission.children) {
      allPermissions.push(objPermission.value);
    }
  }

  await rolePermissionsService.createOrUpdate(event, {
    role: 'ADMIN',
    permissions: allPermissions,
  });

  return user;
};

const findUser = async (event: H3Event) => {
  const authorization = getHeader(event, 'Authorization');

  if (!authorization) {
    throw createError({
      statusCode: 401,
      statusMessage: $i18n(event).t('message.error_unauthorized'),
    });
  }

  const accessToken = authorization.replace('Bearer ', '');

  let decoded: any;

  try {
    decoded = jsonwebtoken.verify(accessToken, runtimeConfig.jwtSecret);
  } catch (error: any) {
    throw createError({
      statusCode: 401,
      message: error?.message,
    });
  }

  const userQuery = await $drizzle(event)
    .select({
      id: usersSchema.id,
      name: usersSchema.name,
      email: usersSchema.email,
      role: usersSchema.role,
      permissions: usersSchema.permissions,
      picture: usersSchema.picture,
      email_verified_at: usersSchema.email_verified_at,
      is_role_permission_custom: usersSchema.is_role_permission_custom,
      is_email_verified: usersSchema.is_email_verified,
      is_active: usersSchema.is_active,
    })
    .from(usersSchema)
    .where(
      and(
        eq(usersSchema.id, +decoded.id),
        isNull(usersSchema.deleted_at),
        eq(usersSchema.is_active, true),
      ),
    );

  const user = userMapping(event, userQuery?.[0]);

  if (!user) {
    throw createError({
      statusCode: 401,
      message: $i18n(event).t('message.error_unauthorized'),
    });
  }

  if (!user.is_role_permission_custom) {
    const rolePermissions = await rolePermissionsService.findByRole(event, {
      role: user.role,
    });
    user.permissions = rolePermissions?.permissions || [];
  }

  return user;
};

const refresh = async (event: H3Event) => {
  const refreshToken = getCookie(event, 'refresh_token');

  if (!refreshToken) {
    throw createError({
      statusCode: 401,
      statusMessage: $i18n(event).t('message.error_unauthorized'),
    });
  }

  let decoded: any;

  try {
    decoded = jsonwebtoken.verify(refreshToken, runtimeConfig.jwtSecret);
  } catch (error: any) {
    throw createError({
      statusCode: 422,
      message: error?.message,
    });
  }

  const userQuery = await $drizzle(event)
    .select({
      id: usersSchema.id,
    })
    .from(usersSchema)
    .where(
      and(
        eq(usersSchema.id, +decoded.id),
        isNull(usersSchema.deleted_at),
        eq(usersSchema.is_active, true),
      ),
    );

  const user = userQuery?.[0];

  if (!user) {
    throw createError({
      statusCode: 401,
      message: $i18n(event).t('message.error_unauthorized'),
    });
  }

  const payloadJwt = {
    id: user.id,
  };

  let accessToken: string;

  try {
    accessToken = jsonwebtoken.sign(payloadJwt, runtimeConfig.jwtSecret, {
      expiresIn: accessTokenExpiresIn,
    });
  } catch (error: any) {
    throw createError({
      statusCode: 422,
      message: error?.message,
    });
  }

  return {
    access_token: accessToken,
  };
};

const logout = async (event: H3Event) => {
  deleteCookie(event, 'refresh_token');
};

export default {
  login,
  findUser,
  refresh,
  logout,
};
