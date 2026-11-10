// Ovqat porsiyasi o'lchami.
export enum ProductSize {
  SMALL = "SMALL",
  NORMAL = "NORMAL",
  LARGE = "LARGE",
  SET = "SET",
}

// Ichimliklar hajmi (litrda).
export enum ProductVolume {
  HALF = 0.5,
  ONE = 1,
  ONE_POINT_TWO = 1.2,
  ONE_POINT_FIVE = 1.5,
  TWO = 2,
}

// Mahsulot holati: PAUSE = sotuvda emas (default), PROCESS = sotuvda (SPA'da faqat shular ko'rinadi), DELETE = o'chirilgan.
export enum ProductStatus {
  PAUSE = "PAUSE",
  PROCESS = "PROCESS",
  DELETE = "DELETE",
}

// Mahsulot kategoriyasi (menyu bo'limlari).
export enum ProductCollection {
  DISH = "DISH",
  SALAD = "SALAD",
  DESSERT = "DESSERT",
  DRINK = "DRINK",
  OTHER = "OTHER",
}
