import { Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member_service";
import { LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member_enum";

const restaurantController: T = {};

restaurantController.goHome = (req: Request, res: Response) => {
  try {
    console.log("Go Home");
    res.send(" Home Page");
  } catch (err) {
    console.log("Error go home ", err);
  }
};

restaurantController.getLogin = (req: Request, res: Response) => {
  try {
    console.log("Get Login");
    res.send(" Login Page");
  } catch (err) {
    console.log("Error go home ", err);
  }
};

restaurantController.getSignup = (req: Request, res: Response) => {
  try {
    console.log("Get Sign Up");
    res.send(" Sign Up Page");
  } catch (err) {
    console.log("Error go home ", err);
  }
};

restaurantController.processLogin = async (req: Request, res: Response) => {
  try {
    console.log("Process Login");
    console.log("Request Body: ", req.body);
    const input: LoginInput = req.body;

    const memberService = new MemberService();
    const result = await memberService.processLogin(input);

    res.send(result);
  } catch (err) {
    console.log("Error processing login ", err);
    res.send(err);
  }
};

restaurantController.processSignup = async (req: Request, res: Response) => {
  try {
    console.log("Process Sign Up");

    const newMember: MemberInput = req.body;
    newMember.memberType = MemberType.RESTAURANT;

    const memberService = new MemberService();
    const result = await memberService.processSignup(newMember);

    res.send(result);
  } catch (err) {
    res.send(err);
    console.log("Error processing sign up ", err);
  }
};

export default restaurantController;
