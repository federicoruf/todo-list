import { Router } from "express";
import * as controller from "../controllers/duty.controller";

export const dutiesRouter = Router();

const wrap =
  (fn: (req: any, res: any, next: any) => Promise<any>) =>
  (req: any, res: any, next: any) => 
    fn(req, res, next).catch(next);

dutiesRouter.get("/", wrap(controller.listDuties));
dutiesRouter.post("/", wrap(controller.createDuty));
dutiesRouter.put("/:id", wrap(controller.updateDuty));
dutiesRouter.delete("/:id", wrap(controller.deleteDuty));

