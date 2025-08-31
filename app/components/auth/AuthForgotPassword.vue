<template>
  <div class="flex w-full flex-col gap-y-7 md:max-w-md">
    <div class="flex flex-col items-center gap-y-1">
      <BaseText class="text-center text-xl font-semibold">
        {{ $i18n().t('auth.forgot_password.title') }}
      </BaseText>

      <BaseText class="text-center text-sm !text-slate-400">
        {{ $i18n().t('auth.forgot_password.caption') }}
      </BaseText>
    </div>

    <div class="flex w-full flex-col gap-y-5">
      <BaseInput
        ref="inputEmailRef"
        v-model="authForgotPasswordStore.inputForm.email"
        :error="authForgotPasswordStore.errorForm?.email"
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
      :loading="authForgotPasswordStore.loadingSubmitForm"
      @click="authForgotPasswordStore.onSubmitForm()"
    >
      {{ $i18n().t('common.reset_password') }}
    </BaseButton>
  </div>
</template>

<script lang="ts" setup>
const authForgotPasswordStore = useAuthForgotPasswordStore();
</script>
