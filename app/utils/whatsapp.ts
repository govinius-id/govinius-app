export const $whatsappSendMessageRedirect = (
  text: string,
  phone?: string | null,
) => {
  if (!phone) {
    $toast().open({
      type: 'error',
      message: $i18n().t('validator.not_yet_set', {
        value: $i18n().t('common.phone_number'),
      }),
    });
    return;
  }

  let cleanedPhone = phone?.replace(/\D/g, '');
  if (cleanedPhone?.startsWith('0')) {
    cleanedPhone = '62' + cleanedPhone.slice(1);
  }

  const url = `https://api.whatsapp.com/send?phone=${cleanedPhone}&text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};
