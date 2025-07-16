
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "../style/signup.module.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords don't match!");
    }
    if (!agree) {
      return setError("You must agree to the terms and conditions.");
    }

    try {
      setError("");
      setLoading(true);
      await signup(email, password, username);
      navigate("/");
    } catch {
      setError("Failed to create an account!");
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
              <h3>Create an Account</h3>
            </div>
            <div className={styles.cardBody}>
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                {/* Username */}
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="Enter your username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <div className={styles.invalidFeedback}>
                    Please enter a username.
                  </div>
                </div>

                {/* Email */}
                <div className={styles.inputGroup}>
                  <input
                    type="email"
                    className={styles.formInput}
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className={styles.invalidFeedback}>
                    Please enter a valid email.
                  </div>
                </div>

                {/* Password */}
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
                  <div className={styles.invalidFeedback}>
                    Please enter a password.
                  </div>
                </div>

                {/* Confirm Password */}
                <div className={styles.inputGroup}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={styles.formInput}
                    placeholder="Confirm password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <div className={styles.invalidFeedback}>
                    Please confirm your password.
                  </div>
                </div>

                {/* Show Password & Agree */}
                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    id="showPassword"
                    checked={showPassword}
                    onChange={() => setShowPassword((prev) => !prev)}
                  />
                  <label htmlFor="showPassword" className={styles.checkboxLabel}>
                    Show Password
                  </label>
                </div>

                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    id="agree"
                    checked={agree}
                    onChange={() => setAgree((prev) => !prev)}
                    required
                  />
                  <label htmlFor="agree" className={styles.checkboxLabel}>
                    I agree to the <Link to="/term">terms and conditions</Link>
                  </label>
                </div>

                {/* Buttons */}
                <div className={styles.buttonGroup}>
                  <button
                    type="submit"
                    className={`${styles.button} ${styles.buttonPrimary}`}
                    disabled={loading}
                  >
                    Sign Up
                  </button>
                  <button
                    type="reset"
                    className={`${styles.button} ${styles.buttonSecondary}`}
                    onClick={() => {
                      setUsername(''); setEmail(''); setPassword(''); setConfirmPassword(''); setAgree(false);
                    }}
                    disabled={loading}
                  >
                    Reset
                  </button>
                </div>

                {error && <p className={styles.errorMessage}>{error}</p>}

                <p className={styles.footerText}>
                  Already have an account? <Link to="/login">Log In</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

