import { useEffect, useState } from "react";
import API from "@/utils/api";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function RecommendedJobs() {
  interface Job {
    job_title: string;
    job_description: string;
    job_link: string;
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
      <h2 className="text-2xl font-bold mb-4">Recommended Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs found. Please upload your resume first.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job, index) => (
            <li key={index} className="bg-white p-4 shadow rounded">
              <h3 className="text-xl font-bold">{job.job_title}</h3>
              <p className="text-gray-700">{job.job_description}</p>
              <a
                href={job.job_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Apply Now
              </a>
            </li>
          ))}
        </ul>
      )}
    </ProtectedRoute>
  );
}