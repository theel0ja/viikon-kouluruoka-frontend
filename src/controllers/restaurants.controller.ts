import axios from "axios";
import { NextFunction, Request, Response, Router } from "express";
import { sendXFrameOptions } from "../components/sendXFrameOptions";

const router: Router = Router();

/**
 * List all restaurants.
 */
router.get("/", sendXFrameOptions, (req: Request, res: Response, next: NextFunction) => {
  Promise.all([
    axios.get(process.env.API_BACKEND + "/restaurants")
      .then((response) => response.data)
      .catch(next),
    axios.get(process.env.API_BACKEND + "/categories")
      .then((response) => response.data)
      .catch(next),
  ])
  .then(([restaurantsData, categoriesData]) => {
    res.render("restaurants/list.twig", {
      title: "List of restaurants",
      description: "List of restaurants.",

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
router.get("/:id", sendXFrameOptions, (req: Request, res: Response, next: NextFunction) => {
  Promise.all([
    axios.get(process.env.API_BACKEND + "/restaurants")
      .then((response) => response.data)
      .catch(next),
    axios.get(process.env.API_BACKEND + "/categories")
      .then((response) => response.data)
      .catch(next),
  ])
    .then(([restaurantsData, categoriesData]) => {
      // TODO: Use Interfaces from backend
      const restaurantData = restaurantsData.find((x) => x.id === req.params.id);
      const categoryName = categoriesData.find((x) => x.id === restaurantData.category).name;

      const menuDataPromises = [];

      restaurantData.menus.forEach((menu) => {
        menuDataPromises.push(
          axios.get(`${process.env.API_BACKEND}/menus/${menu.id}`)
            .then((response) => response.data)
            .catch(next),
        );
      });

      Promise.all(menuDataPromises)
        .then((menus) => {
          res.render("restaurants/show.twig", {
            title: restaurantData.name,
            restaurant: restaurantData,
            categoryName,
            categories: categoriesData,
            menus,
            restaurantJson: JSON.stringify(restaurantData),
            categoriesJson: JSON.stringify(categoriesData),
            menusJson: JSON.stringify(menus, null, 2),

            enable_oembed: true,
          });
        })
        .catch(next);
    })
    .catch(next);
});

/**
 * Show information of a restaurant.
 * Embed
 */
router.get("/:id/embed", (req: Request, res: Response, next: NextFunction) => {
  Promise.all([
    axios.get(process.env.API_BACKEND + "/restaurants")
      .then((response) => response.data)
      .catch(next),
    axios.get(process.env.API_BACKEND + "/categories")
      .then((response) => response.data)
      .catch(next),
  ])
    .then(([restaurantsData, categoriesData]) => {
      // TODO: Use Interfaces from backend

      const restaurantData = restaurantsData.find((x) => x.id === req.params.id);
      const categoryName = categoriesData.find((x) => x.id === restaurantData.category).name;

      const menuDataPromises = [];

      restaurantData.menus.forEach((menu) => {
        menuDataPromises.push(
          axios.get(`${process.env.API_BACKEND}/menus/${menu.id}`)
            .then((response) => response.data)
            .catch(next),
        );
      });

      Promise.all(menuDataPromises)
        .then((menus) => {
          res.render("embed/restaurants/show.twig", {
            title: restaurantData.name,
            restaurant: restaurantData,
            categoryName,
            categories: categoriesData,
            menus,
            restaurantJson: JSON.stringify(restaurantData),
            categoriesJson: JSON.stringify(categoriesData),
            menusJson: JSON.stringify(menus, null, 2),
          });
        })
        .catch(next);
    })
    .catch(next);
});

export const RestaurantController: Router = router;
