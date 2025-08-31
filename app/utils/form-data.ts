export const $createFormData = (obj: any) => {
  const formData = new FormData();

  const builder = (formData: FormData, data: any, parentKey?: string) => {
    if (data && typeof data === 'object' && !(data instanceof File)) {
      Object.keys(data).forEach((key) => {
        const fullKey = parentKey ? `${parentKey}[${key}]` : key;
        builder(formData, data[key], fullKey);
      });
    } else if (Array.isArray(data)) {
      data.forEach((val, i) => {
        const fullKey = `${parentKey}[${i}]`;
        builder(formData, val, fullKey);
      });
    } else {
      formData.append(parentKey!, data ?? '');
    }
  };

  builder(formData, obj);

  return formData;
};
