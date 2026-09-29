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

restaurantController.processLogin = (req: Request, res: Response) => {
  try {
    console.log("Process Login");
    res.send(" Done");
  } catch (err) {
    console.log("Error processing login ", err);
  }
};

restaurantController.processSignup = (req: Request, res: Response) => {
  try {
    console.log("Process Sign Up");
    res.send(" Done");
  } catch (err) {
    console.log("Error processing sign up ", err);
  }
};

export default restaurantController;
