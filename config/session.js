const expressSession = require("express-session");
require("dotenv/config");

const { PrismaPg } = require("@prisma/adapter-pg"); // For other db adapters, see Prisma docs
const { PrismaClient } = require("../generated/prisma/client.js");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function sessionMiddleware() {
  return expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: "a santa at nasa",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  });
}

module.exports = sessionMiddleware;
