<template>
  <div class="flex flex-wrap gap-2">
    <BaseCard
      v-for="(obj, i) in props.items"
      :key="i"
      :classes="{
        color: isActive(obj)
          ? 'border bg-primary-50 border-primary-100 dark:bg-primary/10 dark:border-primary/50'
          : 'border border-slate-200 dark:border-dark-800',
      }"
      class="w-full cursor-pointer lg:w-fit lg:min-w-56"
      @click="onSelect(obj)"
    >
      <BaseIcon
        :name="obj.icon!"
        class="size-7"
        :class="{
          'text-primary': isActive(obj),
          'text-slate-400': !isActive(obj),
        }"
      />
      <BaseText
        class="text-sm font-medium"
        :class="{
          '!text-primary dark:!text-white': isActive(obj),
        }"
      >
        {{ obj.text }}
      </BaseText>
      <BaseText
        class="text-xs"
        :class="{
          '!text-primary/80 dark:!text-white': isActive(obj),
          '!text-slate-400': !isActive(obj),
        }"
      >
        {{ obj.caption }}
      </BaseText>
    </BaseCard>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  modelValue: any;
  items: BaseListItem[];
}

const emit = defineEmits(['update:modelValue', 'onSelect']);
const props = defineProps<Props>();

const selectableModel = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const isActive = (obj: BaseListItem) => {
  return obj.value === selectableModel.value;
};

const onSelect = (obj: BaseListItem) => {
  emit('onSelect', obj);
  selectableModel.value = obj.value;
};
</script>
