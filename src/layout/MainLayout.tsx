import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import Headers from "../components/Header";
import { useDarkMode } from "../context/DarkModeProvider";
import CustomModal from "../utils/CustomModal";
import ChangePassword from "../pages/users/ChangePassword";

const { Content } = Layout;

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [changPsd, setChangePsd] = useState(false);

  const handleToggleSidebar = (open: boolean) => {
    setSidebarOpen(open);
    localStorage.setItem("sidebarOpen", JSON.stringify(open));
  };

  const { isDarkMode, setIsDarkMode } = useDarkMode();

  return (
    <Layout className="min-h-screen">
      {changPsd && (
        <CustomModal
          open={changPsd}
          setOpen={setChangePsd}
          Component={ChangePassword}
        />
      )}
      <Headers
        sidebarOpen={sidebarOpen}
        setSidebarOpen={handleToggleSidebar}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        changPsd={changPsd}
        setChangePsd={setChangePsd}
      />
      <Layout className={`transition-colors duration-500`}>
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={handleToggleSidebar}
        />

        <Content
          className={`transition-all duration-300 min-h-screen ${
            sidebarOpen ? "ml-44" : "ml-12"
          } pt-12`}
        >
          <div className="bg-[#F5F5F5] min-h-[calc(100vh-60px)] p-4 relative">
            <Outlet />
            <div className="football-overlay"></div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
