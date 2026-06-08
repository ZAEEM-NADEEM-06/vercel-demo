require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const todoRoutes = require(
  "./routes/todoRoutes"
);

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  "/api/todos",
  todoRoutes
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(
      process.env.PORT || 5000,
      () => {
        console.log(
          "Server Running"
        );
      }
    );
  })
  .catch((err) =>
    console.log(err)
  );