import { Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member_service";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member_enum";
import { Message } from "../libs/Errors";

const memberService = new MemberService();
const restaurantController: T = {};

restaurantController.goHome = (req: Request, res: Response) => {
  try {
    console.log("Go Home");
    res.render(`home`);
  } catch (err) {
    console.log("Error go home ", err);
  }
};

restaurantController.getSignup = (req: Request, res: Response) => {
  try {
    console.log("Get Sign Up");
    res.render(`signup`);
  } catch (err) {
    console.log("Error go home ", err);
  }
};

restaurantController.getLogin = (req: Request, res: Response) => {
  try {
    console.log("Get Login");
    res.render(`login`);
  } catch (err) {
    console.log("Error go home ", err);
  }
};

restaurantController.processSignup = async (
  req: AdminRequest,
  res: Response,
) => {
  try {
    console.log("Process Sign Up");

    const newMember: MemberInput = req.body;
    newMember.memberType = MemberType.RESTAURANT;
    const result = await memberService.processSignup(newMember);

    req.session.member = result;
    req.session.save(function () {
      res.send(result);
    });
  } catch (err) {
    res.send(err);
    console.log("Error processing sign up ", err);
  }
};

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
      res.send(result);
    });
  } catch (err) {
    console.log("Error processing login ", err);
    res.send(err);
  }
};

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
export default restaurantController;
