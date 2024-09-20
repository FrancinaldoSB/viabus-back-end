import { Hono } from "hono";
import { StopsController } from "../controllers/stopsController";
import { authorizeRole } from "../middlewares/authorizeRole";
import { RoleEnum } from "../interfaces/enums/roleEnum";
import { authenticatedUser } from "../middlewares/authenticatedUser";

const stopsRouter = new Hono();
const stopsController = new StopsController();

stopsRouter.use("*", authenticatedUser);

stopsRouter.post("/", authorizeRole([RoleEnum.ADMIN]), (c) =>
  stopsController.createStop(c)
);
stopsRouter.get("/", authorizeRole([RoleEnum.ADMIN]), (c) =>
  stopsController.getStops(c)
);

export default stopsRouter;
