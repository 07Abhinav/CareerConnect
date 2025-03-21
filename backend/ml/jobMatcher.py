from scikit-learn.feature_extraction.text import TfidfVectorizer
from scikit-learn.metrics.pairwise import cosine_similarity
import pandas as pd

def match_jobs(resume_skills, job_listings):
    """
    Matches jobs based on extracted skills using TF-IDF and Cosine Similarity.
    
    :param resume_skills: String of skills extracted from resume
    :param job_listings: List of job descriptions
    :return: List of top matching jobs
    """
    job_texts = [job["description"] for job in job_listings]
    
    # Combine resume skills and job descriptions for vectorization
    combined_texts = [resume_skills] + job_texts

    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform(combined_texts)

    # Calculate cosine similarity
    similarity_scores = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

    # Sort jobs by similarity score
    matched_jobs = sorted(
        zip(job_listings, similarity_scores),
        key=lambda x: x[1],
        reverse=True
    )

    # Format top 5 matching jobs
    top_jobs = [
        {"title": job["title"], "company": job["company"], "score": round(score, 2)}
        for job, score in matched_jobs[:5]
    ]

    return top_jobs
