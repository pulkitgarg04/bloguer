import { Hono } from "hono";
import { cors } from "hono/cors";

import { blogRouter } from "./routes/blog.route";
import { userRouter } from "./routes/user.route";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.get('/', (c) => {
  return c.text("Hi! Welcome to Bloguer.");
});

app.use("/*", cors());
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

export default app;