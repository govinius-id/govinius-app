<template>
  <div ref="tableWrapperRef" class="overflow-hidden overflow-x-auto pb-5">
    <table class="w-full min-w-0 border-separate border-spacing-0">
      <thead ref="heading">
        <slot name="heading"></slot>
      </thead>

      <tbody v-if="props.loading" class="cursor-progress">
        <tr v-for="i in props.rowLength" :key="i">
          <td
            v-for="j in props.columnLength ?? calcColumnLength"
            :key="j"
            class="px-0.5 pt-1"
          >
            <div
              class="block h-7 w-full animate-pulse rounded-md bg-slate-200 dark:bg-slate-600"
            ></div>
          </td>
        </tr>
      </tbody>

      <tbody v-else-if="isEmpty">
        <tr>
          <td :colspan="props.columnLength ?? calcColumnLength">
            <BasePlaceholderSection
              :title="$i18n().t('common.no_data')"
              :caption="$i18n().t('common.no_data_caption')"
              icon="ph:files-duotone"
            />
          </td>
        </tr>
      </tbody>

      <tbody v-else>
        <slot name="body"></slot>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  id?: string;
  loading?: boolean;
  isEmpty?: boolean;
  rowLength?: number;
  columnLength?: number;
}

const props = withDefaults(defineProps<Props>(), {
  rowLength: 10,
});

const heading = ref();

const calcColumnLength = computed(() => {
  return heading.value?.children?.length || 0;
});

const tableWrapperRef = ref<HTMLElement | undefined>();

onMounted(() => {
  if (tableWrapperRef.value) {
    $overlayScrollbars(tableWrapperRef.value, {
      scrollbars: {
        autoHide: 'leave',
        autoHideDelay: 0,
        visibility: $breakpoint().is_xs ? 'hidden' : 'auto',
      },
      overflow: {
        x: 'scroll',
        y: 'hidden',
      },
    });
  }
});
</script>

<style>
thead th:first-child {
  border-top-left-radius: 0.5rem;
}
thead th:last-child {
  border-top-right-radius: 0.5rem;
}
</style>
