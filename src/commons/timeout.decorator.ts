export function timeout(milliseconds = 0): any {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
      setTimeout(() => {
        originalMethod.apply(this, args);
      }, milliseconds);
    };
    return descriptor;
  };
}
