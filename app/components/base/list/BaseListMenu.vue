<template>
  <div class="flex flex-col gap-y-2">
    <BaseText v-if="props.title" class="text-xs !text-slate-400">
      {{ props.title }}
    </BaseText>

    <div class="flex flex-col">
      <NuxtLink
        v-for="(obj, i) in props.items"
        :key="i"
        :to="obj.to"
        :class="listMenuItemClass(obj)"
        tabindex="-1"
        @click="onSelectItem(obj)"
      >
        <BaseIcon
          v-if="obj.icon"
          :name="obj.icon"
          :class="listMenuItemIconClass(obj)"
          :size="props.size"
        />

        {{ obj.text }}
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  items: BaseMenuItem[];
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}

const emit = defineEmits(['select']);
const props = withDefaults(defineProps<Props>(), {
  size: 'md',
});

const onSelectItem = (obj: BaseMenuItem) => {
  obj.onClick?.();
  emit('select', obj);
};

const listMenuItemClass = (obj: BaseMenuItem) => {
  const itemsClass: string[] = [];

  itemsClass.push('flex items-center');
  itemsClass.push('w-full');
  itemsClass.push('rounded-md');
  itemsClass.push('cursor-pointer');

  if (obj.active) {
    itemsClass.push('bg-primary');
    itemsClass.push('text-white');
    itemsClass.push('dark:bg-primary');
  } else {
    itemsClass.push('text-dark');
    itemsClass.push('hover:bg-slate-100/50');
    itemsClass.push('dark:text-dark-100');
    itemsClass.push('dark:hover:bg-dark-900/50');
  }

  switch (props.size) {
    case 'sm':
      itemsClass.push('h-9');
      itemsClass.push('px-3');
      itemsClass.push('text-[0.8rem]');
      itemsClass.push('gap-x-2');
      break;
    case 'md':
      itemsClass.push('h-10');
      itemsClass.push('px-3');
      itemsClass.push('text-sm');
      itemsClass.push('gap-x-2');
      break;
    case 'lg':
      itemsClass.push('h-12');
      itemsClass.push('px-5');
      itemsClass.push('text-base');
      itemsClass.push('gap-x-3');
      break;
  }

  return itemsClass.join(' ');
};

const listMenuItemIconClass = (obj: BaseMenuItem) => {
  const itemsClass: string[] = [];

  if (obj.active) {
    itemsClass.push('text-white');
  } else {
    itemsClass.push('text-slate-400');
  }

  return itemsClass.join(' ');
};
</script>
