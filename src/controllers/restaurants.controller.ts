import axios from "axios";
import { NextFunction, Request, Response, Router } from "express";

const router: Router = Router();

/**
 * List all restaurants.
 */
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  Promise.all([
    axios.get(process.env.API_BACKEND + "/restaurants"),
    axios.get(process.env.API_BACKEND + "/categories"),
  ])
  .then(([restaurantsResponse, categoriesResponse]) => {
    const restaurantsData = restaurantsResponse.data;
    const categoriesData = categoriesResponse.data;

    res.render("restaurants/list.twig", {
      title: "List of restaurants",
      restaurants: restaurantsData,
      categories: categoriesData,
      restaurantsJson: JSON.stringify(restaurantsData),
      categoriesJson: JSON.stringify(categoriesData),
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
