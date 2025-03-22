"use client";

import { useEffect, useState } from "react";
import JobCard from "../../components/JobCard";
import { fetchJobs } from "../../utils/api";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getJobs = async () => {
      try {
        const response = await fetchJobs();
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    getJobs();
  }, []);

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-4">Recommended Jobs</h1>
      {loading ? (
        <p>Loading...</p>
      ) : jobs.length > 0 ? (
        jobs.map((job) => <JobCard key={job._id} job={job} />)
      ) : (
        <p>No jobs found.</p>
      )}
    </div>
  );
}