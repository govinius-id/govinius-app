<template>
  <BaseLayoutAuth>
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
    <template #secondary-content>
      <img
        :src="
          $themeMode() === 'dark'
            ? '/images/background/login-dark.svg'
            : '/images/background/login-light.svg'
        "
        class="invisible h-auto w-2/3 xl:visible"
        draggable="false"
      />
    </template>
    <template #footer>
      <BaseAppCopyright />
      <BaseAppSignature class="lg:ml-auto" />
    </template>
  </BaseLayoutAuth>
</template>
