import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Machine } from '../../../machines/entities/machine.entity';

@ValidatorConstraint({ async: true })
class IsMachinePropUniq implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return Machine.findOne({
      where: {
        [args.constraints[0] ?? args.property]: value,
      },
    }).then((result) => !result);
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Property: ${validationArguments.property} must be unique`;
  }
}

export function IsUniqForMachine(
  propName?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [propertyName],
      validator: IsMachinePropUniq,
    });
  };
}
