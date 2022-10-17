import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function FindOrReject(
  baseClass: new () => any,
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'FindOrReject',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [baseClass],
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const relatedPropertyName = args.property;
          const [baseClass] = args.constraints;
          const relatedValue = await (args.object as any)[relatedPropertyName];
          let classInstance;
          if (!Array.isArray(relatedValue)) {
            classInstance = await baseClass.findOne({
              where: {
                id: relatedValue,
              },
            });
          } else {
            classInstance = await Promise.all(
              relatedValue.map(
                async (oneElement) =>
                  await baseClass.findOne({
                    where: {
                      id: oneElement,
                    },
                  }),
              ),
            );
          }
          if (!classInstance) return false;
          (args.object as any)[relatedPropertyName] = classInstance;
          return true;
        },
      },
    });
  };
}
