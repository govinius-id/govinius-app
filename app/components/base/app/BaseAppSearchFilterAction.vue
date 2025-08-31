<template>
  <div class="flex flex-col gap-5 lg:flex-row lg:justify-between">
    <div class="flex w-full gap-2">
      <BaseInput
        v-if="props.inputSearch !== undefined"
        v-model="inputSearchModel"
        :placeholder="$i18n().t('common.search')"
        class="w-full lg:w-auto"
        clearable
        icon-prefix="ph:magnifying-glass"
        inputmode="search"
        @clear="inputSearchModel = null"
      />

      <BaseButtonIcon
        v-if="props.modalFilter !== undefined"
        icon="ph:funnel"
        class="!inline-flex md:!hidden"
        size="lg"
        rounded="rounded"
        @click="modalFilterModel = true"
      />

      <BaseButton
        v-if="props.modalFilter !== undefined"
        class="!hidden md:!flex"
        icon-prefix="ph:funnel"
        @click="modalFilterModel = true"
      >
        {{ $i18n().t('common.filter') }}
      </BaseButton>
    </div>

    <div class="flex grow flex-col gap-2 md:flex-row md:justify-end">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  inputSearch?: string | null;
  modalFilter?: boolean;
}

const emit = defineEmits(['update:inputSearch', 'update:modalFilter']);
const props = withDefaults(defineProps<Props>(), {
  inputSearch: undefined,
  modalFilter: undefined,
});

const inputSearchModel = computed({
  get() {
    return props.inputSearch;
  },
  set(value) {
    emit('update:inputSearch', value);
  },
});

const modalFilterModel = computed({
  get() {
    return props.modalFilter;
  },
  set(value) {
    emit('update:modalFilter', value);
  },
});
</script>
