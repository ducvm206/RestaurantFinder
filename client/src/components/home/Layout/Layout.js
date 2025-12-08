// src/components/Layout.js
import { Outlet } from "react-router-dom";
import TopBar from "../../topbar/TopBar";
import { useState, useContext } from "react";
import { LanguageContext } from "../../../context/LanguageContext";

export default function Layout({ user }) {
  return (
    <div>
      {/* Persistent top bar */}
      <TopBar user={user} />

      {/* Render page content */}
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  );
}
