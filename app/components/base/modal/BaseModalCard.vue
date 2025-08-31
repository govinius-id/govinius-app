<template>
  <BaseModal ref="modalRef" v-model="modalModel" :z-index="80">
    <template #activator="opts">
      <slot v-if="$slots.activator" name="activator" v-bind="opts"></slot>
    </template>
    <template #content="opts">
      <Transition
        enter-active-class="duration-100 ease-linear"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="duration-200 ease-linear"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-90"
      >
        <BaseCard v-if="opts.isModalContent" :class="modalClass" bordered>
          <BaseCardHead :title="props.title" :size="cardSize" bordered>
            <template #suffix>
              <BaseButtonIcon
                icon="ph:x"
                :size="cardSize"
                @click="opts.onClose()"
              />
            </template>
          </BaseCardHead>

          <div class="flex flex-col gap-y-4">
            <slot name="content" v-bind="opts"></slot>
          </div>

          <BaseCardAction v-if="$slots.action">
            <slot name="action" v-bind="opts"></slot>
          </BaseCardAction>
        </BaseCard>
      </Transition>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
interface Props {
  modelValue?: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const emit = defineEmits(['update:modelValue']);
const props = withDefaults(defineProps<Props>(), {
  size: 'md',
});

const modalModel = computed({
  get() {
    return props.modelValue;
  },
  set(value: boolean) {
    emit('update:modelValue', value);
  },
});

const cardSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'sm';
    case 'md':
      return 'md';
    case 'lg':
      return 'md';
    case 'xl':
      return 'md';
    case '2xl':
      return 'md';
    default:
      return 'md';
  }
});

const modalClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('w-full');

  switch (props.size) {
    case 'sm':
      itemsClass.push('max-w-sm');
      break;
    case 'md':
      itemsClass.push('max-w-lg');
      break;
    case 'lg':
      itemsClass.push('max-w-3xl');
      break;
    case 'xl':
      itemsClass.push('max-w-5xl');
      break;
    case '2xl':
      itemsClass.push('max-w-6xl');
      break;
  }

  return itemsClass;
});

const modalRef = ref();

onKeyStroke(
  'Escape',
  () => {
    modalModel.value = false;
  },
  { target: modalRef.value },
);
</script>
