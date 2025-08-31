import fs from 'fs';
import tmp from 'tmp';
import sharp from 'sharp';

process.on('message', (options) => {
  try {
    const tmpPath = tmp.fileSync().name;

    sharp.cache(false);
    sharp.concurrency(1);

    let sharpInstance = sharp()
      .rotate()
      .withMetadata({ orientation: undefined });

    switch (options.size) {
      case 'sm':
        sharpInstance = sharpInstance.resize(64);
        break;
      case 'md':
        sharpInstance = sharpInstance.resize(480);
        break;
      case 'lg':
        sharpInstance = sharpInstance.resize(1920);
        break;
    }

    fs.createReadStream(options.file_src_path)
      .pipe(sharpInstance.webp({ quality: 70 }))
      .pipe(fs.createWriteStream(tmpPath))
      .on('ready', () => {
        console.info(`Sharp compress image: processing image`);
      })
      .on('close', async () => {
        global?.gc();

        process.send?.({
          data: tmpPath,
        });
        process.exit(0);
      })
      .on('error', (error) => {
        throw error;
      });
  } catch (error) {
    process.send?.({
      error: error,
    });
    process.exit(1);
  }
});
