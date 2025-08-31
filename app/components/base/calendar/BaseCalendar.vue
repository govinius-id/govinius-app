<template>
  <div v-if="selectType === 'year'" class="w-full select-none">
    <BaseListSelectable
      v-model="selectedYear"
      :items="itemsYear"
      :classes="{
        wrapper: 'max-h-60',
      }"
      @select="onSelectYear()"
    />
  </div>

  <div v-else-if="selectType === 'month'" class="w-full select-none">
    <div class="flex items-center justify-between gap-2 pb-2">
      <BaseButtonIcon
        icon="ph:caret-left"
        size="sm"
        tabindex="-1"
        @click="onPrevItemsMonth()"
      />
      <div
        class="text-dark dark:text-dark-100 grow cursor-pointer text-center text-sm font-semibold"
        @click="onChangeSelectType('year')"
      >
        {{ selectedYear }}
      </div>
      <BaseButtonIcon
        icon="ph:caret-right"
        size="sm"
        tabindex="-1"
        @click="onNextItemsMonth()"
      />
    </div>

    <BaseListSelectable
      v-model="selectedMonth"
      :items="itemsMonth"
      :classes="{
        wrapper: 'max-h-52',
      }"
      @select="onSelectMonth()"
    />
  </div>

  <div v-else-if="selectType === 'date'" class="w-full select-none">
    <div class="flex items-center justify-between gap-2 pb-2">
      <BaseButtonIcon
        icon="ph:caret-left"
        size="sm"
        tabindex="-1"
        @click="onPrevItemsDate()"
      />
      <div
        class="text-dark dark:text-dark-100 grow cursor-pointer text-center text-sm font-semibold"
        @click="onChangeSelectType('month')"
      >
        {{ selectedMonthText }}
      </div>
      <BaseButtonIcon
        icon="ph:caret-right"
        size="sm"
        tabindex="-1"
        @click="onNextItemsDate()"
      />
    </div>

    <div class="grid grid-cols-7 place-items-center">
      <span
        v-for="(day, i) in itemsWeekDay"
        :key="i"
        class="flex aspect-square h-8 items-center justify-center text-center text-[10px] uppercase text-slate-400"
      >
        {{ day }}
      </span>
    </div>

    <div class="grid grid-cols-7 place-items-center">
      <span
        v-for="(obj, i) in itemsDatePreviousMonthOffset"
        :key="i"
        class="flex aspect-square h-8 items-center justify-center text-sm uppercase text-slate-400 opacity-20"
        :class="props.classes?.dateText?.(obj.value)"
      >
        {{ obj.text }}
      </span>
      <span
        v-for="(obj, i) in itemsDate"
        :key="i"
        :class="selectedDateClass(obj)"
        @click="onSelectDate(obj)"
      >
        <div class="relative flex flex-col items-center">
          {{ obj.text }}

          <div
            v-if="eventDate(obj.value)?.dot"
            class="bg-primary absolute -bottom-2 size-2 rounded-full"
            :class="eventDate(obj.value)?.classes?.dot"
          ></div>
        </div>
      </span>
      <span
        v-for="(obj, i) in itemsDateNextMonthOffset"
        :key="i"
        class="flex aspect-square h-8 items-center justify-center text-sm uppercase text-slate-400 opacity-20"
        :class="props.classes?.dateText?.(obj.value)"
      >
        {{ obj.text }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  modelValue?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  disableDates?: string[];
  typeOfPicker?: 'date' | 'month' | 'year' | null;
  timeOfPicker?: 'start' | 'end' | null;
  events?: BaseCalendarEvent[];
  classes?: {
    dateText?: (date: string) => string;
  };
}

const emits = defineEmits(['update:modelValue', 'select', 'change']);
const props = withDefaults(defineProps<Props>(), {
  typeOfPicker: 'date',
});

const inputModel = computed({
  get() {
    return props.modelValue;
  },
  set(value: any) {
    emits('update:modelValue', value);
  },
});

const selectType = ref('date');

const currentDate = ref($dayjs().tz().tz($timezone()).format('YYYY-MM-DD'));

const selectedDate = computed(() => {
  return inputModel.value || currentDate.value;
});

const selectedYear = ref();
const selectedMonth = ref();
const selectedMonthText = computed(() => {
  const year = selectedMonth.value?.split('-')[0];
  const month = selectedMonth.value?.split('-')[1];
  return $dayjs()
    .tz()
    .set('year', +year)
    .set('month', +month - 1)
    .format('MMMM YYYY');
});

const setSelectedItem = () => {
  selectedYear.value = $dayjs().tz(selectedDate.value).format('YYYY');
  selectedMonth.value = $dayjs().tz(selectedDate.value).format('YYYY-MM');
};

