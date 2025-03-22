import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          CareerConnect
        </Link>
        <div className="flex gap-4">
          <Link href="/upload" className="text-white hover:text-gray-200">
            Upload Resume
          </Link>
          <Link href="/jobs" className="text-white hover:text-gray-200">
            Jobs
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;