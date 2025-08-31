export const $scrollIntoElement = (el: any) => {
  let elScrolledInto = null;

  if (typeof el === 'string') {
    elScrolledInto = document.getElementById(el);
  } else {
    elScrolledInto = el;
  }

  if (elScrolledInto) {
    elScrolledInto.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }
};

export const $copyToClipboard = (text: string, textName?: string) => {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text);

    if (textName) {
      $toast().open({
        type: 'info',
        message: $i18n().t('common.copied_value', {
          value: textName,
        }),
      });
    } else {
      $toast().open({
        type: 'info',
        message: $i18n().t('message.success_copy_text'),
      });
    }
  } else {
    $toast().open({
      type: 'error',
      message: $i18n().t('message.error_copy_text'),
    });
  }
};
