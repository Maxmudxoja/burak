// RESTAURANT CONTROLLER (Admin / BSSR): EJS sahifalarni render qiladi, session orqali admin auth'ni boshqaradi.
// Xato bo'lsa ko'pincha JSON emas, <script>alert(...)</script> yoki redirect qaytaradi.
import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member_enum";
import Errors, { HttpCode, Message } from "../libs/Errors";

const memberService = new MemberService();
const restaurantController: T = {};

// GET /admin -> "home" sahifasini render qiladi.
restaurantController.goHome = (req: Request, res: Response) => {
  try {
    console.log("Go Home");
    res.render(`home`);
  } catch (err) {
    console.log("Error go home ", err);
    res.redirect(`/admin`);
  }
};

// GET /admin/signup -> "signup" sahifasini render qiladi.
restaurantController.getSignup = (req: Request, res: Response) => {
  try {
    console.log("Get Sign Up");
    res.render(`signup`);
  } catch (err) {
    console.log("Error get signup ", err);
    res.redirect(`/admin`);
  }
};

// GET /admin/login -> "login" sahifasini render qiladi.
restaurantController.getLogin = (req: Request, res: Response) => {
  try {
    console.log("Get Login");
    res.render(`login`);
  } catch (err) {
    console.log("Error get login ", err);
    res.redirect(`/admin`);
  }
};

// POST /admin/signup -> rasm majburiy (req.file bo'lmasa xato), memberType ni RESTAURANT qilib yaratadi,
// natijani req.session.member ga yozadi, session saqlangach /admin/product/all ga redirect qiladi.
restaurantController.processSignup = async (
  req: AdminRequest,
  res: Response,
) => {
  try {
    console.log("Process Sign Up");
    console.log(req.body);
    const file = req.file;
    if (!file)
      throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);

    const newMember: MemberInput = req.body;
    newMember.memberImage = file?.path.replace(/\\/g, "/");
    newMember.memberType = MemberType.RESTAURANT;
    const result = await memberService.processSignup(newMember);

    req.session.member = result;
    req.session.save(function () {
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("Error processing sign up ", err);
    const message =
      err instanceof Error ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      ` <script> alert("${message}"); window.location.replace("/admin/signup")</script>`,
    );
  }
};

// POST /admin/login -> nick/parolni tekshiradi, req.session.member ga yozadi, saqlangach /admin/product/all ga redirect qiladi.
restaurantController.processLogin = async (
  req: AdminRequest,
  res: Response,
) => {
  try {
    console.log("Process Login");

    console.log("Request Body: ", req.body);
    const input: LoginInput = req.body;
    const result = await memberService.processLogin(input);

    req.session.member = result;
    req.session.save(function () {
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("Error processing login ", err);
    const message =
      err instanceof Error ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      ` <script> alert("${message}"); window.location.replace("/admin/login")</script>`,
    );
  }
};

// GET /admin/logout -> session.destroy bilan sessionni o'chiradi va /admin ga qaytaradi.
restaurantController.logout = async (req: AdminRequest, res: Response) => {
  try {
    console.log("Process Logout");

    req.session.destroy(function () {
      res.redirect(`/admin`);
    });
  } catch (err) {
    console.log("Error processing logout ", err);
    res.redirect(`/admin`);
  }
};

// GET /admin/user/all -> barcha USER larni olib "users" sahifasiga { users } qilib beradi.
restaurantController.getUsers = async (req: Request, res: Response) => {
  try {
    console.log("Get Users");
    const result = await memberService.getUsers();

    console.log("result: ", result);

    res.render("users", { users: result });
  } catch (err) {
    console.log("Error Get Users ", err);
    res.redirect(`/admin/login`);
  }
};

// POST /admin/user/edit -> req.body dagi _id bo'yicha userni yangilaydi va JSON { data } qaytaradi (sahifadagi JS axios bilan chaqiradi).
restaurantController.updateChosenUser = async (req: Request, res: Response) => {
  try {
    console.log("Update Chosen Users");
    const result = await memberService.updateChosenUser(req.body);
    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error updateChosenUser ", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// GET /admin/check-me -> session'da member bormi tekshirib, nickni yoki NOT_AUTHENTICATED ni alert qiladi (test uchun).
restaurantController.checkAuthsession = async (
  req: AdminRequest,
  res: Response,
) => {
  try {
    console.log("Check Auth Session");

    if (req.session?.member)
      res.send(` <script> alert("${req.session.member.memberNick}")</script>`);
    else res.send(` <script> alert("${Message.NOT_AUTHENTICATED}")</script>`);
  } catch (err) {
    console.log("Error processing login ", err);
    res.send(err);
  }
};

// MIDDLEWARE: session'dagi member RESTAURANT turida bo'lsa req.member ga yozib next() qiladi,
// aks holda alert chiqarib /admin/login ga yuboradi (keyingi handler ishlamaydi).
restaurantController.verifyRestaurant = (
  req: AdminRequest,
  res: Response,
  next: NextFunction,
) => {
  console.log("Verify Restaurant");

  if (req.session?.member?.memberType === MemberType.RESTAURANT) {
    req.member = req.session.member;
    next();
  } else {
    const message = Message.NOT_AUTHENTICATED;
    res.send(
      ` <script> alert("${message}"); window.location.replace('/admin/login'); </script>`,
    );
  }
};

export default restaurantController;
