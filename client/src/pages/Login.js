// src/pages/Login.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import axios from "axios";
import "../styles/Login.css";

const Login = () => {
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
    alert(`Đăng nhập ${method} thành công!`);
    localStorage.setItem("user", JSON.stringify(data.user));
    navigate("/home");
  };

  // --- SOCIAL LOGIN ---
  const handleSocialAuth = async (email, name, avatar, authId, authType) => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // <<< bắt buộc để nhận cookie
        body: JSON.stringify({ email, name, avatar, authId, authType }),
      });

      const data = await res.json();
      if (res.ok) handleAuthSuccess(data, authType);
      else setError(data.message || "Lỗi xác thực mạng xã hội");
    } catch (err) {
      setError("Không thể kết nối đến Server");
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
        credentials: "include", // <<< bắt buộc
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        handleAuthSuccess(data);
      } else {
        setError(data.message || "Email hoặc mật khẩu không đúng");
      }
    } catch (err) {
      setError("Không thể kết nối đến Server");
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
        setError("Lỗi kết nối Google API");
      }
    },
    onError: () => setError("Đăng nhập Google thất bại"),
  });

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-header">
          <p className="welcome-text">今日は!</p>
          <h1 className="login-title">おかえり</h1>
        </div>

        {error && (
          <p
            style={{ color: "red", textAlign: "center", marginBottom: "15px" }}
          >
            {error}
          </p>
        )}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <span className="material-icons-outlined input-icon">email</span>
            <input
              type="email"
              className="form-input"
              placeholder="メール"
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

          <button type="submit" className="btn-primary" disabled={isLoading}>
            <span className="material-icons-outlined">login</span>
            {isLoading ? "処理中..." : "ログイン"}
          </button>
        </form>

        <div
          style={{ display: "flex", alignItems: "center", margin: "1.5rem 0" }}
        >
          <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
          <span style={{ padding: "0 10px", color: "#555" }}>
            Or Login with
          </span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
        </div>

        <div className="social-login">
          {/* GOOGLE */}
          <button className="btn-social" onClick={loginGoogle}>
            <span>Google</span>
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
            onFail={() => setError("Đăng nhập Facebook thất bại")}
            render={({ onClick }) => (
              <button className="btn-social" onClick={onClick}>
                Facebook
              </button>
            )}
          />
        </div>

        <div className="login-footer">
          まだアカウントをお持ちではありませんか?
          <a href="/register" className="link-register">
            レジスター
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
