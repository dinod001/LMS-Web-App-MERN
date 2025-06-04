import express from "express";
import cors from "cors";
import bodyParser from "body-parser"; // ✅

import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webHooks.js";

const app = express();
await connectDB();
app.use(cors());

// ✅ Raw body only for Clerk
app.use("/clerk", bodyParser.raw({ type: "*/*" }));

app.get("/", (req, res) => {
  res.send("server running");
});

app.post("/clerk", clerkWebhooks);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server is running on ${PORT}`));
