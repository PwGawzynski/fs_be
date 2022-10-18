export interface UserRolesObj {
  worker: boolean;
  owner: boolean;
}
export enum UserRole {
  worker = 'worker',
  owner = 'owner',
}
