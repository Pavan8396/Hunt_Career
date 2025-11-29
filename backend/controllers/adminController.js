const User = require('../models/userModel');
const Employer = require('../models/employerModel');
const Job = require('../models/jobModel');
const Review = require('../models/reviewModel');

// @desc    Get platform-wide statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEmployers = await Employer.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalReviews = await Review.countDocuments();

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
    const user = await User.findById(req.params.id).select('-password');
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
    const employers = await Employer.find({}).select('companyName');
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
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
      ];
    }

    if (status) {
      query.isActive = status === 'active';
    }

    let sortOption = {};
    if (sortBy === 'date_asc') {
      sortOption.createdAt = 1;
    } else if (sortBy === 'date_desc') {
      sortOption.createdAt = -1;
    }

    const users = await User.find(query).sort(sortOption).select('-password');
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
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { companyName: searchRegex },
        { email: searchRegex },
      ];
    }

    if (status) {
      query.isActive = status === 'active';
    }

    let sortOption = {};
    if (sortBy === 'date_asc') {
      sortOption.createdAt = 1;
    } else if (sortBy === 'date_desc') {
      sortOption.createdAt = -1;
    }

    const employers = await Employer.find(query).sort(sortOption).select('-password');
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
    const user = await User.findById(req.params.id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

      const updatedUser = await user.save();
      res.json(updatedUser);
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
    const employer = await Employer.findById(req.params.id);

    if (employer) {
      employer.companyName = req.body.companyName || employer.companyName;

      const updatedEmployer = await employer.save();
      res.json(updatedEmployer);
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
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
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
        const employer = await Employer.findByIdAndDelete(req.params.id);

        if (employer) {
            // Optional: Also remove jobs associated with the employer
            await Job.deleteMany({ employer: employer._id });
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
    const user = await User.findById(req.params.id);
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
    const employer = await Employer.findById(req.params.id);
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
    const user = await User.findById(req.params.id);
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
