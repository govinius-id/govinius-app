import fs from 'fs';
import path from 'path';
import jsonwebtoken from 'jsonwebtoken';
import appRootPath from 'app-root-path';

const runtimeConfig = useRuntimeConfig();

export const $fileUploadExtension = (filePath: string) => {
  const parts = filePath.split('.');
  return parts.length > 1 ? parts.pop() : null;
};

export const $fileUploadPathImageSize = (
  filePath: string | null,
  size?: 'sm' | 'md' | 'lg' | 'original',
) => {
  if (!filePath) return null;
  if (!size) return filePath;
  const imagePathParts = filePath.split('/');
  const imageFileName = imagePathParts[imagePathParts.length - 1];
  const imageFileExt = $fileUploadExtension(imageFileName);
  const imageSourcePath = filePath.replace(imageFileName, '');

  return `${imageSourcePath}/${size}.${imageFileExt}`.replaceAll('//', '/');
};

export const $fileUploadVisibility = (filePath?: string | null) => {
  if (!filePath) return false;
  return filePath?.startsWith('/private') || filePath?.startsWith('private')
    ? 'private'
    : 'public';
};

export const $fileUploadUrlStorage = (filePath?: string | null) => {
  if (!filePath) return null;
  const storageToken = jsonwebtoken.sign(
    {
      file_path: filePath,
    },
    runtimeConfig.jwtSecret,
    { expiresIn: '1d' },
  );
  let fileUrl = `${runtimeConfig.public.api_url}/storage`;

  fileUrl += `?file=${encodeURIComponent(filePath)}`;

  const fileVisibility = $fileUploadVisibility(filePath);
  if (fileVisibility === 'private') {
    fileUrl += `&token=${storageToken}`;
  }
  return fileUrl;
};

export const $fileUploadPathStorage = (fileUrl?: string | null) => {
  if (!fileUrl) return null;
  return fileUrl
    .replaceAll(`${runtimeConfig.public.api_url}/storage/`, '')
    .split('?')[0];
};

export const $fileUploadSaveToStorage = async (options: {
  file_name: string;
  file_src_path: string;
  save_directory: string;
  is_private: boolean;
}) => {
  return new Promise<string>((resolve, reject) => {
    const storageDir = path.join(appRootPath.path, 'storage');

    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const fileVisibility = options.is_private ? 'private' : 'public';

    const storageSubdir = path.join(
      storageDir,
      fileVisibility,
      options.save_directory,
    );

    if (!fs.existsSync(storageSubdir)) {
      fs.mkdirSync(storageSubdir, { recursive: true });
    }

    const uploadToPath = path.join(storageSubdir, options.file_name);
    const fileSavedPath = `${fileVisibility}/${options.save_directory}/${options.file_name}`;

    const fileReadStream = fs.createReadStream(options.file_src_path);
    const fileUploadStream = fs.createWriteStream(uploadToPath);

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

export const $fileUploadReadFromStorage = (options: {
  filePath: string;
  storageToken?: string;
}) => {
  try {
    const storageDir = path.join(appRootPath.path, 'storage');
    const fileInStoragePath = path.join(storageDir, options.filePath);
    if (!fs.existsSync(fileInStoragePath)) {
      throw createError({
        statusCode: 404,
        message: 'Not found',
      });
    }

    const fileVisibility = $fileUploadVisibility(options.filePath);

    // Check private file
    if (fileVisibility === 'private') {
      if (!options.storageToken) {
        throw createError({
          statusCode: 422,
          message: 'Token required',
        });
      }

      let decoded: any = null;

      try {
        decoded = jsonwebtoken.verify(
          options.storageToken,
          runtimeConfig.jwtSecret,
        );
      } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
          throw createError({
            statusCode: 422,
            message: 'File url is expired',
          });
        } else {
          throw createError({
            statusCode: 422,
            message: error.name,
          });
        }
      }

      if (decoded?.file_path !== options.filePath) {
        throw createError({
          statusCode: 422,
          message: 'Token invalid',
        });
      }
    }

    return fs.createReadStream(fileInStoragePath);
  } catch (error: any) {
    throw createError({
      statusCode: 422,
      message: error.message,
    });
  }
};
