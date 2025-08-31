<template>
  <div class="flex w-full flex-col gap-y-7 md:max-w-md">
    <div class="flex flex-col items-center gap-y-1">
      <BaseText class="text-center text-xl font-semibold">
        {{ $i18n().t('auth.email_verification.title') }}
      </BaseText>

      <BaseText class="text-center text-sm !text-slate-400">
        {{ $i18n().t('auth.email_verification.caption') }}
      </BaseText>
    </div>

    <div class="flex w-full flex-col gap-y-5">
      <BaseInput
        ref="inputEmailRef"
        v-model="authEmailVerificationStore.inputForm.email"
        :error="authEmailVerificationStore.errorForm?.email"
        :label="$i18n().t('common.email')"
        :placeholder="
          $i18n().t('common.enter_value', {
            value: $i18n().t('common.email').toLowerCase(),
          })
        "
        class="w-full"
        icon-prefix="ph:envelope-simple-duotone"
      />
    </div>

    <BaseButton
      color="primary"
      :loading="authEmailVerificationStore.loadingSubmitForm"
      @click="authEmailVerificationStore.onSubmitForm()"
    >
      {{ $i18n().t('auth.email_verification.call_to_action') }}
    </BaseButton>
  </div>
</template>

<script lang="ts" setup>
const authEmailVerificationStore = useAuthEmailVerificationStore();

const onAutoSubmitForm = () => {
  authEmailVerificationStore.inputForm.email =
    authEmailVerificationStore.getEmail();
  authEmailVerificationStore.inputForm.token =
    authEmailVerificationStore.getToken();
  setTimeout(() => {
    authEmailVerificationStore.onSubmitForm();
  }, 500);
};

onMounted(() => {
  onAutoSubmitForm();
});
</script>
