export const usePanelSettingFormStore = defineStore(
  'panelSettingFormStore',
  () => {
    const panelSettingListStore = usePanelSettingListStore();

    const isModalOpen = ref(false);

    const onOpenModal = (item?: ItemSetting) => {
      onResetForm();

      if (item) {
        itemEditing.value = item;
        onFetchItemSetting();
      }

      isModalOpen.value = true;
    };

    const onCloseModal = () => {
      isModalOpen.value = false;
    };

    const itemEditing = ref<ItemSetting | null>(null);

    const isEditing = () => {
      return $isNotEmpty(itemEditing.value);
    };

    const inputFormDefault = {
      key: null as string | null,
      value: null as string | null,
      description: null as string | null,
    };

    const inputForm = reactive($objectClone(inputFormDefault));

    const onResetForm = () => {
      errorForm.value = null;
      itemSetting.value = null;
      itemEditing.value = null;
      $objectAssignTarget(inputForm, inputFormDefault);
    };

    const errorForm = ref<Record<string, any> | null>(null);

    const onValidateForm = () => {
      errorForm.value = {};
      errorForm.value = $validateInput(inputForm, {
        key: ['is_not_empty'],
        value: ['is_not_empty'],
      });

      return $validateErrorMessage(errorForm.value);
    };

    const loadingSubmitForm = ref(false);

    const onSubmitForm = async () => {
      if (!onValidateForm()) return;
      if (loadingSubmitForm.value) return;

      loadingSubmitForm.value = true;

      let res: ApiResponse;

      if (isEditing()) {
        res = await $axios().put(
          `/settings/${itemEditing.value?.id}`,
          inputForm,
        );
      } else {
        res = await $axios().post('/settings', inputForm);
      }

      if (res.statusCode === 200) {
        $toast().open({
          type: 'success',
          message: $i18n().t('message.success_updated'),
        });

        onCloseModal();
        panelSettingListStore.onFetchItemsSetting();
      } else if (res.statusCode === 201) {
        $toast().open({
          type: 'success',
          message: $i18n().t('message.success_added'),
        });

        onCloseModal();
        panelSettingListStore.onFetchItemsSetting();
      } else {
        $toast().open({
          type: 'error',
          message: $apiErrorMessage(res),
        });
      }

      loadingSubmitForm.value = false;
    };

    const itemSetting = ref<ItemSetting | null>(null);
    const loadingItemSetting = ref(false);

    const onFetchItemSetting = async (options?: ApiFetchOption) => {
      const force = options?.force ?? true;
      const loading = options?.loading ?? true;

      if ($isNotEmptyObject(itemSetting.value) && !force) {
        return;
      }

      loadingItemSetting.value = loading;

      const res: ApiResponse = await $axios().get(
        `/settings/${itemEditing.value?.id}`,
      );

      if (res.statusCode === 200) {
        itemSetting.value = res.data;
        $objectAssignTarget(inputForm, res.data);
      } else {
        $toast().open({
          type: 'error',
          message: $apiErrorMessage(res),
        });
      }

      loadingItemSetting.value = false;
    };

    return {
      isModalOpen,
      itemEditing,
      inputForm,
      errorForm,
      itemSetting,
      loadingSubmitForm,
      loadingItemSetting,
      isEditing,
      onOpenModal,
      onCloseModal,
      onResetForm,
      onSubmitForm,
      onFetchItemSetting,
    };
  },
);
