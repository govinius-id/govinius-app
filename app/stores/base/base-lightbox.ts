export const useBaseLightboxStore = defineStore('baseLightboxStore', () => {
  const isModalOpen = ref(false);
  const initialIndex = ref(0);

  const itemsLightboxImage = ref([] as BaseLightboxImage[]);

  const onOpenLightbox = (items: BaseLightboxImage[], index: number) => {
    itemsLightboxImage.value = items;
    initialIndex.value = index;
    isModalOpen.value = true;
  };

  return {
    isModalOpen,
    initialIndex,
    itemsLightboxImage,
    onOpenLightbox,
  };
});
