export const useBaseToastStore = defineStore('baseToastStore', () => {
  const itemsToast = ref([] as BaseToast[]);

  const onOpenToast = (toast: BaseToast) => {
    toast.key = new Date().getTime();
    toast.timeout = setTimeout(() => {
      const index = itemsToast.value.findIndex((obj) => obj.key === toast.key);
      itemsToast.value.splice(index, 1);
    }, 5000);

    itemsToast.value.unshift(toast);
  };

  const onCloseToast = (index: number) => {
    itemsToast.value.splice(index, 1);
  };

  return {
    itemsToast,
    onOpenToast,
    onCloseToast,
  };
});
