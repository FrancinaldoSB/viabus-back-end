// import { Hono } from "hono";
// import { UsersController } from "../controllers/usersController";
// import { jwtAuth } from "../middlewares/jwtAuth";
// import { authorizeRole } from "../middlewares/authorizeRole";
// import { RoleEnum } from "../enums/roleEnum";

import { Hono } from "hono";
import { AuthController } from "../controllers/authController";

const authRouter = new Hono();
const authController = new AuthController();

authRouter.post("/check", (c) => authController.checkUser(c));
authRouter.post("/signup", (c) => authController.signUp(c));

export default authRouter;


