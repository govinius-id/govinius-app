import type { H3Event } from 'h3';
import { and, eq, isNull } from 'drizzle-orm';

const findOne = async (event: H3Event) => {
  const userQuery = await $drizzle(event)
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
    })
    .from(usersSchema)
    .where(
      and(
        eq(usersSchema.id, event.context.user?.id),
        isNull(usersSchema.deleted_at),
      ),
    );

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

const update = async (event: H3Event, payload: any) => {
  const userOld = await findOneOrError(event, event.context.user?.id);

  await usersService.validateUnique(event, event.context.user?.id, payload);

  if (payload.file_picture) {
    payload.picture = await usersService.uploadPicture(
      event,
      payload,
      userOld.uuid!,
    );
  }

  let emailVerifiedAt = userOld.email_verified_at;
  let isEmailVerified = userOld.is_email_verified;
  if (payload.email !== userOld.email) {
    emailVerifiedAt = null;
    isEmailVerified = false;
  }

  await $drizzle(event)
    .update(usersSchema)
    .set({
      name: payload.name,
      username: payload.username,
      email: payload.email,
      picture: payload.picture,
      email_verified_at: emailVerifiedAt,
      is_email_verified: isEmailVerified,
      updated_at: $dayjs(event).tz().toDate(),
    })
    .where(eq(usersSchema.id, event.context.user?.id));

  const user = await findOne(event);
  return user;
};

const findOneOrError = async (event: H3Event, id: number) => {
  const userQuery = await $drizzle(event)
    .select()
    .from(usersSchema)
    .where(and(eq(usersSchema.id, id), isNull(usersSchema.deleted_at)));

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

export default {
  findOne,
  update,
};
