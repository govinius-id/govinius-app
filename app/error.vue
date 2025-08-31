<template>
  <BaseLayoutCenter>
    <BasePlaceholderSection
      :title="itemError?.title"
      :caption="itemError?.caption"
    >
      <template #icon>
        <BaseIcon
          name="ph:warning"
          class="size-10 text-danger dark:text-danger-700"
        />
      </template>
      <template #action>
        <BaseButton
          class="w-full md:w-fit"
          icon-prefix="ph:arrow-left"
          @click="$router.back()"
        >
          {{ $i18n().t('common.back') }}
        </BaseButton>
        <BaseButton to="/" class="w-full md:w-fit" icon-prefix="ph:house">
          {{ $i18n().t('common.home') }}
        </BaseButton>
      </template>
    </BasePlaceholderSection>
  </BaseLayoutCenter>
</template>

<script lang="ts" setup>
const error = useError();

const itemError = computed(() => {
  const errorMessage = error.value?.message;

  if (errorMessage?.includes('Page not found')) {
    return {
      title: $i18n().t('message.error_page_not_found_title'),
      caption: $i18n().t('message.error_page_not_found_caption'),
    };
  }

  if (errorMessage?.includes('Forbidden page')) {
    return {
      title: $i18n().t('message.error_forbidden_page_title'),
      caption: $i18n().t('message.error_forbidden_page_caption'),
    };
  }

  return {
    title: $i18n().t('message.error_something_wrong'),
    caption: errorMessage,
  };
});

useHead({
  title: itemError.value.title,
});
</script>
