<template>
  <div class="flex flex-col gap-y-1">
    <BaseTextLabelContentHorizontal
      v-for="(obj, i) in props.items"
      v-show="!!obj.item"
      :key="i"
      :label="obj.label"
    >
      <BaseText v-if="!$slots[obj.key]" class="text-sm">
        {{ obj.item }}
      </BaseText>
      <slot v-else :name="obj.key" :item="obj.item"></slot>
    </BaseTextLabelContentHorizontal>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  items: {
    key: string;
    label: string;
    item: any;
  }[];
}

const props = withDefaults(defineProps<Props>(), {});
</script>
