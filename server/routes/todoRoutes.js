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
  try {
    const todo = await Todo.create({
      title: req.body.title,
    });

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;