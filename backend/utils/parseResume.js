// backend/utils/parseResume.js
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');

// Define a list of skills (you can expand this list)
const skillsList = [
    "JavaScript", "React", "Node.js", "Express.js", "MongoDB", "Python",
    "Machine Learning", "Data Analysis", "SQL", "Git", "HTML", "CSS",
    "AWS", "Docker", "Kubernetes", "Java", "C++", "Ruby", "PHP"
];

/**
 * Extract text from a PDF or DOCX file
 * @param {string} filePath - Path to the resume file
 * @returns {string} - Extracted text
 */
const extractTextFromFile = async (filePath) => {
    try {
        const fileBuffer = fs.readFileSync(filePath);
        const fileType = filePath.split('.').pop().toLowerCase();

        console.log('File type:', fileType); // Log the file type
        console.log('File buffer:', fileBuffer); // Log the file buffer

        if (fileType === 'pdf') {
            const data = await pdf(fileBuffer);
            console.log('Extracted PDF text:', data.text); // Log extracted PDF text
            return data.text;
        } else if (fileType === 'docx') {
            const result = await mammoth.extractRawText({ buffer: fileBuffer });
            console.log('Extracted DOCX text:', result.value); // Log extracted DOCX text
            return result.value;
        } else {
            throw new Error('Unsupported file type');
        }
    } catch (error) {
        throw new Error(`Error extracting text: ${error.message}`);
    }
};

/**
 * Extract skills from resume text
 * @param {string} resumeText - The text content of the resume
 * @returns {string[]} - List of extracted skills
 */
const extractSkills = (resumeText) => {
    const skills = new Set();

    console.log('Resume text for skills extraction:', resumeText); // Log the resume text
    // Match skills from the skills list
    skillsList.forEach(skill => {
        if (resumeText.toLowerCase().includes(skill.toLowerCase())) {
            skills.add(skill);
        }
    });
    console.log('Matched skills:', Array.from(skills));
    return Array.from(skills);
};

/**
 * Parse resume and extract skills
 * @param {string} filePath - Path to the resume file
 * @returns {string[]} - List of extracted skills
 */
const parseResume = async (filePath) => {
    try {
        // Extract text from the file
        const resumeText = await extractTextFromFile(filePath);
        console.log('Resume text:', resumeText); // Log the extracted text

        // Extract skills from the text
        const skills = extractSkills(resumeText);
        console.log('Extracted skills:', skills); // Log the extracted skills

        return skills;
    } catch (error) {
        console.error('Error parsing resume:', error.message);
        throw new Error(`Error parsing resume: ${error.message}`);
    }
};

module.exports = parseResume;