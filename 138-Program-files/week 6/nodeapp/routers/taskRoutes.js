const express = require('express');
const {createTask, getAllTasks, getTaskById} = require('../controllers/taskController');

const router = express.Router();
router.post("/", createTask);
router.get("/", getAllTasks);
router.get("/:id", getTaskById);

module.exports = router;