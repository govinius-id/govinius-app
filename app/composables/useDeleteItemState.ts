interface Options<T> {
  onDelete: (obj: T) => Promise<ApiResponse>;
  onSuccess?: (res: ApiResponse) => void;
  onFailed?: (res: ApiResponse) => void;
}

export const useDeleteItemState = <T>(opts: Options<T>) => {
  const loadingDeleteItem = ref(false);
  const onDeleteItem = (obj: T) => {
    $dialog().open({
      type: 'confirm',
      title: $i18n().t('common.delete'),
      message: $i18n().t('message.before_delete'),
      icon: 'ph:trash',
      textOk: $i18n().t('common.delete'),
      colorOk: 'danger',
      classes: {
        icon: 'size-10 text-danger',
      },
      onOk: async () => {
        loadingDeleteItem.value = true;

        const res: ApiResponse = await opts.onDelete(obj);

        if (res.statusCode === 200) {
          $dialog().close();
          $toast().open({
            type: 'success',
            message: $i18n().t('message.success_deleted'),
          });
          opts.onSuccess?.(res);
        } else {
          $toast().open({
            type: 'error',
            message: $apiErrorMessage(res),
          });
          opts.onFailed?.(res);
        }

        loadingDeleteItem.value = false;
      },
    });
  };

  return {
    loadingDeleteItem,
    onDeleteItem,
  };
};
