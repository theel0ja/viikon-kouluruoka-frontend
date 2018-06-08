import axios from "axios";
import { NextFunction, Request, Response, Router } from "express";
import { sendXFrameOptions } from "../components/sendXFrameOptions";

const router: Router = Router();

/**
 * Index
 */
router.get("/", sendXFrameOptions, (req: Request, res: Response, next: NextFunction) => {
  res.render("home/index.twig");
});

export const HomeController: Router = router;
