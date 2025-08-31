<template>
  <slot
    name="activator"
    :is-open="isSheetOpen"
    :on-open="onOpenSheet"
    :on-close="onCloseSheet"
  ></slot>

  <ClientOnly>
    <Teleport to="#app-root">
      <Transition
        v-if="backdrop"
        enter-active-class="duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isSheetOpen"
          class="fixed inset-0 z-[var(--z-index)] bg-black/30 dark:bg-black/60"
          :style="{
            '--z-index': props.zIndex,
          }"
          @click.self="onCloseSheet()"
        ></div>
      </Transition>

      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transition duration-200"
        leave-from-class="translate-y-0"
        leave-to-class="translate-y-full"
      >
        <div
          v-if="isSheetOpen"
          ref="sheetCardRef"
          class="dark:bg-dark-950 fixed inset-x-0 bottom-0 z-[var(--z-index)] flex flex-col rounded-t-2xl bg-white pb-[env(safe-area-inset-bottom)] shadow-lg transition-[height] duration-[50ms]"
          :style="{
            '--z-index': props.zIndex,
          }"
        >
          <div
            class="dark:border-dark-900 flex items-center justify-between border-b border-slate-100 px-4 py-2"
          >
            <div class="min-w-9"></div>
            <div
              class="flex size-full cursor-grab flex-col items-center justify-center gap-3 active:cursor-grabbing"
              @mousedown="startDrag"
              @touchstart="startDrag"
            >
              <div
                class="dark:bg-dark-700 h-1.5 w-14 rounded-full bg-slate-300"
              ></div>
              <BaseText
                v-if="props.title"
                class="line-clamp-1 text-center text-lg font-medium"
              >
                {{ props.title }}
              </BaseText>
            </div>
            <BaseButtonIcon icon="ph:x" size="md" @click="onCloseSheet()" />
          </div>

          <div
            ref="sheetContentRef"
            class="flex grow flex-col gap-y-4 overflow-y-auto overscroll-none p-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <slot name="content"></slot>
          </div>

          <div
            v-if="$slots.action"
            class="dark:bg-dark-900 flex min-h-14 select-none items-center justify-end gap-2 bg-slate-50 px-3"
          >
            <slot name="action"></slot>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script lang="ts" setup>
interface Props {
  modelValue?: boolean;
  initialFraction?: number;
  backdrop?: boolean;
  title?: string;
  zIndex?: number;
}

const emit = defineEmits(['update:modelValue']);
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  initialFraction: 0.5,
  backdrop: true,
  zIndex: 85,
});

const sheetModel = computed({
  get: () => {
    return props.modelValue;
  },
  set: (value: boolean) => {
    emit('update:modelValue', value);
  },
});

watch(
  () => sheetModel.value,
  () => {
    if (sheetModel.value) {
      onOpenSheet();
    } else {
      onCloseSheet();
    }
  },
);

const isSheetOpen = ref(false);

const onOpenSheet = () => {
  isSheetOpen.value = true;
  sheetModel.value = true;
  setInitialHeight();
  document.body.classList.add('overflow-hidden');
};

const onCloseSheet = () => {
  isSheetOpen.value = false;
  sheetModel.value = false;
  isDragged.value = false;
  isDragging.value = false;
  document.body.classList.remove('overflow-hidden');
};

const sheetCardRef = ref<HTMLElement | null>(null);
const sheetContentRef = ref<HTMLElement | null>(null);

const isDragged = ref(false);
const isDragging = ref(false);
const currentFraction = ref(props.initialFraction);

let initialSheetHeight = 0;
let dragStartTime = 0;
let dragStartY = 0;

const startDrag = (event: MouseEvent | TouchEvent) => {
  event.preventDefault();

  const clientY =
    event instanceof TouchEvent ? event.touches[0].clientY : event.clientY;

  dragStartTime = performance.now();
  dragStartY = clientY;

  if (sheetCardRef.value) {
    initialSheetHeight = sheetCardRef.value.clientHeight;
  }

  const onMove = (e: MouseEvent | TouchEvent) => {
    const clientY = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;
    const deltaY = dragStartY - clientY;
    const newHeight = initialSheetHeight + deltaY;

    if (sheetCardRef.value) {
      sheetCardRef.value.style.height = `${newHeight}px`;
    }
  };

  const onEnd = (e: MouseEvent | TouchEvent) => {
    isDragging.value = false;

    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onEnd);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onEnd);

    const clientY =
      e instanceof TouchEvent ? e.changedTouches?.[0].clientY : e?.clientY;

    const dragEndTime = performance.now();
    const dragEndY = clientY ?? dragStartY;

    const deltaY = dragEndY - dragStartY;
    const deltaTime = dragEndTime - dragStartTime;

    const velocity = deltaY / deltaTime;

    const VELOCITY_CLOSE_THRESHOLD = 0.5;
    const VELOCITY_FULL_THRESHOLD = -0.5;

    const DIRECTION_UP = deltaY < 0;
    const DIRECTION_DOWN = deltaY > 0;

    if (DIRECTION_DOWN && velocity > VELOCITY_CLOSE_THRESHOLD) {
      onCloseSheet();
      return;
    }

    if (DIRECTION_UP && velocity < VELOCITY_FULL_THRESHOLD) {
      onSnapTo(1);
      return;
    }

    onSnapToClosest();
  };

  isDragging.value = true;
  isDragged.value = true;

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);
  document.addEventListener('touchmove', onMove);
  document.addEventListener('touchend', onEnd);
};

const onSnapTo = (fraction: number) => {
  currentFraction.value = fraction;
  if (sheetCardRef.value) {
    const screenHeight = window.innerHeight - 24;
    sheetCardRef.value.style.height = `${screenHeight * fraction}px`;
  }

  if (fraction <= 0) {
    onCloseSheet();
    return;
  }
};

const onSnapToClosest = () => {
  if (sheetCardRef.value) {
    const snapPoints = [0, props.initialFraction, 1];
    const screenHeight = window.innerHeight - 24;
    const currentHeight = sheetCardRef.value?.clientHeight ?? 0;

    const closest = snapPoints.reduce((prev, curr) => {
      const currPx = screenHeight * curr;
      return Math.abs(currPx - currentHeight) <
        Math.abs(screenHeight * prev - currentHeight)
        ? curr
        : prev;
    });

    onSnapTo(closest);
  }
};

const setInitialHeight = async () => {
  await nextTick();
  onSnapTo(props.initialFraction);
};

onMounted(() => {
  onCloseSheet();
});

onUnmounted(() => {
  onCloseSheet();
});
</script>
