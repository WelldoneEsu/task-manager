//

const express = require('express');
const { getAllTasks, createTask, updateTask, deleteTask } = require('../controllers/tasksController');
const requireAuth = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all /tasks routes with session auth
router.use(requireAuth);

router.get("/", getAllTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
