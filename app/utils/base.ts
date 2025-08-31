export const $toast = () => {
  const baseToastStore = useBaseToastStore();
  return {
    open: baseToastStore.onOpenToast,
    close: baseToastStore.onCloseToast,
  };
};

export const $dialog = () => {
  const baseDialogStore = useBaseDialogStore();
  return {
    open: baseDialogStore.onOpenDialog,
    close: baseDialogStore.onCloseDialog,
  };
};

export const $breadcrumb = () => {
  const baseBreadcrumbStore = useBaseBreadcrumbStore();
  return {
    show: baseBreadcrumbStore.showBreadcrumb,
    items: baseBreadcrumbStore.itemsBreadcrumb,
    setItems: baseBreadcrumbStore.setBreadcrumb,
  };
};

export const $bottombar = () => {
  const baseBottombarStore = useBaseBottombarStore();
  return {
    show: baseBottombarStore.showBottombar,
  };
};

export const $lightbox = () => {
  const baseLightboxStore = useBaseLightboxStore();
  return {
    open: baseLightboxStore.onOpenLightbox,
  };
};
