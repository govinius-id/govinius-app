<template>
  <BaseCard bordered>
    <BaseCardHead
      bordered
      :title="
        $i18n().t('common.list_value', { value: $i18n().t('common.user') })
      "
    >
      <template #suffix>
        <BaseTooltip :text="$i18n().t('common.refresh')" position="bottom">
          <BaseButtonIcon
            icon="ph:arrow-clockwise"
            :loading="loadingItemsUser"
            @click="onFetchItemsUser()"
          />
        </BaseTooltip>
      </template>
    </BaseCardHead>

    <div class="flex flex-col gap-y-5">
      <BaseAppSearchFilterAction
        v-model:input-search="inputSearch.search"
        v-model:modal-filter="isModalOpenFilter"
      >
        <template #action>
          <BaseButton
            v-if="$userPermissionMatch(['USER_CREATE'])"
            to="/panel/user/add"
            color="primary"
            class="w-full md:w-auto"
            icon-prefix="ph:plus-circle-duotone"
          >
            {{ $i18n().t('common.add') }}
          </BaseButton>
        </template>
      </BaseAppSearchFilterAction>

      <BaseAppFilterPreview
        v-if="$isActiveFilter(inputFilterPreview)"
        :items="itemsFilterPreview"
      >
        <template #role="opts">
          <BaseText class="text-sm">
            {{ opts.item?.text }}
          </BaseText>
        </template>
        <template #active="opts">
          <BaseChip :color="opts.item?.color" size="sm">
            <BaseIcon name="ph:circle-fill" class="size-2" />
            {{ opts.item?.text }}
          </BaseChip>
        </template>
      </BaseAppFilterPreview>

      <BaseTable :loading="loadingItemsUser" :is-empty="itemsUser.length === 0">
        <template #heading>
          <BaseTableHeading align="center" width-fit> # </BaseTableHeading>
          <BaseTableHeading align="left" min-width="200px">
            {{ $i18n().t('common.name') }}
          </BaseTableHeading>
          <BaseTableHeading align="left" min-width="150px">
            {{ $i18n().t('common.username') }}
          </BaseTableHeading>
          <BaseTableHeading align="left" min-width="150px">
            {{ $i18n().t('common.email') }}
          </BaseTableHeading>
          <BaseTableHeading align="left" min-width="150px">
            {{ $i18n().t('common.role') }}
          </BaseTableHeading>
          <BaseTableHeading align="center" min-width="100px" width="100px">
            {{ $i18n().t('common.profile_picture') }}
          </BaseTableHeading>
          <BaseTableHeading align="center" min-width="100px">
            {{ $i18n().t('common.active') }}
          </BaseTableHeading>
          <BaseTableHeading align="center" width-fit sticky-right>
            {{ $i18n().t('common.action') }}
          </BaseTableHeading>
        </template>

        <template #body>
          <BaseTableRow v-for="(obj, i) in itemsUser" :key="i">
            <BaseTableCell align="center">
              <BaseText class="text-sm">
                {{ getRowNumber(i) }}
              </BaseText>
            </BaseTableCell>
            <BaseTableCell align="left" :to="`/panel/user/${obj.id}/detail`">
              <BaseText class="text-sm">
                {{ obj.name }}
              </BaseText>
            </BaseTableCell>
            <BaseTableCell align="left">
              <BaseTextCopyable
                class="text-sm"
                :text="obj.username"
                :text-name="$i18n().t('common.username')"
              >
                {{ obj.username }}
              </BaseTextCopyable>
            </BaseTableCell>
            <BaseTableCell align="left" :to="`/panel/user/${obj.id}/detail`">
              <div class="inline-flex flex-nowrap items-center gap-x-1">
                <BaseText class="text-sm">
                  {{ obj.email }}
                </BaseText>
                <BaseTooltip
                  v-if="obj.email"
                  :text="
                    obj.is_email_verified
                      ? $i18n().t('common.verified')
                      : $i18n().t('common.unverified')
                  "
                >
                  <BaseIcon
                    name="ph:seal-check-fill"
                    :class="{
                      'text-success size-4': obj.is_email_verified,
                      'size-4 text-slate-400': !obj.is_email_verified,
                    }"
                  />
                </BaseTooltip>
              </div>
            </BaseTableCell>
            <BaseTableCell align="left" :to="`/panel/user/${obj.id}/detail`">
              <BaseText class="text-sm">
                {{ obj.role_detail?.text }}
              </BaseText>
            </BaseTableCell>
            <BaseTableCell align="center" :to="`/panel/user/${obj.id}/detail`">
              <div class="flex justify-center">
                <BaseImageAvatar :src="obj.picture_url_variant?.sm" size="sm" />
              </div>
            </BaseTableCell>
            <BaseTableCell align="center" :to="`/panel/user/${obj.id}/detail`">
              <div class="flex justify-center">
                <BaseChip
                  v-if="selectableConstStore.itemConst?.items_active_status"
                  size="sm"
                  :color="
                    $arrayFindObjectValue(
                      selectableConstStore.itemConst.items_active_status,
                      obj.is_active ? 'ACTIVE' : 'INACTIVE',
                      'value',
                      'color',
                    )
                  "
                >
                  <BaseIcon name="ph:circle-fill" class="size-2" />
                  {{
                    $arrayFindObjectValue(
                      selectableConstStore.itemConst.items_active_status,
                      obj.is_active ? 'ACTIVE' : 'INACTIVE',
                      'value',
                      'text',
                    )
                  }}
                </BaseChip>
              </div>
            </BaseTableCell>
            <BaseTableCell
              v-if="
                $userPermissionAny([
                  'USER_DETAIL',
                  'USER_UPDATE',
                  'USER_DELETE',
                ])
              "
              align="center"
              sticky-right
            >
              <BaseDropdownAction>
                <BaseDropdownActionItem
                  v-if="$userPermissionMatch(['USER_UPDATE'])"
                  :text="$i18n().t('common.role_permission')"
                  :to="`/panel/user/${obj.id}/role-permission`"
                  icon="ph:key"
                />
                <BaseDropdownActionItem
                  v-if="$userPermissionMatch(['USER_DETAIL'])"
                  :text="$i18n().t('common.detail')"
                  :to="`/panel/user/${obj.id}/detail`"
                  icon="ph:eye"
                />
                <BaseDropdownActionItem
                  v-if="$userPermissionMatch(['USER_UPDATE'])"
                  :text="$i18n().t('common.edit')"
                  :to="`/panel/user/${obj.id}/edit`"
                  icon="ph:pencil"
                />
                <BaseDropdownActionItem
                  v-if="$userPermissionMatch(['USER_DELETE'])"
                  :text="$i18n().t('common.delete')"
                  icon="ph:trash"
                  :classes="{
                    color:
                      'text-danger hover:bg-danger-50 dark:hover:bg-danger/10',
                  }"
                  @click="onDeleteItemUser(obj)"
                />
              </BaseDropdownAction>
            </BaseTableCell>
          </BaseTableRow>
        </template>
      </BaseTable>

      <BasePagination
        v-model:page="inputPagination.page"
        v-model:per-page="inputPagination.per_page"
        :total-data="totalUser"
      />
    </div>
  </BaseCard>
