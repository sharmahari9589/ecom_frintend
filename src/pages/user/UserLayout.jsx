import React from "react";
import { Outlet } from "react-router-dom";
import UserNavbar from "./UserNavbar";

export default function UserLayout() {
  return (
    <>
      <UserNavbar />
      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
}
