import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./adminNavbar";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminNavbar />

      <main className="admin-content">
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminLayout;
