<template>
  <div
    class="w-full overflow-hidden overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
  >
    <div class="inline-flex gap-3">
      <div
        v-for="(obj, i) in props.items"
        :key="i"
        :ref="(el) => (stepRefs[i] = el as HTMLElement)"
        :class="stepperStepClass(obj)"
        @click="onSelectItem(obj)"
      >
        <BaseIcon
          v-if="i > 0"
          name="ph:caret-right-bold"
          :class="stepperArrowClass()"
        />

        <div :class="stepperCircleClass(obj)">
          {{ i + 1 }}
        </div>

        {{ obj.text }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { BaseListItem } from '~/types/base';

interface Props {
  modelValue: any;
  size?: 'sm' | 'md';
  clickable?: boolean;
  items: BaseListItem[];
}

const emit = defineEmits(['update:modelValue']);
const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  clickable: false,
});

const stepModel = computed({
  get() {
    return props.modelValue;
  },
  set(value: any) {
    emit('update:modelValue', value);
  },
});

watch(
  () => stepModel.value,
  () => {
    onScrollToItem();
  },
);

const stepRefs = ref<HTMLElement[]>([]);

const onScrollToItem = () => {
  nextTick(() => {
    const index = props.items.findIndex((obj) => obj.value === stepModel.value);
    const el = stepRefs.value?.[index];
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  });
};

const onSelectItem = (obj: BaseListItem) => {
  if (props.clickable) {
    stepModel.value = obj.value;
  }
};

const stepperStepClass = (obj: BaseListItem) => {
  const baseClass: string[] = [];

  baseClass.push('inline-flex justify-center items-center gap-2');
  baseClass.push('text-nowrap');

  if (props.clickable) {
    baseClass.push('cursor-pointer');
  }

  switch (props.size) {
    case 'sm':
      baseClass.push('text-xs');
      break;
    case 'md':
      baseClass.push('text-sm');
      break;
  }

  if (stepModel.value === obj.value) {
    baseClass.push('text-dark');
  } else {
    baseClass.push('text-slate-300');
  }

  return baseClass.join(' ');
};

const stepperCircleClass = (obj: BaseListItem) => {
  const baseClass: string[] = [];

  baseClass.push('inline-flex justify-center items-center');
  baseClass.push('rounded-full');
  baseClass.push('duration-300');

  switch (props.size) {
    case 'sm':
      baseClass.push('size-6 min-w-6');
      baseClass.push('text-xs');
      break;
    case 'md':
      baseClass.push('size-8 min-w-8');
      baseClass.push('text-sm');
      break;
  }

  if (stepModel.value === obj.value) {
    baseClass.push('bg-primary text-white');
  } else {
    baseClass.push('text-dark border border-slate-200');
  }

  return baseClass.join(' ');
};

const stepperArrowClass = () => {
  const baseClass: string[] = [];

  baseClass.push('text-slate-300');

  switch (props.size) {
    case 'sm':
      baseClass.push('size-3 min-w-3');
      break;
    case 'md':
      baseClass.push('size-4 min-w-4');
      break;
  }

  return baseClass.join(' ');
};

onMounted(() => {
  onScrollToItem();
});
</script>
