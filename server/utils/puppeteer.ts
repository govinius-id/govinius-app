import path from 'path';
import appRootPath from 'app-root-path';
import PQueue from 'p-queue';
import { fork } from 'child_process';
import type { PaperFormat } from 'puppeteer';

const queue = new PQueue({ concurrency: 1 });

export const $puppeteerGeneratePdf = async (options: {
  html: string;
  width?: string;
  height?: string;
  format?: PaperFormat;
  rotate?: 'LANDSCAPE' | 'PORTAIT';
}): Promise<string> => {
  try {
    const taskQueue = async () => {
      const scriptPath = path.join(
        appRootPath.path,
        'scripts/puppeteer-generate-pdf.mjs',
      );

      const childProcess = fork(scriptPath, {
        execArgv: ['--expose-gc'],
      });

      return new Promise((resolve, reject) => {
        childProcess?.send?.(options);
        childProcess?.once('error', reject);
        childProcess?.once(
          'message',
          (message: { data: string; error: string | undefined }) => {
            childProcess.kill();

            if (message.data) {
              resolve(message.data);
            } else {
              reject(message.error);
            }
          },
        );
      });
    };

    const generatedPdfPath = await queue.add(taskQueue);

    return generatedPdfPath as string;
  } catch (error: any) {
    throw createError({
      statusCode: 422,
      message: 'Failed to generate pdf',
      data: error,
    });
  }
};
