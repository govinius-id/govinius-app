<template>
  <div class="flex w-full flex-col gap-y-1">
    <div
      class="group/dropzone flex w-full flex-col items-center justify-center space-y-1 rounded-lg py-3"
      :class="{
        'dark:border-dark-700 border border-slate-300': !props.error,
        'border-danger border': props.error,
        'bg-primary-50': isOverDropZone,
        'dark:hover:bg-dark-900 cursor-pointer hover:bg-slate-50':
          !isOverDropZone,
      }"
      @click="triggerFileInput"
      @dragover.prevent="isOverDropZone = true"
      @dragleave.prevent="isOverDropZone = false"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInputRef"
        type="file"
        class="hidden"
        :accept="props.allowExtensions?.map((val) => `.${val}`)?.join(',')"
        multiple
        @change="handleFileSelect"
      />
      <BaseIcon
        name="ph:cloud-arrow-up-light"
        class="size-7 min-h-7"
        :class="{
          'text-primary': isOverDropZone,
          'group-hover/dropzone:text-primary text-slate-400': !isOverDropZone,
        }"
      />
      <BaseText class="text-xs text-slate-400"> Drop files to upload </BaseText>
      <BaseText class="text-xs text-slate-400"> OR </BaseText>
      <BaseChip color="#94a3b8" size="sm" class="text-sm">
        Select files
      </BaseChip>
    </div>

    <div v-if="props.error" class="text-danger text-xs">
      {{ props.error }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface Props {
  allowExtensions?: string[];
  error?: any;
}

const emit = defineEmits(['drop', 'click']);
const props = withDefaults(defineProps<Props>(), {});

const isOverDropZone = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleDrop = (event: DragEvent) => {
  isOverDropZone.value = false;
  if (event.dataTransfer?.files) {
    emit('drop', event.dataTransfer.files);
  }
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    emit('drop', target.files);
  }
};

defineExpose({
  click: triggerFileInput,
});
</script>
