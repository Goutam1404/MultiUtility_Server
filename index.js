import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors"

dotenv.config({ path: "./.env" }); 
const app=express()
const PORT=process.env.PORT||3000;

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
app.listen(PORT,()=>{
    console.log("App is listening on port",PORT); 
})

app.get("/",(req,res)=>{
    // res.send("In home directory ");
    console.log("In home directory ");
    
})
