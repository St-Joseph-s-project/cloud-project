import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppDispatch } from "../../hooks/store";
import { login } from "../../redux/slices/authSlice";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email,
          password,
        },
      );

      const { user, success, token } = response.data;

      if (!success) {
        setError("Login failed");
        return;
      }

      const appUser = {
        ...user,
        username: user.name,
      };
      localStorage.setItem("JWT_TOKEN", token);
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(appUser));
      }

      dispatch(login(appUser));

      if ([1, 2, 3].includes(user.role_id)) {
        navigate("/dashboard");
      } else if (user.role_id === 4) {
        navigate(`/student/dashboard/${user.id}`);
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Invalid credentials or server error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 transition-all duration-300">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="h-14 w-14 rounded-full text-white flex items-center justify-center font-bold">
            <img
              src="https://th.bing.com/th/id/R.99834f107c683a783f964224c28532cc?rik=zg61i%2fYTLggECw&riu=http%3a%2f%2ficrtet2019.stjosephstechnology.ac.in%2fimg%2fsjit.png&ehk=DdHRFSvOHLSZcfzmk1mwK53v%2fL0wgvdshIHKllSAKjA%3d&risl=&pid=ImgRaw&r=0"
              alt=""
            />
          </div>
        </div>

        <h2 className="text-center text-2xl font-bold mb-6">Sign in</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
