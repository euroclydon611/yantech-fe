import { useEffect, useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Spin, message, Menu, ConfigProvider, Avatar, Modal, Tooltip } from "antd";
import { LogoutOutlined, BookOutlined, DownloadOutlined, PlayCircleOutlined } from "@ant-design/icons";

import { RootState } from "../../../redux/store";
import { useEmployeeImageQuery } from "../../../redux/features/employee/employeeApi";
import { useEmployeeLogoutMutation } from "../../../redux/features/employee-portal-api/authApi";
import { getIPMSNavItems, getEmployeeNavItems } from "./navItemsData";
import { useGetSubDivisionsQuery } from "@/redux/features/employee-portal-api/subdivisionApi";
import { useGetLatestEpisodeQuery } from "@/redux/features/employee-portal-api/videoApi";

// Helper function to transform your nav data into the format Ant Design's Menu expects
const transformToAntdMenuItems = (sections, employee) => {
  return sections.reduce((acc, section) => {
    const visibleItems = section.items.filter((item) => {
      if (item.show === false) return false; // Explicitly hidden
      if (item.show === true) return !!employee; // Only if employee exists
      if (typeof item.show === "boolean" && employee) return item.show;
      return true; // Default show
    });

    if (visibleItems.length === 0) return acc;

    if (!section.section) {
      visibleItems.forEach((item) => {
        acc.push({
          key: item.path,
          label: (
            <Link to={item.path} className="font-bold !text-white uppercase text-[10px]">
              {item.label}
            </Link>
          ),
          icon: item.icon,
        });
      });
    } else if (section.collapsible === false) {
      acc.push({
        type: "group",
        label: (
          <span className="text-[9px] font-extrabold uppercase tracking-widest pl-2" style={{ color: "rgba(245,166,35,0.75)" }}>
            {section.section}
          </span>
        ),
        children: visibleItems.map((item) => ({
          key: item.path,
          label: (
            <Link to={item.path} className="text-[10px] pl-1">
              {item.label}
            </Link>
          ),
          icon: item.icon,
        })),
      });
    } else {
      acc.push({
        key: section.sectionKey,
        label: (
          <span className="font-bold uppercase tracking-widest text-[9px]">
            {section.section}
          </span>
        ),
        children: visibleItems.map((item) => ({
          key: item.path,
          label: (
            <Link to={item.path} className="text-[10px] pl-1">
              {item.label}
            </Link>
          ),
          icon: item.icon,
        })),
      });
    }

    return acc;
  }, []);
};

