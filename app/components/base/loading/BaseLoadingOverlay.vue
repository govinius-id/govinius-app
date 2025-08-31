<template>
  <div
    class="absolute left-0 top-0 z-[2] flex size-full cursor-progress items-center justify-center bg-white/50 transition duration-500 dark:bg-black/50"
    :class="{
      'invisible opacity-0': !props.show,
    }"
  >
    <BaseIcon name="mingcute:loading-3-fill" class="size-7 animate-spin" />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  show: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
});
</script>
