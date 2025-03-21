import { useEffect, useState } from "react";
import axios from "axios";

export default function JobRecommendations() {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/jobs/recommendations", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }).then(res => setJobs(res.data));
    }, []);

    return (
        <div className="h-screen flex flex-col items-center bg-gray-100 p-6">
            <h2 className="text-2xl font-semibold mb-6">Recommended Jobs</h2>
            <div className="w-full max-w-3xl bg-white shadow-md rounded-md p-4">
                {jobs.length > 0 ? jobs.map((job) => (
                    <div key={job._id} className="border-b py-4">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <p className="text-gray-600">{job.company}</p>
                        <p className="text-sm text-gray-500">{job.location}</p>
                    </div>
                )) : <p className="text-center text-gray-500">No job recommendations available.</p>}
            </div>
        </div>
    );
}
