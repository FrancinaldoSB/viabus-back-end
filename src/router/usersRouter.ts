import { Hono } from "hono";
import { UsersController } from "../controllers/usersController";
import { jwtAuth } from "../middlewares/jwtAuth";

const usersRouter = new Hono();
const userController = new UsersController();

usersRouter.use("*", jwtAuth); // jwtAuth em todas as rotas

usersRouter.get("/", (c) => userController.getAll(c));
usersRouter.get("/:id", (c) => userController.getUserById(c));
usersRouter.post("/", (c) => userController.createUser(c));
usersRouter.put("/:id", (c) => userController.updateUser(c));
usersRouter.delete("/:id", (c) => userController.deleteUser(c));

export default usersRouter;
