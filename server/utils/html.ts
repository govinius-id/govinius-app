import fs from 'fs';
import path from 'path';
import appRootPath from 'app-root-path';
import { createSSRApp } from 'vue';
import { renderToString } from '@vue/server-renderer';

export const $compileFileHtml = async (options: {
  html_path: string;
  data: any;
}) => {
  const fileHtml = fs.readFileSync(
    path.join(appRootPath.path, 'html', options.html_path),
    'utf8',
  );

  const app = createSSRApp({
    template: fileHtml,
    compilerOptions: {
      isCustomElement: (tag) => tag === 'center',
    },
    setup: () => {
      return options.data;
    },
  });

  return await renderToString(app);
};
