import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app=express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173/",
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


export default app;