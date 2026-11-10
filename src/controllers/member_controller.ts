// MEMBER CONTROLLER (SPA / React): HTTP qatlami. Vazifasi: req dan ma'lumotni olish -> service'ga berish -> javobni JSON qilib qaytarish.
// Har bir funksiya try/catch: Errors bo'lsa o'sha code bilan, boshqa xato bo'lsa standart 500 bilan javob qaytaradi.
import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import {
  ExtendedRequest,
  LoginInput,
  Member,
  MemberInput,
  MemberUpdateInput,
} from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import AuthService from "../models/Auth.Service";
import { AUTH_TIMER } from "../libs/config";

const memberService = new MemberService();
// Barcha handler'lar shu objectga metod sifatida qo'shiladi va router'da memberController.xxx ko'rinishida ishlatiladi.
const memberController: T = {};
const authService = new AuthService();

// GET /member/restaurant -> restoran ma'lumotini qaytaradi.
memberController.getRestaurant = async (req: Request, res: Response) => {
  try {
    console.log("getRestaurant");
    const result = await memberService.getRestaurant();
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error getRestaurant ", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// POST /member/signup -> req.body bilan user yaratadi, JWT yaratadi, uni "accessToken" cookie'ga yozadi (24 soat),
// 201 bilan { member, accessToken } qaytaradi.
memberController.signup = async (req: Request, res: Response) => {
  try {
    console.log(" Sign Up");

    const input: MemberInput = req.body,
      result: Member = await memberService.signup(input);
    const token = await authService.createToken(result);

    res.cookie("accessToken", token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
    });

    res.status(HttpCode.CREATED).json({ member: result, accessToken: token });
  } catch (err) {
    console.log("Error Sign up ", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// POST /member/login -> nick/parolni tekshiradi, token yaratib cookie'ga yozadi, { member, accessToken } qaytaradi.
memberController.login = async (req: Request, res: Response) => {
  try {
    console.log("Login");
    const input: LoginInput = req.body,
      result = await memberService.login(input),
      token = await authService.createToken(result);

    res.cookie("accessToken", token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
    });

    res.status(HttpCode.OK).json({ member: result, accessToken: token });
  } catch (err) {
    console.log("Error  Login ", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// POST /member/logout -> accessToken cookie'ni bo'sh qiymat va maxAge: 0 bilan o'chiradi, { logout: true } qaytaradi.
memberController.logout = (req: ExtendedRequest, res: Response) => {
  console.log("Log out");
  res.cookie("accessToken", null, { maxAge: 0, httpOnly: true });
  res.status(HttpCode.OK).json({ logout: true });
  try {
  } catch (err) {
    console.log("Error  verifyAuth ", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// GET /member/detail -> verifyAuth qo'ygan req.member bo'yicha profil ma'lumotini qaytaradi.
memberController.getMemberDetail = async (
  req: ExtendedRequest,
  res: Response,
) => {
  try {
    console.log("getMemberDetail");
    const result = await memberService.getMemberDetail(req.member);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("getMemberDetail ", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// POST /member/update -> req.body + (multer'dan kelgan bo'lsa) req.file rasm yo'li bilan profilni yangilaydi.
memberController.updateMember = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("updateMember");
    const input: MemberUpdateInput = req.body;
    if (req.file) input.memberImage = req.file.path.replace(/\\/, "/");

    const result = await memberService.updateMember(req.member, input);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("updateMember ", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// GET /member/top-users -> eng ko'p ballga ega 4 userni qaytaradi.
memberController.getTopUsers = async (req: Request, res: Response) => {
  try {
    console.log("getTopUsers");
    const result = await memberService.getTopUsers();
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("getTopUsers ", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// MIDDLEWARE (login MAJBURIY): cookie'dan accessToken ni oladi, authService.checkAuth bilan tekshiradi,
// to'g'ri bo'lsa req.member ga yozib next() bilan keyingi handler'ga o'tkazadi.
// Token yo'q yoki noto'g'ri bo'lsa 401 NOT_AUTHENTICATED qaytaradi va keyingi handler ishlamaydi.
memberController.verifyAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies["accessToken"];
    if (token) {
      try {
        req.member = await authService.checkAuth(token);
      } catch {
        throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
      }
    }
    if (!req.member)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);

    next();
  } catch (err) {
    console.log("Error, verifyAuth:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// MIDDLEWARE (login IXTIYORIY): token bo'lsa va to'g'ri bo'lsa req.member ga yozadi,
// bo'lmasa yoki xato bo'lsa ham to'xtatmaydi, har doim next() chaqiradi.
memberController.retrieveAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies["accessToken"];
    if (token) req.member = await authService.checkAuth(token);

    next();
  } catch (err) {
    console.log("Error  verifyAuth ", err);
    next();
  }
};

export default memberController;
