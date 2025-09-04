interface Options {
  state: Record<any, any>;
  onChange?: () => void;
}

export const useSearchState = (opts: Options) => {
  const inputSearchDefault = opts.state;
  const inputSearch = reactive($objectClone(inputSearchDefault));

  const onResetSearch = () => {
    $objectAssignTarget(inputSearch, inputSearchDefault);
  };

  const timeoutSearch = ref();
  watch(
    () => inputSearch,
    () => {
      clearTimeout(timeoutSearch.value);
      timeoutSearch.value = setTimeout(() => {
        opts.onChange?.();
      }, 500);
    },
    { deep: true },
  );

  return {
    inputSearch,
    onResetSearch,
  };
};
