<template>
  <BaseCard bordered class="w-full">
    <div class="flex items-center gap-x-4">
      <BaseImageAvatar :src="$auth().user?.picture_url_variant?.sm" />
      <div class="flex flex-col">
        <BaseText
          v-html="
            $i18n().t('dashboard.welcome_title', {
              name: $auth().user?.name,
            })
          "
        />
        <BaseText class="text-sm !text-slate-400">
          {{ $i18n().t('dashboard.welcome_caption') }}
        </BaseText>
      </div>
    </div>
  </BaseCard>
</template>
