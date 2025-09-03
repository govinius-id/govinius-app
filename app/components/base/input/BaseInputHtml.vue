<template>
  <BaseTextLabelContent
    :label="props.label"
    :label-required="props.labelRequired"
    :label-optional="props.labelOptional"
  >
    <div
      class="relative flex w-full flex-col"
      :class="{
        'pointer-events-none': props.disabled,
      }"
    >
      <div ref="editorButtonsRef" :class="editorButtonsWrapperClass">
        <div
          v-for="(obj, i) in itemsButton"
          :key="i"
          :class="editorButtonsItemClass(obj)"
          @click="obj.onClick"
        >
          <BaseIcon :name="obj.icon" :size="props.size" />
        </div>
      </div>

      <EditorContent
        :editor="editor"
        class="w-full"
        :style="{
          '--padding-top': `${editorButtonsHeight}px`,
        }"
      />

      <div
        v-if="isClearable"
        :class="inputClearableWrapperClass"
        :style="{
          '--padding-top': `${editorButtonsHeight}px`,
        }"
      >
        <div :class="inputClearableClass" @click="emit('clear')">
          <BaseIcon name="ph:x" :size="props.size" />
        </div>
      </div>
    </div>

    <div v-if="props.error" class="text-danger text-xs">
      {{ props.error }}
    </div>
  </BaseTextLabelContent>
</template>

<script lang="ts" setup>
import { Editor, EditorContent } from '@tiptap/vue-3';
import ExtensionBold from '@tiptap/extension-bold';
import ExtensionBulletList from '@tiptap/extension-bullet-list';
import ExtensionCodeBlock from '@tiptap/extension-code-block';
import ExtensionDocument from '@tiptap/extension-document';
import ExtensionHeading from '@tiptap/extension-heading';
import ExtensionImage from '@tiptap/extension-image';
import ExtensionItalic from '@tiptap/extension-italic';
import ExtensionLink from '@tiptap/extension-link';
import ExtensionListItem from '@tiptap/extension-list-item';
import ExtensionOrderedList from '@tiptap/extension-ordered-list';
import ExtensionParagraph from '@tiptap/extension-paragraph';
import ExtensionPlaceholder from '@tiptap/extension-placeholder';
import ExtensionStrike from '@tiptap/extension-strike';
import ExtensionText from '@tiptap/extension-text';
import ExtensionTextAlign from '@tiptap/extension-text-align';
import ExtensionUnderline from '@tiptap/extension-underline';

interface EditorButtonsItem {
  show: boolean;
  text: string;
  icon: string;
  onClick: () => void;
  isActive: () => boolean | undefined;
}

interface Props {
  modelValue: any;
  error?: string | null;
  label?: string;
  labelRequired?: boolean;
  labelOptional?: boolean;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  buttons?: string[];
}

const emit = defineEmits(['update:modelValue', 'clear']);
const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  buttons: () => {
    return [
      'bold',
      'italic',
      'underline',
      'strike',
      'list-bullet',
      'list-numbered',
      'text-align-left',
      'text-align-right',
      'text-align-center',
      'text-align-justify',
    ];
  },
});

const inputModel = computed({
  get() {
    return props.modelValue;
  },
  set(value: string | null) {
    emit('update:modelValue', value);
  },
});

watch(
  () => props.modelValue,
  () => {
    setEditorContent();
  },
);

const editor = ref<Editor>();

const setEditorContent = () => {
  const isSame = editor.value?.getHTML() === inputModel.value;

  if (!isSame) {
    editor.value?.commands.setContent(inputModel.value, { emitUpdate: true });
  }
};

const initEditor = () => {
  editor.value = new Editor({
    content: '<p></p>',
    extensions: [
      ExtensionBold.configure(),
      ExtensionBulletList.configure(),
      ExtensionCodeBlock.configure(),
      ExtensionDocument.configure(),
      ExtensionHeading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      ExtensionImage.configure(),
      ExtensionItalic.configure(),
      ExtensionLink.configure(),
      ExtensionListItem.configure(),
      ExtensionOrderedList.configure(),
      ExtensionParagraph.configure(),
      ExtensionStrike.configure(),
      ExtensionText.configure(),
      ExtensionTextAlign.configure({ types: ['heading', 'paragraph'] }),
      ExtensionPlaceholder.configure({
        placeholder: props.placeholder,
        emptyNodeClass:
          'first:before:text-slate-300 first:before:font-light first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none',
      }),
      ExtensionUnderline.configure(),
    ],
    editable: !props.readonly && !props.disabled,
    editorProps: {
      attributes: {
        class: inputClass.value,
      },
    },
    onCreate: () => {
      setEditorContent();
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();

      if (!html || html === '<p></p>') {
        inputModel.value = null;
      } else {
        inputModel.value = html;
      }
    },
  });
};

