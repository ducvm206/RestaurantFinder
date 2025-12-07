// src/pages/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import axios from "axios";
import "../styles/Register.css";

const Register = () => {
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
        credentials: "include", // <<< QUAN TRỌNG
        body: JSON.stringify({ email, name, avatar, authId, authType }),
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.message || "Xác thực mạng xã hội thất bại");
      }

      alert(`Đăng nhập bằng ${authType} thành công!`);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError("Không thể kết nối đến server");
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

    if (password !== confirmPassword) {
      return setError("Mật khẩu nhập lại không khớp!");
    }

    setIsLoading(true);

    try {
      const fullName = `${lastName} ${firstName}`.trim();

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // <<< BẮT BUỘC
        body: JSON.stringify({ email, password, fullName }),
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.message || "Đăng ký thất bại");
      }

      alert("Đăng ký thành công!");
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError("Lỗi kết nối server");
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------
  //   GOOGLE LOGIN
  // --------------------------------------------
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
        setError("Không thể lấy thông tin từ Google");
      }
    },
    onError: () => setError("Đăng nhập Google thất bại"),
  });

  // --------------------------------------------
  //   RETURN UI
  // --------------------------------------------
  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="register-header">
          <p className="sub-title">今日は!</p>
          <h1 className="register-title">アカウントを作成する</h1>
        </div>

        {error && (
          <p
            style={{ color: "red", textAlign: "center", marginBottom: "15px" }}
          >
            {error}
          </p>
        )}

        <form className="register-form" onSubmit={handleRegister}>
          <div className="input-group">
            <span className="material-icons-outlined input-icon">
              person_outline
            </span>
            <input
              type="text"
              className="form-input"
              placeholder="ファーストネーム"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <span className="material-icons-outlined input-icon">
              person_outline
            </span>
            <input
              type="text"
              className="form-input"
              placeholder="苗字"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <span className="material-icons-outlined input-icon">
              mail_outline
            </span>
            <input
              type="email"
              className="form-input"
              placeholder="メール"
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
              placeholder="パスワード"
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
              placeholder="パスワードを確認する"
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

          {/* CHECKBOX */}
          <div className="terms-container">
            <input
              id="terms"
              type="checkbox"
              className="terms-checkbox"
              required
            />
            <label htmlFor="terms" className="terms-label">
              続行すると、当社の
              <a href="#" className="terms-link">
                プライバシーポリシー
              </a>
              と
              <a href="#" className="terms-link">
                利用規約
              </a>
              に同意したことになります。
            </label>
          </div>

          <button type="submit" className="btn-register" disabled={isLoading}>
            {isLoading ? "処理中..." : "レジスター (Đăng ký)"}
          </button>
        </form>

        {/* SOCIAL LOGIN */}
        <div className="divider-container">
          <div className="divider-line"></div>
          <span className="divider-text">Or</span>
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
            onFail={() => setError("Đăng nhập Facebook thất bại")}
            render={({ onClick }) => (
              <button className="btn-social" onClick={onClick}>
                Facebook
              </button>
            )}
          />
        </div>

        <div className="register-footer">
          すでにアカウントをお持ちですか?
          <a href="/login" className="link-login">
            ログイン
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
