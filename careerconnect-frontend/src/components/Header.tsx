"use client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [router.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <Link href="/">
          <h1 className="text-white text-2xl font-bold">CareerConnect</h1>
        </Link>

        <div className="flex space-x-4">
          {isAuthenticated ? (
            <>
              <Link href="/upload-resume" className="text-white">
                Upload Resume
              </Link>
              <Link href="/jobs/recommended" className="text-white">
                Recommended Jobs
              </Link>
              <button
                onClick={handleLogout}
                className="text-white bg-red-500 px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white">
                Login
              </Link>
              <Link href="/signup" className="text-white">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
