import express from "express";
import client from "../db";
import { ObjectId } from "mongodb";
import { conversionsSchema } from "../models/conversions";

const unitConverterDatabase = client.db("unit_converter");
const conversionsCollection = unitConverterDatabase.collection("conversions");
const router = express.Router();

// ADD NEW CONVERSION
router.post("/", async (req, res) => {
  const parsedBody = conversionsSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(400).json({ error: "Invalid request body", details: parsedBody.error.errors });
    return;
  }

  try {
    await client.connect();
    parsedBody.data.createdAt = new Date();
    const result = await conversionsCollection.insertOne(parsedBody.data);
    res.status(201).json({ ...parsedBody.data, _id: result.insertedId });
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error", details: error.message });
  } finally {
    await client.close();
  }
});

// GET ALL SAVED CONVERSIONS
router.get("/", async (req, res) => {
  try {
    await client.connect();
    const results = await conversionsCollection.find({}).toArray();
    res.status(200).json(results);
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error", details: error.message });
  } finally {
    await client.close();
  }
});

// DELETE SAVED CONVERSION BY ID
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid ID format" });
    return;
  }

  try {
    await client.connect();
    const result = await conversionsCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Document not found" });
      return;
    }
    res.json({ message: `Deleted ${result.deletedCount} document successfully`, id });
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error", details: error.message });
  } finally {
    await client.close();
  }
});

export default router;
