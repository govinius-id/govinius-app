<template>
  <BaseInputSelect
    v-model="inputModel"
    v-model:item="itemModel"
    :items="selectableConstStore.itemConst?.items_active_status || []"
    :loading="props.loading || selectableConstStore.loadingItemConst"
    :label="props.label"
    :placeholder="props.placeholder"
    :label-required="props.labelRequired"
    :label-optional="props.labelOptional"
    :error="props.error"
    :clearable="props.clearable"
    :disabled="props.disabled"
    :size="props.size"
    item-text="text"
    item-value="value"
    @select="emit('select')"
    @clear="emit('clear')"
  >
    <template #content>
      <div class="flex h-full items-center gap-x-2">
        <BaseChip :color="props.item?.color" size="sm">
          <BaseIcon name="ph:circle-fill" class="size-2" />
          {{ props.item?.text }}
        </BaseChip>
      </div>
    </template>
    <template #item="optsItem">
      <BaseListItem
        :active="optsItem.isSelected(optsItem.item)"
        @click="optsItem.onSelectItem(optsItem.item)"
      >
        <BaseChip :color="optsItem.item?.color" size="sm">
          <BaseIcon name="ph:circle-fill" class="size-2" />
          {{ optsItem.item?.text }}
        </BaseChip>
      </BaseListItem>
    </template>
  </BaseInputSelect>
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
  item: ItemActiveStatus | null;
}

const emit = defineEmits([
  'update:modelValue',
  'update:item',
  'clear',
  'select',
]);
const props = withDefaults(defineProps<Props>(), {
  labelRequired: false,
  loading: false,
  clearable: false,
  disabled: false,
});

const selectableConstStore = useSelectableConstStore();

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
</script>
