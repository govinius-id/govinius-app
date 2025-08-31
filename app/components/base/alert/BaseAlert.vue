<template>
  <div :class="alertClass">
    <div class="flex gap-x-1">
      <BaseIcon
        v-if="props.icon"
        :name="props.icon"
        class="mt-1"
        :class="props.classes?.icon"
      />
      <BaseText tag="h3" class="font-semibold">
        {{ props.title }}
      </BaseText>
    </div>

    <div>
      <slot name="content"></slot>
    </div>

    <div
      v-if="$slots.action"
      class="mt-3 flex flex-col items-stretch md:flex-row md:items-center"
    >
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
export interface Props {
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  icon?: string;
  title: string;
  classes?: {
    icon?: string;
  };
}

const props = withDefaults(defineProps<Props>(), {});

const alertClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('w-full');
  itemsClass.push('flex flex-col');
  itemsClass.push('rounded-lg');
  itemsClass.push('gap-1 py-2 px-3');

  switch (props.color) {
    case 'primary':
      itemsClass.push('bg-primary-50');
      itemsClass.push('text-primary');
      itemsClass.push('border');
      itemsClass.push('border-primary-100');
      itemsClass.push('dark:bg-primary-950');
      itemsClass.push('dark:border-primary-900');
      break;
    case 'success':
      itemsClass.push('bg-success-50');
      itemsClass.push('text-success');
      itemsClass.push('border');
      itemsClass.push('border-success-100');
      itemsClass.push('dark:bg-success-950');
      itemsClass.push('dark:border-success-900');
      break;
    case 'warning':
      itemsClass.push('bg-warning-50');
      itemsClass.push('text-warning');
      itemsClass.push('border');
      itemsClass.push('border-warning-100');
      itemsClass.push('dark:bg-warning-950');
      itemsClass.push('dark:border-warning-900');
      break;
    case 'danger':
      itemsClass.push('bg-danger-50');
      itemsClass.push('text-danger');
      itemsClass.push('border');
      itemsClass.push('border-danger-100');
      itemsClass.push('dark:bg-danger-950');
      itemsClass.push('dark:border-danger-900');
      break;
    case 'info':
      itemsClass.push('bg-info-50');
      itemsClass.push('text-info');
      itemsClass.push('border');
      itemsClass.push('border-info-100');
      itemsClass.push('dark:bg-info-950');
      itemsClass.push('dark:border-info-900');
      break;
    default:
      itemsClass.push('bg-slate-100');
      itemsClass.push('text-slate-400');
      itemsClass.push('border');
      itemsClass.push('border-slate-200');
      itemsClass.push('dark:bg-dark-900');
      itemsClass.push('dark:border-dark-800');
      break;
  }

  return itemsClass.join(' ');
});
</script>
