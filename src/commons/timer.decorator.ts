
export function measure(target: any, propertyKey: string, descriptor: PropertyDescriptor): any {
  const originalMethod = descriptor.value;

  descriptor.value = function(...args: any[]) {
    const start = performance.now();
    const result = originalMethod.apply(this, args);
    const end = performance.now();
    console.log(`La llamada a ${propertyKey} tomó ${(end - start).toFixed(2)} milisegundos.`);
    return result;
  };
  return descriptor;

}
