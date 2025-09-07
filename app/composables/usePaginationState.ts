interface PaginationState {
  page: number;
  per_page: number;
}

interface Options {
  state: PaginationState;
  onChange?: () => void;
}

export const usePaginationState = (opts: Options) => {
  const inputPaginationDefault = opts.state;
  const inputPagination = reactive($objectClone(inputPaginationDefault));

  const onResetPagination = () => {
    $objectAssignTarget(inputPagination, inputPaginationDefault);
  };

  watch(
    () => inputPagination,
    () => {
      opts.onChange?.();
    },
    { deep: true },
  );

  const getRowNumber = (index: number) => {
    return (inputPagination.page - 1) * inputPagination.per_page + index + 1;
  };

  return {
    inputPagination,
    onResetPagination,
    getRowNumber,
  };
};
