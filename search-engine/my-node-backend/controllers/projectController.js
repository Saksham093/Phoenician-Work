const { loadData } = require('../models/projectModel');

// Function to get all projects
const getProjects = (req, res) => {
    try {
        const projects = loadData();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects' });
    }
};

// Function to get a project by ID
const getProjectById = (req, res) => {
    try {
        const projects = loadData();
        const project = projects.find(p => p.ITEM === req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching project' });
    }
};

module.exports = { getProjects, getProjectById };
