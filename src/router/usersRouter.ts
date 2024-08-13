import { Hono } from "hono";
import { UsersController } from "../controllers/usersController";

const usersRouter = new Hono();
const userController = new UsersController();

usersRouter.get("/", (c) => userController.getAll(c));
usersRouter.get("/:id", (c) => userController.getUserById(c));
usersRouter.post("/", (c) => userController.createUser(c));
usersRouter.put("/:id", (c) => userController.updateUser(c));
usersRouter.delete("/:id", (c) => userController.deleteUser(c));

export default usersRouter;
