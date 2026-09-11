import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

// Get all todos for a specific user
router.get("/", async (req, res) => {
  const todos = await prisma.todo.findMany({
    where: {
      userId: req.userId,
    },
  });

  res.json(todos);
});

// Create a new todo for a specific user
router.post("/", async (req, res) => {
  const { task } = req.body;

  const todo = await prisma.todo.create({
    data: {
      userId: req.userId,
      task: task,
    },
  });

  res.status(201).json({ id: todo.id, task, completed: 0 });
});

// Update a specific todo for a specific user
router.put("/:id", async (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;

  const updatedTodo = await prisma.todo.update({
    where: {
      id: parseInt(id),
      userId: req.userId,
    },
    data: {
      completed: !!completed,
    },
  });

  res.json(updatedTodo);
});

// Delete a specific todo for a specific user
router.delete("/:id", async (req, res) => {
  const { userId } = req;
  const { id } = req.params;
  await prisma.todo.delete({
    where: {
      id: parseInt(id),
      userId,
    },
  });

  res.json({ message: "Todo Deleted" });
});

export default router;
