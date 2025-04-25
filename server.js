/*
  Name: Terrance Lee
  Date: 04-21-25
  Description: Jokebook – Web interface to view and add jokes (hw6 - CSC 372)
  - servrer.js -
  Purpose: This file sets up the server for the Jokebook application. It configures middleware, routes, and starts the server.
*/

const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
const jokeRoutes = require("./routes/jokeRoutes");
app.use("/jokebook", jokeRoutes);

// Root
app.get("/", (req, res) => {
  res.send("Welcome to Jokebook!");
});

// Server start
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});