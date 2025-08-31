<template>
  <div class="flex min-w-fit select-none flex-col items-center gap-y-1 py-4">
    <slot v-if="$slots.icon" name="icon"></slot>

    <BaseIcon
      v-else-if="props.icon"
      :name="props.icon"
      class="size-7 text-slate-400"
    />

    <div class="flex flex-col items-center">
      <BaseText class="text-center text-sm">
        {{ props.title }}
      </BaseText>
      <BaseText class="text-center text-xs !text-slate-400">
        {{ props.caption }}
      </BaseText>
    </div>

    <div
      v-if="$slots.action"
      class="mt-3 flex w-full flex-col-reverse items-center justify-center gap-3 md:flex-row"
    >
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  title: string;
  caption?: string;
  icon?: string;
}

const props = withDefaults(defineProps<Props>(), {});
</script>
