import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webHooks.js";

//initializing express
const app = express();

//connect to Database
await connectDB();

//Middlewares
app.use(cors());
// Body parser with rawBody support
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString(); // Needed for Svix
    },
  })
);

//Routes
app.get("/", (req, res) => {
  res.send("server runnning");
});

app.post("/clerk", clerkWebhooks);

//port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
