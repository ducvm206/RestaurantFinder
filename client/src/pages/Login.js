// src/pages/Login.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import axios from "axios";
import "../styles/Login.css";
import useTranslation from "../hooks/useTranslation";

const Login = () => {
  const t = useTranslation(); // <<--- ADD
  const navigate = useNavigate();
  const FACEBOOK_APP_ID =
    process.env.REACT_APP_FACEBOOK_APP_ID || "1234567890123456";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // // Nếu đã đăng nhập rồi thì đá về Home luôn (UX tốt hơn)
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) navigate('/home');
  // }, [navigate]);

  // --- XỬ LÝ CHUNG ---
  const handleAuthSuccess = (data, method = "") => {
    alert(`${t("login.success")} ${method}!`);
    localStorage.setItem("user", JSON.stringify(data.user));
    window.dispatchEvent(new Event("user-updated"));
    navigate("/home");
  };

  // --- SOCIAL LOGIN ---
  const handleSocialAuth = async (email, name, avatar, authId, authType) => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, name, avatar, authId, authType }),
      });

      const data = await res.json();
      if (res.ok) handleAuthSuccess(data, authType);
      else setError(data.message || t("login.error_social"));
    } catch (err) {
      setError(t("login.server_error"));
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOGIN EMAIL/PASS ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        handleAuthSuccess(data);
      } else {
        setError(data.message || t("login.error_login"));
      }
    } catch (err) {
      setError(t("login.server_error"));
    } finally {
      setIsLoading(false);
    }
  };

  // --- GOOGLE ---
  const loginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );

        const { email, name, picture, sub } = userInfo.data;
        handleSocialAuth(email, name, picture, sub, "google");
      } catch (err) {
        setError(t("login.error_google"));
      }
    },
    onError: () => setError(t("login.error_google")),
  });

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* HEADER */}
        <div className="login-header">
          <p className="welcome-text">{t("login.welcome_text")}</p>
          <h1 className="login-title">{t("login.title")}</h1>
        </div>

        {/* ERROR */}
        {error && (
          <p
            style={{ color: "red", textAlign: "center", marginBottom: "15px" }}
          >
            {error}
          </p>
        )}

        {/* FORM */}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <span className="material-icons-outlined input-icon">email</span>

            <input
              type="email"
              className="form-input"
              placeholder={t("login.email_placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <span className="material-icons-outlined input-icon">lock</span>

            <input
              type={showPassword ? "text" : "password"}
              className="form-input"
              placeholder={t("login.password_placeholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="material-icons-outlined">
                {showPassword ? "visibility" : "visibility_off"}
              </span>
            </button>
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            <span className="material-icons-outlined">login</span>
            {isLoading ? t("login.processing") : t("login.button")}
          </button>
        </form>

        {/* OR LOGIN WITH */}
        <div
          style={{ display: "flex", alignItems: "center", margin: "1.5rem 0" }}
        >
          <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
          <span style={{ padding: "0 10px", color: "#555" }}>
            {t("login.or_login_with")}
          </span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
        </div>

        <div className="social-login">
          {/* GOOGLE */}
          <button className="btn-social" onClick={loginGoogle}>
            <FaGoogle
              className="social-icon"
              aria-hidden="true"
              style={{ color: "#DB4437" }}
            />
          </button>

          {/* FACEBOOK */}
          <FacebookLogin
            appId={FACEBOOK_APP_ID}
            fields="name,email,picture"
            onProfileSuccess={(res) =>
              handleSocialAuth(
                res.email,
                res.name,
                res.picture.data.url,
                res.id,
                "facebook"
              )
            }
            onFail={() => setError(t("login.error_facebook"))}
            render={({ onClick }) => (
              <button className="btn-social" onClick={onClick}>
                <FaFacebook
                  className="social-icon"
                  aria-hidden="true"
                  style={{ color: "#1877F2" }}
                />
              </button>
            )}
          />
        </div>

        {/* FOOTER */}
        <div className="login-footer">
          {t("login.no_account")}
          <a href="/register" className="link-register">
            {t("login.register")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
