import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function UploadResume() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleUpload = async () => {
        if (!file) return alert("Please select a file");
        setLoading(true);
        const formData = new FormData();
        formData.append("resume", file);

        try {
            await axios.post("http://localhost:5000/api/resume/upload", formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            router.push("/jobs");
        } catch {
            alert("Upload failed");
        }
        setLoading(false);
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg p-8 rounded-md w-96">
                <h2 className="text-xl font-semibold text-center mb-4">Upload Your Resume</h2>
                <input type="file" className="w-full p-2 border rounded mb-4" onChange={(e) => setFile(e.target.files[0])} />
                <button onClick={handleUpload} className="w-full bg-blue-600 text-white p-2 rounded">
                    {loading ? "Uploading..." : "Upload & Process"}
                </button>
            </div>
        </div>
    );
}
