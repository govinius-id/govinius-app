<template>
  <div class="relative flex w-full grow flex-col gap-4 xl:flex-row">
    <div class="relative w-full xl:min-w-60 xl:max-w-60">
      <BaseCard bordered compact class="sticky left-0 top-20">
        <slot name="menu"></slot>
      </BaseCard>
    </div>

    <div class="w-full min-w-0 xl:grow">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup></script>
