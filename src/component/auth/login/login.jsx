import React, { useState } from "react";
import { authService } from "../AuthService";
import styles from "./Login.module.css";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.role) {
      setMessage({ text: "Please fill in all fields", type: "error" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ text: "Please enter a valid email address", type: "error" });
      return;
    }

    setIsLoading(true);

    try {
      const credentials = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      const response = await authService.login(credentials);

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      setMessage({ text: "Login successful! Redirecting...", type: "success" });

      setTimeout(() => {
        if (formData.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/voter");
        }
      }, 500);
    } catch (error) {
      setMessage({
        text: error.response?.data || error.message || "Login failed",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hideMessage = () => {
    if (message.type === "error") {
      setMessage({ text: "", type: "" });
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.logoContainer}>ECI</div>
          <h1>Welcome</h1>
          <p>Log in to access your voting portal</p>
        </div>

        {message.text && (
          <div
            className={`${styles.message} ${styles[message.type]} ${
              styles.show
            }`}
          >
            {message.text}
          </div>
        )}

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>📧</span>
              <input
                type="email"
                id="email"
                name="email"
                placeholder=" "
                value={formData.email}
                onChange={handleInputChange}
                onFocus={hideMessage}
                required
                autoComplete="email"
              />
              <label htmlFor="email">Email Address</label>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder=" "
                value={formData.password}
                onChange={handleInputChange}
                onFocus={hideMessage}
                required
                autoComplete="current-password"
              />
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={togglePassword}
              >
                <span>{showPassword ? "🙈" : "👁️"}</span>
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>👤</span>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                onFocus={hideMessage}
                required
              >
                <option value="">Select your role</option>
                <option value="voter">Voter</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className={styles.btnGroup}>
            <button
              type="submit"
              className={`${styles.btn} ${styles.btnPrimary} ${
                isLoading ? styles.loading : ""
              }`}
              disabled={isLoading}
            >
              <span style={{ opacity: isLoading ? 0 : 1 }}>Log In</span>
            </button>

            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => navigate("/signup")}
            >
              <span>Sign Up</span>
            </button>

            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => navigate("/auth/verify-account")}
            >
              <span>✓ Verify Account</span>
            </button>
          </div>

          <div className={styles.formLinks}>
            <Link to="/auth/forgot-password" className={styles.formLink}>
              Forgot Password?
            </Link>
            <Link to="/" className={styles.formLink}>
              Back to Home
            </Link>
          </div>
        </form>

        <div className={styles.divider}>
          <span>Secure Login</span>
        </div>

        <div className={styles.loginFooter}>
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
          <Link to="/help">Need Help?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
