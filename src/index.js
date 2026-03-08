import dotenv from "dotenv";
import { connectDb } from "./utils/db.js";
import userRouter from "./routes/user.route.js";
import app from "./app.js"
dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 3000;
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log("App is listening on port http://localhost:",PORT);
    });
  })
  .catch((err) => {
    console.error("Error in mongodbConnection");
    process.exit(1);
  });

// app.get("/", (req, res) => {
//   // res.send("In home directory ");
//   console.log("In home directory ");
// });

// app.use("/user", userRouter);