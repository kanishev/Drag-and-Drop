export function Autobind(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const adjDescriptor: PropertyDescriptor = {
    get() {
      return descriptor.value.bind(this);
    },
  };

  return adjDescriptor;
}
