import { Hono } from "hono";
import { sign } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string;
    }
}>();

userRouter.post('/signup', async (c) => {
    const body = await c.req.json();
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: body.password,
                name: body.name
            }
        })

        console.log("JWT_SECRET:", c.env.JWT_SECRET || "Bloguer");

        const jwt = await sign({
            id: user.id
        }, c.env.JWT_SECRET);

        return c.text(jwt);
    } catch (e) {
        console.log(e);
        c.status(411);

        return c.text('Invalid');
    }
});

userRouter.post('/signin', async (c) => {
    const body = await c.req.json();
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: body.email,
                password: body.password,
            }
        })

        if(!user) {
            c.status(403);
            return c.json({
                message: "Incorrect Credenetials"
            })
        }
    
        const jwt = await sign({
            id: user.id
        }, c.env.JWT_SECRET);
    
        return c.text(jwt);
    } catch (e) {
        console.log(e);
        c.status(411);
    
        return c.text('Invalid');
    }
});