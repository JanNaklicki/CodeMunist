export enum Roles {
  Admin = "admin",
  User = "user",
}

export const rolePermissions = {
  [Roles.Admin]: ["manageUsers", "scanTickets"],
  [Roles.User]: ["viewOwnProfile"],
};
