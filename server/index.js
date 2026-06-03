const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const FILE = "./tasks.json";

// Read tasks
const getTasks = () => {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE));
};

// Save tasks
const saveTasks = (tasks) => {
  fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
};

// GET all tasks
app.get("/tasks", (req, res) => {
  res.json(getTasks());
});

// ADD task
app.post("/tasks", (req, res) => {
  const tasks = getTasks();
  const newTask = { id: Date.now(), ...req.body };
  tasks.push(newTask);
  saveTasks(tasks);
  res.json(newTask);
});

// UPDATE task
app.put("/tasks/:id", (req, res) => {
  let tasks = getTasks();
  tasks = tasks.map(t =>
    t.id == req.params.id ? { ...t, ...req.body } : t
  );
  saveTasks(tasks);
  res.json({ message: "Updated" });
});

// DELETE task
app.delete("/tasks/:id", (req, res) => {
  let tasks = getTasks();
  tasks = tasks.filter(t => t.id != req.params.id);
  saveTasks(tasks);
  res.json({ message: "Deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
