import express from "express";
import connectDB from './database';
import dotenv from 'dotenv';
import BoardGameModel from './models/BoardGame';
import { IBoardGame } from './interfaces/BoardGame';
import { toBoardGamePojo, toBoardGamePojoArray } from './adapters/BoardGameAdapter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(express.json());

// Create a new board game
app.post('/api/boardgames', async (req, res) => {
  try {
    const { name, bggUrl }: IBoardGame = req.body;
    const boardGameDoc = await BoardGameModel.create({ name, bggUrl });
    res.status(201).json(toBoardGamePojo(boardGameDoc));
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Get all board games
app.get('/api/boardgames', async (_req, res) => {
  try {
    const boardGameDocs = await BoardGameModel.find();
    res.status(200).json(toBoardGamePojoArray(boardGameDocs));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/boardgames/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBoardGame = await BoardGameModel.findByIdAndDelete(id);
    if (!deletedBoardGame) {
      return res.status(404).json({ message: 'Board game not found' });
    }
    res.status(200).json({ message: 'Board game deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
