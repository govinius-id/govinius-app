export const $arrayFindObject = <T, K extends keyof T>(
  source: T[],
  targetValue: any,
  sourceKey: K,
) => {
  if (!source) return null;
  if (source.length === 0) return null;
  const found = source.find((obj) => {
    return obj[sourceKey] === targetValue;
  });
  return found;
};

export const $arrayFindObjectValue = <T, K extends keyof T>(
  source: T[],
  targetValue: any,
  sourceKey: K,
  targetKey: K,
) => {
  const obj = $arrayFindObject(source, targetValue, sourceKey);
  if (!obj) return null;
  return obj[targetKey];
};

export const $objectClone = <T>(source: T): T => {
  const deepClone = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof File) return obj;
    if (Array.isArray(obj)) {
      return obj.map(deepClone);
    }

    const objCloned: any = {};
    for (const key in obj) {
      objCloned[key] = deepClone(obj[key]);
    }
    return objCloned;
  };

  return deepClone(source);
};

export const $objectOmitKeys = <T, K extends keyof T>(
  source: T,
  keys: K[],
): T => {
  if (!source) return source;
  const obj: any = $objectClone(source);
  for (const key of keys) {
    obj[key] = undefined;
  }
  return obj;
};

export const $objectAssignTarget = (target: any, source: any) => {
  Object.keys(target).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  });
};

export const $objectAssignNullable = (target: any) => {
  Object.keys(target).forEach((key) => {
    target[key] = null;
  });
};
