import type { H3Event } from 'h3';
import { readFiles } from 'h3-formidable';

export const $createFormData = (obj: any) => {
  const formData = new FormData();

  const builder = (formData: FormData, data: any, parentKey?: string) => {
    if (data && typeof data === 'object' && !(data instanceof File)) {
      Object.keys(data).forEach((key) => {
        const fullKey = parentKey ? `${parentKey}[${key}]` : key;
        builder(formData, data[key], fullKey);
      });
    } else if (Array.isArray(data)) {
      data.forEach((val, i) => {
        const fullKey = `${parentKey}[${i}]`;
        builder(formData, val, fullKey);
      });
    } else {
      formData.append(parentKey!, data ?? '');
    }
  };

  builder(formData, obj);

  return formData;
};

export const $readFormData = async (event: H3Event) => {
  const { fields, files } = await readFiles(event);
  const object = {} as Record<string, any>;

  const parseValue = (value: any) => {
    let parsed = value?.toString();
    if (parsed === '') parsed = null;
    if (parsed === 'null') parsed = null;
    if (parsed === 'true') parsed = true;
    if (parsed === 'false') parsed = false;
    return parsed;
  };

  const builder = (obj: Record<string, any>, path: string[], value: any) => {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      const nextKey = path[i + 1];
      const isArray = /^\d+$/.test(nextKey);
      if (!current[key]) {
        current[key] = isArray ? [] : {};
      }
      current = current[key];
    }
    current[path[path.length - 1]] = value;
  };

  const allEntries: {
    name: string;
    isFile: boolean;
    data: any;
  }[] = [];

  for (const [name, values] of Object.entries(fields)) {
    if (Array.isArray(values) && values.length > 0) {
      allEntries.push({
        name,
        isFile: false,
        data: values[0],
      });
    }
  }

  for (const [name, fileList] of Object.entries(files)) {
    if (Array.isArray(fileList) && fileList.length > 0) {
      const file = fileList[0];
      allEntries.push({
        name,
        isFile: true,
        data: {
          filepath: file.filepath,
          filename: file.originalFilename,
          type: file.mimetype,
          size: file.size,
        },
      });
    }
  }

  for (const { name, isFile, data } of allEntries) {
    if (!name) continue;
    const path = [...name.matchAll(/([^[\]]+)/g)].map((m) => m[1]);
    const finalValue = isFile ? data : parseValue(data);
    builder(object, path, finalValue);
  }

  return object;
};
