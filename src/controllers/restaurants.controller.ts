import axios from "axios";
import { NextFunction, Request, Response, Router } from "express";

const router: Router = Router();
/**
 * List all restaurants.
 */
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.render("restaurants/list.twig", {
    title: "List of restaurants",
  });
});

export const RestaurantController: Router = router;
