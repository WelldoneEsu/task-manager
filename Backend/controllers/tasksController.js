//tasksController.js
const fs = require("fs-extra");
const path = require("path");

const tasksFile = path.join(__dirname, '../data/tasks.json');

// Helpers
async function getTasks() {
  return fs.readJSON(tasksFile).catch(() => []);
}

async function saveTasks(tasks) {
  return fs.writeJSON(tasksFile, tasks, { spaces: 2 });
}

// @desc Get all tasks for logged-in user
async function getAllTasks(req, res) {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const tasks = await getTasks();
  const userTasks = tasks.filter(task => task.userId === userId);

  res.json(userTasks);
}

// @desc Create a new task
async function createTask(req, res) {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { title, description, priority } = req.body;

  if (!title || !priority) {
    return res.status(400).json({ error: "Title and priority required" });
  }

  const tasks = await getTasks();

  const newTask = {
    id: Date.now().toString(),
    userId,
    title,
    description,
    priority,
    completed: false,
  };

  tasks.push(newTask);
  await saveTasks(tasks);

  res.status(201).json(newTask);
}

// @desc Update a task
async function updateTask(req, res) {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ error: "❌Unauthorized" });
  }

  const { id } = req.params;
  const { title, description, priority, completed } = req.body;

  const tasks = await getTasks();
  const task = tasks.find(t => t.id === id && t.userId === userId);

  if (!task) {
    return res.status(404).json({ error: "❌Task not found" });
  }

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (priority !== undefined) task.priority = priority;
  if (completed !== undefined) task.completed = completed;

  await saveTasks(tasks);
  res.json(task);
}

// @desc Delete a task
async function deleteTask(req, res) {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ error: "❌Unauthorized" });
  }

  const { id } = req.params;
  let tasks = await getTasks();

  const task = tasks.find(t => t.id === id && t.userId === userId);
  if (!task) {
    return res.status(404).json({ error: "❌Task not found" });
  }

  tasks = tasks.filter(t => t.id !== id);
  await saveTasks(tasks);

  res.json({ message: "❌Task deleted sucessfully" });
}

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};
