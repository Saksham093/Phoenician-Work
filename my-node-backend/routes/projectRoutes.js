const express = require('express');
const { getProjects, getProjectById } = require('../controllers/projectController');
const router = express.Router();

// Define your routes
router.get('/', getProjects);
router.get('/:id', getProjectById);

module.exports = router;
