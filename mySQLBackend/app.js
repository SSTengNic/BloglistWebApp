const express = require("express");
const cors = require("cors");

const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const blogRouter = require("./controllers/blogs");

const middleware = require("./utils/middleware");

const app = express();

app.use(express.json());
app.use(cors());

app.use(middleware.tokenExtractor);
app.use(middleware.userExtractor);

app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/bloglist", blogRouter);

app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

module.exports = app;