</template>

<script lang="ts" setup>
const selectableConstStore = useSelectableConstStore();

const { inputSearch } = useSearchState({
  state: {
    search: null as string | null,
  },
  onChange: () => {
    onResetPagination();
    onFetchItemsUser();
  },
});

const { inputPagination, onResetPagination, getRowNumber } = usePaginationState(
  {
    state: {
      page: 1,
      per_page: 10,
    },
    onChange: () => {
      document.getElementById('app-top')?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
      onFetchItemsUser();
    },
  },
);

const { isModalOpenFilter, inputFilter, inputFilterPreview } = useFilterState({
  state: {
    role: null as string | null,
    role_detail: null as ItemUserRole | null,
    active_status: null as string | null,
    active_status_detail: null as ItemActiveStatus | null,
  },
  onApply: () => {
    onResetPagination();
    onFetchItemsUser();
  },
});

const itemsFilterPreview = computed(() => {
  return [
    {
      key: 'role',
      label: $i18n().t('common.role'),
      item: inputFilterPreview.role_detail,
    },
    {
      key: 'active',
      label: $i18n().t('common.active'),
      item: inputFilterPreview.active_status_detail,
    },
  ];
});

const {
  itemsList: itemsUser,
  loadingItemsList: loadingItemsUser,
  total: totalUser,
  onFetchItemsList: onFetchItemsUser,
} = useFetchListState({
  state: [] as ItemUser[],
  onFetch: async () => {
    return $axios().get('/users', {
      params: {
        ...inputSearch,
        ...inputPagination,
        ...$objectOmitKeys(inputFilter, [
          'active_status_detail',
          'role_detail',
        ]),
      },
    });
  },
  onSuccess: (res) => {
    itemsUser.value = res.data.rows;
    totalUser.value = res.data.count;
  },
});

const { onDeleteItem: onDeleteItemUser } = useDeleteItemState({
  onDelete: async (obj: ItemUser) => {
    return $axios().delete(`/users/${obj.id}`);
  },
  onSuccess: () => {
    onFetchItemsUser({
      loading: false,
    });
  },
});

onMounted(() => {
  onFetchItemsUser();
});
</script>
