import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { User } from '../../../user/entities/user.entity';

@ValidatorConstraint({ async: true })
class doExistForUser implements ValidatorConstraintInterface {
  validate(id: any, args: ValidationArguments) {
    return User.findOne({
      where: {
        id,
      },
    }).then((result) => !!result);
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Given: ${validationArguments.property} cannot be matched with any existing user`;
  }
}

export function DoExistForUser(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: doExistForUser,
    });
  };
}
