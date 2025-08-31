<template>
  <slot
    name="activator"
    :is-open="isModalOpen"
    :on-open="onOpenModal"
    :on-close="onCloseModal"
    :class="props.class"
  ></slot>

  <ClientOnly>
    <Teleport v-if="isMounted" to="#app-root">
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
          v-if="isModalOpen"
          class="fixed inset-0 z-[var(--z-index)] h-dvh w-dvw bg-black/30 dark:bg-black/60"
          :style="{
            '--z-index': props.zIndex,
          }"
          @click.self="onCloseModal()"
        >
          <div
            class="size-full overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div
              class="min-h-dvh w-dvw px-3 pb-20 pt-5"
              @click.self="onCloseModal()"
            >
              <div
                class="flex w-full justify-center"
                @click.self="onCloseModal()"
              >
                <slot
                  name="content"
                  :is-modal-content="isModalContent"
                  :on-close="onCloseModal"
                ></slot>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script lang="ts" setup>
interface Props {
  modelValue?: boolean;
  backdrop?: boolean;
  zIndex?: number;
  class?: string;
}

const emit = defineEmits(['update:modelValue']);
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  backdrop: true,
  zIndex: 80,
});

const modalModel = computed({
  get() {
    return props.modelValue;
  },
  set(value: boolean) {
    emit('update:modelValue', value);
  },
});

watch(
  () => modalModel.value,
  () => {
    if (modalModel.value) {
      onOpenModal();
    } else {
      onCloseModal();
    }
  },
);

const isModalOpen = ref(false);
const isModalContent = ref(false);

const onOpenModal = () => {
  isModalOpen.value = true;
  modalModel.value = true;
  setTimeout(() => {
    isModalContent.value = true;
    document.body.classList.add('overflow-hidden');
  }, 100);
};

const onCloseModal = () => {
  isModalContent.value = false;
  setTimeout(() => {
    isModalOpen.value = false;
    modalModel.value = false;
    document.body.classList.remove('overflow-hidden');
  }, 100);
};

const isMounted = useMounted();

onMounted(() => {
  onCloseModal();
});

onUnmounted(() => {
  onCloseModal();
});
</script>
