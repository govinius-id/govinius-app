import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars } from 'overlayscrollbars';
import type { EventListeners, PartialOptions } from 'overlayscrollbars';

export const $overlayScrollbars = (
  element: HTMLElement,
  options: PartialOptions = {},
  eventListeners?: EventListeners,
) => {
  if (!document) return;
  OverlayScrollbars(element, options, eventListeners);
};
