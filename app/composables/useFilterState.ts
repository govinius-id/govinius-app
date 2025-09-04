interface Options {
  state: Record<any, any>;
  onApply?: () => void;
}

export const useFilterState = (opts: Options) => {
  const isModalOpenFilter = ref(false);

  const inputFilterDefault = opts.state;
  const inputFilter = reactive($objectClone(inputFilterDefault));
  const inputFilterPreview = ref($objectClone(inputFilterDefault));

  const onResetFilter = () => {
    $objectAssignNullable(inputFilter);
    onApplyFilter();
  };

  const onApplyFilter = () => {
    $objectAssignTarget(inputFilterPreview.value, inputFilter);
    opts.onApply?.();
    isModalOpenFilter.value = false;
  };

  return {
    isModalOpenFilter,
    inputFilter,
    inputFilterPreview,
    onResetFilter,
    onApplyFilter,
  };
};