const itemsButton = computed(() => {
  return [
    {
      show: props.buttons.includes('bold'),
      text: 'Bold',
      icon: 'mdi:format-bold',
      onClick: () => {
        editor.value?.chain().focus().toggleBold().run();
      },
      isActive: () => {
        return editor.value?.isActive('bold');
      },
    },
    {
      show: props.buttons.includes('italic'),
      text: 'Italic',
      icon: 'mdi:format-italic',
      onClick: () => {
        editor.value?.chain().focus().toggleItalic().run();
      },
      isActive: () => {
        return editor.value?.isActive('italic');
      },
    },
    {
      show: props.buttons.includes('underline'),
      text: 'Underline',
      icon: 'mdi:format-underline',
      onClick: () => {
        editor.value?.chain().focus().toggleUnderline().run();
      },
      isActive: () => {
        return editor.value?.isActive('underline');
      },
    },
    {
      show: props.buttons.includes('strike'),
      text: 'Strikethrough',
      icon: 'mdi:format-strikethrough-variant',
      onClick: () => {
        editor.value?.chain().focus().toggleStrike().run();
      },
      isActive: () => {
        return editor.value?.isActive('strike');
      },
    },
    {
      show: props.buttons.includes('list-bullet'),
      text: 'List Bullet',
      icon: 'mdi:format-list-bulleted',
      onClick: () => {
        editor.value?.chain().focus().toggleBulletList().run();
      },
      isActive: () => {
        return editor.value?.isActive('bulletList');
      },
    },
    {
      show: props.buttons.includes('list-numbered'),
      text: 'List Numbered',
      icon: 'mdi:format-list-numbered',
      onClick: () => {
        editor.value?.chain().focus().toggleOrderedList().run();
      },
      isActive: () => {
        return editor.value?.isActive('orderedList');
      },
    },
    {
      show: props.buttons.includes('text-align-left'),
      text: 'Text Align Left',
      icon: 'mdi:format-align-left',
      onClick: () => {
        editor.value?.chain().focus().setTextAlign('left').run();
      },
      isActive: () => {
        return editor.value?.isActive({ textAlign: 'left' });
      },
    },
    {
      show: props.buttons.includes('text-align-right'),
      text: 'Text Align Right',
      icon: 'mdi:format-align-right',
      onClick: () => {
        editor.value?.chain().focus().setTextAlign('right').run();
      },
      isActive: () => {
        return editor.value?.isActive({ textAlign: 'right' });
      },
    },
    {
      show: props.buttons.includes('text-align-center'),
      text: 'Text Align Center',
      icon: 'mdi:format-align-center',
      onClick: () => {
        editor.value?.chain().focus().setTextAlign('center').run();
      },
      isActive: () => {
        return editor.value?.isActive({ textAlign: 'center' });
      },
    },
    {
      show: props.buttons.includes('text-align-justify'),
      text: 'Text Align Justify',
      icon: 'mdi:format-align-justify',
      onClick: () => {
        editor.value?.chain().focus().setTextAlign('justify').run();
      },
      isActive: () => {
        return editor.value?.isActive({ textAlign: 'justify' });
      },
    },
  ] as EditorButtonsItem[];
});

const editorButtonsRef = ref();
const editorButtonsHeight = ref(0);
const setEditorButtonsHeight = () => {
  if (editorButtonsRef.value && editorButtonsRef.value.clientHeight) {
    editorButtonsHeight.value = editorButtonsRef.value.clientHeight;
  } else {
    editorButtonsHeight.value = 0;
  }
};

const editorButtonsWrapperClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('absolute');
  itemsClass.push('left-0');
  itemsClass.push('top-0');
  itemsClass.push('z-[2]');
  itemsClass.push('flex');
  itemsClass.push('w-full');
  itemsClass.push('select-none');
  itemsClass.push('flex-wrap');
  itemsClass.push('items-center');
  itemsClass.push('overflow-hidden');
  itemsClass.push('rounded-t-md');
  itemsClass.push('bg-slate-50');
  itemsClass.push('dark:bg-dark-900');

  switch (props.size) {
    case 'sm':
      itemsClass.push('min-h-8');
      break;
    case 'md':
      itemsClass.push('min-h-10');
      break;
    case 'lg':
      itemsClass.push('min-h-12');
      break;
  }

  return itemsClass.join(' ');
});

