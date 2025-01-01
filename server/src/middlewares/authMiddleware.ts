import { verify } from "hono/jwt";

export default async function authMiddleware(c: any, next: () => void) {
  const authorizationHeader = c.req.header("authorization") || "";
  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    c.status(401);
    return c.json({ message: "Authorization token is missing" });
  }

  try {
    const user = await verify(token, c.env.JWT_SECRET);
    if (user && user.id) {
      c.set("userId", user.id);
      await next();
    } else {
      c.status(403);
      return c.json({ message: "Invalid token" });
    }
  } catch (error: any) {
    console.error("Authentication Error:", error.message);
    if (error.name === "JwtTokenInvalid") {
      c.status(403);
      return c.json({ message: "Invalid or expired token" });
    }
    c.status(500);
    return c.json({ message: "Internal Server Error" });
  }
}