export default function Sidebar({ sidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { employee } = useSelector((state: RootState) => state.employee_auth);
  const [manualOpen, setManualOpen] = useState(false);

  // Your localStorage-backed state for expanded sections
  const [openKeys, setOpenKeys] = useState(() => {
    const saved = localStorage.getItem("sidebar-expanded-sections");
    return saved ? JSON.parse(saved) : ["assignments"];
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded-sections", JSON.stringify(openKeys));
  }, [openKeys]);

  const [logout, { isSuccess, isLoading: isLoggingOut, data: logoutData }] =
    useEmployeeLogoutMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success(logoutData?.message || "Logged out successfully.");
      navigate("/employee");
    }
  }, [isSuccess, logoutData, navigate]);

  const handleLogout = () => {
    logout({});
  };

  // Check if the current employee is a head of any subdivision
  const { data: subDivisionsData } = useGetSubDivisionsQuery(undefined, {
    skip: !employee,
  });
  const isGroupHead = useMemo(() => {
    if (!employee || !subDivisionsData?.data?.length) return false;
    return subDivisionsData.data.some(
      (sd: any) =>
        (sd.head?._id || sd.head)?.toString() === (employee as any)._id?.toString()
    );
  }, [employee, subDivisionsData]);

  // Memoize the menu items to prevent re-calculating on every render
  const IPMSMenuItems = useMemo(
    () => transformToAntdMenuItems(getIPMSNavItems(employee, isGroupHead), employee),
    [employee, isGroupHead]
  );
  const employeeMenuItems = useMemo(
    () => transformToAntdMenuItems(getEmployeeNavItems(employee), employee),
    [employee]
  );

  const { data: latestEpisodeData } = useGetLatestEpisodeQuery(undefined, { skip: !employee });
  const latestEpisode = latestEpisodeData?.data;
  // Show "NEW" badge for 7 days after an episode is published
  const hasNewEpisode = useMemo(() => {
    if (!latestEpisode?.publishedAt) return false;
    const daysSince = (Date.now() - new Date(latestEpisode.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSince < 7;
  }, [latestEpisode]);

  const trainingSeriesMenuItem = useMemo(() => ({
    key: "/employee-portal/training-series",
    icon: <PlayCircleOutlined style={{ color: "#fbbf24" }} />,
    label: (
      <Link to="/employee-portal/training-series" className="flex items-center justify-between w-full">
        <span className="text-[10px] font-bold text-yellow-300">Training Series</span>
        {hasNewEpisode && (
          <span
            className="ml-1 text-[8px] font-extrabold px-1 py-0 rounded-full leading-none"
            style={{ background: "#fbbf24", color: "#1a1a1a" }}
          >
            NEW
          </span>
        )}
      </Link>
    ),
  }), [hasNewEpisode]);

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#F5A623" },
        components: {
          Menu: {
            itemBg: "#0A1628",
            itemColor: "rgba(255, 255, 255, 0.72)",
            itemHoverColor: "#ffffff",
            itemHoverBg: "rgba(245,166,35,0.10)",
            itemSelectedBg: "rgba(245,166,35,0.18)",
            itemSelectedColor: "#F5A623",
            subMenuItemBg: "#060f1e",
            groupTitleColor: "rgba(245,166,35,0.70)",
            itemPaddingInline: 10,
            itemMarginInline: 0,
            fontSize: 10,
            itemHeight: 28,
            subMenuItemBorderRadius: 4,
            ...({ indentSize: 12 } as any),
          },
        },
      }}
    >
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-44 text-white flex-shrink-0 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "#0A1628", borderRight: "1px solid rgba(245,166,35,0.15)" }}
      >
        <div className="h-full flex flex-col">
          {/* Profile Section */}
          <div className="px-3 py-2.5 flex items-center gap-2.5 mt-12 border-b" style={{ borderColor: "rgba(245,166,35,0.20)" }}>
            <Avatar
              size={34}
              src={employee?.passport_image_url}
              className="flex-shrink-0"
              style={{ border: "1px solid rgba(245,166,35,0.40)" }}
            >
              {employee?.firstname?.[0]}
              {employee?.lastname?.[0]}
            </Avatar>
            <div className="min-w-0">
              <p className="font-semibold text-white text-[11px] leading-tight truncate">
                {employee?.firstname} {employee?.lastname}
              </p>
              <p className="text-[10px] truncate" style={{ color: "#F5A623" }}>{employee?.grade}</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto custom-scrollbar">
            <Menu
              theme="dark"
              mode="inline"
              className="w-full border-r-0"
              style={{ background: "#0A1628" }}
              selectedKeys={[location.pathname]}
              openKeys={openKeys}
              onOpenChange={setOpenKeys}
              items={[...IPMSMenuItems, ...employeeMenuItems]}
            />
          </nav>

          {/* Operational Manual & Training Series Section */}
          <div className="px-2.5 pt-2 pb-1 border-t space-y-1" style={{ borderColor: "rgba(245,166,35,0.20)" }}>
            <Tooltip title="View & Download Operational Manual" placement="right">
              <Button
                block
                size="small"
                icon={<BookOutlined style={{ color: "#F5A623" }} />}
                onClick={() => setManualOpen(true)}
                className="!font-semibold !text-[10px]"
                style={{ background: "rgba(245,166,35,0.12)", color: "rgba(245,166,35,0.90)", border: "1px solid rgba(245,166,35,0.25)" }}
              >
                Operational Manual
              </Button>
            </Tooltip>

            <Tooltip title="Watch Training Series" placement="right">
              <Button
                block
                size="small"
                icon={<PlayCircleOutlined style={{ color: "#F5A623" }} />}
                onClick={() => navigate("/employee-portal/training-series")}
                className="!font-semibold !text-[10px] flex items-center justify-center gap-1"
                style={{ background: "rgba(245,166,35,0.12)", color: "#F5A623", border: "1px solid rgba(245,166,35,0.25)" }}
              >
                <span>Training Series</span>
                {hasNewEpisode && (
                  <span
                    className="text-[8px] font-extrabold px-1 py-0 rounded-full leading-none"
                    style={{ background: "#fbbf24", color: "#1a1a1a" }}
                  >
                    NEW
                  </span>
                )}
              </Button>
            </Tooltip>
          </div>

          {/* Logout Button */}
          <div className="px-2.5 py-2">
            <Button
              block
              size="small"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              loading={isLoggingOut}
              className="!font-bold !text-[10px] !border-none"
              style={{ background: "rgba(206,17,38,0.20)", color: "#ff6b6b" }}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </aside>

      {/* Operational Manual Modal */}
      <Modal
        open={manualOpen}
        onCancel={() => setManualOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <BookOutlined className="text-green-700" />
            <span className="font-bold text-gray-800">YANTEC Operational Manual</span>
          </div>
        }
        width="85vw"
        style={{ top: 20 }}
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={() => setManualOpen(false)}>Close</Button>
            <a href="/manual/Operational_Manual.pdf" download="IPMS_Operational_Manual.pdf">
              <Button type="primary" icon={<DownloadOutlined />} style={{ background: "#0A1628", borderColor: "#0A1628" }} className="hover:!opacity-90 !border-none">
                Download PDF
              </Button>
            </a>
          </div>
        }
      >
        <div className="w-full" style={{ height: "80vh" }}>
          <iframe
            src="/manual/Operational_Manual.pdf"
            title="IPMS Operational Manual"
            className="w-full h-full rounded border border-gray-200"
            style={{ minHeight: "75vh" }}
          />
        </div>
      </Modal>
    </ConfigProvider>
  );
}
