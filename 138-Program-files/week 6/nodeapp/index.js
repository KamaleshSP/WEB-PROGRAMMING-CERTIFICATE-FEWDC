const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routers/taskRoutes');

const app = express();
app.use(express.json());
app.use("/tasks", taskRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/taskDB")
    .then(() => app.listen(8080, () => console.log("Server running on 8080")))
    .catch(err => console.error(err))