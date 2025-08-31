<template>
  <div :class="switchThemeModeBackgroundClass" @click="onChangeTheme()">
    <div :class="switchThemeModeContentClass">
      <div :class="switchThemeModeCircleClass">
        <BaseIcon
          v-if="$themeMode() === 'light'"
          name="mingcute:sun-fill"
          class="size-4 text-[#ffac33]"
        />
        <BaseIcon
          v-if="$themeMode() === 'dark'"
          name="mingcute:moon-fill"
          class="size-4 text-[#ffe8a6]"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const onChangeTheme = () => {
  if ($themeMode() === 'light') {
    $changeThemeMode('dark');
  }
  if ($themeMode() === 'dark') {
    $changeThemeMode('light');
  }
};

const switchThemeModeBackgroundClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('inline-flex items-center justify-center');
  itemsClass.push('h-fit w-fit');
  itemsClass.push('p-0.5');
  itemsClass.push('cursor-pointer');
  itemsClass.push('rounded-full');

  switch ($themeMode()) {
    case 'light':
      itemsClass.push('bg-sky-100');
      break;
    case 'dark':
      itemsClass.push('bg-dark-800');
      break;
  }

  return itemsClass.join(' ');
});

const switchThemeModeContentClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('inline-flex items-center justify-start');
  itemsClass.push('h-6 w-12');
  itemsClass.push('rounded-full');

  return itemsClass.join(' ');
});

const switchThemeModeCircleClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('inline-flex items-center justify-center');
  itemsClass.push('h-6 w-6');
  itemsClass.push('rounded-full');
  itemsClass.push('transition-transform duration-300');

  switch ($themeMode()) {
    case 'light':
      itemsClass.push('bg-white');
      break;
    case 'dark':
      itemsClass.push('bg-white');
      itemsClass.push('translate-x-6');
      break;
  }

  return itemsClass.join(' ');
});
</script>
