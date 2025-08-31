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
              :loading="panelProfileDetailStore.loadingItemProfile"
              @click="panelProfileDetailStore.onFetchItemProfile()"
            />
          </BaseTooltip>
        </div>
      </template>
    </BaseCardHead>

    <div
      v-if="panelProfileDetailStore.loadingItemProfile"
      class="flex flex-col gap-y-5 md:max-w-96"
    >
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
          :src="panelProfileDetailStore.itemProfile?.picture_url"
          size="3xl"
          :class="{
            'cursor-zoom-in': panelProfileDetailStore.itemProfile?.picture_url,
          }"
          @click="onOpenLightbox()"
        />
      </BaseTextLabelContent>

      <BaseTextLabelContent :label="$i18n().t('common.name')">
        <BaseText>
          {{ panelProfileDetailStore.itemProfile?.name || '-' }}
        </BaseText>
      </BaseTextLabelContent>

      <BaseTextLabelContent :label="$i18n().t('common.username')">
        <BaseText>
          {{ panelProfileDetailStore.itemProfile?.username || '-' }}
        </BaseText>
      </BaseTextLabelContent>

      <BaseTextLabelContent :label="$i18n().t('common.email')">
        <div class="inline-flex flex-nowrap items-center gap-x-1">
          <BaseText>
            {{ panelProfileDetailStore.itemProfile?.email || '-' }}
          </BaseText>
          <BaseTooltip
            v-if="panelProfileDetailStore.itemProfile?.email"
            :text="
              panelProfileDetailStore.itemProfile?.is_email_verified
                ? $i18n().t('common.verified')
                : $i18n().t('common.unverified')
            "
          >
            <BaseIcon
              name="ph:seal-check-fill"
              :class="{
                'text-success size-4':
                  panelProfileDetailStore.itemProfile?.is_email_verified,
                'size-4 text-slate-400':
                  !panelProfileDetailStore.itemProfile?.is_email_verified,
              }"
            />
          </BaseTooltip>
        </div>
      </BaseTextLabelContent>

      <BaseTextLabelContent :label="$i18n().t('common.role')">
        <BaseText>
          {{ panelProfileDetailStore.itemProfile?.role_detail?.text || '-' }}
        </BaseText>
      </BaseTextLabelContent>
    </div>
  </BaseCard>
</template>

<script lang="ts" setup>
const panelProfileDetailStore = usePanelProfileDetailStore();

const onOpenLightbox = () => {
  if (!panelProfileDetailStore.itemProfile?.picture_url) return;

  $lightbox().open(
    [
      {
        name: $i18n().t('common.profile_picture'),
        url: panelProfileDetailStore.itemProfile.picture_url,
      },
    ],
    0,
  );
};

onMounted(() => {
  panelProfileDetailStore.onFetchItemProfile();
});
</script>
