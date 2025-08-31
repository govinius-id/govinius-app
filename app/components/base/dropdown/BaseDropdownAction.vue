<template>
  <BaseDropdown teleport-to="root">
    <template #activator="opts">
      <BaseButtonIcon icon="ph:dots-three-vertical" @click="opts.onToggle()" />
    </template>
    <template #content="opts">
      <BaseCard class="flex min-w-44 flex-col" compact bordered shadow>
        <slot v-bind="opts"></slot>
      </BaseCard>
    </template>
  </BaseDropdown>
</template>
