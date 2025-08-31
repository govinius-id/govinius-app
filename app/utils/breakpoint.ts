import { breakpointsTailwind } from '@vueuse/core';
import { UAParser } from 'ua-parser-js';

const objBreakpoint = {
  is_xs: false,
  is_sm: false,
  is_sm_and_up: false,
  is_sm_and_down: false,
  is_md: false,
  is_md_and_up: false,
  is_md_and_down: false,
  is_lg: false,
  is_lg_and_up: false,
  is_lg_and_down: false,
  is_xl: false,
  is_xl_and_up: false,
  is_xl_and_down: false,
  is_2xl: false,
  is_2xl_and_up: false,
  is_2xl_and_down: false,
};

export const $breakpoint = () => {
  if (import.meta.server) {
    const headers = useRequestHeaders();
    const userAgent = headers['user-agent'] || '';
    const parser = new UAParser(userAgent);
    const deviceType = parser.getDevice().type || 'desktop';

    let width = 1024; // Default desktop

    if (deviceType === 'mobile') {
      width = 375;
    } else if (deviceType === 'tablet') {
      width = 768;
    }

    objBreakpoint.is_xs = width < 640;
    objBreakpoint.is_sm = width >= 640 && width < 768;
    objBreakpoint.is_sm_and_up = width >= 640;
    objBreakpoint.is_sm_and_down = width < 768;
    objBreakpoint.is_md = width >= 768 && width < 1024;
    objBreakpoint.is_md_and_up = width >= 768;
    objBreakpoint.is_md_and_down = width < 1024;
    objBreakpoint.is_lg = width >= 1024 && width < 1280;
    objBreakpoint.is_lg_and_up = width >= 1024;
    objBreakpoint.is_lg_and_down = width < 1280;
    objBreakpoint.is_xl = width >= 1280 && width < 1536;
    objBreakpoint.is_xl_and_up = width >= 1280;
    objBreakpoint.is_xl_and_down = width < 1536;
    objBreakpoint.is_2xl = width >= 1536;
    objBreakpoint.is_2xl_and_up = width >= 1536;
    objBreakpoint.is_2xl_and_down = true;
  }

  if (import.meta.client) {
    const breakpoint = useBreakpoints(breakpointsTailwind);

    objBreakpoint.is_xs = breakpoint.isSmaller('sm');
    objBreakpoint.is_sm = breakpoint.sm.value;
    objBreakpoint.is_sm_and_up = breakpoint.isGreaterOrEqual('sm');
    objBreakpoint.is_sm_and_down = breakpoint.isSmallerOrEqual('sm');
    objBreakpoint.is_md = breakpoint.md.value;
    objBreakpoint.is_md_and_up = breakpoint.isGreaterOrEqual('md');
    objBreakpoint.is_md_and_down = breakpoint.isSmallerOrEqual('md');
    objBreakpoint.is_lg = breakpoint.lg.value;
    objBreakpoint.is_lg_and_up = breakpoint.isGreaterOrEqual('lg');
    objBreakpoint.is_lg_and_down = breakpoint.isSmallerOrEqual('lg');
    objBreakpoint.is_xl = breakpoint.xl.value;
    objBreakpoint.is_xl_and_up = breakpoint.isGreaterOrEqual('xl');
    objBreakpoint.is_xl_and_down = breakpoint.isSmallerOrEqual('xl');
    objBreakpoint.is_2xl = breakpoint['2xl'].value;
    objBreakpoint.is_2xl_and_up = breakpoint.isGreaterOrEqual('2xl');
    objBreakpoint.is_2xl_and_down = breakpoint.isSmallerOrEqual('2xl');
  }

  return objBreakpoint;
};
