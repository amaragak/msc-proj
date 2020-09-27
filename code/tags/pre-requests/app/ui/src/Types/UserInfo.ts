export enum UserRole {
  ADMIN,
  PRODUCER,
  PROCESSOR,
  SELLER,
  BUYER,
  STORAGE,
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

export const Users: UserInfo[] = [
  { username: "Alice", roles: [UserRole.ADMIN] },
  { username: "producer", roles: [UserRole.PRODUCER] },
  { username: "processor", roles: [UserRole.PROCESSOR] },
  { username: "seller", roles: [UserRole.SELLER] },
  { username: "buyer", roles: [UserRole.BUYER] },
  { username: "storage", roles: [UserRole.STORAGE] },
  { username: "transporter", roles: [UserRole.TRANSPORTER] }
];

export function getUserInfo(username: string) {
  return Users.find(user => user.username === username);
}
