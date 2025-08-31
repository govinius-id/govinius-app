<template>
  <BaseCard bordered>
    <BaseCardHead
      bordered
      :title="
        $i18n().t('common.list_value', { value: $i18n().t('common.setting') })
      "
    >
      <template #suffix>
        <BaseTooltip :text="$i18n().t('common.refresh')" position="bottom">
          <BaseButtonIcon
            icon="ph:arrow-clockwise"
            :loading="panelSettingListStore.loadingItemsSetting"
            @click="panelSettingListStore.onFetchItemsSetting()"
          />
        </BaseTooltip>
      </template>
    </BaseCardHead>

    <div class="flex flex-col gap-y-5">
      <BaseAppSearchFilterAction
        v-model:input-search="panelSettingListStore.inputSearch.search"
      >
        <template #action>
          <BaseButton
            v-if="$userPermissionMatch(['SETTING_CREATE'])"
            color="primary"
            class="w-full md:w-auto"
            icon-prefix="ph:plus-circle-duotone"
            @click="panelSettingFormStore.onOpenModal()"
          >
            {{ $i18n().t('common.add') }}
          </BaseButton>
        </template>
      </BaseAppSearchFilterAction>

      <BaseTable
        :loading="panelSettingListStore.loadingItemsSetting"
        :is-empty="panelSettingListStore.itemsSetting.length === 0"
      >
        <template #heading>
          <BaseTableHeading align="center" width-fit> # </BaseTableHeading>
          <BaseTableHeading align="left" min-width="200px">
            {{ $i18n().t('common.key') }}
          </BaseTableHeading>
          <BaseTableHeading align="left" min-width="100px">
            {{ $i18n().t('common.value') }}
          </BaseTableHeading>
          <BaseTableHeading align="left" min-width="200px">
            {{ $i18n().t('common.description') }}
          </BaseTableHeading>
          <BaseTableHeading
            v-if="
              $userPermissionAny([
                'SETTING_DETAIL',
                'SETTING_UPDATE',
                'SETTING_DELETE',
              ])
            "
            align="center"
            width-fit
            sticky-right
          >
            {{ $i18n().t('common.action') }}
          </BaseTableHeading>
        </template>

        <template #body>
          <BaseTableRow
            v-for="(obj, i) in panelSettingListStore.itemsSetting"
            :key="i"
          >
            <BaseTableCell align="center">
              <BaseText class="text-sm">
                {{ panelSettingListStore.getRowNumber(i) }}
              </BaseText>
            </BaseTableCell>
            <BaseTableCell
              align="left"
              class="cursor-pointer"
              @click="panelSettingFormStore.onOpenModal(obj)"
            >
              <BaseText class="text-sm">
                {{ obj.key }}
              </BaseText>
            </BaseTableCell>
            <BaseTableCell
              align="left"
              class="cursor-pointer"
              @click="panelSettingFormStore.onOpenModal(obj)"
            >
              <BaseText class="text-sm">
                {{ obj.value }}
              </BaseText>
            </BaseTableCell>
            <BaseTableCell
              align="left"
              class="cursor-pointer"
              @click="panelSettingFormStore.onOpenModal(obj)"
            >
              <BaseText class="text-sm !leading-snug">
                {{ obj.description }}
              </BaseText>
            </BaseTableCell>
            <BaseTableCell
              v-if="
                $userPermissionAny([
                  'SETTING_DETAIL',
                  'SETTING_UPDATE',
                  'SETTING_DELETE',
                ])
              "
              align="center"
              sticky-right
            >
              <BaseDropdownAction>
                <BaseDropdownActionItem
                  v-if="$userPermissionMatch(['SETTING_UPDATE'])"
                  :text="$i18n().t('common.edit')"
                  icon="ph:pencil"
                  @click="panelSettingFormStore.onOpenModal(obj)"
                />
                <BaseDropdownActionItem
                  v-if="$userPermissionMatch(['SETTING_DELETE'])"
                  :text="$i18n().t('common.delete')"
                  icon="ph:trash"
                  :classes="{
                    color:
                      'text-danger hover:bg-danger-50 dark:hover:bg-danger/10',
                  }"
                  @click="panelSettingListStore.onDeleteItemSetting(obj)"
                />
              </BaseDropdownAction>
            </BaseTableCell>
          </BaseTableRow>
        </template>
      </BaseTable>

      <BasePagination
        v-model:page="panelSettingListStore.inputPagination.page"
        v-model:per-page="panelSettingListStore.inputPagination.per_page"
        :total-data="panelSettingListStore.totalSetting"
      />
    </div>
  </BaseCard>
</template>

<script lang="ts" setup>
const panelSettingListStore = usePanelSettingListStore();
const panelSettingFormStore = usePanelSettingFormStore();

onMounted(() => {
  panelSettingListStore.onFetchItemsSetting();
});
</script>
