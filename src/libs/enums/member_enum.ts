// Member turi: oddiy foydalanuvchi (USER) yoki restoran egasi/admin (RESTAURANT).
export enum MemberType {
  USER = `USER`,
  RESTAURANT = `RESTAURANT`,
}

// Member holati: ACTIVE = faol, BLOCK = bloklangan (login qila olmaydi), DELETE = o'chirilgan.
export enum MemberStatus {
  ACTIVE = "ACTIVE",
  BLOCK = "BLOCK",
  DELETE = "DELETE",
}
