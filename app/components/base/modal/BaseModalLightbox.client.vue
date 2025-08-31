<template>
  <ClientOnly>
    <Teleport v-if="isMounted" to="#app-root">
      <div
        v-if="isModalOverlay"
        class="fixed left-0 top-0 z-[100] flex min-h-dvh w-full select-none flex-col items-center overflow-y-auto overflow-x-hidden bg-black/80"
        @click.self="onCloseModal()"
      >
        <div
          v-if="isModalContent"
          ref="modalRef"
          class="relative w-dvw min-w-0 overflow-hidden"
        >
          <div
            class="fixed left-0 top-0 z-[3] flex h-12 w-dvw items-center gap-2 bg-black/20 px-5"
          >
            <div class="line-clamp-1 text-lg text-white">
              {{ currentItem?.name }}
            </div>
            <div class="ml-auto flex gap-2">
              <div
                class="flex size-12 cursor-pointer items-center justify-center"
                @click="onRotateImage()"
              >
                <BaseIcon
                  name="ph:arrows-clockwise"
                  class="text-3xl text-white"
                />
              </div>
              <div
                class="flex size-12 cursor-pointer items-center justify-center"
                @click="onCloseModal()"
              >
                <BaseIcon name="ph:x" class="text-3xl text-white" />
              </div>
            </div>
          </div>

          <div
            id="swiper-slide-prev-lightbox"
            class="absolute left-0 top-0 z-[2] flex h-dvh w-12 cursor-pointer items-center justify-center"
          >
            <BaseIcon name="ph:caret-left-light" class="text-4xl text-white" />
          </div>

          <div
            id="swiper-slide-next-lightbox"
            class="absolute right-0 top-0 z-[2] flex h-dvh w-12 cursor-pointer items-center justify-center"
          >
            <BaseIcon name="ph:caret-right-light" class="text-4xl text-white" />
          </div>

          <div class="swiper-lightbox h-dvh w-dvw">
            <div class="swiper-wrapper">
              <div
                v-for="(obj, i) in baseLightboxStore.itemsLightboxImage"
                :key="i"
                class="swiper-slide"
              >
                <div class="flex size-full items-center justify-center">
                  <img
                    v-if="obj.url"
                    :src="obj.url"
                    class="object-contain"
                    :class="{
                      'cursor-grab': zoomLevel > 1 && !isDragging,
                      'cursor-grabbing': zoomLevel > 1 && isDragging,
                      'duration-500': zoomLevel === 1 && !isDragging,
                    }"
                    :style="i === currentIndex ? imageStyle : undefined"
                    draggable="false"
                    @wheel="onWheel"
                    @pointerdown="handlePointerDown"
                    @pointermove="handlePointerMove"
                    @pointerup="handlePointerUp"
                    @touchstart="onTouchStart"
                    @touchmove="onTouchMove"
                    @touchend="onTouchEnd"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script lang="ts" setup>
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const baseLightboxStore = useBaseLightboxStore();

const isModalOverlay = ref(false);
const isModalContent = ref(false);

watch(
  () => baseLightboxStore.isModalOpen,
  () => {
    if (baseLightboxStore.isModalOpen) {
      isModalOverlay.value = true;
      setTimeout(() => {
        isModalContent.value = true;
      }, 100);
    } else {
      isModalContent.value = false;
      setTimeout(() => {
        isModalOverlay.value = false;
      }, 100);
    }
  },
  {
    immediate: true,
  },
);

watch(
  () => isModalContent.value,
  async () => {
    await nextTick();

    onResetImageTransform();
    imageRotationDegree.value = 0;
    currentIndex.value = baseLightboxStore.initialIndex;

    if (isModalContent.value) {
      initSwiperLightbox();
    }
  },
);

const onCloseModal = () => {
  baseLightboxStore.isModalOpen = false;
};

const swiperLightbox = ref<Swiper>();
const initSwiperLightbox = () => {
  swiperLightbox.value = new Swiper('.swiper-lightbox', {
    modules: [Navigation],
    initialSlide: baseLightboxStore.initialIndex,
    slidesPerView: 1,
    loop: true,
    navigation: {
      enabled: true,
      nextEl: '#swiper-slide-next-lightbox',
      prevEl: '#swiper-slide-prev-lightbox',
    },
    on: {
      slideChange: onSlideChange,
    },
  });
};

const currentIndex = ref(baseLightboxStore.initialIndex);
const currentItem = computed(() => {
  return baseLightboxStore.itemsLightboxImage[currentIndex.value] || null;
});

const onSlideChange = (event: any) => {
  onResetImageTransform();
  imageRotationDegree.value = 0;
  currentIndex.value = event.realIndex;
};

