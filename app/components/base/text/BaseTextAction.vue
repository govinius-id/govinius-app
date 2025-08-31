<template>
  <div
    class="group inline-flex items-center gap-2"
    :class="!props.disabled ? 'cursor-pointer' : ''"
    @click="onClick()"
  >
    <div v-if="props.icon && !props.disabled" :class="textActionButtonClass">
      <BaseIcon :name="props.icon" :class="textActionIconClass" />
    </div>
    <BaseText
      class="whitespace-nowrap"
      :class="[!props.disabled ? 'group-hover:opacity-50' : '', props.class]"
    >
      <slot></slot>
    </BaseText>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  icon?: string;
  class?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const emit = defineEmits(['click']);
const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  doisabled: false,
});

const textActionButtonClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('inline-flex');
  itemsClass.push('items-center');
  itemsClass.push('justify-center');
  itemsClass.push('rounded-md');
  itemsClass.push('border');
  itemsClass.push('border-slate-200');
  itemsClass.push('text-slate-400');
  itemsClass.push('dark:border-dark-800');

  if (!props.disabled) {
    itemsClass.push('group-hover:bg-slate-50');
    itemsClass.push('dark:group-hover:bg-dark-900');
  }

  switch (props.size) {
    case 'sm':
      itemsClass.push('p-0.75');
      break;
    case 'md':
      itemsClass.push('p-1');
      break;
    case 'lg':
      itemsClass.push('p-1.5');
      break;
  }

  return itemsClass.join(' ');
});

const textActionIconClass = computed(() => {
  const itemsClass: string[] = [];

  switch (props.size) {
    case 'sm':
      itemsClass.push('size-3');
      break;
    case 'md':
      itemsClass.push('size-3.5');
      break;
    case 'lg':
      itemsClass.push('size-4');
      break;
  }

  return itemsClass.join(' ');
});

const onClick = () => {
  if (!props.disabled) {
    emit('click');
  }
};
</script>
