import express, { Express, Request, Response } from "express";
import client from "./db";
import dotenv from "dotenv";
import conversionsRouter from "./routes/conversions";

const cors = require("cors");

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/conversions", conversionsRouter);

app.get("/api", (req: Request, res: Response) => {
  res.send("Units Converter API");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

async function testConnection() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("You are successfully connected to your MongoDB!");
  } finally {
    await client.close();
  }
}

testConnection().catch(console.dir);
