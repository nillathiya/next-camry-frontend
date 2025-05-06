"use client";
import React, { useEffect } from "react";
import Taptop from "@/layout/tap-top/index";
import ThemeCustomizer from "@/layout/theme-customizer";
import Header from "@/layout/Header";
import Sidebar from "@/layout/sidebar";
import FooterLayout from "@/layout/footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Taptop />
      <div className={`page-wrapper`} id="pageWrapper">
        <Header />
        <div className="page-body-wrapper">
          <Sidebar />
          <div className="page-body">{children}</div>
          <FooterLayout />
        </div>
      </div>
      <ThemeCustomizer />
    </>
  );
};

export default Layout;
