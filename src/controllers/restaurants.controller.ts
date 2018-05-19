import axios from "axios";
import { NextFunction, Request, Response, Router } from "express";

const router: Router = Router();

/**
 * List all restaurants.
 */
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  axios.get(process.env.API_BACKEND + "/restaurants")
  .then((response) => response.data)
  .then((data) => {
    res.render("restaurants/list.twig", {
      title: "List of restaurants",
      restaurants: data,
      dataJson: JSON.stringify(data),
    });
  })
  .catch(next);
});

/**
 * Show information of a restaurant.
 */
router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  axios.get(process.env.API_BACKEND + "/restaurants")
  .then((response) => response.data)
  .then((data) => data.find((x) => x.id === req.params.id))
  .then((data) => {
    res.render("restaurants/show.twig", {
      title: data.name,
      restaurant: data,
      dataJson: JSON.stringify(data),
    });
  })
  .catch(next);
});

export const RestaurantController: Router = router;
