/*
  Name: Terrance Lee
  Date: 04-21-25
  Description: Jokebook – Handles joke logic and external API fallback (hw6 - CSC 372)
  - jokeController.js -
  Purpose: This file contains the logic for handling jokes, including fetching random jokes, categories, and adding new jokes. It also interacts with the database and external API.
*/

const db = require("../models/db");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

function getRandomJoke(req, res) {
  const result = db.prepare("SELECT setup, delivery FROM jokes ORDER BY RANDOM() LIMIT 1").get();
  res.json(result || { setup: "No jokes yet!", delivery: "Try adding one." });
}

function getCategories(req, res) {
  const result = db.prepare("SELECT DISTINCT category FROM jokes ORDER BY category").all();
  const categories = result.map(row => row.category);
  res.json(categories);
}

async function getJokesByCategory(req, res) {
  const category = req.params.category.toLowerCase(); // ⬅️ normalize for API
  const limit = req.query.limit;

  let jokes = db.prepare("SELECT setup, delivery FROM jokes WHERE category = ?").all(category);

  if (jokes.length === 0) {
    try {
      const url = `https://v2.jokeapi.dev/joke/${category}?amount=3&safe-mode`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.error || (!data.jokes && !data.joke)) {
        return res.status(404).json({ error: `No jokes found in local DB or API for "${category}"` });
      }
      
      const fetchedJokes = data.jokes || [data];
      const insert = db.prepare("INSERT INTO jokes (category, setup, delivery) VALUES (?, ?, ?)");
      
      for (const joke of fetchedJokes) {
        if (joke.type === "twopart" && joke.setup && joke.delivery) {
          insert.run(category, joke.setup, joke.delivery);
        } else if (joke.type === "single" && joke.joke) {
          insert.run(category, joke.joke, "[Single-line joke]");
        }
      }

      jokes = db.prepare("SELECT setup, delivery FROM jokes WHERE category = ?").all(category);
    } catch (err) {
      console.error("API fetch failed:", err);
      return res.status(500).json({ error: "JokeAPI request failed" });
    }
  }

  if (limit) {
    jokes = jokes.slice(0, parseInt(limit));
  }

  res.json(jokes);
}

function addJoke(req, res) {
  const { category, setup, delivery } = req.body;

  if (!category || !setup || !delivery) {
    return res.status(400).json({ error: "All fields required" });
  }

  db.prepare("INSERT INTO jokes (category, setup, delivery) VALUES (?, ?, ?)").run(category, setup, delivery);
  const newJokes = db.prepare("SELECT setup, delivery FROM jokes WHERE category = ? ORDER BY id DESC LIMIT 1").all(category);
  res.status(201).json(newJokes);
}

module.exports = {
  getRandomJoke,
  getCategories,
  getJokesByCategory,
  addJoke,
};