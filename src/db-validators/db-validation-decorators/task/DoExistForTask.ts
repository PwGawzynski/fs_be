import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Task } from '../../../tasks/entities/task.entity';

@ValidatorConstraint({ async: true })
class doExistForTask implements ValidatorConstraintInterface {
  validate(id: any, args: ValidationArguments) {
    return Task.findOne({
      where: {
        id,
      },
    }).then((result) => !!result);
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Given: ${validationArguments.property} cannot be matched with any existing Task`;
  }
}

export function DoExistForTask(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: doExistForTask,
    });
  };
}
