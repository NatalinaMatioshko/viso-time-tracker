import { Router } from "express";
import { prisma } from "../db/prisma.js";

export const entriesRouter = Router();

// GET /api/entries — повертає всі записи
entriesRouter.get("/", async (_req, res) => {
  const entries = await prisma.timeEntry.findMany({
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  });

  res.json(entries);
});

// POST /api/entries — створює запис + валідації
entriesRouter.post("/", async (req, res) => {
  const { date, project, hours, description } = req.body ?? {};

  // required fields
  if (!date || !project || hours === undefined || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const hoursNumber = Number(hours);
  if (!Number.isFinite(hoursNumber) || hoursNumber <= 0) {
    return res.status(400).json({ message: "Hours must be a positive number" });
  }

  // rule: sum(hours by date) + newHours <= 24
  const agg = await prisma.timeEntry.aggregate({
    where: { date },
    _sum: { hours: true },
  });

  const current = agg._sum.hours ?? 0;
  if (current + hoursNumber > 24) {
    return res
      .status(400)
      .json({ message: "Total hours per day cannot exceed 24" });
  }

  const created = await prisma.timeEntry.create({
    data: { date, project, hours: hoursNumber, description },
  });

  return res.status(201).json(created);
});
