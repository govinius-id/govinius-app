export const usePanelUserRolePermissionStore = defineStore(
  'panelUserRolePermissionStore',
  () => {
    const getUserId = () => {
      const route = useRoute();
      return route.params.user_id as string;
    };

    const inputFormDefault = {
      is_role_permission_custom: false,
      permissions: [] as string[],
    };
    const inputForm = reactive($objectClone(inputFormDefault));

    const onResetForm = () => {
      errorForm.value = null;
      itemRolePermission.value = null;
      $objectAssignTarget(inputForm, inputFormDefault);
      inputForm.permissions = [];
    };

    const errorForm = ref<Record<string, any> | null>(null);
    const onValidateForm = () => {
      errorForm.value = $validateInput(inputForm, {
        permissions: ['is_not_empty'],
      });
      return $validateErrorMessage(errorForm.value);
    };

    const loadingSubmitForm = ref(false);
    const onSubmitForm = async () => {
      if (!onValidateForm()) return;
      if (loadingSubmitForm.value) return;

      loadingSubmitForm.value = true;

      const res: ApiResponse = await $axios().patch(
        `/users/${getUserId()}/role-permission`,
        inputForm,
      );

      if (res.statusCode === 200) {
        $toast().open({
          type: 'success',
          message: $i18n().t('message.success_updated'),
        });
        onFetchItemUser();
      } else {
        $toast().open({
          type: 'error',
          message: $apiErrorMessage(res),
        });
      }

      loadingSubmitForm.value = false;
    };

    const itemUser = ref<ItemUser | null>(null);
    const loadingItemUser = ref(false);
    const onFetchItemUser = async () => {
      loadingItemUser.value = true;

      const res: ApiResponse = await $axios().get(`/users/${getUserId()}`);

      if (res.statusCode === 200) {
        itemUser.value = res.data;

        $objectAssignTarget(inputForm, res.data);

        onFetchItemRolePermission();
      } else {
        $toast().open({
          type: 'error',
          message: $apiErrorMessage(res),
        });
      }

      loadingItemUser.value = false;
    };

    const itemRolePermission = ref<ItemRolePermission | null>(null);
    const loadingItemRolePermission = ref(false);
    const onFetchItemRolePermission = async () => {
      loadingItemRolePermission.value = true;

      const res: ApiResponse = await $axios().get(`/role-permissions`, {
        params: {
          role: itemUser.value?.role,
        },
      });

      if (res.statusCode === 200) {
        itemRolePermission.value = res.data;
        if (!itemUser.value?.is_role_permission_custom && res.data) {
          inputForm.permissions = itemRolePermission.value?.permissions || [];
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
      itemUser,
      itemRolePermission,
      loadingItemUser,
      loadingItemRolePermission,
      loadingSubmitForm,
      onFetchItemUser,
      onFetchItemRolePermission,
      onResetForm,
      onSubmitForm,
      isChecked,
      onChecked,
    };
  },
);
