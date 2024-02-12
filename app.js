const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const conf = require("./conf");
const app = express();

// console.log(conf.CORS_ORIGIN);
// console.log(conf.PORT);

// cors policy
const corsOptions = {
  origin: [conf.CORS_ORIGIN, conf.LOCAL_CORS_ORIGIN],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
const userRoutes = require("./routes/user.routes");
const todoRoutes = require("./routes/todo.routes");

// Routes declaration
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/todos", todoRoutes);

module.exports = { app };
