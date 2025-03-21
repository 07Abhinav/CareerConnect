import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleAuth = async (isSignup) => {
        try {
            const endpoint = isSignup ? "signup" : "login";
            const res = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, { email, password });
            localStorage.setItem("token", res.data.token);
            router.push("/upload");
        } catch (err) {
            console.error(err);
            alert("Authentication failed!");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg p-8 rounded-md w-96">
                <h2 className="text-xl font-semibold text-center mb-4">Welcome</h2>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded mb-2"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 border rounded mb-4"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={() => handleAuth(false)} className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
                <button onClick={() => handleAuth(true)} className="w-full bg-gray-400 text-white p-2 rounded mt-2">Sign Up</button>
            </div>
        </div>
    );
}
