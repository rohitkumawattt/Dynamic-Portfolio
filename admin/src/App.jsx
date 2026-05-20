import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import { useAuth } from "@/context/authContext.jsx";
import Dashboad from "./pages/Dashboad";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Messages from "./pages/Messages";
import ProfileSetting from "./pages/ProfileSetting";
import MainLayout from "./layout/MainLayout";

function App() {
  const { isLogin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }
  return (
    <>
      <Routes>
        {/* Public routes  */}
        {!isLogin && (
          <>
            <Route path="/login" element={<Login />} />
            {/* If user tries to go anywhere else → redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}

        {/* Protected Routes  */}

        {isLogin && (
          <>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboad />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/profile-setting" element={<ProfileSetting />} />
            </Route>
            {/* If user tries to go to login/register after logged in */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
