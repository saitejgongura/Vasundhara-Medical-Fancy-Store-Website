import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabase";
import logo from "../assets/logo.png";
import loginBg from "../assets/login-bg.jpg";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Invalid Email or Password");
      return;
    }

    navigate("/dashboard");
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative overflow-hidden px-4 py-8"
      style={{
        backgroundImage: `url(${loginBg})`,
      }}
    >
      {/* Soft White Overlay */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />

      {/* Login Card */}
      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-md rounded-[32px] shadow-2xl border border-white/50 p-6 md:p-8"
      >
        {/* Clinic Name */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 text-center leading-tight">
          Vasundhara
          <br />
          Medical & Fancy Store
        </h1>

        {/* Logo */}
        <div className="flex justify-center my-6">
          <img
            src={logo}
            alt="Vasundhara Medical & Fancy Store"
            className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-[5px] border-yellow-400 shadow-2xl"
          />
        </div>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/90 border border-gray-300 rounded-xl p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white/90 border border-gray-300 rounded-xl p-4 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-700 to-green-500 hover:from-green-800 hover:to-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300"
        >
          Login →
        </button>
      </form>
    </div>
  );
}