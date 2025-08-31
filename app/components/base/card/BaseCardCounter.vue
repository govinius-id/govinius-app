<template>
  <div :class="cardClass">
    <div v-if="props.icon">
      <div :class="iconBoxClass">
        <BaseIcon :name="props.icon" class="size-7" />
      </div>
    </div>

    <div v-if="props.icon" :class="separatorClass"></div>

    <div class="flex flex-col">
      <BaseTextCounter :value="props.value">
        <template #content="opts">
          <BaseText v-if="$slots.value" :class="valueClass">
            <slot name="value" :value="opts.value"></slot>
          </BaseText>
          <BaseText v-else :class="valueClass">
            {{ opts.value }}
          </BaseText>
        </template>
      </BaseTextCounter>

      <BaseText :class="textClass">
        {{ props.text }}
      </BaseText>

      <BaseText :class="captionClass">
        {{ props.caption }}
      </BaseText>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  value?: any;
  icon?: string | null;
  text?: string | null;
  caption?: string | null;
  variant?: 'solid' | 'pastel';
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  variant: 'solid',
});

const cardClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('flex');
  itemsClass.push('items-center');
  itemsClass.push('gap-4');
  itemsClass.push('rounded-xl');
  itemsClass.push('p-4');

  switch (props.variant) {
    case 'solid':
      itemsClass.push('bg-primary');
      itemsClass.push('text-white');
      break;
    case 'pastel':
      itemsClass.push('bg-primary-50');
      itemsClass.push('text-primary');
      itemsClass.push('dark:bg-primary/10');
      break;
  }

  return itemsClass.join(' ');
});

const iconBoxClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('inline-flex');
  itemsClass.push('aspect-square');
  itemsClass.push('w-12');
  itemsClass.push('min-w-12');
  itemsClass.push('items-center');
  itemsClass.push('justify-center');
  itemsClass.push('rounded-lg');

  switch (props.variant) {
    case 'solid':
      itemsClass.push('bg-white/20');
      itemsClass.push('text-white');
      break;
    case 'pastel':
      itemsClass.push('text-primary');
      itemsClass.push('bg-primary-100');
      itemsClass.push('dark:bg-primary/50');
      itemsClass.push('dark:text-white');
      break;
  }

  return itemsClass.join(' ');
});

const separatorClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('min-h-full');
  itemsClass.push('border-r');

  switch (props.variant) {
    case 'solid':
      itemsClass.push('border-white/20');
      break;
    case 'pastel':
      itemsClass.push('border-primary/10');
      break;
  }

  return itemsClass.join(' ');
});

const valueClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('text-xl');
  itemsClass.push('!leading-snug');
  itemsClass.push('!font-bold');

  switch (props.variant) {
    case 'solid':
      itemsClass.push('!text-white');
      break;
    case 'pastel':
      itemsClass.push('!text-primary dark:!text-white');
      break;
  }

  return itemsClass.join(' ');
});

const textClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('text-sm');
  itemsClass.push('!leading-snug');
  itemsClass.push('!font-medium');

  switch (props.variant) {
    case 'solid':
      itemsClass.push('!text-white');
      break;
    case 'pastel':
      itemsClass.push('!text-primary dark:!text-white');
      break;
  }

  return itemsClass.join(' ');
});

const captionClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('text-xs');
  itemsClass.push('!leading-snug');
  itemsClass.push('!font-light');

  switch (props.variant) {
    case 'solid':
      itemsClass.push('!text-white');
      break;
    case 'pastel':
      itemsClass.push('!text-primary dark:!text-white');
      break;
  }

  return itemsClass.join(' ');
});
</script>
