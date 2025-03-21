import spacy

# Load spaCy NLP model
nlp = spacy.load("en_core_web_sm")

# Predefined skill set (can be expanded)
SKILLS_DB = {
    "Python", "JavaScript", "React", "Node.js", "MongoDB", 
    "AWS", "GCP", "Machine Learning", "Express.js", "SQL", "Docker"
}

def extract_skills(text):
    """
    Extract skills from resume text using NLP.
    """
    doc = nlp(text)
    extracted_skills = set()

    for token in doc:
        if token.text in SKILLS_DB:
            extracted_skills.add(token.text)

    return list(extracted_skills)
