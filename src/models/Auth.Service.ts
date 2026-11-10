// AUTH SERVICE: JWT token yaratish va tekshirish. Faqat SPA (React) tomoni uchun, admin esa session ishlatadi.
import { AUTH_TIMER } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { Member } from "../libs/types/member";
import jwt from "jsonwebtoken";

class AuthService {
  // .env dagi SECRET_TOKEN: tokenni imzolash va tekshirish uchun maxfiy kalit.
  private readonly secretToken;
  constructor() {
    this.secretToken = process.env.SECRET_TOKEN as string;
  }

  // login/signup dan keyin chaqiriladi: member ma'lumotini (payload) token ichiga joylab,
  // AUTH_TIMER (24h) muddatli JWT yaratadi. jwt.sign callback ishlatgani uchun Promise ga o'ralgan.
  public async createToken(payload: Member) {
    return new Promise((resolve, reject) => {
      const duration = `${AUTH_TIMER}h`;
      jwt.sign(
        payload,
        process.env.SECRET_TOKEN as string,
        {
          expiresIn: duration,
        },
        (err, token) => {
          // Xato bo'lsa 401 TOKEN_CREATION_FAILED, aks holda tayyor token qaytadi.
          if (err)
            reject(
              new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAILED),
            );
          else resolve(token as string);
        },
      );
    });
  }

  // verifyAuth / retrieveAuth middleware'lari chaqiradi: tokenni tekshirib ichidagi member ma'lumotini qaytaradi.
  // Token soxta yoki muddati o'tgan bo'lsa jwt.verify xato tashlaydi.
  public async checkAuth(token: string): Promise<Member> {
    const result: Member = (await jwt.verify(
      token,
      this.secretToken,
    )) as Member;
    console.log(`--------[AUTH] memberNck: ${result.memberNick} ----`);
    return result;
  }
}

export default AuthService;
