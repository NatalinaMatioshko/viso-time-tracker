import "dotenv/config";
import express from "express";
import cors from "cors";
import { entriesRouter } from "./routes/entries.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/entries", entriesRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => console.log(`API: http://localhost:${port}`));
