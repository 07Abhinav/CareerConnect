import { useRouter } from "next/router";

export default function Navbar() {
    const router = useRouter();

    const logout = () => {
        localStorage.removeItem("token");
        router.push("/");
    };

    return (
        <nav className="bg-blue-600 text-white p-4 flex justify-between">
            <h1 className="text-lg font-bold">Job Recommendation</h1>
            <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
        </nav>
    );
}
