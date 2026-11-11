export type SerializableKey = string | number;
export type SerializablePrimitive = string | number | boolean | null;
export type SerializableObject = {
  [key: SerializableKey]: SerializableValue;
};
export type SerializableArray = SerializableValue[];
export type SerializableValue = SerializablePrimitive | SerializableObject | SerializableArray;
