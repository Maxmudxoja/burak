import { Request, Response } from "express";
import { T } from "../libs/types/common";

const restaurantController: T = {};

restaurantController.goHome = (req: Request, res: Response) => {
  try {
    res.send(" Home Page");
  } catch (err) {
    console.log("Error go home ", err);
  }
};

restaurantController.getLogin = (req: Request, res: Response) => {
  try {
    res.send(" Login Page");
  } catch (err) {
    console.log("Error go home ", err);
  }
};

restaurantController.getSignup = (req: Request, res: Response) => {
  try {
    res.send(" Sign Up Page");
  } catch (err) {
    console.log("Error go home ", err);
  }
};

export default restaurantController;
