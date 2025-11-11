const taskController = require('../controllers/taskController');
const Task = require('../models/taskModel');
jest.mock('../models/taskModel'); 

describe('Task_Controller_Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createTask_should_return_201_and_created_task', async () => {
    const req = { body: { title: 'Test Task', completed: false } };
    const savedTask = { _id: '1', title: 'Test Task', completed: false };
    Task.prototype.save = jest.fn().mockResolvedValue(savedTask);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await taskController.createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(savedTask);
  });

  test('createTask_should_return_500_on_error', async () => {
    const req = { body: { title: 'Fail Task' } };
    const error = new Error('Save error');
    Task.prototype.save = jest.fn().mockRejectedValue(error);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await taskController.createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });

  test('getAllTasks_should_return_200_and_all_tasks', async () => {
    const tasks = [
      { _id: '1', title: 'Task 1', completed: false },
      { _id: '2', title: 'Task 2', completed: true }
    ];
    Task.find.mockResolvedValue(tasks);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await taskController.getAllTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(tasks);
  });

  test('getAllTasks_should_return_500_on_error', async () => {
    const error = new Error('Find failed');
    Task.find.mockRejectedValue(error);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await taskController.getAllTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });

  test('getTaskById_should_return_200_and_task', async () => {
    const task = { _id: '1', title: 'Single Task', completed: true };
    Task.findById.mockResolvedValue(task);

    const req = { params: { id: '1' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await taskController.getTaskById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(task);
  });

  test('getTaskById_should_return_404_if_not_found', async () => {
    Task.findById.mockResolvedValue(null);

    const req = { params: { id: '999' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await taskController.getTaskById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
  });

  test('getTaskById_should_return_500_on_error', async () => {
    const error = new Error('DB error');
    Task.findById.mockRejectedValue(error);

    const req = { params: { id: '1' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await taskController.getTaskById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });
});


describe('Task_Model_Validation', () => {
  test('task_model_should_have_required_fields', () => {
    const schema = Task.schema.paths;

    expect(schema).toHaveProperty('title');
    expect(schema.title.isRequired).toBeTruthy();

    expect(schema).toHaveProperty('completed');
    expect(schema.completed.options.default).toBe(false);
  });
});

