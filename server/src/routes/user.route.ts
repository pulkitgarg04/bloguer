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
        avatar: `https://avatar.iran.liara.run/username?username=${body.name}`,
        JoinedDate: new Date(),
      },
    });

    const jwt = await generateJWT(user.id, c.env.JWT_SECRET);
    c.status(201);
    return c.json({ jwt, user });
  } catch (e) {
    console.log(e);
    c.status(411);
    return c.json({ message: "Server Error" });
  }
});

userRouter.post("/login", async (c) => {
  const body = await c.req.json();
  // console.log(body);
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
    // console.log(jwt);
    // console.log(user);
    c.status(200);
    return c.json({ jwt, user });
  } catch (e) {
    console.log(e);
    c.status(411);
    return c.json({ message: "Server error" });
  }
});

userRouter.get("/checkAuth", authMiddleware, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const userId = c.get("userId");

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

userRouter.get("/profile/:username", async (c) => {
  const { username } = c.req.param();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  
  try {
    // console.log("Fetching profile for username:", username);
    const user = await prisma.user.findUnique({
      where: {
        username: username.toLowerCase()
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatar: true,
        JoinedDate: true,
        location: true,
        bio: true,
        followers: true
      },
    });
    
    // console.log(user);

    if (!user) {
      c.status(404);
      return c.json({ message: "User not found." });
    }
    
    // console.log(user.id);
    const posts = await prisma.post.findMany({
      where: {
        authorId: user.id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        featuredImage: true,
        readTime: true,
        category: true,
        views: true,
        Date: true,
      },
      orderBy: {
        Date: "desc",
      },
    });

    c.status(200);
    return c.json({user, posts});
  } catch (e) {
    console.error(e);
    c.status(500);
    return c.json({ message: "Server error while fetching posts." });
  }
});

userRouter.get("/followersFollowingCount/:username", async (c) => {
  const { username } = c.req.param();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username.toLowerCase(),
      },
      include: {
        followers: true,
        following: true,
      },
    });

    if (!user) {
      c.status(404);
      return c.json({ message: "User not found." });
    }

    const followersCount = user.followers.length;
    const followingCount = user.following.length;
    const followers = user.followers;
    // console.log("Followers Count: ", followersCount);
    // console.log("Following Count: ", followingCount);

    c.status(200);
    return c.json({ followersCount, followingCount });
  } catch (e) {
    console.error(e);
    c.status(500);
    return c.json({ message: "Error fetching followers and following count." });
  }
});

userRouter.post("/followOrUnfollow", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const { usernameToFollow, action } = await c.req.json();

  if (!userId || !usernameToFollow || !action) {
    return c.json({ message: "Missing required parameters" }, 400);
  }

  // console.log("usernameToFollow: ", usernameToFollow);
  // console.log("action: ", action);
  // console.log("userId: ", userId);

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const userToFollow = await prisma.user.findUnique({
      where: { username: usernameToFollow.toLowerCase() }
    });

    if (!userToFollow) {
      return c.json({ message: "User to follow not found" }, 404);
    }

    if (action === "follow") {
      await prisma.user.update({
        where: { id: userId },
        data: {
          following: {
            connect: { id: userToFollow.id },
          },
        },
      });

      await prisma.user.update({
        where: { id: userToFollow.id },
        data: {
          followers: {
            connect: { id: userId },
          },
        },
      });
    } else if (action === "unfollow") {
      await prisma.user.update({
        where: { id: userId },
        data: {
          following: {
            disconnect: { id: userToFollow.id },
          },
        },
      });

      await prisma.user.update({
        where: { id: userToFollow.id },
        data: {
          followers: {
            disconnect: { id: userId },
          },
        },
      });
    } else {
      return c.json({ message: "Invalid action" }, 400);
    }

    return c.json({ message: `Successfully ${action}ed` }, 200);
  } catch (error) {
    console.error("Error in follow/unfollow", error);
    return c.json({ message: "Server error" }, 500);
  }
});