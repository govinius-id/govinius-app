<template>
  <BaseDropdown position="bottom-right">
    <template #activator="opts">
      <div
        class="dark:border-dark-800 dark:hover:bg-dark-900/80 inline-flex max-w-44 cursor-pointer select-none items-center justify-center gap-x-2 rounded-full border border-slate-200 px-1 py-1 pr-2.5 hover:bg-slate-50/90"
        @click="opts.isOpen ? opts.onClose() : opts.onOpen()"
      >
        <BaseImageAvatar
          :src="$auth().user?.picture_url_variant?.sm"
          size="xs"
        />
        <BaseText class="hidden truncate text-sm md:block">
          {{ $auth().user?.name }}
        </BaseText>
        <BaseIcon
          name="ph:caret-down"
          class="text-slate-400 duration-200"
          :class="{
            'rotate-180': opts.isOpen,
          }"
        />
      </div>
    </template>
    <template #content="opts">
      <BaseCard shadow bordered>
        <div class="flex w-full min-w-64 flex-col items-center gap-y-3 pb-4">
          <div class="flex w-full select-none items-center justify-end gap-2">
            <BaseAppLanguage />
            <BaseAppThemeMode />
          </div>

          <BaseImageAvatar
            :src="$auth().user?.picture_url"
            size="xl"
            :class="{
              'cursor-zoom-in': $auth().user?.picture_url,
            }"
            @click="onOpenLightbox()"
          />

          <BaseText class="line-clamp-3 text-center !leading-tight">
            {{ $auth().user?.name }}
          </BaseText>
        </div>
        <div class="flex flex-col items-center gap-y-2">
          <BaseButton
            to="/panel/profile"
            size="sm"
            class="w-full"
            icon-prefix="ph:user"
            @click="opts.onClose()"
          >
            {{ $i18n().t('common.profile') }}
          </BaseButton>
          <BaseButton
            to="/panel/change-password"
            size="sm"
            class="w-full"
            icon-prefix="ph:lock"
            @click="opts.onClose()"
          >
            {{ $i18n().t('common.change_password') }}
          </BaseButton>
          <BaseButton
            size="sm"
            class="w-full"
            icon-prefix="ph:power"
            color="danger"
            @click="onLogout()"
          >
            {{ $i18n().t('common.logout') }}
          </BaseButton>
        </div>
      </BaseCard>
    </template>
  </BaseDropdown>
</template>

<script lang="ts" setup>
const onLogout = () => {
  $dialog().open({
    type: 'confirm',
    title: $i18n().t('common.confirmation'),
    message: $i18n().t('message.before_logout'),
    textOk: $i18n().t('common.logout'),
    colorOk: 'danger',
    icon: 'ph:power',
    classes: {
      icon: 'size-10 text-danger',
    },
    onOk: async () => {
      await $auth().logout();
    },
  });
};

const onOpenLightbox = () => {
  if (!$auth().user?.picture_url) return;
  $lightbox().open(
    [
      {
        name: $i18n().t('common.profile_picture'),
        url: $auth().user!.picture_url!,
      },
    ],
    0,
  );
};
</script>
