interface Options {
  onBeforeSubmit?: () => Promise<boolean>;
  onSubmit: () => Promise<ApiResponse>;
  onAfterSubmit?: () => Promise<void>;
  onSuccess?: (res: ApiResponse) => void;
  onFailed?: (res: ApiResponse) => void;
}

export const useSubmitState = (opts: Options) => {
  const loadingSubmit = ref(false);
  const onSubmit = async () => {
    const isContinue = (await opts.onBeforeSubmit?.()) ?? true;
    if (!isContinue) return;

    if (loadingSubmit.value) return;
    loadingSubmit.value = true;

    const res: ApiResponse = await opts.onSubmit();

    if (res.statusCode === 200 || res.statusCode === 201) {
      opts.onSuccess?.(res);
    } else {
      $toast().open({
        type: 'error',
        message: $apiErrorMessage(res),
      });
      opts.onFailed?.(res);
    }

    opts.onAfterSubmit?.();
    loadingSubmit.value = false;
  };

  return {
    loadingSubmit,
    onSubmit,
  };
};
