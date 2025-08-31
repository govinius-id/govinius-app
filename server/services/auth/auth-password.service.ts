import argon2 from 'argon2';
import type { H3Event } from 'h3';
import { and, eq, isNull } from 'drizzle-orm';

const runtimeConfig = useRuntimeConfig();

const changePassword = async (event: H3Event, payload: any) => {
  const userQuery = await $drizzle(event)
    .select({
      id: usersSchema.id,
      password: usersSchema.password,
    })
    .from(usersSchema)
    .where(eq(usersSchema.id, event.context.user?.id));

  const user = userQuery?.[0];

  try {
    const validPassword = await argon2.verify(
      user.password,
      payload.old_password,
    );
    if (!validPassword) {
      throw createError({
        statusCode: 401,
        message: $i18n(event).t('message.error_old_password'),
      });
    }
  } catch (error: any) {
    throw createError({
      statusCode: 422,
      message: error?.message,
    });
  }

  let passwordHashed;
  try {
    passwordHashed = await argon2.hash(payload.new_password!);
  } catch (error: any) {
    throw createError({
      statusCode: 422,
      message: error,
    });
  }

  await $drizzle(event)
    .update(usersSchema)
    .set({
      password: passwordHashed,
    })
    .where(eq(usersSchema.id, user.id));

  return true;
};

const resetPassword = async (event: H3Event, payload: any) => {
  const userQuery = await $drizzle(event)
    .select({
      id: usersSchema.id,
      email: usersSchema.email,
      reset_password_expires: usersSchema.reset_password_expires,
    })
    .from(usersSchema)
    .where(
      and(
        eq(usersSchema.email, payload.email!),
        eq(usersSchema.reset_password_token, payload.token!),
        isNull(usersSchema.deleted_at),
      ),
    );

  const user = userQuery?.[0];

  if (!user || new Date(user.reset_password_expires!) < new Date()) {
    throw createError({
      statusCode: 401,
      message: $i18n(event).t('message.error_unauthorized'),
    });
  }

  let passwordHashed;
  try {
    passwordHashed = await argon2.hash(payload.new_password!);
  } catch (error: any) {
    throw createError({
      statusCode: 422,
      message: error,
    });
  }

  await $drizzle(event)
    .update(usersSchema)
    .set({
      password: passwordHashed,
      reset_password_token: null,
      reset_password_expires: null,
    })
    .where(eq(usersSchema.id, user.id));

  return true;
};

const resetPasswordEmail = async (event: H3Event, payload: any) => {
  const userQuery = await $drizzle(event)
    .select({
      id: usersSchema.id,
      name: usersSchema.name,
      email: usersSchema.email,
      is_email_verified: usersSchema.is_email_verified,
    })
    .from(usersSchema)
    .where(
      and(eq(usersSchema.email, payload.email), isNull(usersSchema.deleted_at)),
    );

  const user = userQuery?.[0];

  if (!user) {
    throw createError({
      statusCode: 404,
      message: $i18n(event).t('validator.not_found', {
        value: $i18n(event).t('common.email'),
      }),
    });
  }

  if (!user.is_email_verified) {
    throw createError({
      statusCode: 422,
      message: $i18n(event).t('common.email_unverified'),
    });
  }

  const token = $uuidv4();
  const expiresAt = $dayjs(event).tz().add(15, 'minutes').toDate();

  await $drizzle(event)
    .update(usersSchema)
    .set({
      reset_password_token: token,
      reset_password_expires: expiresAt,
    })
    .where(eq(usersSchema.id, user.id))
    .execute();

  const emailTemplate = await $compileFileHtml({
    html_path: `${$lang(event)}/email-reset-password.html`,
    data: {
      name: user.name,
      call_to_action_url: `${runtimeConfig.public.app_url}/auth/reset-password?email=${payload.email}&token=${token}`,
      now_year: new Date().getFullYear(),
      app_name: 'Govinius',
    },
  });

  $sendToEmail({
    html: emailTemplate,
    subject: $i18n(event).t('common.reset_password'),
    to: payload.email,
  });

  return true;
};

export default {
  changePassword,
  resetPassword,
  resetPasswordEmail,
};
