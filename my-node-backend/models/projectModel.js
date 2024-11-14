const fs = require('fs');
const path = require('path');

// Load data from JSON
const dataFilePath = path.join(__dirname, '../data/data.json');
const loadData = () => {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
};

module.exports = { loadData };
