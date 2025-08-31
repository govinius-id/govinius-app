import type {
  RouteLocationAsRelativeGeneric,
  RouteLocationAsPathGeneric,
} from 'vue-router';

export interface BaseListItem {
  text?: string;
  caption?: string;
  value?: any;
  to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
  icon?: string;
  color?: string;
  active?: boolean;
}

export interface BaseMenuItem {
  text?: string;
  value?: any;
  to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
  icon?: string;
  active?: boolean;
  roles?: string[];
  permissions?: string[];
  show?: boolean;
}

export interface BaseDialog {
  type?: 'confirm';
  title?: string;
  message?: string;
  icon?: string;
  textOk?: string;
  textCancel?: string;
  onOk?: () => Promise<void> | void;
  onCancel?: () => Promise<void> | void;
  colorOk?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'danger';
  colorCancel?:
    | 'default'
    | 'primary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger';
  classes?: {
    icon?: string;
    buttonOk?: string;
    buttonCancel?: string;
  };
}

export interface BaseToast {
  type?: 'success' | 'error' | 'info';
  message: string;
  timeout?: NodeJS.Timeout;
  key?: number;
}

export interface BaseLightboxImage {
  name: string;
  url: string;
}

export interface BaseCalendarEvent {
  date: string;
  disabled?: boolean;
  onSelect?: () => Promise<void> | void;
  dot?: boolean;
  classes?: {
    text?: string;
    dot?: string;
  };
}
