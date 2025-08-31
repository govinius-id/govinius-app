<template>
  <div ref="activatorRef" :class="props.class" class="relative">
    <slot
      name="activator"
      :is-open="isDropdownOpen"
      :on-open="onOpenDropdown"
      :on-close="onCloseDropdown"
      :on-toggle="onToggleDropdown"
    ></slot>

    <ClientOnly v-if="props.teleportTo === 'activator'">
      <Teleport
        v-if="isMounted && props.teleportTo === 'activator'"
        :to="activatorRef"
      >
        <Transition
          enter-active-class="duration-100 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="duration-0"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-if="isDropdownOpen" :class="dropdownWrapperClass">
            <div
              ref="dropdownRef"
              :class="dropdownClass"
              :style="{
                '--top': `${dropdownTop}px`,
                '--left': `${dropdownLeft}px`,
              }"
            >
              <slot
                name="content"
                :is-open="isDropdownOpen"
                :on-open="onOpenDropdown"
                :on-close="onCloseDropdown"
                :on-toggle="onToggleDropdown"
                :max-width="activatorWidth"
              ></slot>
            </div>
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>
  </div>

  <ClientOnly v-if="props.teleportTo === 'root'">
    <Teleport v-if="isMounted" to="#app-root">
      <Transition
        enter-active-class="duration-100 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="duration-0"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isDropdownOpen" :class="dropdownWrapperClass">
          <div
            ref="dropdownRef"
            :class="dropdownClass"
            :style="{
              '--top': `${dropdownTop}px`,
              '--left': `${dropdownLeft}px`,
            }"
          >
            <slot
              name="content"
              :is-open="isDropdownOpen"
              :on-open="onOpenDropdown"
              :on-close="onCloseDropdown"
              :on-toggle="onToggleDropdown"
              :max-width="activatorWidth"
            ></slot>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script lang="ts" setup>
interface Props {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'auto';
  teleportTo?: 'activator' | 'root';
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  position: 'auto',
  teleportTo: 'activator',
});

const activatorRef = ref<HTMLElement | undefined>();
const dropdownRef = ref<HTMLElement | undefined>();

const isDropdownOpen = ref(false);

const onOpenDropdown = () => {
  isCalculatePosition.value = false;
  isDropdownOpen.value = true;

  // After animation class "duration-100"
  setTimeout(() => {
    onCalculatePosition();
    document.addEventListener('click', onClickOutsideDropdown);
    window.addEventListener('resize', onCalculatePosition);
    onListenElementAcrossScrollParents();
    nextTick(() => onCalculatePosition());
  }, 100);
};

const onCloseDropdown = () => {
  isDropdownOpen.value = false;
  document.removeEventListener('click', onClickOutsideDropdown);
  window.removeEventListener('resize', onCalculatePosition);
  onRemoveElementAcrossScrollParents();
};

const onToggleDropdown = () => {
  if (isDropdownOpen.value) {
    onCloseDropdown();
  } else {
    onOpenDropdown();
  }
};

const onClickOutsideDropdown = (event: MouseEvent) => {
  if (!dropdownRef.value) return;
  if (!dropdownRef.value.contains(event.target as Node)) {
    onCloseDropdown();
  }
};

const activatorWidth = ref(0);

const isCalculatePosition = ref(false);
const dropdownTop = ref(0);
const dropdownLeft = ref(0);

const onCalculatePosition = () => {
  if (!activatorRef.value) return;
  if (!dropdownRef.value) return;

  const activatorRect = activatorRef.value.getBoundingClientRect();
  const dropdownRect = dropdownRef.value.getBoundingClientRect();

  activatorWidth.value = activatorRect.width;

  const spaceAbove = activatorRect.top;
  const spaceBelow = window.innerHeight - activatorRect.bottom;
  const spaceLeft = activatorRect.left;
  const spaceRight = window.innerWidth - activatorRect.right;

  if (props.position === 'auto') {
    if (spaceBelow >= dropdownRect.height || spaceBelow >= spaceAbove) {
      dropdownTop.value = activatorRect.bottom;
    } else {
      dropdownTop.value = activatorRect.top - dropdownRect.height;
    }

    if (spaceRight >= dropdownRect.width || spaceRight >= spaceLeft) {
      dropdownLeft.value = activatorRect.left;
    } else {
      dropdownLeft.value = activatorRect.right - dropdownRect.width;
    }
  }

  if (props.position === 'top-left') {
    dropdownTop.value = activatorRect.y - dropdownRect.height;
    dropdownLeft.value = activatorRect.x;
  }

  if (props.position === 'top-right') {
    dropdownTop.value = activatorRect.y - dropdownRect.height;
    dropdownLeft.value =
      activatorRect.x - dropdownRect.width + activatorRect.width;
  }

  if (props.position === 'bottom-left') {
    dropdownTop.value = activatorRect.y + activatorRect.height;
    dropdownLeft.value = activatorRect.x;
  }

  if (props.position === 'bottom-right') {
    dropdownTop.value = activatorRect.y + activatorRect.height;
    dropdownLeft.value =
      activatorRect.x - dropdownRect.width + activatorRect.width;
  }

  isCalculatePosition.value = true;
};

const dropdownClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('fixed z-40');
  itemsClass.push('top-[var(--top)] left-[var(--left)]');

  return itemsClass.join(' ');
});

const dropdownWrapperClass = computed(() => {
  const itemsClass: string[] = [];

  if (!isCalculatePosition.value) {
    itemsClass.push('invisible');
  } else {
    itemsClass.push('visible');
  }

  return itemsClass.join(' ');
});

const itemsScrollableParents = ref(
  [] as ((Window & typeof globalThis) | HTMLElement)[],
);

const onLookUpScrollableParents = (element: HTMLElement) => {
  const scrollables = [];
  let parent = element.parentElement;

  while (parent && parent !== document.body) {
    const style = getComputedStyle(parent);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;
    const isScrollableY = overflowY === 'auto' || overflowY === 'scroll';
    const isScrollableX = overflowX === 'auto' || overflowX === 'scroll';

    const canScrollY = parent.scrollHeight > parent.clientHeight;
    const canScrollX = parent.scrollWidth > parent.clientWidth;

    if ((isScrollableY && canScrollY) || (isScrollableX && canScrollX)) {
      scrollables.push(parent);
    }

    parent = parent.parentElement;
  }

  if (document.body.scrollHeight > window.innerHeight) {
    scrollables.push(window);
  }

  return scrollables;
};

const onListenElementAcrossScrollParents = () => {
  if (!activatorRef.value) return;

  itemsScrollableParents.value = onLookUpScrollableParents(activatorRef.value);

  itemsScrollableParents.value.forEach((parent) => {
    parent.addEventListener('scroll', onCalculatePosition, { passive: true });
  });
};

const onRemoveElementAcrossScrollParents = () => {
  itemsScrollableParents.value.forEach((parent) => {
    parent.removeEventListener('scroll', onCalculatePosition);
  });
};

const isMounted = useMounted();

onMounted(() => {
  isDropdownOpen.value = false;
});

defineExpose({
  isOpen: isDropdownOpen,
  onOpen: onOpenDropdown,
  onClose: onCloseDropdown,
  onToggle: onToggleDropdown,
});
</script>
