import path from 'path';
import appRootPath from 'app-root-path';
import { fork } from 'child_process';
import PQueue from 'p-queue';

const queue = new PQueue({ concurrency: 1 });

export const $sharpCompressImage = async (options: {
  file_src_path: string;
  size?: 'sm' | 'md' | 'lg';
}): Promise<string> => {
  try {
    const taskQueue = async () => {
      const scriptPath = path.join(
        appRootPath.path,
        'scripts/sharp-compress-image.mjs',
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
            childProcess?.kill();

            if (message.data) {
              resolve(message.data);
            } else {
              reject(message.error);
            }
          },
        );
      });
    };

    const compressedImagePath = await queue.add(taskQueue);

    return compressedImagePath as string;
  } catch (error: any) {
    throw createError({
      statusCode: 422,
      message: 'Failed to compress image',
      data: error,
    });
  }
};
