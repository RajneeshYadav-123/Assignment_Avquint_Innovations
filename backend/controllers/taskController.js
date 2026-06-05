const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    const userId = req.user;

    const allUserTasks = await Task.find({ userId });
    const totalCount = allUserTasks.length;
    const completedCount = allUserTasks.filter(t => t.status === 'Completed').length;
    const pendingCount = allUserTasks.filter(t => t.status === 'Pending').length;
    const completedPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const query = { userId };

    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }

    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const totalMatchedTasks = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      tasks,
      currentPage: page,
      totalPages: Math.ceil(totalMatchedTasks / limit) || 1,
      totalMatchedTasks,
      stats: {
        total: totalCount,
        completed: completedCount,
        pending: pendingCount,
        completedPercentage: completedPercent
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error while fetching tasks' });
  }
};

const createTask = async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Task title is required' });
  }

  try {
    const newTask = new Task({
      title,
      description: description || '',
      userId: req.user,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error while creating task' });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Task title is required' });
  }

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    task.title = title;
    task.description = description || '';
    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error while updating task' });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error while deleting task' });
  }
};

const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['Pending', 'Completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid or missing status value' });
  }

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    task.status = status;
    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error while updating task status' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
};
