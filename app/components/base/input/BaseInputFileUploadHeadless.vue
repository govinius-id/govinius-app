<template>
  <input
    ref="inputFile"
    type="file"
    class="hidden"
    :accept="props.allowExtensions?.map((val) => `.${val}`)?.join(',')"
    :multiple="props.multiple"
    @change="onSelect($event)"
  />

  <slot
    :preview="preview"
    :on-drop="onDrop"
    :on-open="onOpen"
    :on-remove="onRemove"
  ></slot>
</template>

<script lang="ts" setup>
interface Props {
  modelValue: any;
  multiple?: boolean;
  allowExtensions?: string[];
  minSize?: string;
  maxSize?: string;
}

const emits = defineEmits(['update:modelValue']);
const props = withDefaults(defineProps<Props>(), {
  multiple: false,
});

const inputModel = computed({
  get() {
    return props.modelValue;
  },
  set(value: any) {
    emits('update:modelValue', value);
  },
});

const inputFile = ref();

const preview = computed(() => {
  if (props.multiple) {
    return inputModel.value.map((obj: any) => {
      if (obj instanceof File) {
        return URL.createObjectURL(obj);
      } else {
        return obj;
      }
    });
  } else {
    if (inputModel.value instanceof File) {
      return URL.createObjectURL(inputModel.value);
    } else {
      return inputModel.value;
    }
  }
});

const onDrop = (files: File[] | null) => {
  if (files && files.length > 0) {
    if (props.multiple) {
      for (const objFile of files) {
        const isValidFileSize = onValidateFileSize(objFile);
        const isValidFileType = onValidateFileType(objFile);
        if (isValidFileSize && isValidFileType) {
          inputModel.value.unshift(objFile);
        }
      }
    } else {
      const isValidFileSize = onValidateFileSize(files[0]);
      const isValidFileType = onValidateFileType(files[0]);
      if (isValidFileSize && isValidFileType) {
        inputModel.value = files[0];
      }
    }
  }
};

const onOpen = () => {
  inputFile.value.click();
};

const onSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    if (props.multiple) {
      for (const objFile of input.files) {
        const isValidFileSize = onValidateFileSize(objFile);
        const isValidFileType = onValidateFileType(objFile);
        if (isValidFileSize && isValidFileType) {
          inputModel.value.unshift(objFile);
        }
      }
    } else {
      const isValidFileSize = onValidateFileSize(input.files[0]);
      const isValidFileType = onValidateFileType(input.files[0]);
      if (isValidFileSize && isValidFileType) {
        inputModel.value = input.files[0];
      }
    }
  }
};

const onRemove = (index?: number) => {
  inputFile.value.value = null;
  if (props.multiple) {
    inputModel.value.splice(index, 1);
  } else {
    inputModel.value = null;
  }
};

const onValidateFileSize = (file: File) => {
  if (props.minSize) {
    const byteSize = $convertToByteSize(props.minSize);

    if (file.size < byteSize) {
      $toast().open({
        type: 'error',
        message: $i18n().t('validator.min_file_size', { size: props.minSize }),
      });

      return false;
    }
  }

  if (props.maxSize) {
    const byteSize = $convertToByteSize(props.maxSize);

    if (file.size > byteSize) {
      $toast().open({
        type: 'error',
        message: $i18n().t('validator.max_file_size', { size: props.maxSize }),
      });

      return false;
    }
  }

  return true;
};

const onValidateFileType = (file: File) => {
  if (props.allowExtensions) {
    const fileExt = $fileUploadExtension(file.type);

    if (fileExt && !props.allowExtensions.includes(fileExt)) {
      $toast().open({
        type: 'error',
        message: $i18n().t('validator.allow_file_type', {
          types: props.allowExtensions.join(', '),
        }),
      });

      return false;
    }
  }

  return true;
};
</script>
