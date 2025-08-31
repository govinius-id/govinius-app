import type { H3Event } from 'h3';
import { and, eq, isNull } from 'drizzle-orm';

const runtimeConfig = useRuntimeConfig();

const emailVerification = async (event: H3Event, payload: any) => {
  const userQuery = await $drizzle(event)
    .select({
      id: usersSchema.id,
      email: usersSchema.email,
      email_verification_expires: usersSchema.email_verification_expires,
    })
    .from(usersSchema)
    .where(
      and(
        eq(usersSchema.email, payload.email!),
        eq(usersSchema.email_verification_token, payload.token!),
        isNull(usersSchema.deleted_at),
      ),
    );

  const user = userQuery?.[0];

  if (!user || new Date(user.email_verification_expires!) < new Date()) {
    throw createError({
      statusCode: 401,
      message: $i18n(event).t('message.error_link_invalid'),
    });
  }

  await $drizzle(event)
    .update(usersSchema)
    .set({
      is_email_verified: true,
      email_verified_at: $dayjs(event).tz().toDate(),
      email_verification_token: null,
      email_verification_expires: null,
    })
    .where(eq(usersSchema.id, user.id));

  return true;
};

const emailVerificationEmail = async (event: H3Event, payload: any) => {
  const userQuery = await $drizzle(event)
    .select({
      id: usersSchema.id,
      name: usersSchema.name,
      email: usersSchema.email,
    })
    .from(usersSchema)
    .where(
      and(
        eq(usersSchema.email, payload.email!),
        isNull(usersSchema.deleted_at),
      ),
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

  const token = $uuidv4();
  const expiresAt = $dayjs(event).tz().add(15, 'minutes').toDate();

  await $drizzle(event)
    .update(usersSchema)
    .set({
      email_verification_token: token,
      email_verification_expires: expiresAt,
    })
    .where(eq(usersSchema.id, user.id))
    .execute();

  const emailTemplate = await $compileFileHtml({
    html_path: `${$lang(event)}/email-email-verification.html`,
    data: {
      name: user.name,
      call_to_action_url: `${runtimeConfig.public.app_url}/auth/email-verification?email=${payload.email}&token=${token}`,
      now_year: new Date().getFullYear(),
      app_name: 'Govinius',
    },
  });

  $sendToEmail({
    html: emailTemplate,
    subject: $i18n(event).t('common.email_verification'),
    to: payload.email,
  });

  return true;
};

export default {
  emailVerification,
  emailVerificationEmail,
};
