import { Location } from "@daml.js/app-0.0.1/lib/Types";

export enum UserRole {
  ADMIN,
  PRODUCER,
  PROCESSOR,
  //SELLER,
  BUYER,
  //STORAGE,
  TRANSPORTER,
  UNDEFINED
}

export function userRoleToString(role: UserRole): string {
  return UserRole[role];
}

export function userRoleFromString(roleStr: string | null): UserRole {
  if (roleStr === null) return UserRole.UNDEFINED;
  return (UserRole as any)[roleStr];
}

export function userRolesToString(roles: UserRole[]): string {
  const roleStrs = roles.map(role => UserRole[role]);
  return roleStrs.join(", ");
}

export function userRolesFromString(str: string | null): UserRole[] {
  if (str === null) return [UserRole.UNDEFINED];
  const roleStrs = str.split(", ");
  return roleStrs.map(roleStr => (UserRole as any)[roleStr]);
}

export interface UserInfo {
  username: string;
  roles: UserRole[];
  location?: Location;
}

export function hasRole(user: UserInfo, roles: UserRole[]): boolean {
  if (!user) return false;
  return user.roles.some(role => roles.includes(role));
}

export function rolesForParty(username: string): UserRole[] {
  const user = Users.find(user => user.username === username);
  if (user === undefined) return [];
  return user.roles;
}

export const Alice: UserInfo = { username: "Admin Alice", roles: [UserRole.ADMIN], location: { name: "House of Alice", country: "UK" } };
export const Alex: UserInfo = { username: "Admin Alex", roles: [UserRole.ADMIN], location: { name: "Kootala Villa", country: "UK" } };
export const Fred: UserInfo = { username: "Farmer Fred", roles: [UserRole.PRODUCER], location: { name: "The Farming Coop", country: "UK" } };
export const Felicity: UserInfo = { username: "Farmer Felicity", roles: [UserRole.PRODUCER], location: { name: "Happy Farm", country: "UK" } };
export const Polly: UserInfo = { username: "Processor Polly", roles: [UserRole.PROCESSOR], location: { name: "Processing Inc.", country: "UK" } };
export const Percy: UserInfo = { username: "Processor Percy", roles: [UserRole.PROCESSOR], location: { name: "The Factory", country: "UK" } };
export const Tim: UserInfo = { username: "Transporter Tim", roles: [UserRole.TRANSPORTER] };
export const Trish: UserInfo = { username: "Transporter Trish", roles: [UserRole.TRANSPORTER] };
export const Barry: UserInfo = { username: "Buyer Barry", roles: [UserRole.BUYER] };
export const Bonzo: UserInfo = { username: "Buyer Bonzo", roles: [UserRole.BUYER] };

export const Users: UserInfo[] = [
  Alice,
  Alex,
  Fred,
  Felicity,
  Polly,
  Percy,
  Tim,
  Trish,
  Barry,
  Bonzo
];

export function getUserInfo(username: string) {
  return Users.find(user => user.username === username);
}
