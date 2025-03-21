import sys
import json
from resume_parser import resumeparse

def extract_skills_from_resume(file_url):
    # Download the resume from GCP URL
    import requests
    response = requests.get(file_url)
    
    if response.status_code != 200:
        print(json.dumps({"error": "Failed to download resume"}))
        sys.exit(1)

    # Save the resume temporarily
    with open("temp_resume.pdf", "wb") as file:
        file.write(response.content)

    # Extract skills
    data = resumeparse.read_file("temp_resume.pdf")
    skills = data.get("skills", [])
    
    # Clean up
    import os
    os.remove("temp_resume.pdf")

    # Return the skills
    return skills


# Read the file URL from args
file_url = sys.argv[1]
skills = extract_skills_from_resume(file_url)

# Print JSON output
print(json.dumps({"skills": skills}))
