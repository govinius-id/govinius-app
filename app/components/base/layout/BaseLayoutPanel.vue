<template>
  <div class="flex pb-[env(safe-area-inset-bottom)]">
    <div :class="sidebarWrapperClass">
      <div ref="sidebarCardRef" :class="sidebarCardClass">
        <div
          class="dark:border-dark-900 flex h-16 min-h-16 items-center border-b border-slate-100 px-4"
        >
          <slot name="sidebar-header"></slot>
          <BaseButtonIcon
            v-if="!isSidebarCollapse"
            ref="sidebarToggleRef"
            icon="tabler:layout-sidebar-left-collapse"
            @click="onToggleCollapse()"
          />
        </div>

        <div
          id="panel-sidebar-content"
          class="flex grow flex-col overflow-y-auto p-4"
        >
          <slot
            name="sidebar-content"
            :is-collapse="isSidebarCollapse"
            :on-close="onCloseCollapse"
          ></slot>
        </div>
      </div>
    </div>

    <div
      class="dark:bg-dark-950 relative flex min-h-screen w-full min-w-0 grow flex-col bg-white pt-16"
    >
      <div :class="navbarWrapperClass">
        <div :class="navbarCardClass">
          <BaseButtonIcon
            v-if="isSidebarCollapse"
            icon="tabler:layout-sidebar-left-expand"
            @click="onToggleCollapse()"
          />

          <slot name="navbar-left"></slot>

          <div class="ml-auto inline-flex items-center">
            <slot name="navbar-right"></slot>
          </div>
        </div>
      </div>

      <div :class="mainWrapperClass">
        <div class="mx-auto flex flex-col p-1.5 md:p-4 2xl:max-w-[1920px]">
          <slot name="main-content"></slot>
        </div>
      </div>

      <div v-if="$slots.footer" :class="footerWrapperClass">
        <div
          class="flex min-h-16 w-full flex-col items-center gap-1 p-4 lg:flex-row"
        >
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const sidebarCardRef = ref<HTMLDivElement | undefined>();
const sidebarToggleRef = ref<HTMLDivElement | undefined>();

const isSidebarCollapse = ref(false);

const onToggleCollapse = () => {
  setTimeout(() => {
    isSidebarCollapse.value = !isSidebarCollapse.value;
  }, 100);
};

const onCloseCollapse = () => {
  isSidebarCollapse.value = true;
};

const sidebarWrapperClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('fixed left-0 top-0 z-[50]');
  itemsClass.push('h-screen');
  itemsClass.push('transition-all duration-300');

  if (isSidebarCollapse.value) {
    itemsClass.push('-translate-x-64');
  }

  return itemsClass.join(' ');
});

const sidebarCardClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('flex flex-col');
  itemsClass.push('size-full min-h-screen');
  itemsClass.push('min-w-64 max-w-64');
  itemsClass.push('bg-white');
  itemsClass.push('dark:bg-dark-950');

  if (!isSidebarCollapse.value) {
    itemsClass.push('border-r');
    itemsClass.push('border-slate-100');
    itemsClass.push('shadow-[5px_0_20px_-10px]');
    itemsClass.push('shadow-dark-400/20');
    itemsClass.push('lg:shadow-none');
    itemsClass.push('dark:shadow-black/40');
    itemsClass.push('dark:border-dark-900');
  }

  return itemsClass.join(' ');
});

const navbarWrapperClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('fixed left-0 top-0 z-[49] w-full');
  itemsClass.push('transition-all duration-300');

  if (!isSidebarCollapse.value) {
    itemsClass.push('lg:pl-64');
  }

  return itemsClass.join(' ');
});

const navbarCardClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('flex items-center');
  itemsClass.push('h-16 w-full');
  itemsClass.push('gap-x-4');
  itemsClass.push('px-4');
  itemsClass.push('border-b');
  itemsClass.push('border-slate-100');
  itemsClass.push('bg-white');
  itemsClass.push('dark:bg-dark-950');
  itemsClass.push('dark:border-dark-900');

  return itemsClass.join(' ');
});

const mainWrapperClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('transition-all duration-300');
  itemsClass.push('w-full');

  if (!isSidebarCollapse.value) {
    itemsClass.push('lg:pl-64');
  }

  return itemsClass.join(' ');
});

const footerWrapperClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('transition-all duration-300');
  itemsClass.push('mt-auto');

  if (!isSidebarCollapse.value) {
    itemsClass.push('lg:pl-64');
  }

  return itemsClass.join(' ');
});

const onCheckDefaultSidebarCollapse = () => {
  if (import.meta.client) {
    if ($breakpoint().is_lg_and_down) {
      isSidebarCollapse.value = true;
    } else {
      isSidebarCollapse.value = false;
    }
  }
};

const onClickOutsideSidebar = (event: MouseEvent) => {
  if (!sidebarCardRef.value) return;
  if (!sidebarCardRef.value.contains(event.target as Node)) {
    if ($breakpoint().is_lg_and_down) {
      isSidebarCollapse.value = true;
    }
  }
};

onMounted(() => {
  document.addEventListener('click', onClickOutsideSidebar);
  window.addEventListener('resize', onCheckDefaultSidebarCollapse);

  onCheckDefaultSidebarCollapse();

  $overlayScrollbars(document.getElementById('panel-sidebar-content')!, {
    scrollbars: {
      autoHide: 'leave',
      autoHideDelay: 0,
    },
    overflow: {
      x: 'hidden',
      y: 'scroll',
    },
  });
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutsideSidebar);
  window.removeEventListener('resize', onCheckDefaultSidebarCollapse);
});
</script>
