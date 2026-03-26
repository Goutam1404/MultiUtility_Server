import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import notesRouter from "./routes/note.route.js";
import todosRouter from "./routes/todo.route.js";
import taskRouter from "./routes/task.route.js";
dotenv.config({ path: "./.env" });
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("In home directory ");
  console.log("In home directory ");
});

app.use("/api/user", userRouter);
app.use("/api/note", notesRouter);
app.use("/api/todo", todosRouter);
app.use("/api/task/", taskRouter);
export default app;
