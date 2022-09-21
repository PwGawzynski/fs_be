import { UserRolesObj } from './UserRolesObj';

export interface ICreateUserAsk {
  login: string;
  password: string;
  name: string;
  surname: string;
  age: number;
  email: string;
  roles: UserRolesObj;
}
