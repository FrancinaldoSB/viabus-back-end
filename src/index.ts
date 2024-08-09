import { Hono, Context } from "hono";
import customersRoute from "./routes/customers";
import phonesRoute from "./routes/phones";

const app = new Hono();

app.route("/api/customers", customersRoute);
app.route("/api/phones", phonesRoute);

export default app;
