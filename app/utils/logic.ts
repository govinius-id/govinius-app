import { v4 as uuidv4 } from 'uuid';

export const $delay = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

export const $uuidv4 = uuidv4;

export const $generateDatesFromRange = (
  dateFrom?: string | null,
  dateTo?: string | null,
  timezone?: string | null,
) => {
  if (!dateFrom) return [];
  if (!dateTo) return [];

  const dates: string[] = [];

  let current = $dayjs().tz(dateFrom, timezone ?? $timezone());
  const end = $dayjs().tz(dateTo, timezone ?? $timezone());

  while (current.isSameOrBefore(end)) {
    const dateStr = current.format('YYYY-MM-DD');
    dates.push(dateStr);
    current = current.add(1, 'day');
  }

  return dates;
};

export const $generateTextDateRange = (
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
    ? $dayjs()
        .tz(dateFrom, timezone ?? $timezone())
        .tz(timezone ?? $timezone())
        .format(formatString)
    : null;
  const to = dateTo
    ? $dayjs()
        .tz(dateTo, timezone ?? $timezone())
        .tz(timezone ?? $timezone())
        .format(formatString)
    : null;

  if (from && !to) {
    return `${$i18n().t('common.range_from')} ${from}`;
  }

  if (!from && to) {
    return `${$i18n().t('common.range_to')} ${to}`;
  }

  if (from === to) {
    return from;
  }

  return `${from} - ${to}`;
};
