// src/pages/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import axios from "axios";
import "../styles/Register.css";
import useTranslation from "../hooks/useTranslation";

const Register = () => {
  const t = useTranslation(); // <-- IMPORTANT
  const navigate = useNavigate();
  const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --------------------------------------------
  //   SOCIAL AUTH (Google / Facebook)
  // --------------------------------------------
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

      if (!res.ok) return setError(data.message || t("register.error_social"));

      alert(`${t("register.button")} ${authType} OK!`);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(t("register.error_server"));
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------
  //   ĐĂNG KÝ THƯỜNG
  // --------------------------------------------
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword)
      return setError(t("register.error_password_mismatch"));

    setIsLoading(true);

    try {
      const fullName = `${lastName} ${firstName}`.trim();

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, fullName }),
      });

      const data = await res.json();

      if (!res.ok) return setError(t("register.error_register"));

      alert(t("register.button") + " OK!");
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(t("register.error_server"));
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------
  //   GOOGLE AUTH
  // --------------------------------------------
  const loginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const { email, name, picture, sub } = userInfo.data;
        handleSocialAuth(email, name, picture, sub, "google");
      } catch {
        setError(t("register.error_google"));
      }
    },
    onError: () => setError(t("register.error_google")),
  });

  // --------------------------------------------
  //   RETURN UI
  // --------------------------------------------
  return (
    <div className="register-container">
      <div className="register-wrapper">
        {/* HEADER */}
        <div className="register-header">
          <p className="sub-title">{t("register.welcome_text")}</p>
          <h1 className="register-title">{t("register.title")}</h1>
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
        <form className="register-form" onSubmit={handleRegister}>
          {/* First Name */}
          <div className="input-group">
            <span className="material-icons-outlined input-icon">
              person_outline
            </span>
            <input
              type="text"
              className="form-input"
              placeholder={t("register.first_name")}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          {/* Last Name */}
          <div className="input-group">
            <span className="material-icons-outlined input-icon">
              person_outline
            </span>
            <input
              type="text"
              className="form-input"
              placeholder={t("register.last_name")}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="input-group">
            <span className="material-icons-outlined input-icon">
              mail_outline
            </span>
            <input
              type="email"
              className="form-input"
              placeholder={t("register.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <span className="material-icons-outlined input-icon">
              lock_outline
            </span>
            <input
              type={showPassword ? "text" : "password"}
              className="form-input"
              placeholder={t("register.password")}
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

          {/* CONFIRM PASSWORD */}
          <div className="input-group">
            <span className="material-icons-outlined input-icon">
              lock_outline
            </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="form-input"
              placeholder={t("register.confirm_password")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <span className="material-icons-outlined">
                {showConfirmPassword ? "visibility" : "visibility_off"}
              </span>
            </button>
          </div>

          {/* TERMS */}
          <div className="terms-container">
            <input
              id="terms"
              type="checkbox"
              className="terms-checkbox"
              required
            />
            <label htmlFor="terms" className="terms-label">
              {t("register.terms_1")}{" "}
              <a className="terms-link">{t("register.terms_privacy")}</a>{" "}
              {t("register.terms_and")}{" "}
              <a className="terms-link">{t("register.terms_service")}</a>{" "}
              {t("register.terms_2")}
            </label>
          </div>

          {/* SUBMIT BUTTON */}
          <button type="submit" className="btn-register" disabled={isLoading}>
            {isLoading ? t("register.processing") : t("register.button")}
          </button>
        </form>

        {/* SOCIAL LOGIN */}
        <div className="divider-container">
          <div className="divider-line"></div>
          <span className="divider-text">{t("register.or")}</span>
          <div className="divider-line"></div>
        </div>

        <div className="social-login">
          {/* Google */}
          <button className="btn-social" onClick={loginGoogle}>
            Google
          </button>

          {/* Facebook */}
          <FacebookLogin
            appId={FACEBOOK_APP_ID}
            fields="name,email,picture"
            onProfileSuccess={(res) =>
              handleSocialAuth(
                res.email,
                res.name,
                res.picture?.data?.url,
                res.id,
                "facebook"
              )
            }
            onFail={() => setError(t("register.error_facebook"))}
            render={({ onClick }) => (
              <button className="btn-social" onClick={onClick}>
                Facebook
              </button>
            )}
          />
        </div>

        {/* FOOTER */}
        <div className="register-footer">
          {t("register.footer_question")}
          <a href="/login" className="link-login">
            {t("register.footer_login")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
