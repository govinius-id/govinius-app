<template>
  <div :class="loadingWrapperClass">
    <svg class="h-full w-full rotate-[-90deg]" viewBox="0 0 40 40">
      <circle
        cx="20"
        cy="20"
        r="16"
        :stroke="$themeMode() === 'light' ? '#e2e8f0' : '#3b4251'"
        stroke-width="3"
        fill="transparent"
      />

      <circle
        cx="20"
        cy="20"
        r="16"
        :stroke="props.color"
        stroke-width="3"
        fill="transparent"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        class="transition-[stroke-dashoffset] duration-500 ease-out"
      />
    </svg>

    <div :class="loadingTextClass">{{ props.percentage }}<span>%</span></div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  percentage: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  color: 'var(--color-primary)',
  size: 'md',
});

const radius = 16;
const circumference = 2 * Math.PI * radius;

const dashOffset = computed(() => {
  return circumference - (circumference * props.percentage) / 100;
});

const loadingWrapperClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('relative');

  switch (props.size) {
    case 'sm':
      itemsClass.push('w-8 h-8 min-w-8');
      break;
    case 'md':
      itemsClass.push('w-14 h-14 min-w-14');
      break;
    case 'lg':
      itemsClass.push('w-20 h-20 min-w-20');
      break;
  }

  return itemsClass.join(' ');
});

const loadingTextClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('text-dark');
  itemsClass.push('absolute');
  itemsClass.push('inset-0');
  itemsClass.push('flex');
  itemsClass.push('items-center');
  itemsClass.push('justify-center');
  itemsClass.push('dark:text-white');

  switch (props.size) {
    case 'sm':
      itemsClass.push('text-[9px]');
      itemsClass.push('[&>span]:text-[6px]');
      break;
    case 'md':
      itemsClass.push('text-sm');
      itemsClass.push('[&>span]:text-[8px]');
      break;
    case 'lg':
      itemsClass.push('text-lg');
      itemsClass.push('[&>span]:text-xs');
      break;
  }

  return itemsClass.join(' ');
});
</script>
