/////// app.js

const path = require("node:path");
const express = require("express");
require("dotenv/config");
const sessionMiddleware = require("./config/session.js");
const passport = require("passport");
require("./config/passport");
const multer = require("multer");
const upload = multer({ dest: "/home/tom/Pictures/" });
const { PrismaPg } = require("@prisma/adapter-pg"); // For other db adapters, see Prisma docs
const { PrismaClient } = require("./generated/prisma/client.js");

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(sessionMiddleware());

app.use(passport.session());

app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  }),
);

app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.post("/upload", upload.single("file"), function (req, res, next) {
  console.log(req.file, req.body);
});

app.post("/createFolder", async (req, res, next) => {
  try {
    const folder = await prisma.Folder.create({
      data: {
        name: req.body.folderName,
        userid: req.user.id,
      },
    });
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
});

app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});
