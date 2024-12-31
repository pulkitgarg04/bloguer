import { Hono } from "hono";
import { sign, decode } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import bcrypt from "bcryptjs";
import { signinInput, signupInput } from "@pulkitgarg04/bloguer-validations";
import authMiddleware from "../middlewares/authMiddleware";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

const generateJWT = (id: string, jwtSecret: string) => {
  return sign(
    {
      id
    },
    jwtSecret
  );
};

userRouter.post("/signup", async (c) => {
  const body = await c.req.json();

  const { success, error } = signupInput.safeParse(body);
  if (!success) {
    c.status(403);
    return c.json({
      message: error.message,
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      c.status(409);
      return c.json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(body.password, 12);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        username: body.username,
        email: body.email,
        password: hashedPassword,
        avatar: `https://avatar.iran.liara.run/username?username=${body.name}`
      },
    });

    const jwt = await generateJWT(user.id, c.env.JWT_SECRET);
    c.status(201);
    return c.json({ jwt });
  } catch (e) {
    console.log(e);
    c.status(411);

    return c.json({ message: "Server Error" });
  }
});

userRouter.post("/login", async (c) => {
  const body = await c.req.json();
  const { success, error } = signinInput.safeParse(body);

  if (!success) {
    c.status(411);
    return c.json({
      message: error.message,
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      c.status(403);
      return c.json({ message: "Incorrect credentials" });
    }

    const jwt = await generateJWT(user.id, c.env.JWT_SECRET);
    c.status(200);
    return c.json({ jwt });
  } catch (e) {
    console.log(e);
    c.status(411);
    return c.json({ message: "Server error" });
  }
});

userRouter.get("/getUser", authMiddleware, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const userId = c.get("userId");
    console.log(userId);

    if (!userId) {
      c.status(401);
      return c.json({ message: "Unauthorized. No user ID found." });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatar: true,
      },
    });

    if (!user) {
      c.status(404);
      return c.json({ message: "User not found." });
    }

    c.status(200);
    return c.json(user);
  } catch (e) {
    console.error(e);
    c.status(500);
    return c.json({ message: "Server error." });
  }
});