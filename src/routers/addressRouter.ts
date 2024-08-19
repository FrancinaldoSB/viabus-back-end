// import { Hono } from "hono";
// import { UsersController } from "../controllers/usersController";
// import { jwtAuth } from "../middlewares/jwtAuth";
// import { authorizeRole } from "../middlewares/authorizeRole";
// import { RoleEnum } from "../enums/roleEnum";

import { Hono } from "hono";
import { AddressController } from "../controllers/addressController";
import { jwtAuth } from "../middlewares/jwtAuth";
import { authorizeRole } from "../middlewares/authorizeRole";
import { RoleEnum } from "../models/enums/roleEnum";

const addressRouter = new Hono();
const addressController = new AddressController();

addressRouter.use("*", jwtAuth);

// buscar endereco por id
addressRouter.get(
  "/:id",
  authorizeRole([RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.EMPLOYEE]),
  (c) => addressController.fetchAddressById(c)
);

// buscar endereco por id do usuario
addressRouter.get(
  "/user/:userId",
  authorizeRole([RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.EMPLOYEE]),
  (c) => addressController.fetchAddressByUserId(c)
);

// criar endereço
addressRouter.post("/", (c) => addressController.createAddress(c));

// atualizar endereco
addressRouter.put("/:id", authorizeRole([RoleEnum.ADMIN, RoleEnum.USER]), (c) =>
  addressController.updateAddress(c)
);

// deletar endereco
addressRouter.delete(
  "/:id",
  authorizeRole([RoleEnum.ADMIN, RoleEnum.USER]),
  (c) => addressController.deleteAddress(c)
);
