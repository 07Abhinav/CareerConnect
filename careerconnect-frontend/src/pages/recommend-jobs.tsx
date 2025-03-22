"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import API from "@/utils/api";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function RecommendJobs() {
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]); // 🔥 Original extracted skills
  const [skills, setSkills] = useState<string[]>([]); // 🎯 Skills displayed and updated by user
  const [newSkill, setNewSkill] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 📝 Fetch extracted skills when page loads
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data: userData } = await API.get("/users/me");
        console.log("✅ Extracted Skills:", userData.skills);
        setExtractedSkills(userData.skills || []);
        setSkills(userData.skills || []); // Pre-fill the skills for user to modify
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
        setError("Failed to load skills. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // ➕ Add skill to list
  const addSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (
      trimmedSkill !== "" &&
      !skills.includes(trimmedSkill.toLowerCase())
    ) {
      setSkills([...skills, trimmedSkill.toLowerCase()]);
      setNewSkill("");
    } else {
      alert("Skill already added or empty! ❗");
    }
  };

  // ❌ Remove skill from list
  const removeSkill = (index: number) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  // 📡 Send skills to recommend jobs
  const recommendJobs = async () => {
    try {
      if (skills.length === 0) {
        alert("⚠️ Please add at least one skill.");
        return;
      }

      setLoading(true);
      console.log("📡 Sending skills for recommendation:", skills);
      await API.post("/jobs/recommend", { skills });

      // 🔀 Redirect to /jobs/recommended after recommendation
      router.push("/jobs/recommended");
    } catch (error) {
      console.error("❌ Error recommending jobs:", error);
      setError("Failed to recommend jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold">Loading skills... ⏳</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100">
        <p className="text-lg font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">📚 Extracted Skills</h2>

          {/* Original Extracted Skills Display */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">✨ Extracted Skills:</h3>
            <ul className="flex flex-wrap gap-2">
              {extractedSkills.length > 0 ? (
                extractedSkills.map((skill, index) => (
                  <li
                    key={index}
                    className="bg-gray-200 text-sm px-3 py-1 rounded-lg"
                  >
                    {skill}
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-500">No extracted skills found.</p>
              )}
            </ul>
          </div>

          {/* Editable Skills List */}
          <h3 className="text-lg font-semibold mb-2">📝 Modify Skills:</h3>
          <ul className="space-y-2 mb-4">
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded-lg"
                >
                  <span className="text-sm font-medium">{skill}</span>
                  <button
                    onClick={() => removeSkill(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✖️ Remove
                  </button>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500">No skills added yet.</p>
            )}
          </ul>

          {/* Add New Skill */}
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add new skill"
              className="w-full border rounded-lg px-4 py-2"
            />
            <button
              onClick={addSkill}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              ➕ Add
            </button>
          </div>

          {/* Submit Button */}
          <button
            onClick={recommendJobs}
            className="bg-green-500 w-full text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            🚀 Recommend Jobs
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
