<template>
  <div class="relative inline-block">
    <slot></slot>

    <span
      v-if="props.show"
      class="absolute right-0 top-0 -mr-1 -mt-1 flex h-3 w-3"
    >
      <span
        class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"
      ></span>
      <span class="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
    </span>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  show?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
});
</script>
