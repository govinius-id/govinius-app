<template>
  <BaseTextLabelContent
    :label="props.label"
    :label-required="props.labelRequired"
    :label-optional="props.labelOptional"
  >
    <div v-if="props.loading" class="flex w-full flex-col gap-y-4">
      <BaseLoadingLabelAndInput v-for="i in 3" :key="i" />
    </div>

    <slot
      v-else-if="!props.loading && arrayModel.length === 0"
      name="empty"
    ></slot>

    <div
      v-else
      ref="listContainerRef"
      class="flex w-full flex-col gap-y-3"
      :class="{
        'dark:divide-dark-900 divide-y divide-slate-100': props.divider,
      }"
    >
      <div
        v-for="(obj, i) in arrayModel"
        :key="props.itemKey ? obj[props.itemKey] : i"
        class="flex gap-x-3"
        :class="{ 'pb-4': props.divider }"
      >
        <div class="flex grow gap-2">
          <slot name="input" :item="toRef(obj).value" :index="i"></slot>
        </div>
        <div
          v-if="$slots.action || props.actionDelete"
          class="flex size-fit items-center gap-2"
        >
          <slot
            v-if="$slots.action"
            name="action"
            :item="obj"
            :index="i"
            :on-remove="onRemoveItem"
          ></slot>
          <BaseTooltip
            v-else-if="props.actionDelete"
            :text="$i18n().t('common.delete')"
          >
            <BaseButtonIcon
              icon="ph:trash-duotone"
              :classes="{
                icon: '!text-danger',
              }"
              @click="onRemoveItem(obj, i)"
            />
          </BaseTooltip>
        </div>
      </div>
    </div>

    <div v-if="props.error" class="text-danger py-3 text-xs">
      {{ props.error }}
    </div>

    <div v-if="$slots.create || props.actionCreate" class="flex w-full py-3">
      <slot v-if="$slots.create" name="create"></slot>
      <BaseButton
        v-else-if="props.actionCreate"
        tabindex="-1"
        color="primary"
        variant="outlined"
        icon-prefix="ph:plus-circle-duotone"
        @click="onAddItem()"
      >
        {{ props.buttonCreateText ?? $i18n().t('common.add') }}
      </BaseButton>
    </div>
  </BaseTextLabelContent>
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
  actionCreate?: boolean;
  actionDelete?: boolean;
  buttonCreateText?: string;
  divider?: boolean;
  itemAdded?: any;
  itemKey?: string;
}

const emit = defineEmits(['update:modelValue', 'clear']);
const props = withDefaults(defineProps<Props>(), {
  actionCreate: true,
  actionDelete: true,
});

const arrayModel = computed({
  get() {
    return props.modelValue;
  },
  set(value: any[]) {
    emit('update:modelValue', value);
  },
});

const onAddItem = () => {
  const objClone = JSON.parse(JSON.stringify(props.itemAdded));
  arrayModel.value.push(objClone);
};

const onRemoveItem = (item: any, index: number) => {
  arrayModel.value.splice(index, 1);
};

const listContainerRef = ref<HTMLElement | undefined>();

defineExpose({
  listContainerRef,
});
</script>
