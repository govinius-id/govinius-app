<template>
  <div :class="tabWrapperClass">
    <div class="inline-flex w-full min-w-fit">
      <div
        v-for="(obj, i) in props.items"
        :key="i"
        :ref="(el) => (tabRefs[i] = el as HTMLElement)"
        :class="tabClass(obj)"
        @click="onSelectItem(obj)"
      >
        <BaseIcon
          v-if="obj.icon"
          :name="obj.icon"
          :size="props.size"
          class="text-inherit"
        />
        <BaseText class="text-sm">
          {{ obj.text }}
        </BaseText>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  modelValue: any;
  size?: 'sm' | 'md' | 'lg';
  items: BaseListItem[];
}

const emit = defineEmits(['update:modelValue']);
const props = withDefaults(defineProps<Props>(), {
  size: 'md',
});

const route = useRoute();
const router = useRouter();

const tabModel = computed({
  get() {
    return props.modelValue;
  },
  set(value: any) {
    emit('update:modelValue', value);
  },
});

watch(
  () => tabModel.value,
  () => {
    onScrollToItem();
  },
);

const tabRefs = ref<HTMLElement[]>([]);

const onScrollToItem = () => {
  nextTick(() => {
    const index = props.items.findIndex((obj) => obj.value === tabModel.value);
    const el = tabRefs.value?.[index];
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
  tabModel.value = obj.value;
  if (obj.to) {
    router.push(obj.to);
  }
};

const onSelectItemFromUrl = () => {
  const objTab = props.items.find((obj) => obj.to === route.path);
  if (objTab?.value) {
    tabModel.value = objTab.value;
  }
};

watch(
  () => route.path,
  () => {
    onSelectItemFromUrl();
  },
  {
    immediate: true,
  },
);

const tabClass = (obj: BaseListItem) => {
  const itemsClass: string[] = [];

  itemsClass.push('inline-flex justify-center items-center');
  itemsClass.push('cursor-pointer');
  itemsClass.push('text-nowrap');
  itemsClass.push('gap-x-2');
  itemsClass.push('border-b-2');

  switch (props.size) {
    case 'sm':
      itemsClass.push('h-8 min-w-16 px-2');
      itemsClass.push('text-xs');
      break;
    case 'md':
      itemsClass.push('h-10 min-w-20 px-3');
      itemsClass.push('text-sm');
      break;
    case 'lg':
      itemsClass.push('h-12 min-w-24 px-5');
      itemsClass.push('text-sm');
      break;
  }

  if (tabModel.value === obj.value) {
    itemsClass.push('text-primary');
    itemsClass.push('border-primary');
    itemsClass.push('dark:text-primary');
    itemsClass.push('dark:border-primary');
  } else {
    itemsClass.push('text-slate-400');
    itemsClass.push('dark:text-slate-400');
    itemsClass.push('border-transparent');
    itemsClass.push('dark:border-transparent');
  }

  return itemsClass.join(' ');
};

const tabWrapperClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('overflow-hidden');
  itemsClass.push('overflow-x-auto');
  itemsClass.push('border-b');
  itemsClass.push('border-slate-200');
  itemsClass.push('[-ms-overflow-style:none]');
  itemsClass.push('[scrollbar-width:none]');
  itemsClass.push('[&::-webkit-scrollbar]:hidden');
  itemsClass.push('dark:border-dark-800');

  switch (props.size) {
    case 'sm':
      itemsClass.push('h-8 min-h-8');
      break;
    case 'md':
      itemsClass.push('h-10 min-h-10');
      break;
    case 'lg':
      itemsClass.push('h-12 min-h-12');
      break;
  }

  return itemsClass.join(' ');
});

onMounted(() => {
  onScrollToItem();
});
</script>
