export const useBaseDialogStore = defineStore('baseDialogStore', () => {
  const dialog = ref<BaseDialog | null>(null);
  const isModalOpen = ref(false);

  const onOpenDialog = (obj: BaseDialog) => {
    dialog.value = obj;
    isModalOpen.value = true;
  };

  const onCloseDialog = () => {
    isModalOpen.value = false;
    setTimeout(() => {
      dialog.value = null;
    }, 500);
  };

  return {
    isModalOpen,
    dialog,
    onOpenDialog,
    onCloseDialog,
  };
});
