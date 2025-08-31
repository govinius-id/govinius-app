<template>
  <div class="flex flex-col gap-4">
    <div class="flex w-full flex-col gap-4 lg:flex-row">
      <PanelDashboardWelcomeCard />
      <PanelDashboardCount />
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <PanelDashboardRentalProductPending />
      <PanelDashboardRentalProductPickUp />
      <PanelDashboardRentalProductRenting />
      <PanelDashboardRentalProductReturn />
      <PanelDashboardRentalProductLateReturn />
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'panel',
  middleware: ['auth-required'],
});

$breadcrumb().setItems([
  {
    to: '/panel/dashboard',
    icon: 'ph:house',
  },
  {
    to: '/panel/dashboard',
    text: $i18n().t('common.dashboard'),
  },
]);

useHead({
  title: $i18n().t('common.dashboard'),
});
</script>
