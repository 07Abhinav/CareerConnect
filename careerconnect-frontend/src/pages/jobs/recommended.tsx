import { useEffect, useState } from "react";
import API from "@/utils/api";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function RecommendedJobs() {
  interface Job {
    job_title: string;
    job_description: string;
    job_link: string;
    company_name?: string;
    location?: string;
    posted_date?: string;
    salary?: string;
  }

  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      try {
        // Fetch recommended jobs from MongoDB
        const { data } = await API.get("/jobs/recommended");
        setJobs(data.recommendedJobs);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching jobs:", error instanceof Error && (error as { response?: { data: string } }).response ? (error as { response?: { data: string } }).response!.data : error.message);
        } else {
          console.error("Error fetching jobs:", error);
        }
      }
    };

    fetchRecommendedJobs();
  }, []);

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Recommended Jobs</h2>
        {jobs.length === 0 ? (
          <p className="text-gray-600">No jobs found. Please upload your resume first.</p>
        ) : (
          <div className="space-y-6">
            {jobs.map((job, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-2xl font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-300">
                  <a href={job.job_link} target="_blank" rel="noopener noreferrer">
                    {job.job_title}
                  </a>
                </h3>
                {job.company_name && (
                  <p className="text-gray-700 font-medium mt-1">{job.company_name}</p>
                )}
                {job.location && (
                  <p className="text-gray-500 text-sm mt-1">{job.location}</p>
                )}
                {job.posted_date && (
                  <p className="text-gray-500 text-sm mt-1">Posted on: {job.posted_date}</p>
                )}
                {job.salary && (
                  <p className="text-gray-700 font-medium mt-1">Salary: {job.salary}</p>
                )}
                <p className="text-gray-700 mt-3">{job.job_description}</p>
                <div className="mt-4">
                  <a
                    href={job.job_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}