const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills: { type: [String], required: true }
});
module.exports = mongoose.model('Job', jobSchema);