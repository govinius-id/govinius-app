import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import appRootPath from 'app-root-path';
import path from 'path';

const runtimeConfig = useRuntimeConfig();

const storage = new Storage({
  keyFilename: path.join(appRootPath.path, '/gcs-key.json'),
  projectId: runtimeConfig.gcpProjectId,
});

const bucketName = runtimeConfig.gcpBucketName;
const bucket = storage.bucket(bucketName);

export const $gcsUrlStorage = (filePath?: string | null) => {
  if (!filePath) return null;

  const fileSavedPathRelative = filePath.slice(1, filePath.length);

  return bucket.file(fileSavedPathRelative).getSignedUrl({
    action: 'read',
    expires: Date.now() + 1000 * 60 * 60,
  });
};

export const $gcsSaveToStorage = async (options: {
  file_name: string;
  file_src_path: string;
  save_directory: string;
}) => {
  return new Promise<string>((resolve, reject) => {
    const fileSavedPath = `/${options.save_directory}/${options.file_name}`;

    const fileSavedPathRelative = fileSavedPath.slice(1, fileSavedPath.length);

    const upload = bucket.file(fileSavedPathRelative);

    const fileReadStream = fs.createReadStream(options.file_src_path);
    const fileUploadStream = upload.createWriteStream();

    fileUploadStream.on('error', reject);
    fileUploadStream.on('finish', () => {
      if (fs.existsSync(options.file_src_path)) {
        fs.unlinkSync(options.file_src_path);
      }
      resolve(fileSavedPath);
    });

    fileReadStream.on('error', reject);
    fileReadStream.pipe(fileUploadStream);
  }).catch((error: any) => {
    throw createError({
      statusCode: 422,
      message: error.message,
    });
  });
};

export const $gcsDeleteFile = async (fileUrl: string) => {
  await bucket.file(fileUrl).delete({ ignoreNotFound: true });
};
