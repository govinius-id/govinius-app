interface Options<T> {
  state: T | null;
  onBeforeFetch?: () => Promise<boolean>;
  onFetch: () => Promise<ApiResponse>;
  onAfterFetch?: () => Promise<boolean>;
  onSuccess?: (res: ApiResponse) => void;
  onFailed?: (res: ApiResponse) => void;
}

export const useFetchDetailState = <T>(opts: Options<T>) => {
  const itemDetail = ref<T | null>(opts.state);
  const loadingItemDetail = ref(false);
  const onFetchItemDetail = async (options?: ApiFetchOption) => {
    const isContinue = (await opts.onBeforeFetch?.()) ?? true;
    if (!isContinue) return;

    const force = options?.force ?? true;
    const loading = options?.loading ?? true;

    if ($isNotEmptyObject(itemDetail.value) && !force) {
      return;
    }

    loadingItemDetail.value = loading;

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
    loadingItemDetail.value = false;
  };

  return {
    itemDetail,
    loadingItemDetail,
    onFetchItemDetail,
  };
};
