import axios from "axios";
import { NextFunction, Request, Response, Router } from "express";
import { sendXFrameOptions } from "../components/sendXFrameOptions";

const router: Router = Router();

/**
 * List all restaurants.
 */
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  const queryUrl = req.query.url;

  if (!queryUrl || queryUrl === "") {
    next();

    return;
  }

  // TODO: Enable oEmbed only on "Show restaurant" route

  let sourceUrl = queryUrl;
  sourceUrl = sourceUrl.split("#")[0];
  sourceUrl = sourceUrl.split("?")[0];
  // Remove last forward slash
  sourceUrl = sourceUrl.replace(/\/+$/, ""); // https://stackoverflow.com/a/6680825#comment11853012_6680877

  const cleanedUrl = sourceUrl + "/embed" + "?utm_source=oembed";

  const width = 640;
  const height = 480;

  res.json({
    success: true,
    type: "rich",
    version: "1.0",
    provider_name: process.env.APP_NAME,
    provider_url: process.env.ROOT_URL,
    // title: "TODO: Get title",
    height,
    width,
    html:
    `<div class="kouluruoka-menu" data-src="${sourceUrl}">\
      <iframe frameborder="0" src="${cleanedUrl}" \
      width="${width}" height="${height}"></iframe>\
    </div>`.replace(/  /g, ""), // remove whitespace
  });
});

export const OEmbedController: Router = router;
