import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome to CareerConnect</h1>
      <p className="mb-6">
        Upload your resume and get job recommendations tailored to your skills.
      </p>
      <div className="flex gap-4">
        <Link href="/login">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Login
          </button>
        </Link>
        <Link href="/signup">
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Signup
          </button>
        </Link>
      </div>
    </div>
  );
}