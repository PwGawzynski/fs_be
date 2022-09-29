import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Company } from '../../../company/entities/company.entity';

@ValidatorConstraint({ async: true })
export class IsCompanyPropUniq implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return Company.findOne({
      where: {
        [args.constraints[0] ?? args.property]: value,
      },
    }).then((result) => !result);
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Property: ${validationArguments.property} must be uniqueeee`;
  }
}

export function IsUniqForCompany(
  propName?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [propertyName],
      validator: IsCompanyPropUniq,
    });
  };
}
