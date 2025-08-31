<template>
  <BaseTextLabelContent
    :label="props.label"
    :label-required="props.labelRequired"
    :label-optional="props.labelOptional"
  >
    <BaseInputFileUploadHeadless
      v-model="inputFile"
      :allow-extensions="props.allowExtensions"
      :max-size="props.maxSize"
      :min-size="props.minSize"
      class="w-full"
    >
      <template #default="opts">
        <slot
          v-if="$slots.image"
          name="image"
          :src="opts.preview || (inputModel && props.preview)"
          :on-drop="opts.onDrop"
          :on-open="opts.onOpen"
          :on-remove="opts.onRemove"
        ></slot>

        <BaseImage
          v-else
          :src="opts.preview || (inputModel && props.preview)"
          class="h-44 rounded-md"
        />

        <div v-if="props.error" class="text-danger text-xs">
          {{ props.error }}
        </div>

        <div class="mt-2 flex flex-col items-start">
          <BaseButton
            v-if="inputModel"
            icon-prefix="ph:trash-duotone"
            size="sm"
            color="danger"
            @click="inputModel = null"
          >
            {{ $i18n().t('common.delete') }}
          </BaseButton>
          <BaseButton
            v-else-if="opts.preview"
            icon-prefix="ph:trash-duotone"
            size="sm"
            color="danger"
            @click="opts.onRemove()"
          >
            {{ $i18n().t('common.delete') }}
          </BaseButton>
          <BaseButton
            v-else
            icon-prefix="ph:upload-duotone"
            size="sm"
            color="primary"
            @click="opts.onOpen()"
          >
            {{ $i18n().t('common.upload') }}
          </BaseButton>

          <div class="mt-2 flex flex-col">
            <BaseText
              v-if="props.minSize"
              class="text-xs font-light !text-slate-400"
            >
              *{{
                $i18n().t('validator.min_file_size', { size: props.minSize })
              }}
            </BaseText>
            <BaseText
              v-if="props.maxSize"
              class="text-xs font-light !text-slate-400"
            >
              *{{
                $i18n().t('validator.max_file_size', { size: props.maxSize })
              }}
            </BaseText>
            <BaseText
              v-if="props.allowExtensions"
              class="text-xs font-light !text-slate-400"
            >
              *{{
                $i18n().t('validator.allow_file_type', {
                  types: props.allowExtensions?.join(', '),
                })
              }}
            </BaseText>
          </div>
        </div>
      </template>
    </BaseInputFileUploadHeadless>
  </BaseTextLabelContent>
</template>

<script lang="ts" setup>
interface Props {
  modelValue: any;
  error?: string | null;
  label?: string;
  labelRequired?: boolean;
  labelOptional?: boolean;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  file: File | null;
  preview?: string | null;
  minSize?: string;
  maxSize?: string;
  allowExtensions?: string[];
}

const emit = defineEmits(['update:modelValue', 'update:file', 'clear']);
const props = defineProps<Props>();

const inputModel = computed({
  get() {
    return props.modelValue;
  },
  set(value: string | null) {
    emit('update:modelValue', value);
  },
});

const inputFile = computed({
  get() {
    return props.file;
  },
  set(value: string | null) {
    emit('update:file', value);
  },
});
</script>
