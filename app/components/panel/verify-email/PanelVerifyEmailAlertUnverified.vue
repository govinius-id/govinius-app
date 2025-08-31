<template>
  <BaseAlert
    v-if="$auth().user?.email && !$auth().user?.is_email_verified"
    :title="$i18n().t('auth.email_verification.alert_unverified_title')"
    color="info"
    icon="ph:seal-check-fill"
    class="mb-4"
  >
    <template #content>
      <BaseText
        class="text-sm"
        v-html="$i18n().t('auth.email_verification.alert_unverified_content')"
      />
    </template>
    <template #action>
      <BaseButton
        :loading="authVerifyEmailStore.loadingSubmitForm"
        size="sm"
        color="info"
        @click="authVerifyEmailStore.onSubmitForm()"
      >
        {{ $i18n().t('common.verify_now') }}
      </BaseButton>
    </template>
  </BaseAlert>
</template>

<script lang="ts" setup>
const authVerifyEmailStore = useAuthVerifyEmailStore();
</script>
