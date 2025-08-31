import type { H3Event } from 'h3';
import dayjs from 'dayjs';
import pluginUtc from 'dayjs/plugin/utc.js';
import pluginDuration from 'dayjs/plugin/duration.js';
import pluginTimezone from 'dayjs/plugin/timezone.js';
import pluginRelativeTime from 'dayjs/plugin/relativeTime.js';
import pluginIsSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
import pluginIsSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import 'dayjs/locale/id.js';
import 'dayjs/locale/en.js';

export const $dayjs = (event: H3Event) => {
  dayjs.extend(pluginUtc);
  dayjs.extend(pluginDuration);
  dayjs.extend(pluginTimezone);
  dayjs.extend(pluginRelativeTime);
  dayjs.extend(pluginIsSameOrAfter);
  dayjs.extend(pluginIsSameOrBefore);
  dayjs.locale($lang(event));
  dayjs.tz.setDefault($serverTimezone(event));
  return dayjs;
};

export const $serverTimezone = (event: H3Event) => {
  return 'UTC';
};

export const $clientTimezone = (event: H3Event) => {
  const timezone = getRequestHeader(event, 'X-Timezone');
  return timezone || 'Asia/Makassar';
};
