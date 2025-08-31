<template>
  <div ref="listWrapperRef" :class="listWrapperClass">
    <div
      :class="listContainerClass"
      :style="{
        '--height': `${totalHeight}px`,
      }"
    >
      <div
        v-for="(obj, i) in itemsVirtual"
        :key="i"
        :class="listItemClass"
        :style="{
          '--top': `${getItemTop(i)}px`,
        }"
      >
        <slot name="item" :item="obj" :index="i"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  items: any[];
  itemHeight: number;
  classes?: {
    wrapper?: string;
    container?: string;
  };
}

const props = withDefaults(defineProps<Props>(), {});

const listWrapperRef = ref<HTMLElement | undefined>();
const listWrapperScrollRef = ref<HTMLElement | undefined>();
const listWrapperScrollTop = ref(0);
const itemsStart = ref(0);
const itemsEnd = ref(10);
const totalHeight = computed(() => props.items.length * props.itemHeight);

const itemsVirtual = computed(() => {
  return props.items.slice(itemsStart.value, itemsEnd.value);
});

const getItemTop = (index: number) => {
  return (index + itemsStart.value) * props.itemHeight;
};

const onScroll = (scrollTop: number) => {
  if (!listWrapperRef.value) return;

  const threshold = 50;
  const safeScrollTop = Math.max(0, scrollTop);

  listWrapperScrollTop.value = safeScrollTop;

  itemsStart.value = Math.floor(safeScrollTop / props.itemHeight);
  itemsEnd.value =
    itemsStart.value +
    Math.ceil(
      (listWrapperRef.value.clientHeight + threshold) / props.itemHeight,
    );
};

const onScrollToItem = (index: number) => {
  if (!listWrapperRef.value) return;
  if (!listWrapperScrollRef.value) return;

  const targetScrollTop = index * props.itemHeight;

  listWrapperScrollRef.value.scrollTo({
    top: targetScrollTop - props.itemHeight,
    behavior: 'smooth',
  });
};

const listWrapperClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('overflow-y-auto');
  itemsClass.push('relative');
  itemsClass.push('w-full');
  itemsClass.push('h-full');

  if (props.classes?.wrapper) {
    itemsClass.push(props.classes.wrapper);
  }

  return itemsClass.join(' ');
});

const listContainerClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('relative');
  itemsClass.push('flex flex-col');
  itemsClass.push('w-full');
  itemsClass.push('h-[var(--height)]');

  if (props.classes?.container) {
    itemsClass.push(props.classes.container);
  }

  return itemsClass.join(' ');
});

const listItemClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('absolute');
  itemsClass.push('w-full');
  itemsClass.push('top-[var(--top)]');

  return itemsClass.join(' ');
});

onMounted(() => {
  if (listWrapperRef.value) {
    $overlayScrollbars(
      listWrapperRef.value,
      {
        scrollbars: {
          autoHide: 'leave',
          autoHideDelay: 0,
          visibility: $breakpoint().is_xs ? 'hidden' : 'auto',
        },
        overflow: {
          x: 'hidden',
          y: 'scroll',
        },
      },
      {
        initialized: (event) => {
          listWrapperScrollRef.value = event.elements().viewport;
        },
        scroll: (event) => {
          const scrollTop = event.elements().viewport.scrollTop;
          onScroll(scrollTop);
        },
      },
    );
  }
});

defineExpose({
  onScrollToItem,
});
</script>
