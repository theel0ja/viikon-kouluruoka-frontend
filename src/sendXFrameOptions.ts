import { NextFunction, Request, Response } from "express";
import lusca from "lusca";

function sendXFrameOptions(req: Request, res: Response, next: NextFunction) {
  lusca.xframe("DENY")(req, res, next);
}

export { sendXFrameOptions };
