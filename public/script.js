/*
  Name: Terrance Lee
  Date: 04-21-25
  Description: Jokebook – Client-side JavaScript to fetch and render jokes (hw6 - CSC 372)
    - script.js -
    Purpose: This file contains the client-side JavaScript for the Jokebook application.
             It handles fetching jokes from the server, rendering them on the page, and submitting new jokes.
*/

document.addEventListener("DOMContentLoaded", () => {
    fetchRandomJoke();
    fetchCategories();
  
    document.getElementById("search-btn").addEventListener("click", () => {
      const category = document.getElementById("search-input").value.trim();
      if (category) fetchJokesByCategory(category);
    });
  
    document.getElementById("joke-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const category = form.category.value;
      const setup = form.setup.value;
      const delivery = form.delivery.value;
  
      const res = await fetch("/jokebook/joke/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, setup, delivery })
      });
  
      const data = await res.json();
      displayJokes(data, "new-joke-list");
      form.reset();
      fetchCategories(); // Auto-refresh category list after adding joke
    });
  });
  
  async function fetchRandomJoke() {
    const res = await fetch("/jokebook/random");
    const joke = await res.json();
    displayJoke(joke, "random-joke");
  }
  
  async function fetchCategories() {
    const res = await fetch("/jokebook/categories");
    const categories = await res.json();
    const list = document.getElementById("category-list");
    list.innerHTML = "";
  
    categories.forEach(cat => {
      const li = document.createElement("li");
      li.textContent = cat;
      li.tabIndex = 0;
      li.addEventListener("click", () => fetchJokesByCategory(cat));
      list.appendChild(li);
    });
  }
  
  async function fetchJokesByCategory(category) {
    try {
      const res = await fetch(`/jokebook/joke/${category}`);
      const jokes = await res.json();
  
      if (jokes.error) {
        displayError(jokes.error, "search-results");
      } else {
        displayJokes(jokes, "search-results");
      }
    } catch (err) {
      displayError("Something went wrong fetching jokes.", "search-results");
      console.error(err);
    }
  }
  
  function displayJoke(joke, containerId) {
    const container = document.getElementById(containerId);
    container.textContent = "";
    const p1 = document.createElement("p");
    p1.textContent = "Setup: " + joke.setup;
    const p2 = document.createElement("p");
    p2.textContent = "Delivery: " + joke.delivery;
    container.appendChild(p1);
    container.appendChild(p2);
  }
  
  function displayJokes(jokes, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    jokes.forEach(joke => {
      const div = document.createElement("div");
      const setup = document.createElement("p");
      setup.textContent = "Setup: " + joke.setup;
      const delivery = document.createElement("p");
      delivery.textContent = "Delivery: " + joke.delivery;
      div.appendChild(setup);
      div.appendChild(delivery);
      div.appendChild(document.createElement("hr"));
      container.appendChild(div);
    });
  }
  
  function displayError(message, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    const p = document.createElement("p");
    p.textContent = message;
    p.style.color = "red";
    container.appendChild(p);
  }