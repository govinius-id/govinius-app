export const useBaseBreadcrumbStore = defineStore('baseBreadcrumbStore', () => {
  const showBreadcrumb = ref(false);
  const itemsBreadcrumb = ref([] as BaseListItem[]);

  const setBreadcrumb = (items: BaseListItem[]) => {
    showBreadcrumb.value = true;
    itemsBreadcrumb.value = items;
  };

  const hideBreadcrumb = () => {
    showBreadcrumb.value = false;
    itemsBreadcrumb.value = [];
  };

  return {
    showBreadcrumb,
    itemsBreadcrumb,
    setBreadcrumb,
    hideBreadcrumb,
  };
});
