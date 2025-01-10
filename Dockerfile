FROM node:18 AS client-build

WORKDIR /client

COPY client/package*.json ./
COPY client/tsconfig*.json ./
COPY client/vite.config.ts ./
COPY client/ .

RUN npm install && npm run build

FROM node:18 AS server-build

WORKDIR /server

COPY server/package*.json ./
COPY server/prisma ./prisma/
COPY server/tsconfig.json ./
COPY server/src ./src/

RUN npm install && npx prisma generate

FROM node:18

ENV NODE_ENV=production
ENV PORT=8080

WORKDIR /

COPY --from=server-build /server /server

COPY --from=client-build /client/dist /client/dist

WORKDIR /server
RUN npm install --production

EXPOSE 8080

CMD ["npm", "run", "deploy"]