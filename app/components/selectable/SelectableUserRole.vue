<template>
  <BaseInputSelect
    v-model="inputModel"
    v-model:item="itemModel"
    :items="selectableConstStore.itemConst?.items_user_role || []"
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
  />
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
  item: ItemUserRole | null;
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
