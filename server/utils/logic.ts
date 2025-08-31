import type { H3Event } from 'h3';
import { v4 as uuidv4 } from 'uuid';

export const $delay = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

export const $uuidv4 = uuidv4;

export const $generateDatesFromRange = (
  event: H3Event,
  from?: string | null,
  to?: string | null,
  timezone?: string | null,
) => {
  if (!from) return [];
  if (!to) return [];

  const dates: string[] = [];

  let current = $dayjs(event).tz(from, timezone ?? $clientTimezone(event));
  const end = $dayjs(event).tz(to, timezone ?? $clientTimezone(event));

  while (current.isSameOrBefore(end)) {
    const dateStr = current.format('YYYY-MM-DD');
    dates.push(dateStr);
    current = current.add(1, 'day');
  }

  return dates;
};

export const $generateTextDateRange = (
  event: H3Event,
  dateFrom?: string | null,
  dateTo?: string | null,
  type?: 'date' | 'month' | 'year',
  timezone?: string | null,
) => {
  let formatString = '';
  if (type === 'year') {
    formatString = 'YYYY';
  } else if (type === 'month') {
    formatString = 'MMM YYYY';
  } else {
    formatString = 'DD MMM YYYY';
  }

  const from = dateFrom
    ? $dayjs(event)
        .tz(dateFrom, timezone ?? $clientTimezone(event))
        .tz(timezone ?? $clientTimezone(event))
        .format(formatString)
    : null;
  const to = dateTo
    ? $dayjs(event)
        .tz(dateTo, timezone ?? $clientTimezone(event))
        .tz(timezone ?? $clientTimezone(event))
        .format(formatString)
    : null;

  if (from && !to) {
    return `${$i18n(event).t('common.range_from')} ${from}`;
  }

  if (!from && to) {
    return `${$i18n(event).t('common.range_to')} ${to}`;
  }

  if (from === to) {
    return from;
  }

  return `${from} - ${to}`;
};

export const $garbageCollection = () => {
  if (global.gc) {
    global.gc();
  }
};
