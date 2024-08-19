import { Hono } from "hono";
import { UsersController } from "../controllers/usersController";
import { jwtAuth } from "../middlewares/jwtAuth";
import { authenticatedUser } from "../middlewares/authenticatedUser";
import { authorizeRole } from "../middlewares/authorizeRole";
import { RoleEnum } from "../models/enums/roleEnum";

const usersRouter = new Hono();
const userController = new UsersController();

usersRouter.use("*", authenticatedUser);

// buscar todos os usuarios
usersRouter.get("/", authorizeRole([RoleEnum.ADMIN, RoleEnum.EMPLOYEE]), (c) =>
  userController.fetchUsers(c)
);

// buscar usuario por id
usersRouter.get(
  "/:id",
  authorizeRole([RoleEnum.ADMIN, RoleEnum.EMPLOYEE]),
  (c) => userController.fetchUserById(c)
);

// criar usuario
usersRouter.post("/", (c) => userController.createUser(c));

// atualizar usuario
usersRouter.put("/:id", authorizeRole([RoleEnum.ADMIN, RoleEnum.USER]), (c) =>
  userController.updateUser(c)
);

// deletar usuario
usersRouter.delete(
  "/:id",
  authorizeRole([RoleEnum.ADMIN, RoleEnum.USER]),
  (c) => userController.deleteUser(c)
);

export default usersRouter;
