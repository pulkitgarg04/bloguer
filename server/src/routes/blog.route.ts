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
    // console.log(body);

    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    function calculateReadingTime(content: string) {
      const wordsPerMinute = 200;
      const words = content.split(/\s+/).length;
      const minutes = Math.ceil(words / wordsPerMinute);
      return `${minutes} Min Read`;
    }

    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
        featuredImage: `/thumbnails/${body.category}.png`,
        category: body.category,
        readTime: calculateReadingTime(body.content),
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

  const { page = "1", limit = "10", search = "" } = c.req.query();
  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    const totalCount = await prisma.post.count({
      where: {
        published: true,
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    const posts = await prisma.post.findMany({
      where: {
        published: true,
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
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
        readTime: true,
        featuredImage: true,
        category: true,
        Date: true,
      },
      skip,
      take: parseInt(limit),
      orderBy: {
        Date: "desc",
      },
    });

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    return c.json({
      blogs: posts,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    return c.json(
      {
        message: "Something went wrong",
        error: (error as any).message,
      },
      500
    );
  }
});

blogRouter.get("/getPopularBlogs", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const popularPosts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { views: "desc" },
      take: 6,
      include: {
        author: true,
      },
    });

    return c.json({ popularPosts });
  } catch (error) {
    console.error("Error in fetching blogs: ", error);
    c.status(500);
    return c.json({ error: "Failed to fetch blogs." });
  }
});

blogRouter.get("/getFollowingBlogs", async (c) => {
  const userId = c.req.query("userId");
  if (!userId) {
    c.status(400);
    return c.json({ error: "userId is required" });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const followingBlogs = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        following: {
          include: {
            posts: {
              where: { published: true },
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
                readTime: true,
                featuredImage: true,
                category: true,
                Date: true,
              },
              orderBy: { Date: "desc" },
            },
          },
        },
      },
    });
    return c.json({ followingBlogs: followingBlogs?.following || [] });
  } catch (error) {
    console.error("Error fetching following blogs:", error);
    c.status(500);
    return c.json({ error: "Failed to fetch following blogs." });
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
        readTime: true,
        featuredImage: true,
        category: true,
        Date: true,
        views: true,
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
        readTime: true,
        featuredImage: true,
        category: true,
        Date: true,
      },
      orderBy: {
        Date: "desc",
      },
      take: 3,
    });

    return c.json({ post, similarPosts });
  } catch (error) {
    c.status(411);
    return c.json({
      message: "An error occurred while fetching the blog post",
    });
  }
});

blogRouter.post("/bookmark", async (c) => {
  const { userId, postId } = await c.req.json();

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const existingBookmark = await prisma.bookmark.findFirst({
      where: { userId, postId },
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id },
      });

      c.status(200);
      return c.json({ message: "Bookmark removed" });
    } else {
      await prisma.bookmark.create({
        data: { userId, postId },
      });

      c.status(201);
      return c.json({ message: "Bookmark added" });
    }
  } catch (error) {
    console.error(error);
    c.status(500);
    return c.json({ error: "Failed to toggle bookmark" });
  }
});

blogRouter.get("/bookmarks/:userId", async (c) => {
  const userId = c.req.param("userId");
  // console.log(userId);

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      select: {
        post: {
          select: {
            id: true,
            title: true,
            featuredImage: true,
            category: true,
            readTime: true,
            authorId: true,
            author: {
              select: {
                name: true,
                avatar: true,
                username: true,
              },
            },
            Date: true,
          },
        },
      },
    });

    if (!bookmarks.length) {
      c.status(200);
      return c.json({ message: "No bookmarked blogs found." });
    }

    const posts = bookmarks.map((bookmark) => bookmark.post);
    c.status(200);
    return c.json({ posts });
  } catch (error) {
    console.error(error);
    c.status(500);
    return c.json({ error: "Failed to fetch bookmarked blogs." });
  }
});
