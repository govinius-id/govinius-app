interface Options<T extends object> {
  state: T;
  onReset?: () => void;
  onValidate?: (input: Record<string, any>) => void;
}

export const useFormState = <T extends object>(opts: Options<T>) => {
  const inputFormDefault = opts.state;
  const inputForm = reactive($objectClone(inputFormDefault));

  const onResetForm = () => {
    errorForm.value = null;
    $objectAssignTarget(inputForm, inputFormDefault);
    opts.onReset?.();
  };

  const errorForm = ref<Record<string, any> | null>(null);
  const onValidateForm = () => {
    opts.onValidate?.(inputForm);
    if (errorForm.value === null) return true;
    return $validateErrorMessage(errorForm.value);
  };

  return {
    inputForm,
    inputFormDefault,
    errorForm,
    onResetForm,
    onValidateForm,
  };
};
