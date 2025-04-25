/*
  Name: Terrance Lee
  Date: 04-21-25
  Description: Jokebook – SQLite database setup and joke schema (hw6 - CSC 372)
    - db.js -  
    Purpose: This file sets up the SQLite database for the Jokebook application. It creates the database and the jokes table if it doesn't exist.
*/

const Database = require("better-sqlite3");
const db = new Database("jokebook.db");

// Create table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS jokes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    setup TEXT NOT NULL,
    delivery TEXT NOT NULL
  )
`).run();

module.exports = db;