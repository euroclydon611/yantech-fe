import { Button, Dropdown, Badge, Avatar, Tooltip, Space, MenuProps } from "antd";
import { Bell, User, Key, Settings, LogOut, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useEmployeeLogoutMutation } from "../../../redux/features/employee-portal-api/authApi";
import toast from "react-hot-toast";
import { useEffect } from "react";
import {
  useEmployeeNotificationListQuery,
} from "../../../redux/features/employee-portal-api/notificationApi";
import { IoMdMenu } from "react-icons/io";
import { useSocket } from "../../../context/SocketContext";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const navigate = useNavigate();
  const { socket } = useSocket();

  const { employee } = useSelector((state: RootState) => state.employee_auth);

  const handleNotificationBellClick = () => {
    navigate('/employee-portal/notification-hub');
  };

  const { data: notificationData, refetch: refetchNotifications } =
    useEmployeeNotificationListQuery({});

  useEffect(() => {
    if (socket) {
      const handleNotification = (notification: any) => {
        console.log("New employee notification received via socket:", notification);
        
        // Play notification sound
        const audio = new Audio("/new-notification-022-370046.mp3");
        audio.play().catch(err => console.log("Audio play failed:", err));

        // Show toast
        toast.success(notification.message || "New notification received", {
          duration: 4000,
          position: "top-right",
        });

        // Refetch notification list to update counter
        refetchNotifications();
      };

      socket.on("notification", handleNotification);

      return () => {
        socket.off("notification", handleNotification);
      };
    }
  }, [socket, refetchNotifications]);

  const [logout, { data, isSuccess, isLoading, error }] =
    useEmployeeLogoutMutation();

  const logOutHandler = async () => {
    try {
      await logout({});
    } catch (error) {
      toast.error("Logout failed. Please try again later.");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Logged out successfully", { duration: 5000 });
      navigate("/employee");
    }
  }, [isSuccess, error, data, navigate]);

  const unreadCount = notificationData?.stats?.unreadCount || 0;

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <div className="px-1 py-2 border-b border-gray-100 min-w-[200px]">
          <div className="flex items-center space-x-3">
            <Avatar 
              style={{ backgroundColor: '#f6ffed', color: '#52c41a' }}
              className="font-bold"
            >
              {employee?.firstname?.[0]?.toUpperCase() || employee?.username?.[0]?.toUpperCase()}
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate m-0">
                {employee ? `${employee.firstname} ${employee.lastname}` : employee?.username}
              </p>
              <p className="text-xs text-gray-600 truncate m-0">
                {employee?.email || employee?.personal_email || "No email provided"}
              </p>
            </div>
          </div>
        </div>
      ),
      disabled: true,
      className: "!cursor-default !bg-transparent pointer-events-none"
    },
    {
      key: 'profile',
      icon: <User size={14} />,
      label: <Link to="/employee-portal/profile">My Profile</Link>,
    },
    {
      key: 'staff',
      icon: <User size={14} />,
      label: <Link to="/employee-portal/team-members">Staff</Link>,
    },
    {
      key: 'password',
      icon: <Key size={14} />,
      label: <Link to="/employee-portal/settings">Change Password</Link>,
    },
    {
      key: 'settings',
      icon: <Settings size={14} />,
      label: <Link to="/employee-portal/settings">Settings</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogOut size={14} />,
      label: 'Logout',
      danger: true,
      onClick: logOutHandler,
      disabled: isLoading
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#05180E] border-b border-green-900/60 shadow-md">
      <div className="flex justify-between items-center h-12 lg:pr-4">
        {/* Left Section - Logo & Brand */}
        <div className="flex items-center gap-2.5 px-3 h-full min-[1200px]:w-[176px]">
          <Link
            to="/employee-portal/dashboard"
            className="flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0"
          >
            <img
              src="/images/logo.png"
              alt="YANTEC Engineering"
              className="w-7 h-7 object-contain"
            />
          </Link>
          <div className="hidden min-[1200px]:flex flex-col leading-none">
            <span className="text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap" style={{ color: "#D4A017" }}>
              Ghana Sports
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: "rgba(212,160,23,0.70)" }}>
              Fund — Staff Portal
            </span>
          </div>
          <Button
            type="text"
            icon={<IoMdMenu size={18} />}
            onClick={toggleSidebar}
            className="!text-white/70 hover:!text-white hover:!bg-white/10 flex items-center justify-center !p-1 ml-auto"
          />
        </div>

        {/* Right Section - Actions & User */}
        <div className="flex items-center space-x-2 text-white pr-3">
          {/* Notifications */}
          <div
            onClick={handleNotificationBellClick}
            className="cursor-pointer"
            title="View notifications"
          >
            <Badge count={unreadCount} overflowCount={99} size="small" offset={[-4, 4]}>
              <Button
                type="text"
                icon={<Bell size={18} />}
                className="text-white hover:!bg-white/10 flex items-center justify-center !p-1.5 pointer-events-none"
              />
            </Badge>
          </div>

          {/* User Dropdown */}
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
            overlayClassName="min-w-[220px]"
          >
            <Button
              type="text"
              className="h-auto py-1 px-1.5 hover:!bg-white/10 transition-colors duration-200 rounded-lg flex items-center border-none"
            >
              <Space size={8}>
                <Avatar
                  size={28}
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}
                  className="font-semibold text-xs"
                >
                  {employee?.firstname?.[0]?.toUpperCase() || employee?.username?.[0]?.toUpperCase()}
                </Avatar>
                <div className="hidden md:flex flex-col items-start text-left leading-tight">
                  <span className="text-xs font-semibold text-white">
                    {employee ? `${employee.firstname} ${employee.lastname}` : employee?.username || "User"}
                  </span>
                  {employee?.is_head && (
                    <span className="text-[9px] bg-green-900 px-1 py-0.5 rounded text-green-200 mt-0.5 leading-none">
                      HOD
                    </span>
                  )}
                </div>
                <ChevronDown size={12} className="text-green-100" />
              </Space>
            </Button>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
