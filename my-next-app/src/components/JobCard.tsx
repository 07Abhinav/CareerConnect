import React from "react";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
}

const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-bold mb-2">{job.title}</h2>
      <p className="text-gray-600 mb-2">{job.company}</p>
      <p className="text-gray-600 mb-2">{job.location}</p>
      <p className="mb-4">{job.description}</p>
      <p className="text-sm text-gray-500">
        Skills Required: {job.skills.join(", ")}
      </p>
    </div>
  );
};

export default JobCard;