<template>
  <div class="flex select-none flex-col gap-y-2">
    <div class="flex items-center justify-between gap-3">
      <div class="text-dark-500 dark:text-dark-200 text-sm">
        {{ $i18n().t('common.total') }}: {{ props.totalData }}
      </div>

      <div class="flex items-center gap-2">
        <div class="text-dark-500 dark:text-dark-200 text-sm">
          {{ $i18n().t('common.show') }}:
        </div>

        <BaseInputSelect
          v-model="inputPerPage"
          :item="inputPerPageDetail"
          :items="itemsPerPage"
          item-text="text"
          item-value="value"
          size="sm"
          class="w-28"
        />
      </div>
    </div>

    <div
      class="flex flex-col justify-between gap-2 md:flex-row md:items-center"
    >
      <div
        v-if="totalPage <= totalVisible"
        class="bg-primary-50 dark:bg-dark-800/50 flex flex-wrap items-center justify-center gap-1 rounded-lg p-1"
      >
        <div
          v-for="value in totalPage"
          :key="value"
          :class="paginationPageClass(value)"
          @click="onPage(value)"
        >
          {{ value }}
        </div>
      </div>

      <div
        v-if="totalPage > totalVisible"
        class="bg-primary-50 flex flex-wrap items-center justify-center gap-1 rounded-lg p-1"
      >
        <div
          v-if="!isFirstGroupPage"
          :class="paginationPageClass(firstPage)"
          @click="onPage(firstPage)"
        >
          {{ firstPage }}
        </div>
        <div
          v-if="!isFirstGroupPage"
          class="text-dark grid size-8 place-items-center md:size-10"
        >
          ...
        </div>
        <div
          v-for="value in itemsPage"
          :key="value"
          :class="paginationPageClass(value)"
          @click="onPage(value)"
        >
          {{ value }}
        </div>
        <div
          v-if="!isLastGroupPage"
          class="text-dark grid size-8 place-items-center md:size-10"
        >
          ...
        </div>
        <div
          v-if="!isLastGroupPage"
          :class="paginationPageClass(lastPage)"
          @click="onPage(lastPage)"
        >
          {{ lastPage }}
        </div>
      </div>

      <div
        class="dark:bg-dark-800/50 flex items-center justify-center gap-1 rounded-lg bg-slate-50 p-1"
      >
        <BaseButtonIcon
          icon="ph:caret-left"
          rounded="rounded"
          @click="onPrevious()"
        />
        <BaseButtonIcon
          icon="ph:caret-right"
          rounded="rounded"
          @click="onNext()"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  page: number;
  perPage: number;
  totalData?: number;
}

const emit = defineEmits(['update:page', 'update:perPage']);
const props = withDefaults(defineProps<Props>(), {
  totalData: 1,
});

const totalVisible = ref(7);

const itemsPerPage = ref([
  {
    text: '10',
    value: 10,
  },
  {
    text: '25',
    value: 25,
  },
  {
    text: '50',
    value: 50,
  },
  {
    text: '100',
    value: 100,
  },
  {
    text: '500',
    value: 500,
  },
  {
    text: '1000',
    value: 1000,
  },
]);

const inputPerPage = computed({
  get() {
    return props.perPage;
  },
  set(value: any) {
    emit('update:page', 1);
    emit('update:perPage', value);
  },
});

const inputPerPageDetail = computed(() => {
  return $arrayFindObject(itemsPerPage.value, inputPerPage.value, 'value');
});

const totalPage = computed(() => {
  return Math.ceil(props.totalData / props.perPage) || 1;
});

const firstPage = computed(() => {
  return 1;
});

const lastPage = computed(() => {
  return totalPage.value;
});

const startTruncateLeftPage = ref(4);

const startTruncateRightPage = computed(() => {
  return lastPage.value - 3;
});

const isFirstGroupPage = computed(() => {
  return props.page <= startTruncateLeftPage.value;
});

const isLastGroupPage = computed(() => {
  return props.page >= startTruncateRightPage.value;
});

const itemsPage = computed(() => {
  if (isFirstGroupPage.value) {
    return Array.from(
      { length: totalVisible.value - 1 },
      (_, i: number) => i + 1,
    );
  } else if (isLastGroupPage.value) {
    return Array.from(
      { length: totalVisible.value - 1 },
      (_, i: number) => i - totalVisible.value + lastPage.value + 2,
    );
  } else {
    return Array.from({ length: 4 }, (_, i: number) => i - 2 + props.page);
  }
});

const onPrevious = () => {
  if (props.page > 1) {
    emit('update:page', props.page - 1);
  }
};

const onNext = () => {
  if (props.page < totalPage.value) {
    emit('update:page', props.page + 1);
  }
};

const onPage = (value: number) => {
  emit('update:page', value);
};

const paginationPageClass = (value: number) => {
  const itemsClass: string[] = [];

  itemsClass.push('size-8');
  itemsClass.push('md:size-10');
  itemsClass.push('grid');
  itemsClass.push('place-items-center');
  itemsClass.push('rounded-md');

  if (value > 1000) {
    itemsClass.push('text-[10px]');
  } else if (value > 100) {
    itemsClass.push('text-xs');
  } else {
    itemsClass.push('text-sm');
  }

  if (props.page === value) {
    itemsClass.push('bg-primary');
    itemsClass.push('text-white');
    itemsClass.push('dark:bg-primary');
  } else {
    itemsClass.push('cursor-pointer');
    itemsClass.push('bg-white');
    itemsClass.push('text-slate-400');
    itemsClass.push('outline-1');
    itemsClass.push('outline-slate-200');
    itemsClass.push('hover:bg-slate-50/80');
    itemsClass.push('dark:text-dark-400');
    itemsClass.push('dark:bg-dark-950');
    itemsClass.push('dark:outline-dark-700');
    itemsClass.push('dark:hover:bg-dark-900/80');
  }

  return itemsClass.join(' ');
};
</script>
