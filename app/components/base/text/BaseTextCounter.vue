<template>
  <slot name="content" :value="valueCounting"></slot>
</template>

<script lang="ts" setup>
interface Props {
  value?: number;
  duration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  duration: 500,
});

const valueCounting = ref(0);
let interval: ReturnType<typeof setInterval> | null = null;

const onAnimateCounter = () => {
  if (interval) {
    clearInterval(interval);
  }

  const speed = 10;
  const range = Math.abs(props.value - valueCounting.value);
  if (range === 0) return;

  const increment = Math.max(Math.round(range / (props.duration / speed)), 1);

  interval = setInterval(() => {
    const diff = props.value - valueCounting.value;
    const step = Math.sign(diff) * Math.min(Math.abs(diff), increment);

    valueCounting.value += step;

    if (valueCounting.value === props.value) {
      clearInterval(interval!);
      interval = null;
    }
  }, speed);
};

watch(
  () => props.value,
  () => {
    onAnimateCounter();
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (interval) {
    clearInterval(interval);
  }
});
</script>
