interface Options<T> {
  state: T;
  onBeforeFetch?: () => Promise<boolean>;
  onFetch: () => Promise<ApiResponse>;
  onAfterFetch?: () => Promise<boolean>;
  onSuccess?: (res: ApiResponse) => void;
  onFailed?: (res: ApiResponse) => void;
}

export const useFetchListState = <T>(opts: Options<T>) => {
  const itemsList = ref<T>(opts.state);
  const total = ref<number>(0);
  const loadingItemsList = ref(false);
  const onFetchItemsList = async (options?: ApiFetchOption) => {
    const isContinue = (await opts.onBeforeFetch?.()) ?? true;
    if (!isContinue) return;

    const force = options?.force ?? true;
    const loading = options?.loading ?? true;

    if (itemsList.value.length > 0 && !force) {
      return;
    }

    loadingItemsList.value = loading;

    await $delay(1);
    const res: ApiResponse = await opts.onFetch();

    if (res.statusCode === 200) {
      opts.onSuccess?.(res);
    } else {
      $toast().open({
        type: 'error',
        message: $apiErrorMessage(res),
      });
      opts.onFailed?.(res);
    }

    opts.onAfterFetch?.();
    loadingItemsList.value = false;
  };

  return {
    itemsList,
    total,
    loadingItemsList,
    onFetchItemsList,
  };
};
