<template>
  <div class="flex w-full flex-col gap-y-7 md:max-w-96">
    <div class="flex flex-col items-center gap-y-1">
      <BaseText class="text-center text-xl font-semibold">
        {{ $i18n().t('auth.login.title') }}
      </BaseText>

      <BaseText class="text-center text-sm !text-slate-400">
        {{ $i18n().t('auth.login.caption') }}
      </BaseText>
    </div>

    <div class="flex w-full flex-col gap-y-5">
      <BaseInput
        ref="inputUsernameRef"
        v-model="authLoginStore.inputForm.username"
        :error="authLoginStore.errorForm?.username"
        :label="$i18n().t('common.username')"
        :placeholder="
          $i18n().t('common.enter_value', {
            value: $i18n().t('common.username').toLowerCase(),
          })
        "
        class="w-full"
        icon-prefix="ph:envelope-simple-duotone"
        @keydown="
          $keydownPressKey($event, 'Enter', authLoginStore.onSubmitForm)
        "
      />

      <BaseInputPassword
        v-model="authLoginStore.inputForm.password"
        :error="authLoginStore.errorForm?.password"
        :label="$i18n().t('common.password')"
        class="w-full"
        :placeholder="
          $i18n().t('common.enter_value', {
            value: $i18n().t('common.password').toLowerCase(),
          })
        "
        @keydown="
          $keydownPressKey($event, 'Enter', authLoginStore.onSubmitForm)
        "
      />
    </div>

    <div class="flex justify-end">
      <NuxtLink tabindex="-1" to="/auth/forgot-password">
        <BaseText class="text-sm !text-slate-400">
          {{ $i18n().t('common.forgot_password') }}?
        </BaseText>
      </NuxtLink>
    </div>

    <BaseButton
      color="primary"
      :loading="authLoginStore.loadingSubmitForm"
      @click="authLoginStore.onSubmitForm()"
    >
      {{ $i18n().t('common.login') }}
    </BaseButton>
  </div>
</template>

<script lang="ts" setup>
const authLoginStore = useAuthLoginStore();

const inputUsernameRef = ref();

onMounted(() => {
  inputUsernameRef.value?.focus();
});
</script>
