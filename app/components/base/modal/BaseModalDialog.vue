<template>
  <BaseModal ref="modalRef" v-model="baseDialogStore.isModalOpen" :z-index="90">
    <template #content="opts">
      <Transition
        enter-active-class="duration-100 ease-linear"
        enter-from-class="opacity-0 -translate-y-5 scale-95"
        enter-to-class="opacity-100"
        leave-active-class="duration-200 ease-linear"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0 -translate-y-full scale-50"
      >
        <BaseCard v-if="opts.isModalContent" class="w-full max-w-sm" bordered>
          <BaseCardHead
            :title="baseDialogStore.dialog?.title"
            size="sm"
            bordered
          >
            <template #suffix>
              <BaseButtonIcon
                icon="ph:x-bold"
                size="sm"
                @click="opts.onClose()"
              />
            </template>
          </BaseCardHead>

          <div class="flex flex-col items-center gap-y-5">
            <BaseIcon
              v-if="baseDialogStore.dialog?.icon"
              :name="baseDialogStore.dialog?.icon"
              :class="baseDialogStore.dialog?.classes?.icon"
            />
            <BaseText v-html="baseDialogStore.dialog?.message" />
          </div>

          <BaseCardAction>
            <BaseButton
              v-if="baseDialogStore.dialog?.type === 'confirm'"
              ref="buttonCancelRef"
              :classes="{
                color: baseDialogStore.dialog?.classes?.buttonCancel,
              }"
              :loading="loadingCancel"
              @click="onCancel()"
            >
              {{
                baseDialogStore.dialog?.textCancel || $i18n().t('common.cancel')
              }}
            </BaseButton>
            <BaseButton
              ref="buttonOkRef"
              :color="baseDialogStore.dialog?.colorOk"
              :classes="{ color: baseDialogStore.dialog?.classes?.buttonOk }"
              :loading="loadingOk"
              @click="onOk()"
            >
              {{ baseDialogStore.dialog?.textOk || $i18n().t('common.ok') }}
            </BaseButton>
          </BaseCardAction>
        </BaseCard>
      </Transition>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
const baseDialogStore = useBaseDialogStore();

const loadingOk = ref(false);
const onOk = async () => {
  loadingOk.value = true;
  if (baseDialogStore.dialog?.onOk) {
    await baseDialogStore.dialog?.onOk();
  }
  baseDialogStore.isModalOpen = false;
  loadingOk.value = false;
};

const loadingCancel = ref(false);
const onCancel = async () => {
  loadingCancel.value = true;
  if (baseDialogStore.dialog?.onCancel) {
    await baseDialogStore.dialog?.onCancel();
  }
  baseDialogStore.isModalOpen = false;
  loadingCancel.value = false;
};

const modalRef = ref();
const buttonCancelRef = ref();
const buttonOkRef = ref();

watch(
  () => baseDialogStore.isModalOpen,
  () => {
    setTimeout(() => {
      buttonOkRef.value?.focus();
    }, 200);
  },
);

onKeyStroke(
  'Escape',
  () => {
    onCancel();
  },
  { target: modalRef.value },
);
</script>
