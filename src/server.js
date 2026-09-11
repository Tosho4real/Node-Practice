import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/authRoutes.js";
import todoRouter from "./routes/todoRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();
const port = process.env.PORT || 5000;

// Serve static files from the "public" directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "../public")));

// Get the index.html file when the root URL is accessed
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// routers
app.use("/auth", authRouter);
app.use("/todos", authMiddleware, todoRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
