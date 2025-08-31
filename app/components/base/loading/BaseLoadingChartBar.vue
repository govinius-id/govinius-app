<template>
  <div
    class="dark:bg-dark-900 animate-pulse cursor-progress rounded-lg bg-slate-50 p-3"
  >
    <div
      class="dark:bg-dark-600 h-4 w-full max-w-44 rounded-full bg-slate-200"
    ></div>

    <div
      class="relative mt-2 min-h-[var(--height)] w-full"
      :style="{
        '--height': `${props.height}px`,
      }"
    >
      <div
        class="dark:divide-dark-700 dark:border-dark-600 absolute top-0 z-[2] flex size-full flex-col items-stretch justify-evenly divide-y-2 divide-slate-100 border-b border-slate-200"
      >
        <div v-for="i in 6" :key="i"></div>
      </div>

      <div
        class="absolute top-0 z-[3] grid size-full grid-cols-5 items-end gap-3 px-3 md:grid-cols-12"
      >
        <div
          v-for="i in $breakpoint().is_md_and_up ? 12 : 5"
          :key="i"
          class="dark:bg-dark-600 mx-auto h-[var(--random-height)] w-full max-w-6 rounded-sm bg-slate-200"
          :style="{
            '--random-height': `${Math.random() * (100 - 50) + 50}%`,
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  height: 200,
});
</script>