// Year
const onSelectYear = () => {
  if (props.typeOfPicker === 'year') {
    let value = null;
    if (props.timeOfPicker === 'start') {
      value = $dayjs()
        .tz()
        .tz($timezone())
        .year(selectedYear.value)
        .startOf('year')
        .format('YYYY-MM-DD');
    }
    if (props.timeOfPicker === 'end') {
      value = $dayjs()
        .tz()
        .tz($timezone())
        .year(selectedYear.value)
        .endOf('year')
        .format('YYYY-MM-DD');
    }
    onSelectDate({ value: value });
  } else {
    onChangeSelectType('month');
  }
};

const itemsYear = computed(() => {
  const start = +$dayjs().tz().tz($timezone()).format('YYYY') - 70;
  const end = +$dayjs().tz().tz($timezone()).format('YYYY') + 5;
  const arr: any[] = [];
  for (let year = start; year <= end; year++) {
    arr.push({
      text: $dayjs().tz().set('year', year).format('YYYY'),
      value: $dayjs().tz().set('year', year).format('YYYY'),
    });
  }
  return arr;
});

// Month
const onSelectMonth = () => {
  if (props.typeOfPicker === 'month') {
    let value = null;
    if (props.timeOfPicker === 'start') {
      value = $dayjs()
        .tz(`${selectedMonth.value}-01`, $timezone())
        .tz($timezone())
        .startOf('month')
        .format('YYYY-MM-DD');
    }
    if (props.timeOfPicker === 'end') {
      value = $dayjs()
        .tz(`${selectedMonth.value}-01`, $timezone())
        .tz($timezone())
        .endOf('month')
        .format('YYYY-MM-DD');
    }
    onSelectDate({ value: value });
  } else {
    onChangeSelectType('date');
  }
};

const itemsMonth = computed(() => {
  const start = 1;
  const end = 12;
  const arr: any[] = [];
  for (let month = start; month <= end; month++) {
    arr.push({
      text: $dayjs()
        .tz()
        .set('month', month - 1)
        .format('MMMM'),
      value: $dayjs()
        .tz()
        .set('year', +selectedYear.value)
        .set('month', month - 1)
        .format('YYYY-MM'),
    });
  }
  return arr;
});

const onPrevItemsMonth = () => {
  const prevYear = $dayjs()
    .tz()
    .tz($timezone())
    .set('year', +selectedYear.value)
    .subtract(1, 'year');

  if (validateNotInStartEndDate(prevYear.format('YYYY-MM-DD'))) {
    return;
  }

  selectedYear.value = prevYear.format('YYYY');
};

const onNextItemsMonth = () => {
  const nextYear = $dayjs()
    .tz()
    .tz($timezone())
    .set('year', +selectedYear.value)
    .add(1, 'year');

  if (validateNotInStartEndDate(nextYear.format('YYYY-MM-DD'))) {
    return;
  }

  selectedYear.value = nextYear.format('YYYY');
};

// Week day
const itemsWeekDay = computed(() => {
  const arr: string[] = [];
  const startOfWeek = $dayjs().tz().tz($timezone()).day(0);

  for (let i = 0; i < 7; i++) {
    arr.push(startOfWeek.add(i, 'day').format('ddd'));
  }

  return arr;
});

// Date
const validateNotInStartEndDate = (date: string) => {
  const isIsBeforeStartDate =
    props.startDate &&
    $dayjs()
      .tz(date)
      .tz($timezone())
      .isBefore($dayjs().tz(props.startDate).tz($timezone()));

  const isIsAfterEndDate =
    props.endDate &&
    $dayjs()
      .tz(date)
      .tz($timezone())
      .isAfter($dayjs().tz(props.endDate).tz($timezone()));

  return isIsBeforeStartDate || isIsAfterEndDate;
};

const validateNotInDisableDates = (date: string) => {
  if (!props.disableDates) return false;
  return props.disableDates.includes(date);
};

const eventDate = (date: string) => {
  if (!props.events) return null;
  if (props.events.length === 0) return null;
  return props.events.find((obj) => obj.date === date);
};

const selectedDateClass = (obj: any) => {
  const itemsClass: any[] = [];

  itemsClass.push('h-8 aspect-square text-sm rounded-full');
  itemsClass.push('flex justify-center items-center');
  itemsClass.push('text-dark');
  itemsClass.push('dark:text-dark-100');

  const objEventDate = eventDate(obj.value);
  if (objEventDate) {
    if (objEventDate.classes?.text) {
      itemsClass.push(objEventDate.classes.text);
    }
  }

  if (
    validateNotInStartEndDate(obj.value) ||
    validateNotInDisableDates(obj.value) ||
    objEventDate?.disabled
  ) {
    itemsClass.push('text-slate-400');
    itemsClass.push('cursor-not-allowed');
    itemsClass.push('dark:text-dark-400');
  } else {
    if (selectedDate.value === obj.value) {
      itemsClass.push('border');
      itemsClass.push('border-primary');
      itemsClass.push('text-primary');
      itemsClass.push('cursor-pointer');
    } else {
      itemsClass.push('text-dark');
      itemsClass.push('dark:text-dark-100');
      itemsClass.push('cursor-pointer');
      itemsClass.push('hover:bg-slate-100');
      itemsClass.push('hover:bg-opacity-50');
      itemsClass.push('dark:hover:bg-dark-800');
    }
  }

  if (props.classes?.dateText) {
    itemsClass.push(props.classes?.dateText(obj.value));
  }

  return itemsClass.join(' ');
};

