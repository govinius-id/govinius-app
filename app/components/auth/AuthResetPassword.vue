<template>
  <div class="flex w-full flex-col gap-y-7 md:max-w-md">
    <div class="flex flex-col items-center gap-y-1">
      <BaseText class="text-center text-xl font-semibold">
        {{ $i18n().t('auth.reset_password.title') }}
      </BaseText>

      <BaseText class="text-center text-sm !text-slate-400">
        {{ $i18n().t('auth.reset_password.caption') }}
      </BaseText>
    </div>

    <div class="flex w-full flex-col gap-y-5">
      <BaseInputPassword
        v-model="authResetPasswordStore.inputForm.new_password"
        :error="authResetPasswordStore.errorForm?.new_password"
        :label="$i18n().t('common.new_password')"
        :placeholder="
          $i18n().t('common.enter_value', {
            value: $i18n().t('common.new_password').toLowerCase(),
          })
        "
        class="w-full"
      />
    </div>

    <BaseButton
      color="primary"
      :loading="authResetPasswordStore.loadingSubmitForm"
      @click="authResetPasswordStore.onSubmitForm()"
    >
      {{ $i18n().t('common.save') }}
    </BaseButton>
  </div>
</template>

<script lang="ts" setup>
const authResetPasswordStore = useAuthResetPasswordStore();
</script>
