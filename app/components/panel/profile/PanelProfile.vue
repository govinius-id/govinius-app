<template>
  <PanelVerifyEmailAlertUnverified />

  <BaseCard bordered>
    <BaseCardHead bordered :title="$i18n().t('common.profile')">
      <template #prefix>
        <BaseButtonIcon icon="ph:arrow-left" @click="$router.back()" />
      </template>
      <template #suffix>
        <div class="flex items-center gap-x-2">
          <BaseTooltip :text="$i18n().t('common.edit')" position="bottom">
            <BaseButtonIcon icon="ph:pencil-duotone" to="/panel/profile/edit" />
          </BaseTooltip>
          <BaseTooltip :text="$i18n().t('common.refresh')" position="bottom">
            <BaseButtonIcon
              icon="ph:arrow-clockwise"
              :loading="loadingItemProfile"
              @click="onFetchItemProfile()"
            />
          </BaseTooltip>
        </div>
      </template>
    </BaseCardHead>

    <div v-if="loadingItemProfile" class="flex flex-col gap-y-5 md:max-w-96">
      <BaseLoadingLabelAndAvatar />
      <BaseLoadingLabelAndText />
      <BaseLoadingLabelAndText />
      <BaseLoadingLabelAndText />
      <BaseLoadingLabelAndText />
      <BaseLoadingLabelAndText />
    </div>

    <div v-else class="flex flex-col gap-y-4 md:max-w-96">
      <BaseTextLabelContent :label="$i18n().t('common.profile_picture')">
        <BaseImageAvatar
          :src="itemProfile?.picture_url"
          size="3xl"
          :class="{
            'cursor-zoom-in': itemProfile?.picture_url,
          }"
          @click="onOpenLightbox()"
        />
      </BaseTextLabelContent>

      <BaseTextLabelContent :label="$i18n().t('common.name')">
        <BaseText>
          {{ itemProfile?.name || '-' }}
        </BaseText>
      </BaseTextLabelContent>

      <BaseTextLabelContent :label="$i18n().t('common.username')">
        <BaseText>
          {{ itemProfile?.username || '-' }}
        </BaseText>
      </BaseTextLabelContent>

      <BaseTextLabelContent :label="$i18n().t('common.email')">
        <div class="inline-flex flex-nowrap items-center gap-x-1">
          <BaseText>
            {{ itemProfile?.email || '-' }}
          </BaseText>
          <BaseTooltip
            v-if="itemProfile?.email"
            :text="
              itemProfile?.is_email_verified
                ? $i18n().t('common.verified')
                : $i18n().t('common.unverified')
            "
          >
            <BaseIcon
              name="ph:seal-check-fill"
              :class="{
                'text-success size-4': itemProfile?.is_email_verified,
                'size-4 text-slate-400': !itemProfile?.is_email_verified,
              }"
            />
          </BaseTooltip>
        </div>
      </BaseTextLabelContent>

      <BaseTextLabelContent :label="$i18n().t('common.role')">
        <BaseText>
          {{ itemProfile?.role_detail?.text || '-' }}
        </BaseText>
      </BaseTextLabelContent>
    </div>
  </BaseCard>
</template>

<script lang="ts" setup>
const itemProfile = ref<ItemUser | null>(null);
const loadingItemProfile = ref(false);
const onFetchItemProfile = async () => {
  loadingItemProfile.value = true;

  const res: ApiResponse = await $axios().get(`/profile`);

  if (res.statusCode === 200) {
    itemProfile.value = res.data;
  } else {
    $toast().open({
      type: 'error',
      message: $apiErrorMessage(res),
    });
  }

  loadingItemProfile.value = false;
};

const onOpenLightbox = () => {
  if (!itemProfile.value?.picture_url) return;
  $lightbox().open(
    [
      {
        name: $i18n().t('common.profile_picture'),
        url: itemProfile.value.picture_url,
      },
    ],
    0,
  );
};

onMounted(() => {
  onFetchItemProfile();
});
</script>
