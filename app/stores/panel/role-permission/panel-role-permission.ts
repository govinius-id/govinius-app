export const usePanelRolePermissionStore = defineStore(
  'panelRolePermissionStore',
  () => {
    const inputFormDefault = {
      id: null as string | null,
      role: null as string | null,
      role_detail: null as ItemUserRole | null,
      permissions: [] as string[],
    };
    const inputForm = reactive($objectClone(inputFormDefault));

    watch(
      () => inputForm.role,
      () => {
        if (inputForm.role) {
          onFetchItemRolePermission();
        }
      },
    );

    const onResetForm = () => {
      errorForm.value = null;
      itemRolePermission.value = null;
      $objectAssignTarget(inputForm, inputFormDefault);
      inputForm.permissions = [];
    };

    const errorForm = ref<Record<string, any> | null>(null);
    const onValidateForm = () => {
      errorForm.value = $validateInput(inputForm, {
        role: ['is_not_empty'],
      });
      return $validateErrorMessage(errorForm.value);
    };

    const loadingSubmitForm = ref(false);
    const onSubmitForm = async () => {
      if (!onValidateForm()) return;
      if (loadingSubmitForm.value) return;

      loadingSubmitForm.value = true;

      const res: ApiResponse = await $axios().patch(
        '/role-permissions',
        inputForm,
      );

      if (res.statusCode === 200) {
        $toast().open({
          type: 'success',
          message: $i18n().t('message.success_updated'),
        });
        onFetchItemRolePermission();
      } else {
        $toast().open({
          type: 'error',
          message: $apiErrorMessage(res),
        });
      }

      loadingSubmitForm.value = false;
    };

    const itemRolePermission = ref<ItemRolePermission | null>(null);
    const loadingItemRolePermission = ref(false);
    const onFetchItemRolePermission = async () => {
      loadingItemRolePermission.value = true;

      const res: ApiResponse = await $axios().get(`/role-permissions`, {
        params: {
          role: inputForm.role,
        },
      });

      if (res.statusCode === 200) {
        itemRolePermission.value = res.data;
        if (res.data) {
          $objectAssignTarget(inputForm, res.data);
        } else {
          inputForm.id = null;
          inputForm.permissions = [];
        }
      } else {
        $toast().open({
          type: 'error',
          message: $apiErrorMessage(res),
        });
      }

      loadingItemRolePermission.value = false;
    };

    const isChecked = (permissionKey: string) => {
      return inputForm.permissions.includes(permissionKey);
    };

    const onChecked = (permissionKey: string) => {
      if (isChecked(permissionKey)) {
        const i = inputForm.permissions.findIndex((key) => {
          return key === permissionKey;
        });
        if (i > -1) {
          inputForm.permissions.splice(i, 1);
        }
      } else {
        inputForm.permissions.push(permissionKey);
      }
      inputForm.permissions.sort((a, b) => {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      });
    };

    return {
      inputForm,
      errorForm,
      itemRolePermission,
      loadingItemRolePermission,
      loadingSubmitForm,
      onFetchItemRolePermission,
      onResetForm,
      onSubmitForm,
      isChecked,
      onChecked,
    };
  },
);
