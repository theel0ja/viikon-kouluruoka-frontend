import axios from "axios";
import { NextFunction, Request, Response, Router } from "express";

const router: Router = Router();

/**
 * Index
 */
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.render("home/index.twig");
});

export const HomeController: Router = router;
