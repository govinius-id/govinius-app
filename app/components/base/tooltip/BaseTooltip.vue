<template>
  <div ref="activatorRef" @click="isActivatorHover = false">
    <slot></slot>
  </div>

  <ClientOnly>
    <Teleport v-if="isMounted" to="#app-root">
      <Transition
        enter-active-class="duration-100 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="duration-0"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isActivatorHover && props.text"
          ref="tooltipRef"
          :class="tooltipClass"
          :style="{
            '--top': `${tooltipTop}px`,
            '--left': `${tooltipLeft}px`,
          }"
        >
          {{ props.text }}
          <div :class="arrowClass"></div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script lang="ts" setup>
interface Props {
  text?: string | null;
  show?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
  position: 'top',
});

const activatorRef = ref();
const tooltipRef = ref();
const tooltipTop = ref(0);
const tooltipLeft = ref(0);

const onCalculatePosition = () => {
  const tooltipRect = tooltipRef.value?.getBoundingClientRect();
  const activatorRect = activatorRef.value?.getBoundingClientRect();

  if (!tooltipRect) return;

  const arrowSize = 10;

  if (props.position === 'top') {
    tooltipTop.value = activatorRect.y - tooltipRect.height - arrowSize;
    tooltipLeft.value =
      activatorRect.x - tooltipRect.width / 2 + activatorRect.width / 2;
  }

  if (props.position === 'bottom') {
    tooltipTop.value = activatorRect.y + activatorRect.height + arrowSize;
    tooltipLeft.value =
      activatorRect.x - tooltipRect.width / 2 + activatorRect.width / 2;
  }

  if (props.position === 'left') {
    tooltipTop.value =
      activatorRect.y - tooltipRect.height / 2 + activatorRect.height / 2;
    tooltipLeft.value = activatorRect.x - tooltipRect.width - arrowSize;
  }

  if (props.position === 'right') {
    tooltipTop.value =
      activatorRect.y + activatorRect.height / 2 - tooltipRect.height / 2;
    tooltipLeft.value = activatorRect.x + activatorRect.width + arrowSize;
  }
};

const tooltipClass = computed(() => {
  if (!props.show || !isActivatorHover.value || $breakpoint().is_xs) {
    return 'absolute invisible';
  }

  const itemsClass: string[] = [];

  itemsClass.push('fixed z-[999]');
  itemsClass.push('select-none');
  itemsClass.push('visible');
  itemsClass.push('transition-opacity');
  itemsClass.push('bg-dark');
  itemsClass.push('text-white');
  itemsClass.push('text-nowrap');
  itemsClass.push('text-xs');
  itemsClass.push('px-3 py-2');
  itemsClass.push('rounded-lg');
  itemsClass.push('top-[var(--top)] left-[var(--left)]');
  itemsClass.push('dark:bg-black');
  itemsClass.push('dark:text-dark-100');

  return itemsClass.join(' ');
});

const arrowClass = computed(() => {
  if (!props.show || !isActivatorHover.value) {
    return 'absolute';
  }

  const itemsClass: string[] = [];

  itemsClass.push('absolute w-0 h-0');

  if (props.position === 'top') {
    itemsClass.push('top-[calc(100%-1px)] left-0 ml-[calc(50%-7px)]');
    itemsClass.push('border-l-[7px] border-l-transparent');
    itemsClass.push('border-t-[7px] border-t-dark');
    itemsClass.push('border-r-[7px] border-r-transparent');
    itemsClass.push('dark:border-t-black');
  }
  if (props.position === 'bottom') {
    itemsClass.push('bottom-[calc(100%-1px)] left-0 ml-[calc(50%-7px)]');
    itemsClass.push('border-l-[7px] border-l-transparent');
    itemsClass.push('border-b-[7px] border-b-dark');
    itemsClass.push('border-r-[7px] border-r-transparent');
    itemsClass.push('dark:border-b-black');
  }
  if (props.position === 'left') {
    itemsClass.push('left-[calc(100%-1px)] top-0 mt-2');
    itemsClass.push('border-t-[7px] border-t-transparent');
    itemsClass.push('border-l-[7px] border-l-dark');
    itemsClass.push('border-b-[7px] border-b-transparent');
    itemsClass.push('dark:border-l-black');
  }
  if (props.position === 'right') {
    itemsClass.push('right-[calc(100%-1px)] top-0 mt-2');
    itemsClass.push('border-t-[7px] border-t-transparent');
    itemsClass.push('border-r-[7px] border-r-dark');
    itemsClass.push('border-b-[7px] border-b-transparent');
    itemsClass.push('dark:border-r-black');
  }

  return itemsClass.join(' ');
});

const windowScroll = useWindowScroll();
watchDeep(
  () => [windowScroll.x, windowScroll.y],
  () => {
    onCalculatePosition();
  },
);

const isActivatorHover = useElementHover(activatorRef);
watch(
  () => isActivatorHover.value,
  async () => {
    await nextTick();
    onCalculatePosition();
  },
);

const isMounted = useMounted();

onMounted(() => {
  onCalculatePosition();
});
</script>
