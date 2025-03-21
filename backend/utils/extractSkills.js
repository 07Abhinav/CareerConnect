const pdfParse = require('pdf-parse');
const natural = require('natural');
const fs = require('fs');

// Sample list of common skills (you can expand this list)
const skillsList = [
    "javascript", "python", "java", "c++", "node.js", "react", "express.js", 
    "mongodb", "sql", "aws", "gcp", "docker", "kubernetes", "html", "css",
    "machine learning", "data science", "api development", "devops"
];

// Function to extract text from PDF
const extractTextFromPDF = async (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        return pdfData.text.toLowerCase(); 
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        throw new Error('Failed to extract text from PDF');
    }
};

// Function to extract skills from the text
const extractSkills = (text) => {
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(text);

    // Match tokens with skills list
    const extractedSkills = tokens
        .filter(token => skillsList.includes(token))
        .map(skill => skill.toLowerCase());

    return [...new Set(extractedSkills)];  // Remove duplicates
};

module.exports = { extractTextFromPDF, extractSkills };
