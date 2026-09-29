import { Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member_service";

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

export default restaurantController;
