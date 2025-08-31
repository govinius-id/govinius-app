<template>
  <div
    class="dark:bg-dark-900/50 font-inter relative flex min-h-dvh w-full flex-col bg-white pb-[env(safe-area-inset-bottom)] xl:flex-row-reverse"
  >
    <div
      class="relative z-[1] h-56 w-full overflow-hidden md:h-72 xl:h-dvh xl:w-1/2"
    >
      <div
        v-if="props.backgroundImage"
        class="pointer-events-none absolute left-0 top-0 z-0 h-full w-full overflow-hidden"
      >
        <img
          :src="props.backgroundImage"
          alt="background"
          class="size-full object-cover object-center"
          draggable="false"
        />
      </div>
    </div>

    <div
      class="dark:bg-dark-950 z-[2] mx-auto -mt-10 flex w-full grow flex-col rounded-t-3xl bg-white shadow-2xl shadow-gray-300/50 md:-mt-56 md:max-w-2xl lg:shadow-none xl:mt-0 xl:w-1/2 xl:max-w-full xl:rounded-none dark:shadow-black/50"
    >
      <div
        v-if="$slots.header"
        class="flex min-h-16 w-full items-center gap-1 p-4"
      >
        <slot name="header"></slot>
      </div>

      <div class="flex grow justify-center px-5 py-10 xl:items-center">
        <slot name="main-content"></slot>
      </div>

      <div
        v-if="$slots.footer"
        class="flex min-h-16 w-full flex-col items-center gap-1 p-4 lg:flex-row"
      >
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  backgroundImage?: string;
}

const props = withDefaults(defineProps<Props>(), {});
</script>
