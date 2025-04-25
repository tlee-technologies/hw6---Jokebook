/*
  Name: Terrance Lee
  Date: 04-21-25
  Description: Jokebook – Express routes for joke API endpoints (hw6 - CSC 372)
  - jokeRoutes.js -
  Purpose: This file defines the routes for the Jokebook application. It includes routes for fetching random jokes, categories, and adding new jokes.
*/

const express = require("express");
const router = express.Router();
const jokeController = require("../controllers/jokeController");

// GET /jokebook/random
router.get("/random", jokeController.getRandomJoke);

// GET /jokebook/categories
router.get("/categories", jokeController.getCategories);

// GET /jokebook/joke/:category?limit=#
router.get("/joke/:category", jokeController.getJokesByCategory);

// POST /jokebook/joke/add
router.post("/joke/add", jokeController.addJoke);

module.exports = router;