const onSelectDate = (obj: any) => {
  if (
    eventDate(obj.value)?.disabled ||
    validateNotInStartEndDate(obj.value) ||
    validateNotInDisableDates(obj.value)
  ) {
    return;
  }

  eventDate(obj.value)?.onSelect?.();

  inputModel.value = obj.value;
  emits('select');
};

const itemsDatePreviousMonthOffset = computed(() => {
  const year = selectedMonth.value?.split('-')[0];
  const month = selectedMonth.value?.split('-')[1];
  const offset = +$dayjs()
    .tz()
    .tz($timezone())
    .set('year', +year)
    .set('month', +month - 1)
    .startOf('month')
    .format('d');
  const start = $dayjs()
    .tz()
    .tz($timezone())
    .set('year', +year)
    .set('month', +month - 1)
    .startOf('month')
    .subtract(1, 'day')
    .toDate();
  const end = $dayjs()
    .tz()
    .tz($timezone())
    .set('year', +year)
    .set('month', +month - 1)
    .startOf('month')
    .subtract(offset, 'day')
    .toDate();
  const arr: any[] = [];
  let d = $dayjs().tz(start).tz($timezone());
  while (d.isSameOrAfter(end, 'day')) {
    arr.unshift({
      text: d.format('D'),
      value: d.format('YYYY-MM-DD'),
    });
    d = d.subtract(1, 'day');
  }
  return arr;
});

const itemsDateNextMonthOffset = computed(() => {
  const year = selectedMonth.value?.split('-')[0];
  const month = selectedMonth.value?.split('-')[1];
  const offset =
    6 -
    +$dayjs()
      .tz()
      .tz($timezone())
      .set('year', +year)
      .set('month', +month - 1)
      .endOf('month')
      .format('d');

  const start = $dayjs()
    .tz()
    .tz($timezone())
    .set('year', +year)
    .set('month', +month - 1)
    .endOf('month')
    .add(1, 'day')
    .toDate();
  const end = $dayjs()
    .tz()
    .tz($timezone())
    .set('year', +year)
    .set('month', +month - 1)
    .endOf('month')
    .add(offset, 'day')
    .toDate();

  const arr: any[] = [];
  let d = $dayjs().tz(start).tz($timezone());
  while (d.isSameOrBefore(end, 'day')) {
    arr.push({
      text: d.format('D'),
      value: d.format('YYYY-MM-DD'),
    });
    d = d.add(1, 'day');
  }
  return arr;
});

const itemsDate = computed(() => {
  const year = selectedMonth.value?.split('-')[0];
  const month = selectedMonth.value?.split('-')[1];
  const start = $dayjs()
    .tz()
    .tz($timezone())
    .set('year', +year)
    .set('month', +month - 1)
    .startOf('month')
    .toDate();
  const end = $dayjs()
    .tz()
    .tz($timezone())
    .set('year', +year)
    .set('month', +month - 1)
    .endOf('month')
    .toDate();
  const arr: any[] = [];
  let d = $dayjs().tz(start).tz($timezone());
  while (d.isSameOrBefore(end, 'day')) {
    arr.push({
      text: d.format('D'),
      value: d.format('YYYY-MM-DD'),
    });
    d = d.add(1, 'day');
  }
  return arr;
});

const onPrevItemsDate = () => {
  const year = selectedMonth.value?.split('-')[0];
  const month = selectedMonth.value?.split('-')[1];
  selectedMonth.value = $dayjs()
    .tz()
    .tz($timezone())
    .set('year', +year)
    .set('month', +month - 1)
    .subtract(1, 'month')
    .format('YYYY-MM');
};

const onNextItemsDate = () => {
  const year = selectedMonth.value?.split('-')[0];
  const month = selectedMonth.value?.split('-')[1];
  selectedMonth.value = $dayjs()
    .tz()
    .tz($timezone())
    .set('year', +year)
    .set('month', +month - 1)
    .add(1, 'month')
    .format('YYYY-MM');
};

const onChangeSelectType = (value: string) => {
  setTimeout(() => {
    selectType.value = value;
  }, 10);
};

watch(
  () => itemsDate.value,
  () => {
    const year = selectedMonth.value?.split('-')[0];
    const month = selectedMonth.value?.split('-')[1];
    const startMonthDate = $dayjs()
      .tz()
      .tz($timezone())
      .set('date', 1)
      .set('year', +year)
      .set('month', +month - 1)
      .format('YYYY-MM-DD');

    emits('change', startMonthDate);
  },
  { deep: true },
);

onMounted(() => {
  if (props.typeOfPicker) {
    selectType.value = props.typeOfPicker;
  }
  setSelectedItem();
});
</script>
