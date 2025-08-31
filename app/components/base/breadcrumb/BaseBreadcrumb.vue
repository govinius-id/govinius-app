<template>
  <ClientOnly>
    <div
      class="flex w-full select-none items-center gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div
        v-for="(obj, i) in baseBreadcrumbStore.itemsBreadcrumb"
        :key="i"
        class="flex items-center gap-1"
        :class="{
          'cursor-pointer': obj.to,
        }"
        @click="obj.to ? $router.push(obj.to) : undefined"
      >
        <BaseIcon v-if="obj.icon" :name="obj.icon" class="text-slate-400" />

        <BaseIcon
          v-if="i > 0"
          name="ph:caret-right"
          class="size-3 text-slate-400"
        />

        <div
          v-if="obj.text"
          class="text-dark dark:text-dark-100 whitespace-nowrap text-xs"
        >
          {{ obj.text }}
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script lang="ts" setup>
const baseBreadcrumbStore = useBaseBreadcrumbStore();
</script>
