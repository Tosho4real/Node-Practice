import express from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Hash the password before storing it in the database
  const hashedPassword = bcryptjs.hashSync(password, 8);

  // save user and password to the database
  try {
    // Create user
    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });

    // add first todo for the user
    const defaultTodo = "Hello :) Add your first todo";

    await prisma.todo.create({ data: { task: defaultTodo, userId: user.id } });

    // create a JWT token for the user
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ token });
  } catch (error) {
    console.log(error.message);
  }
});

// Login a user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    // if user is not found
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isPasswordValid = bcryptjs.compareSync(password, user.password);

    // if password is invalid
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid password" });
    }

    console.log(user);

    // Now the user is authenticated
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    return res.json({ token });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

export default router;
