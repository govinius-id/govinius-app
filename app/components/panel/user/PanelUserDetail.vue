<template>
  <BaseCard bordered>
    <BaseCardHead
      bordered
      :title="
        $i18n().t('common.detail_value', {
          value: $i18n().t('common.user'),
        })
      "
    >
      <template #prefix>
        <BaseButtonIcon icon="ph:arrow-left" @click="$router.back()" />
      </template>
      <template #suffix>
        <div class="flex items-center gap-x-2">
          <BaseDropdownAction v-if="itemUser">
            <BaseDropdownActionItem
              v-if="$userPermissionMatch(['USER_UPDATE'])"
              :text="$i18n().t('common.role_permission')"
              :to="`/panel/user/${itemUser?.id}/role-permission`"
              icon="ph:key"
            />
            <BaseDropdownActionItem
              v-if="$userPermissionMatch(['USER_UPDATE'])"
              :text="$i18n().t('common.edit')"
              :to="`/panel/user/${itemUser?.id}/edit`"
              icon="ph:pencil"
            />
            <BaseDropdownActionItem
              v-if="$userPermissionMatch(['USER_DELETE'])"
              :text="$i18n().t('common.delete')"
              icon="ph:trash"
              :classes="{
                color: 'text-danger hover:bg-danger-50 dark:hover:bg-danger/10',
              }"
              @click="onDeleteItemUser(itemUser)"
            />
          </BaseDropdownAction>
          <BaseTooltip :text="$i18n().t('common.refresh')" position="bottom">
            <BaseButtonIcon
              icon="ph:arrow-clockwise"
              :loading="loadingItemUser"
              @click="onFetchItemUser()"
            />
          </BaseTooltip>
        </div>
      </template>
    </BaseCardHead>

    <div v-if="loadingItemUser" class="flex flex-col gap-y-5 md:max-w-96">
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
          :src="itemUser?.picture_url"
          size="3xl"
          :class="{
            'cursor-zoom-in': itemUser?.picture_url,
          }"
          @click="onOpenLightbox()"
        />
      </BaseTextLabelContent>

      <BaseTextLabelContent :label="$i18n().t('common.name')">
        <BaseText>
          {{ itemUser?.name || '-' }}
        </BaseText>
      </BaseTextLabelContent>

      <BaseTextLabelContent :label="$i18n().t('common.username')">
        <BaseTextCopyable
          :text="itemUser?.username"
          :text-name="$i18n().t('common.username')"
        >
          {{ itemUser?.username }}
        </BaseTextCopyable>
      </BaseTextLabelContent>

      <BaseTextLabelContent :label="$i18n().t('common.email')">
        <div class="inline-flex flex-nowrap items-center gap-x-1">
          <BaseText>
            {{ itemUser?.email || '-' }}
          </BaseText>
          <BaseTooltip
            v-if="itemUser?.email"
            :text="
              itemUser?.is_email_verified
                ? $i18n().t('common.verified')
                : $i18n().t('common.unverified')
            "
          >
            <BaseIcon
              name="ph:seal-check-fill"
              :class="{
                'text-success size-4': itemUser?.is_email_verified,
                'size-4 text-slate-400': !itemUser?.is_email_verified,
              }"
            />
          </BaseTooltip>
        </div>
      </BaseTextLabelContent>

      <BaseTextLabelContent :label="$i18n().t('common.role')">
        <BaseText>
          {{ itemUser?.role_detail?.text || '-' }}
        </BaseText>
      </BaseTextLabelContent>

      <BaseTextLabelContent :label="$i18n().t('common.active')">
        <BaseChip
          v-if="selectableConstStore.itemConst?.items_active_status"
          size="sm"
          :color="
            $arrayFindObjectValue(
              selectableConstStore.itemConst.items_active_status,
              itemUser?.is_active ? 'ACTIVE' : 'INACTIVE',
              'value',
              'color',
            )
          "
        >
          <BaseIcon name="ph:circle-fill" class="size-2" />
          {{
            $arrayFindObjectValue(
              selectableConstStore.itemConst.items_active_status,
              itemUser?.is_active ? 'ACTIVE' : 'INACTIVE',
              'value',
              'text',
            )
          }}
        </BaseChip>
      </BaseTextLabelContent>
    </div>
  </BaseCard>
</template>

<script lang="ts" setup>
const selectableConstStore = useSelectableConstStore();

const {
  itemDetail: itemUser,
  loadingItemDetail: loadingItemUser,
  onFetchItemDetail: onFetchItemUser,
} = useFetchDetailState({
  state: null as ItemUser | null,
  onFetch: () => {
    return $axios().get(`/users/${useRoute().params.user_id}`);
  },
  onSuccess: (res) => {
    itemUser.value = res.data;
  },
});

const { onDeleteItem: onDeleteItemUser } = useDeleteItemState({
  onDelete: async (obj: ItemUser) => {
    return $axios().delete(`/users/${obj.id}`);
  },
  onSuccess: () => {
    navigateTo('/panel/user', { replace: true });
  },
});

const onOpenLightbox = () => {
  if (!itemUser.value?.picture_url) return;
  $lightbox().open(
    [
      {
        name: $i18n().t('common.profile_picture'),
        url: itemUser.value.picture_url,
      },
    ],
    0,
  );
};

onMounted(() => {
  onFetchItemUser();
});
</script>
