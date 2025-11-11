const Task = require('../models/taskModel');

exports.createTask = async(req, res) => {
    try{
        const {title, completed} = req.body;
        const task = new Task({title, completed});
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
};

exports.getAllTasks = async(req, res) => {
    try{
        res.status(200).json(await Task.find());
    } catch(err){
        res.status(500).json({message: err.message});
    }
};

exports.getTaskById = async(req, res) => {
    try{
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({message: "Task not found"});
        res.status(200).json(task);
    } catch (err){
        res.status(500).json({message: err.message});
    }
}