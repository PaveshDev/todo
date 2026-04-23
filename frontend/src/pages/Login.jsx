import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.css";

const LOGIN_USERS = {
  "patient@dentai.com": {
    password: "Patient@123",
    role: "patient",
    name: "Pavesh",
    redirectTo: "/",
  },
  "admin@dentai.com": {
    password: "Admin@123",
    role: "admin",
    name: "Admin Demo",
    redirectTo: "/admin/dashboard",
  },
};

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const normalizedEmail = formData.email.trim().toLowerCase();
      const matchedUser = LOGIN_USERS[normalizedEmail];

      if (!matchedUser || matchedUser.password !== formData.password) {
        toast.error("Invalid email or password");
        return;
      }

      localStorage.setItem("userEmail", normalizedEmail);
      localStorage.setItem("userRole", matchedUser.role);
      localStorage.setItem("userName", matchedUser.name);
      localStorage.setItem("isAuthenticated", "true");

      toast.success("Login successful!");
      navigate(matchedUser.redirectTo);
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <div className="login-brand">
              <span className="login-brand-icon">⚕️</span>
              <h1>Dent AI</h1>
            </div>
            <h2>Welcome Back</h2>
            <p className="login-subtitle">Sign in to your account</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <button type="button" className="forgot-password">
                Forgot password?
              </button>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <button type="button" className="signup-link">
                Sign up
              </button>
            </p>
          </div>
        </div>

        <div className="login-illustration">
          <div className="illustration-card">
            <div className="illustration-icon">🦷</div>
            <h3>Advanced Dental Care</h3>
            <p>Experience cutting-edge dental technology combined with expert care</p>
          </div>
          <div className="illustration-card">
            <div className="illustration-icon">📊</div>
            <h3>Real-time Analytics</h3>
            <p>Track your health metrics and treatment progress with detailed insights</p>
          </div>
          <div className="illustration-card">
            <div className="illustration-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>Your data is encrypted and protected with industry-leading security</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
