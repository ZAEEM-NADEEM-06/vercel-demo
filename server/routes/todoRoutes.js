const express = require("express");
const router = express.Router();

const Todo = require("../models/Todo");

router.get("/", async (req, res) => {
  const todos = await Todo.find().sort({
    createdAt: -1,
  });

  res.json(todos);
});

router.post("/", async (req, res) => {
  const todo = await Todo.create({
    title: req.body.title,
  });

  res.json(todo);
});

module.exports = router;