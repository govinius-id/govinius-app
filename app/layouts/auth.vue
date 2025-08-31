<template>
  <BaseLayoutAuth background-image="/images/background/login.webp">
    <template #header>
      <BaseButtonIcon
        icon="ph:arrow-left"
        @click="
          $route.path === '/auth/login' ? $router.push('/') : $router.back()
        "
      />

      <div class="ml-auto flex select-none items-center gap-x-2">
        <BaseAppLanguage />
        <BaseAppThemeMode />
      </div>
    </template>
    <template #main-content>
      <slot></slot>
    </template>
    <template #footer>
      <BaseAppCopyright />
      <BaseAppSignature class="lg:ml-auto" />
    </template>
  </BaseLayoutAuth>
</template>
