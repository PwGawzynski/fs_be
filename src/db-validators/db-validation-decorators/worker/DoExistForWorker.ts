import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Worker } from '../../../worker/entities/worker.entity';

@ValidatorConstraint({ async: true })
class doExistForWorker implements ValidatorConstraintInterface {
  validate(id: any, args: ValidationArguments) {
    return Worker.findOne({
      where: {
        id,
      },
    }).then((result) => !!result);
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Given: ${validationArguments.property} cannot be matched with any existing worker`;
  }
}

export function DoExistForWorker(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: doExistForWorker,
    });
  };
}
