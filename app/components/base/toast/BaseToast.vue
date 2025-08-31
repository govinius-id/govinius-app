<template>
  <ClientOnly>
    <Teleport v-if="isMounted" to="#app-root">
      <div class="fixed top-0 z-[9999] flex w-full justify-center">
        <div
          class="fixed"
          :class="{
            'p-3': baseToastStore.itemsToast.length > 0,
            'p-0': baseToastStore.itemsToast.length === 0,
          }"
        >
          <TransitionGroup
            enter-active-class="duration-200 ease-linear"
            enter-from-class="transform opacity-0 -translate-y-5 scale-90"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="duration-200 ease-linear absolute"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="transform opacity-0 -translate-y-full scale-50"
            move-class="duration-200"
            tag="div"
            class="flex flex-col items-center justify-center gap-3"
          >
            <div
              v-for="(obj, i) in baseToastStore.itemsToast"
              :key="obj.key"
              :class="toastClass(obj)"
            >
              <div
                v-if="toastIcon(obj)"
                class="inline-flex h-12 min-w-6 items-center justify-center pr-2"
              >
                <BaseIcon :name="toastIcon(obj)" size="lg" />
              </div>

              <div class="grow py-3.5 text-sm md:py-3 md:text-base">
                <div v-html="obj.message"></div>
              </div>

              <button
                class="ml-auto inline-flex h-12 min-w-12 cursor-pointer items-center justify-center rounded-lg"
                @click="baseToastStore.onCloseToast(i)"
              >
                <BaseIcon name="ph:x" />
              </button>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script lang="ts" setup>
import type { BaseToast } from '~/types/base';

const baseToastStore = useBaseToastStore();

const toastIcon = (obj: BaseToast) => {
  switch (obj.type) {
    case 'success':
      return 'ph:check-circle-duotone';
    case 'error':
      return 'ph:warning-duotone';
    default:
      return '';
  }
};

const toastClass = (obj: BaseToast) => {
  const itemsClass: string[] = [];

  itemsClass.push('flex justify-center');
  itemsClass.push('min-w-96 max-w-2/3 min-h-12 pl-4');
  itemsClass.push('rounded-lg select-none');

  switch (obj.type) {
    case 'success':
      itemsClass.push('bg-success/80 !text-white');
      itemsClass.push('dark:bg-success-800/80');
      break;
    case 'error':
      itemsClass.push('bg-danger/80 !text-white');
      itemsClass.push('dark:bg-danger-800/80');
      break;
    default:
      itemsClass.push('bg-dark !text-white');
      itemsClass.push('dark:bg-black/80');
      break;
  }

  return itemsClass.join(' ');
};

const isMounted = useMounted();
</script>
