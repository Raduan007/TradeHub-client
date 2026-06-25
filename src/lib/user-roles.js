export const USER_ROLES = {
  BUYER: "buyer",
  SELLER: "seller",
  ADMIN: "admin",
};

export const ALLOWED_SIGNUP_ROLES = [
  USER_ROLES.BUYER,
  USER_ROLES.SELLER,
];

export const DEFAULT_USER_ROLE = USER_ROLES.BUYER;
export const DEFAULT_USER_STATUS = "active";

export function getUserRole(user) {
  if (!user?.role) {
    return DEFAULT_USER_ROLE;
  }

  return user.role;
}

export function isAllowedSignupRole(role) {
  return ALLOWED_SIGNUP_ROLES.includes(role);
}
