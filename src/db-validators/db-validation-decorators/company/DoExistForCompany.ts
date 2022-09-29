import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Company } from '../../../company/entities/company.entity';

@ValidatorConstraint({ async: true })
class doExistForCompany implements ValidatorConstraintInterface {
  validate(id: any, args: ValidationArguments) {
    return Company.findOne({
      where: {
        id,
      },
    }).then((result) => !!result);
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Given: ${validationArguments.property} cannot be matched with any existing company`;
  }
}

export function DoExistForCompany(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: doExistForCompany,
    });
  };
}
