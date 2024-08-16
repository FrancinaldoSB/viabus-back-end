import { Hono } from "hono";
import { UsersController } from "../controllers/usersController";
import { jwtAuth } from "../middlewares/jwtAuth";
import { authorizeRole } from "../middlewares/authorizeRole";
import { RoleEnum } from "../enums/roleEnum";

const usersRouter = new Hono();
const userController = new UsersController();

usersRouter.use("*", jwtAuth);

usersRouter.get("/", authorizeRole([RoleEnum.ADMIN]), (c) =>
  userController.fetchUsers(c)
);
usersRouter.get("/:id", (c) => userController.fetchUserById(c));
usersRouter.post("/", (c) => userController.createUser(c));
usersRouter.put("/:id", (c) => userController.updateUser(c));
usersRouter.delete("/:id", (c) => userController.deleteUser(c));

export default usersRouter;
