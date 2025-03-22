import { useState } from "react";
import { useRouter } from "next/router";
import API from "@/utils/api";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function UploadResume() {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    try {
      // 1. Upload resume and extract skills
      await API.post("/resume/upload", formData);

      // 2. Redirect to /recommend-jobs to recommend jobs based on extracted skills
      router.push("/recommend-jobs");
    } catch (error) {
      console.error("Upload Error:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleUpload}
          className="bg-white p-6 rounded shadow-md w-96"
        >
          <h2 className="text-2xl font-bold mb-4">Upload Resume</h2>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Upload
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
