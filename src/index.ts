import { Hono, type Context } from "hono";
import { etag } from "hono/etag";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import usersRouter from "./router/usersRouter";

import { csrf } from "hono/csrf";
import { secureHeaders } from "hono/secure-headers";

const app = new Hono();

app.use("*", etag(), logger());
app.use("*", prettyJSON());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(csrf());
app.use(secureHeaders());

app.get("/", (c) => {
  return c.json({ message: "ViaBus API" });
});

app.route("/api/users", usersRouter);

export default {
  port: Bun.env.PORT || 3000,
  fetch: app.fetch,
};
