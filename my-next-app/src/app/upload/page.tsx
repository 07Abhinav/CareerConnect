"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadResume } from "../../utils/api";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    setUploading(true);
    try {
      const response = await uploadResume(file);
      setMessage(`Resume uploaded successfully! Skills: ${response.data.skills.join(", ")}`);
      router.push("/jobs");
    } catch (error) {
      setMessage("Failed to upload resume.");
      console.error("Error uploading resume:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Upload Your Resume</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.docx"
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}