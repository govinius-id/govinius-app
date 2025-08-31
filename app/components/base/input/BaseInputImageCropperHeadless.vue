<template>
  <slot></slot>

  <BaseModalCard
    v-model="isModalOpen"
    :title="
      $i18n().t('common.customize_value', {
        value: props.label,
      })
    "
    size="sm"
  >
    <template #content>
      <div class="-mx-4 -my-4 h-80 w-auto">
        <img
          v-if="imageSrc"
          id="cropper-image"
          :src="imageSrc"
          alt="cropper image"
          class="size-full"
        />
      </div>
    </template>
    <template #action>
      <BaseButton
        @click="
          $emit('clear');
          isModalOpen = false;
        "
      >
        {{ $i18n().t('common.cancel') }}
      </BaseButton>
      <BaseButton color="primary" :loading="loadingCrop" @click="onCrop()">
        {{ $i18n().t('common.ok') }}
      </BaseButton>
    </template>
  </BaseModalCard>
</template>

<script lang="ts" setup>
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

interface Props {
  modelValue: File | null;
  label: string;
}

const emits = defineEmits(['update:modelValue', 'clear']);
const props = withDefaults(defineProps<Props>(), {});

const inputModel = computed({
  get() {
    return props.modelValue;
  },
  set(value: any) {
    emits('update:modelValue', value);
  },
});

const imageSrc = computed(() => {
  if (!inputModel.value) return null;
  return URL.createObjectURL(inputModel.value);
});

const isModalOpen = ref(false);

watch(
  () => inputModel.value,
  () => {
    if (inputModel.value) {
      isModalOpen.value = true;
    }
  },
);

watch(
  () => isModalOpen.value,
  () => {
    if (inputModel.value) {
      setTimeout(() => {
        initCropper();
      }, 200);
    }
  },
);

const cropper = ref<Cropper>();

const initCropper = () => {
  nextTick(() => {
    const el = document.getElementById('cropper-image');
    if (!el) return;

    cropper.value = new Cropper(el as HTMLImageElement, {
      dragMode: 'move',
      viewMode: 1,
      aspectRatio: 1,
      autoCropArea: 1,
      responsive: false,
      background: false,
      cropBoxMovable: false,
      cropBoxResizable: false,
      minCropBoxHeight: 300,
    });
  });
};

const loadingCrop = ref(false);
const onCrop = async () => {
  loadingCrop.value = true;
  const croppedCanvas = cropper.value?.getCroppedCanvas();

  if (!croppedCanvas) return;
  if (!inputModel.value) return;

  const blob = await new Promise<Blob>((resolve) => {
    croppedCanvas.toBlob((blob) => resolve(blob!));
  });

  const fileCropped = new File([blob], inputModel.value?.name, {
    type: blob.type,
  });

  inputModel.value = fileCropped;

  loadingCrop.value = false;

  setTimeout(() => {
    isModalOpen.value = false;
  }, 200);
};
</script>
