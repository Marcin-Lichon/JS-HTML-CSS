// server.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "game")));
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // lub podaj konkretny origin
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
// Prosty "backend" na potrzeby gry - wczytuje/zapisuje do pliku JSON
const DB_FILE = path.join(__dirname, "scores.json");

// Inicjalizacja pliku jeśli nie istnieje
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

// GET - pobierz wszystkie wyniki
app.get("/api/scores", (req, res) => {
  const scores = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  res.json(scores);
});

// POST - dodaj nowy wynik
app.post("/api/scores", (req, res) => {
  const scores = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  const newScore = {
    id: Date.now(),
    name: req.body.name,
    moves: req.body.moves,
    time: req.body.time,
  };
  scores.push(newScore);
  fs.writeFileSync(DB_FILE, JSON.stringify(scores, null, 2));
  res.status(201).json(newScore);
});

// DELETE - usuń wynik po ID
app.delete("/api/scores/:id", (req, res) => {
  const scores = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  
  const updatedScores = scores.filter(
    (score) => score.id !== parseInt(req.params.id)
  );
  fs.writeFileSync(DB_FILE, JSON.stringify(updatedScores, null, 2));
  res.sendStatus(204);
});

// Uruchom serwer
app.listen(PORT, () => {
  console.log(`Server działa na http://localhost:${PORT}`);
});
