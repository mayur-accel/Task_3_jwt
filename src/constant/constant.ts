export const JWTexpiresIn = "6h";

export enum UserRoleEnum {
  free = 0,
  normal = 1,
  pro = 2,
  subAdmin = 3,
  rootAdmin = 4,
}

export enum PermissionEnum {
  create = 0,
  read = 1,
  update = 2,
  delete = 3,
}

export const proURL = ["/check-user-role-pro"];

export const normalURL = ["/check-user-role-normal"];

export const freeURL = ["/check-user-role-free"];
