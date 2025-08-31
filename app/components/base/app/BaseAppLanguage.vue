<template>
  <BaseDropdown>
    <template #activator="opts">
      <div
        class="dark:bg-dark-900 inline-flex min-w-16 cursor-pointer items-center overflow-hidden rounded-full bg-slate-50 p-1.5"
        @click="opts.isOpen ? opts.onClose() : opts.onOpen()"
      >
        <img
          :src="itemLanguage?.icon"
          alt="icon"
          class="dark:border-dark-900 mr-2 size-5 rounded-full border border-slate-100"
        />
        <div class="text-dark dark:text-dark-100 mr-1 text-sm uppercase">
          {{ itemLanguage?.value }}
        </div>
      </div>
    </template>
    <template #content="opts">
      <BaseCard shadow bordered compact class="min-w-48">
        <BaseListSelectable
          :model-value="$lang()"
          :items="constItemsLanguage()"
          @select="opts.onClose()"
        >
          <template #item="optsItem">
            <BaseListItem
              :active="optsItem.item?.value === $lang()"
              @click="
                onChangeLanguage(optsItem.item);
                optsItem.onSelectItem(optsItem.item);
              "
            >
              <img
                :src="optsItem.item?.icon"
                alt="icon"
                class="dark:border-dark-900 mr-2 size-5 rounded-full border border-slate-100"
              />
              {{ optsItem.item?.text }}
            </BaseListItem>
          </template>
        </BaseListSelectable>
      </BaseCard>
    </template>
  </BaseDropdown>
</template>

<script lang="ts" setup>
const itemLanguage = computed(() => {
  return $arrayFindObject(constItemsLanguage(), $lang(), 'value');
});

const onChangeLanguage = (obj: BaseListItem) => {
  $changeLang(obj.value);
};
</script>
