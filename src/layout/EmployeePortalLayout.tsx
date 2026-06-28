import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import { useState, useEffect } from "react";
import Header from "@/employee_portal_pages/components/layout/Header";
import Sidebar from "@/employee_portal_pages/components/layout/Sidebar";
import Swal from "sweetalert2";

const EmployeePortalLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const shouldPrompt = sessionStorage.getItem("show_manual_prompt");
    if (shouldPrompt) {
      sessionStorage.removeItem("show_manual_prompt");
      setTimeout(() => {
        Swal.fire({
          title: "📘 Operational Manual Available",
          html: `
            <p style="color:#374151;font-size:14px;line-height:1.6">
              The <strong>IPMS Operational Manual</strong> is now available to guide you through processing permit applications and licenses from start to finish.
            </p>
            <p style="color:#6b7280;font-size:13px;margin-top:10px">
              You can access it at any time from the <strong>sidebar</strong> (bottom left).
            </p>
          `,
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "View Manual",
          cancelButtonText: "Later",
          confirmButtonColor: "#166534",
          cancelButtonColor: "#6b7280",
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            window.open("/manual/Operational_Manual.pdf", "_blank");
          }
        });
      }, 800);
    }
  }, []);

  return (
    <>
      <Header toggleSidebar={toggleSidebar}  />

      <Sidebar sidebarOpen={sidebarOpen}/>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <div
        className={`pt-12 min-h-screen overflow-x-hidden transition-all duration-300 ${
          sidebarOpen ? "lg:ml-44" : "lg:ml-0"
        }`}
      >
        <Layout className="wrapper bg-white text-primary-black flex flex-col h-full relative pb-4">
          {/* Content here */}
          <Outlet />

          <footer
            className={`absolute bottom-3 pl-2 text-xs dark:text-white transition-all duration-300`}
          >
            {/* © 2024, Calculus Solutions Limited{" "} */}
          </footer>

          <div className="football-overlay"></div>
        </Layout>
      </div>

      {/* <MobileNavigation /> */}
    </>
  );
};

export default EmployeePortalLayout;