const editorButtonsItemClass = (obj: EditorButtonsItem) => {
  const itemsClass: string[] = [];

  itemsClass.push('inline-flex');
  itemsClass.push('aspect-square');
  itemsClass.push('cursor-pointer');
  itemsClass.push('items-center');
  itemsClass.push('justify-center');
  itemsClass.push('hover:bg-slate-100');
  itemsClass.push('dark:hover:bg-dark-800');

  if (obj.isActive()) {
    itemsClass.push('text-dark');
  } else {
    itemsClass.push('hover:text-dark text-slate-400');
  }

  switch (props.size) {
    case 'sm':
      itemsClass.push('h-8');
      break;
    case 'md':
      itemsClass.push('h-10');
      break;
    case 'lg':
      itemsClass.push('h-12');
      break;
  }

  return itemsClass.join(' ');
};

const isClearable = computed(() => {
  return props.clearable && props.modelValue && !props.disabled;
});

const inputClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('inline-flex flex-col');
  itemsClass.push('w-full');
  itemsClass.push('text-dark');
  itemsClass.push('outline-1');
  itemsClass.push('rounded-md');
  itemsClass.push('placeholder:font-light');
  itemsClass.push('placeholder:text-slate-200');
  itemsClass.push('placeholder:select-none');
  itemsClass.push('focus:ring-2');
  itemsClass.push('focus:outline-none');
  itemsClass.push('dark:text-dark-100');
  itemsClass.push('dark:placeholder:text-slate-600');

  itemsClass.push(inputPaddingClass.value);

  if (props.disabled) {
    itemsClass.push('bg-slate-50');
    itemsClass.push('dark:bg-dark-900');
  } else {
    itemsClass.push('bg-white');
    itemsClass.push('dark:bg-dark-950');
  }

  if (props.error) {
    itemsClass.push('outline-danger-500');
    itemsClass.push('focus:ring-danger-500');
    itemsClass.push('dark:outline-danger-900');
    itemsClass.push('dark:focus:ring-danger-900');
  } else {
    itemsClass.push('outline-slate-300');
    itemsClass.push('focus:ring-primary');
    itemsClass.push('dark:outline-dark-700');
    itemsClass.push('dark:focus:ring-primary');
  }

  if (props.disabled) {
    itemsClass.push('cursor-not-allowed');
  } else if (props.loading) {
    itemsClass.push('cursor-progress');
  } else if (props.readonly) {
    itemsClass.push('cursor-default');
  }

  return itemsClass.join(' ');
});

const inputPaddingClass = computed(() => {
  const itemsClass: string[] = [];

  if (props.size === 'sm') {
    itemsClass.push('pt-[calc(var(--padding-top)+12px)]');
    itemsClass.push('pb-3');
    itemsClass.push('pl-3');

    if (props.clearable) {
      itemsClass.push('pr-7');
    } else {
      itemsClass.push('pr-3');
    }
  }

  if (props.size === 'md') {
    itemsClass.push('pt-[calc(var(--padding-top)+12px)]');
    itemsClass.push('pb-3');
    itemsClass.push('pl-3');

    if (props.clearable) {
      itemsClass.push('pr-10');
    } else {
      itemsClass.push('pr-3');
    }
  }

  if (props.size === 'lg') {
    itemsClass.push('pt-[calc(var(--padding-top)+16px)]');
    itemsClass.push('pb-4');
    itemsClass.push('pl-4');

    if (props.clearable) {
      itemsClass.push('pr-12');
    } else {
      itemsClass.push('pr-4');
    }
  }

  return itemsClass.join(' ');
});

const inputClearableClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('text-danger');
  itemsClass.push('flex');
  itemsClass.push('aspect-square');
  itemsClass.push('h-full');
  itemsClass.push('cursor-pointer');
  itemsClass.push('items-center');
  itemsClass.push('justify-center');

  return itemsClass.join(' ');
});

const inputClearableWrapperClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('absolute');
  itemsClass.push('right-0');
  itemsClass.push('top-[var(--padding-top)]');
  itemsClass.push('z-[2]');
  itemsClass.push('select-none');
  itemsClass.push('overflow-hidden');

  switch (props.size) {
    case 'sm':
      itemsClass.push('h-8 min-w-8');
      break;
    case 'md':
      itemsClass.push('h-10 min-w-10');
      break;
    case 'lg':
      itemsClass.push('h-12 min-w-12');
      break;
  }

  if (props.disabled) {
    itemsClass.push('pointer-events-none');
  }

  return itemsClass.join(' ');
});

onMounted(() => {
  initEditor();
  setEditorButtonsHeight();
  window.addEventListener('resize', setEditorButtonsHeight);
});

onBeforeUnmount(() => {
  editor.value?.destroy();
  window.removeEventListener('resize', setEditorButtonsHeight);
});
</script>

<style>
ul {
  list-style: disc !important;
  list-style-position: outside !important;
  padding-left: 1.75rem !important;
}
ol {
  list-style: decimal !important;
  list-style-position: outside !important;
  padding-left: 1.75rem !important;
}
</style>
