export function Singleton<T extends new (...args: any[]) => any>(target: T): T {
  let inst: InstanceType<T> | undefined;

  const singleClass = class extends target {
    constructor(...args: any[]) {
      if (inst) return inst;
      super(...args);
      inst = this as unknown as InstanceType<T>;
    }
  };
  Object.defineProperty(singleClass, 'name', { value: target.name });

  return singleClass as unknown as T;
}
