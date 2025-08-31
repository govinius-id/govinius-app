<template>
  <slot
    name="activator"
    :is-open="isModalOpen"
    :on-open="onOpenModal"
    :on-close="onCloseModal"
    :on-toggle="onToggleModal"
    :class="props.class"
  ></slot>

  <BaseInput
    v-if="!slots.activator"
    ref="inputActivatorRef"
    :model-value="props.item?.[props.itemText]"
    :loading="props.loading"
    :label="props.label"
    :placeholder="props.placeholder || $i18n().t('common.select')"
    :label-required="props.labelRequired"
    :label-optional="props.labelOptional"
    :error="props.error"
    readonly
    :clearable="props.clearable"
    :disabled="props.disabled"
    class="w-full"
    @click="isModalOpen = !isModalOpen"
    @keydown="
      $keydownPressKey($event, 'Enter', onToggleModal);
      $keydownPressKey($event, 'Tab', onCloseModal);
    "
    @clear="emit('clear')"
  >
    <template #suffix>
      <div
        class="inline-flex aspect-square h-full cursor-pointer items-center justify-center text-slate-400"
        @click="onToggleModal()"
      >
        <BaseIcon
          name="ph:caret-down"
          :size="props.size"
          :class="[isModalOpen ? 'rotate-180 duration-300' : 'duration-300']"
        />
      </div>
    </template>
    <template v-if="slots.content" #content>
      <slot name="content"></slot>
    </template>
  </BaseInput>

  <component
    :is="$breakpoint().is_md_and_down ? BaseSheetBottom : BaseModalCard"
    v-model="isModalOpen"
    :title="props.label || $i18n().t('common.select')"
    v-bind="$breakpoint().is_md_and_down ? { initialFraction: 0.75 } : {}"
  >
    <template #content>
      <BaseListSelectable
        v-model="inputModel"
        v-model:search="searchModel"
        :loading="props.loading"
        :items="props.items"
        :item-text="props.itemText"
        :item-value="props.itemValue"
        :classes="{
          wrapper: $breakpoint().is_md_and_down ? 'grow' : 'max-h-[70dvh]',
        }"
        :searchable="props.searchable"
        :autofocus-search="props.autofocusSearch"
        :item-height="props.itemHeight"
        class="h-full"
        @select="onSelectItem"
      >
        <template v-if="slots.item" #item="optsItem">
          <slot name="item" v-bind="optsItem"></slot>
        </template>
        <template #empty>
          <slot v-if="$slots.empty" name="empty"></slot>
          <div v-else class="flex justify-center">
            <BasePlaceholderSection
              :title="$i18n().t('common.no_data')"
              :caption="$i18n().t('common.no_data_caption')"
              icon="ph:files-duotone"
            />
          </div>
        </template>
      </BaseListSelectable>
    </template>
  </component>
</template>

<script lang="ts" setup>
import { BaseSheetBottom, BaseModalCard } from '#components';

interface Props {
  modelValue: any;
  error?: string | null;
  label?: string;
  labelRequired?: boolean;
  labelOptional?: boolean;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  items: any[];
  item: any;
  itemText: string;
  itemValue: string;
  itemHeight: number;
  searchable?: boolean;
  autofocusSearch?: boolean;
  search?: any;
  class?: string;
}

const emit = defineEmits([
  'update:modelValue',
  'update:item',
  'update:search',
  'clear',
  'select',
]);
const slots = useSlots();
const props = withDefaults(defineProps<Props>(), {
  labelRequired: false,
  loading: false,
  clearable: false,
  disabled: false,
  searchable: false,
  autofocusSearch: false,
});

const inputModel = computed({
  get() {
    return props.modelValue;
  },
  set(value: any) {
    emit('update:modelValue', value);
  },
});

const itemModel = computed({
  get() {
    return props.item;
  },
  set(value: any) {
    emit('update:item', value);
  },
});

const searchModel = computed({
  get() {
    return props.search;
  },
  set(value: any) {
    emit('update:search', value);
  },
});

const isModalOpen = ref(false);
const inputActivatorRef = ref();

const onOpenModal = () => {
  isModalOpen.value = true;
};

const onCloseModal = () => {
  isModalOpen.value = false;
};

const onToggleModal = () => {
  if (isModalOpen.value) {
    onCloseModal();
  } else {
    onOpenModal();
  }
};

const onSelectItem = (obj: any) => {
  emit('select', obj);
  inputModel.value = obj[props.itemValue];
  itemModel.value = obj;
  inputActivatorRef.value?.focus();
  isModalOpen.value = false;
};

defineExpose({
  isModalOpen,
});
</script>
