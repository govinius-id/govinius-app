export const useBasePrintStore = defineStore('basePrintStore', () => {
  const iframe = ref<HTMLIFrameElement | null>(null);

  const onPrintPage = (blobUrl: string) => {
    if (!iframe.value) {
      iframe.value = document.createElement('iframe');
    }

    iframe.value.style.position = 'fixed';
    iframe.value.style.right = '0';
    iframe.value.style.bottom = '0';
    iframe.value.style.width = '0';
    iframe.value.style.height = '0';
    iframe.value.style.border = '0';
    iframe.value.src = blobUrl;
    iframe.value.onload = () => {
      iframe.value?.contentWindow?.focus();
      iframe.value?.contentWindow?.print();
    };

    document.body.appendChild(iframe.value);
  };

  const onPrintReset = () => {
    if (iframe.value) {
      document.body.removeChild(iframe.value);
    }
  };

  return {
    onPrintPage,
    onPrintReset,
  };
});
