import axios from "axios";
import { NextFunction, Request, Response, Router } from "express";

const router: Router = Router();
/**
 * List all restaurants.
 */
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  axios.get("http://localhost:3001/restaurants")
  .then((response) => response.data)
  .then((data) => {
    res.render("restaurants/list.twig", {
      title: "List of restaurants",
      restaurants: data,
      restaurantsJson: JSON.stringify(data),
    });
  });
});

export const RestaurantController: Router = router;
