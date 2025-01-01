import { Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import {
  createBlogInput,
  updateBlogInput,
} from "@pulkitgarg04/bloguer-validations";
import authMiddleware from "../middlewares/authMiddleware";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };

  Variables: {
    userId: string;
  };
}>();

blogRouter.post("/post", authMiddleware, async (c) => {
  try {
    const userId = c.get("userId");
    if (!userId) {
      c.status(401);
      return c.json({ message: "Unauthorized. No user ID found." });
    }

    const body = await c.req.json();
    console.log(body);

    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
        featuredImage: `/thumbnails/${body.category}.png`,
        category: body.category,
        Date: new Date(),
      },
    });

    c.status(200);
    return c.json({
      id: post.id,
    });
  } catch (err) {
    console.log(err);
  }
});

blogRouter.put("/post", authMiddleware, async (c) => {
  const body = await c.req.json();

  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs are Incorrect",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const post = await prisma.post.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return c.json({
    messaage: "Updated the blog",
    id: post.id,
  });
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            name: true,
            username: true,
            avatar: true,
          },
        },
        featuredImage: true,
        category: true,
        Date: true
      },
      orderBy: {
        Date: "desc",
      },
    });
    return c.json(posts);
  } catch (error) {
    return c.json({
      message: "Something went wrong",
      error: error,
    });
  }
});

blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const post = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            name: true,
            username: true,
            avatar: true,
          },
        },
        featuredImage: true,
        category: true,
        Date: true,
        views: true
      },
    });

    const similarPosts = await prisma.post.findMany({
      where: {
        category: post?.category,
        id: {
          not: post?.id,
        },
        published: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            name: true,
            username: true,
            avatar: true,
          },
        },
        featuredImage: true,
        category: true,
        Date: true,
      },
      orderBy: {
        Date: "desc",
      },
    });

    return c.json({ post, similarPosts });
  } catch (error) {
    c.status(411);
    return c.json({
      message: "An error occurred while fetching the blog post",
    });
  }
});
