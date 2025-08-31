import type { H3Event } from 'h3';
import { and, eq, count, isNull, like, desc, or } from 'drizzle-orm';

const create = async (event: H3Event, payload: any) => {
  const settingQuery = await $drizzle(event)
    .insert(settingsSchema)
    .values({
      key: payload.key,
      value: payload.value,
      description: payload.description,
      created_at: $dayjs(event).tz().toDate(),
    })
    .$returningId();

  const setting = await findOne(event, settingQuery?.[0]?.id);

  return setting;
};

const findAll = async (event: H3Event, payload: any) => {
  const page = +payload.page || 1;
  const perPage = +payload.per_page || 10;
  const offset = (page - 1) * perPage;
  const whereClause = [];

  whereClause.push(isNull(settingsSchema.deleted_at));

  if (payload.search) {
    whereClause.push(
      or(
        like(settingsSchema.key, `%${payload.search}%`),
        like(settingsSchema.value, `%${payload.search}%`),
      ),
    );
  }

  const settingsQuery = await $drizzle(event)
    .select({
      id: settingsSchema.id,
      key: settingsSchema.key,
      description: settingsSchema.description,
      value: settingsSchema.value,
    })
    .from(settingsSchema)
    .where(and(...whereClause))
    .orderBy(desc(settingsSchema.created_at))
    .limit(perPage)
    .offset(offset);

  const settings = settingsQuery?.map((obj: any) => settingMapping(event, obj));

  const settingCountQuery = await $drizzle(event)
    .select({ count: count(settingsSchema.id) })
    .from(settingsSchema)
    .where(and(...whereClause));

  const settingCount = settingCountQuery?.[0]?.count;

  return {
    rows: settings,
    count: settingCount,
  };
};

const findOne = async (event: H3Event, id: number) => {
  const whereClause = [];
  whereClause.push(eq(settingsSchema.id, id));
  whereClause.push(isNull(settingsSchema.deleted_at));

  const settingQuery = await $drizzle(event)
    .select({
      id: settingsSchema.id,
      key: settingsSchema.key,
      description: settingsSchema.description,
      value: settingsSchema.value,
    })
    .from(settingsSchema)
    .where(and(...whereClause))
    .limit(1);

  const setting = settingMapping(event, settingQuery?.[0]);

  if (!setting) {
    throw createError({
      statusCode: 404,
      message: $i18n(event).t('validator.not_found', {
        value: $i18n(event).t('common.setting'),
      }),
    });
  }

  return setting;
};

const update = async (event: H3Event, id: number, payload: any) => {
  await findOneOrError(event, id);

  await $drizzle(event)
    .update(settingsSchema)
    .set({
      key: payload.key,
      value: payload.value,
      description: payload.description,
      updated_at: $dayjs(event).tz().toDate(),
    })
    .where(eq(settingsSchema.id, id));

  return await findOne(event, id);
};

const remove = async (event: H3Event, id: number) => {
  await findOneOrError(event, id);

  await $drizzle(event)
    .update(settingsSchema)
    .set({
      deleted_at: $dayjs(event).tz().toDate(),
    })
    .where(eq(settingsSchema.id, id));

  return true;
};

const findValueByKey = async (event: H3Event, key: string) => {
  const whereClause = [];
  whereClause.push(eq(settingsSchema.key, key));
  whereClause.push(isNull(settingsSchema.deleted_at));

  const settingQuery = await $drizzle(event)
    .select({
      value: settingsSchema.value,
    })
    .from(settingsSchema)
    .where(and(...whereClause))
    .limit(1);

  const setting = settingQuery?.[0];

  if (!setting) {
    throw createError({
      statusCode: 404,
      message: $i18n(event).t('validator.not_found', {
        value: $i18n(event).t('common.setting'),
      }),
    });
  }

  return setting.value;
};

const findKeyValue = async (event: H3Event) => {
  const settingsQuery = await $drizzle(event)
    .select({
      key: settingsSchema.key,
      value: settingsSchema.value,
    })
    .from(settingsSchema)
    .where(isNull(settingsSchema.deleted_at));

  const settings = settingsQuery;

  const objSetting = {} as Record<string, string>;

  for (const setting of settings) {
    if (setting.key !== null && setting.value !== null) {
      objSetting[setting.key] = setting.value;
    }
  }

  return objSetting;
};

const findOneOrError = async (event: H3Event, id: number) => {
  const whereClause = [];
  whereClause.push(eq(settingsSchema.id, id));
  whereClause.push(isNull(settingsSchema.deleted_at));

  const settingQuery = await $drizzle(event)
    .select()
    .from(settingsSchema)
    .where(and(...whereClause))
    .limit(1);

  const setting = settingQuery?.[0];

  if (!setting) {
    throw createError({
      statusCode: 404,
      message: $i18n(event).t('validator.not_found', {
        value: $i18n(event).t('common.setting'),
      }),
    });
  }

  return setting;
};

export default {
  create,
  findAll,
  findOne,
  update,
  remove,
  findValueByKey,
  findKeyValue,
  findOneOrError,
};
