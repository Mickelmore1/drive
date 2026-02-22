/////// app.js

const path = require("node:path");
const express = require("express");
require("dotenv/config");
const sessionMiddleware = require("./config/session.js");
const passport = require("passport");
require("./config/passport");

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

app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});