const onResetImageTransform = () => {
  zoomLevel.value = 1;
  translateX.value = 0;
  translateY.value = 0;
  isDragging.value = false;
};

const zoomLevel = ref(1);
const translateX = ref(0);
const translateY = ref(0);
const isDragging = ref(false);

let startX = 0;
let startY = 0;
let initialPinchDistance = 0;
let initialZoomLevel = 1;
let lastCenter = { x: 0, y: 0 };

const onWheel = (event: WheelEvent) => {
  event.preventDefault();
  const zoomFactor = 0.1;
  if (event.deltaY < 0) {
    zoomLevel.value = Math.min(zoomLevel.value + zoomFactor, 3);
  } else {
    zoomLevel.value = Math.max(zoomLevel.value - zoomFactor, 1);
  }
  resetTranslateIfZoomReset();
};

const isTouchDevice = ref('ontouchstart' in window);

const handlePointerDown = (event: PointerEvent) => {
  if (!isTouchDevice.value && zoomLevel.value > 1) {
    isDragging.value = true;
    startX = event.clientX - translateX.value;
    startY = event.clientY - translateY.value;
  }
};

const handlePointerMove = (event: PointerEvent) => {
  if (!isTouchDevice.value && isDragging.value) {
    translateX.value = event.clientX - startX;
    translateY.value = event.clientY - startY;
  }
};

const handlePointerUp = () => {
  if (!isTouchDevice.value) {
    isDragging.value = false;
  }
};

const onTouchStart = (event: TouchEvent) => {
  if (event.touches.length === 2) {
    initialPinchDistance = getPinchDistance(event.touches);
    initialZoomLevel = zoomLevel.value;
    lastCenter = getTouchCenter(event.touches);
  } else if (event.touches.length === 1 && zoomLevel.value > 1) {
    isDragging.value = true;
    startX = event.touches[0].clientX - translateX.value;
    startY = event.touches[0].clientY - translateY.value;
  }
};

const onTouchMove = (event: TouchEvent) => {
  if (event.touches.length === 2) {
    const currentDistance = getPinchDistance(event.touches);
    const scaleFactor = currentDistance / initialPinchDistance;
    zoomLevel.value = Math.min(Math.max(initialZoomLevel * scaleFactor, 1), 3);

    const currentCenter = getTouchCenter(event.touches);
    const deltaX = currentCenter.x - lastCenter.x;
    const deltaY = currentCenter.y - lastCenter.y;

    if (zoomLevel.value > 1) {
      translateX.value += deltaX;
      translateY.value += deltaY;
    }

    lastCenter = currentCenter;
  } else if (event.touches.length === 1 && isDragging.value) {
    translateX.value = event.touches[0].clientX - startX;
    translateY.value = event.touches[0].clientY - startY;
  }
};

const onTouchEnd = () => {
  isDragging.value = false;
  initialPinchDistance = 0;
  resetTranslateIfZoomReset();
};

const getPinchDistance = (touches: TouchList) => {
  const [touch1, touch2] = touches;
  const dx = touch2.clientX - touch1.clientX;
  const dy = touch2.clientY - touch1.clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

const getTouchCenter = (touches: TouchList) => {
  const x = (touches[0].clientX + touches[1].clientX) / 2;
  const y = (touches[0].clientY + touches[1].clientY) / 2;
  return { x, y };
};

const resetTranslateIfZoomReset = () => {
  if (zoomLevel.value === 1) {
    translateX.value = 0;
    translateY.value = 0;
  }
};

const imageRotationDegree = ref(0);
const onRotateImage = () => {
  imageRotationDegree.value += 90;
  if (imageRotationDegree.value > 270) {
    imageRotationDegree.value = 0;
  }
};

const imageStyle = computed(() => {
  const rotate = imageRotationDegree.value % 360;
  const transform = `scale(${zoomLevel.value}) translate(${translateX.value}px, ${translateY.value}px) rotate(${rotate}deg)`;

  const isVertical = rotate === 90 || rotate === 270;

  return {
    transform: transform,
    width: isVertical ? `${window.innerHeight}px` : `${window.innerWidth}px`,
    height: isVertical ? `${window.innerWidth}px` : '100%',
  };
});

watch(
  () => zoomLevel.value,
  () => {
    if (zoomLevel.value === 1) {
      onResetImageTransform();
    }
  },
);

const modalRef = ref();

onKeyStroke(
  'Escape',
  () => {
    onCloseModal();
  },
  { target: modalRef.value },
);

onKeyStroke(
  'ArrowRight',
  () => {
    swiperLightbox.value?.slideNext();
  },
  { target: modalRef.value },
);

onKeyStroke(
  'ArrowLeft',
  () => {
    swiperLightbox.value?.slidePrev();
  },
  { target: modalRef.value },
);

const isMounted = useMounted();
</script>
