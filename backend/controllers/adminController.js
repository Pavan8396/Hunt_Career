const User = require('../models/userModel');
const Employer = require('../models/employerModel');
const Job = require('../models/jobModel');
const Review = require('../models/reviewModel');
const { Op } = require('sequelize');

// @desc    Get platform-wide statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalEmployers = await Employer.count();
    const totalJobs = await Job.count();
    const totalReviews = await Review.count();

    res.json({
      totalUsers,
      totalEmployers,
      totalJobs,
      totalReviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all employer names and IDs
// @route   GET /api/admin/employers/names
// @access  Private (Admin)
exports.getAllEmployerNames = async (req, res) => {
  try {
    const employers = await Employer.findAll({
        attributes: ['id', 'companyName']
    });
    res.json(employers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { search, status, sortBy } = req.query;
    let where = {};

    if (search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status) {
      where.isActive = status === 'active';
    }

    let order = [];
    if (sortBy === 'date_asc') {
      order.push(['createdAt', 'ASC']);
    } else if (sortBy === 'date_desc') {
      order.push(['createdAt', 'DESC']);
    }

    const users = await User.findAll({
        where,
        order,
        attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all employers
// @route   GET /api/admin/employers
// @access  Private (Admin)
exports.getAllEmployers = async (req, res) => {
  try {
    const { search, status, sortBy } = req.query;
    let where = {};

    if (search) {
      where[Op.or] = [
        { companyName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status) {
      where.isActive = status === 'active';
    }

    let order = [];
    if (sortBy === 'date_asc') {
      order.push(['createdAt', 'ASC']);
    } else if (sortBy === 'date_desc') {
      order.push(['createdAt', 'DESC']);
    }

    const employers = await Employer.findAll({
        where,
        order,
        attributes: { exclude: ['password'] }
    });
    res.json(employers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an employer
// @route   PUT /api/admin/employers/:id
// @access  Private (Admin)
exports.updateEmployer = async (req, res) => {
  try {
    const employer = await Employer.findByPk(req.params.id);

    if (employer) {
      employer.companyName = req.body.companyName || employer.companyName;

      await employer.save();
      res.json(employer);
    } else {
      res.status(404).json({ message: 'Employer not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an employer
// @route   DELETE /api/admin/employers/:id
// @access  Private (Admin)
exports.deleteEmployer = async (req, res) => {
    try {
        const employer = await Employer.findByPk(req.params.id);

        if (employer) {
            // Associated jobs will be handled by Job.destroy if needed, or manually
            await Job.destroy({ where: { employerId: employer.id } });
            await employer.destroy();
            res.json({ message: 'Employer and associated jobs removed' });
        } else {
            res.status(404).json({ message: 'Employer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      user.isActive = req.body.isActive;
      await user.save();
      res.json({ message: `User status updated to ${user.isActive ? 'active' : 'suspended'}.` });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle employer active status
// @route   PUT /api/admin/employers/:id/status
// @access  Private (Admin)
exports.toggleEmployerStatus = async (req, res) => {
  try {
    const employer = await Employer.findByPk(req.params.id);
    if (employer) {
      employer.isActive = req.body.isActive;
      await employer.save();
      res.json({ message: `Employer status updated to ${employer.isActive ? 'active' : 'suspended'}.` });
    } else {
      res.status(404).json({ message: 'Employer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle user admin status
// @route   PUT /api/admin/users/:id/make-admin
// @access  Private (Admin)
exports.toggleUserAdminStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      user.isAdmin = req.body.isAdmin;
      await user.save();
      res.json({ message: `User admin status updated to ${user.isAdmin}.` });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
