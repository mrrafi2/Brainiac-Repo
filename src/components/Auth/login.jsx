//simple login form with toggleable password visibility
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "../style/login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState();
  const [loading, setLoading] = useState();

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch {
      setError("Failed to login!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Login</h3>
            </div>
            <div className={styles.cardBody}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <input
                    type="email"
                    className={styles.formInput}
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={styles.formInput}
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>

                <div className={styles.buttonGroup}>
                  <button
                    type="submit"
                    className={`${styles.button} ${styles.buttonPrimary}`}
                    disabled={loading}
                  >
                    Login
                  </button>
                  <button
                    type="reset"
                    className={`${styles.button} ${styles.buttonSecondary}`}
                    onClick={() => { setEmail(''); setPassword(''); }}
                    disabled={loading}
                  >
                    Reset
                  </button>
                </div>

                {error && (
                  <p className={styles.errorMessage}>{error}</p>
                )}

                <p className={styles.footerText}>
                  Don&apos;t have an account? <Link to="/singup">Sign-up</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// TODO: add OAuth buttons for Google/Facebook

export default Login;

