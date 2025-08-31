<template>
  <div class="flex flex-col gap-y-3">
    <BaseInput
      v-if="props.searchable"
      ref="inputSearchRef"
      v-model="searchModel"
      :size="props.size"
      :placeholder="$i18n().t('common.search')"
      icon-prefix="ph:magnifying-glass-duotone"
      inputmode="search"
      clearable
      @clear="searchModel = null"
    />

    <div v-if="props.loading" class="flex flex-col gap-y-4">
      <BaseLoadingLabelAndParagraph />
      <BaseLoadingLabelAndParagraph />
      <BaseLoadingLabelAndParagraph />
    </div>

    <slot
      v-else-if="!props.loading && itemsOption.length === 0"
      name="empty"
    ></slot>

    <BaseListVirtualScroller
      v-else
      ref="listVirtualScrollerRef"
      :items="itemsOption"
      :item-height="props.itemHeight"
      :classes="props.classes"
    >
      <template #item="opts">
        <slot
          v-if="$slots.item"
          name="item"
          :item="opts.item"
          :index="opts.index"
          :is-selected="isSelected"
          :on-select-item="onSelectItem"
        ></slot>

        <BaseListItem
          v-else
          :active="isSelected(opts.item)"
          @click="onSelectItem(opts.item)"
        >
          {{ opts.item[props.itemText] }}
        </BaseListItem>
      </template>
    </BaseListVirtualScroller>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  modelValue: any;
  items: any[];
  itemText?: string;
  itemValue?: string;
  itemHeight?: number;
  selected?: any;
  search?: string | null;
  size?: 'sm' | 'md' | 'lg';
  searchable?: boolean;
  autofocusSearch?: boolean;
  loading?: boolean;
  multiple?: boolean;
  classes?: {
    wrapper?: string;
    container?: string;
  };
}

const emit = defineEmits([
  'update:modelValue',
  'update:selected',
  'update:search',
  'select',
]);
const props = withDefaults(defineProps<Props>(), {
  itemText: 'text',
  itemValue: 'value',
  itemHeight: 40,
  searchable: false,
  autofocusSearch: false,
  loading: false,
  multiple: false,
});

const inputSearch = ref<string | null>(null);
const inputSearchRef = ref();

const searchModel = computed({
  get() {
    if (props.search !== undefined) {
      return props.search;
    } else {
      return inputSearch.value;
    }
  },
  set(value: string | null) {
    if (props.search !== undefined) {
      emit('update:search', value);
    } else {
      inputSearch.value = value;
    }
  },
});

watch(
  () => props.autofocusSearch,
  () => {
    setTimeout(() => {
      if (props.autofocusSearch && inputSearchRef.value) {
        inputSearchRef.value?.focus();
      }
    }, 200);
  },
  {
    immediate: true,
  },
);

const listVirtualScrollerRef = ref();

const onScrollToItem = () => {
  const index = itemsOption.value.findIndex((obj) => {
    return obj[props.itemValue] === props.modelValue;
  });

  if (index !== -1) {
    listVirtualScrollerRef.value?.onScrollToItem(index);
  }
};

const itemsOption = computed(() => {
  if (props.searchable && props.search === undefined) {
    return props.items?.filter((obj: any) => {
      if (!inputSearch.value) return true;

      return obj[props.itemText]
        ?.toLowerCase()
        ?.includes(inputSearch.value?.toLowerCase());
    });
  } else {
    return props.items;
  }
});

const isSelected = (obj: any) => {
  if (props.multiple) {
    return props.modelValue?.includes(obj[props.itemValue]);
  } else {
    return obj[props.itemValue] === props.modelValue;
  }
};

const onSelectItem = (obj: any) => {
  if (props.multiple) {
    const values = props.modelValue || [];
    const index = values.findIndex((val: any) => {
      return val === obj[props.itemValue];
    });

    if (index === -1) {
      values.push(obj[props.itemValue]);
    } else {
      values.splice(index, 1);
    }

    emit('update:modelValue', values);
  } else {
    emit('update:modelValue', obj[props.itemValue]);
    emit('select', obj);
  }
};

onMounted(() => {
  setTimeout(() => {
    onScrollToItem();
  }, 200);
});
</script>
