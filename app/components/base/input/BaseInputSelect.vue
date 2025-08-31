<template>
  <BaseDropdown ref="dropdownRef">
    <template #activator="opts">
      <BaseInput
        ref="inputActivatorRef"
        :model-value="props.item?.[props.itemText]"
        :loading="props.loading"
        :label="props.label"
        :placeholder="props.placeholder || $i18n().t('common.select')"
        :label-required="props.labelRequired"
        :label-optional="props.labelOptional"
        :error="props.error"
        :size="props.size"
        readonly
        :clearable="props.clearable"
        :disabled="props.disabled"
        class="w-full"
        @click="opts.onToggle()"
        @keydown="
          $keydownPressKey($event, 'Enter', opts.onToggle);
          $keydownPressKey($event, 'Tab', opts.onClose);
        "
        @clear="
          emit('clear');
          opts.onClose();
        "
      >
        <template #suffix>
          <div
            class="inline-flex aspect-square h-full cursor-pointer items-center justify-center text-slate-400"
            @click="
              opts.onToggle();
              triggerFocus();
            "
          >
            <BaseIcon
              name="ph:caret-down"
              :size="props.size"
              :class="['duration-300', opts.isOpen ? 'rotate-180' : '']"
            />
          </div>
        </template>
        <template v-if="slots.content" #content>
          <slot name="content"></slot>
        </template>
      </BaseInput>
    </template>

    <template #content="opts">
      <BaseCard
        bordered
        shadow
        compact
        class="min-w-[var(--min-width)]"
        :style="{
          '--min-width': `${opts.maxWidth}px`,
        }"
      >
        <BaseListSelectable
          v-model="inputModel"
          :items="props.items"
          :item-text="props.itemText"
          :item-value="props.itemValue"
          :classes="{
            wrapper: 'max-h-52',
          }"
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
      </BaseCard>
    </template>
  </BaseDropdown>
</template>

<script lang="ts" setup>
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
}

const emit = defineEmits([
  'update:modelValue',
  'update:item',
  'clear',
  'select',
]);
const slots = useSlots();
const props = withDefaults(defineProps<Props>(), {
  labelRequired: false,
  loading: false,
  clearable: false,
  disabled: false,
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

const dropdownRef = ref();
const inputActivatorRef = ref();

const isDropdownOpen = computed(() => {
  return dropdownRef.value?.isOpen;
});

const triggerFocus = () => {
  inputActivatorRef.value?.focus();
};

const onSelectItem = (obj: any) => {
  emit('select', obj);
  inputModel.value = obj[props.itemValue];
  itemModel.value = obj;
  inputActivatorRef.value?.focus();
  dropdownRef.value?.onClose();
};

defineExpose({
  isDropdownOpen,
  focus: triggerFocus,
});
</script>
