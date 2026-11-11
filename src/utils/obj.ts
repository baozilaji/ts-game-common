import { SerializableKey, SerializableObject, SerializableValue } from '../const/consts';

export function deepCopy<SerializableValue>(obj: SerializableValue): SerializableValue {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map((x) => deepCopy(x)) as unknown as SerializableValue;
  }

  if (typeof obj === 'object') {
    const out: SerializableObject = {};
    for (const k of Object.keys(obj)) {
      out[k] = deepCopy((obj as SerializableObject)[k]);
    }
    return out as unknown as SerializableValue;
  }

  return obj;
}

export function isSerializableObject(val: SerializableValue): val is SerializableObject {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

export function mergeSerializableValue(target: SerializableValue, src: SerializableValue): SerializableValue {
  if (isSerializableObject(src) && isSerializableObject(target)) {
    for (const k of Object.keys(target)) {
      if (Reflect.has(src, k)) {
        if (isSerializableObject(target[k]) && isSerializableObject(src[k])) {
          mergeSerializableValue(target[k], src[k]);
        } else {
          target[k] = src[k];
        }
      }
    }

    for (const k of Object.keys(src)) {
      if (!Reflect.has(target, k)) {
        target[k] = src[k];
      }
    }
  }
  return target;
}
