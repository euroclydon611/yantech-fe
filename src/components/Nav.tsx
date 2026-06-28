import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Badge, Avatar, Button, Space, MenuProps } from "antd";
import { 
  LogOut, 
  LogIn, 
  Key, 
  Bell, 
  ChevronDown
} from "lucide-react";
import { useLogoutMutation } from "../redux/features/auth/authApi";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { useNotificationListQuery } from "../redux/features/users/notificationApi";
import { formatDistanceToNow } from "date-fns";
import { userLogout } from "../redux/features/auth/authSlice";
import { apiSlice } from "../redux/features/api/apiSlice";
import { useSocket } from "../context/SocketContext";

const Nav = ({ setChangePsd }: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth) as any;
  const { socket } = useSocket();

  const { data: notificationData, refetch: refetchNotifications } = useNotificationListQuery({});

  const [logout, {isLoading, isSuccess}] = useLogoutMutation();

  useEffect(() => {
    if (socket) {
      console.log("Setting up notification listener in Nav");
      const handleNotification = (notification: any) => {
        console.log("New notification received via socket in Nav:", notification);
        
        // Play notification sound
        const audio = new Audio("/new-notification-022-370046.mp3");
        audio.play().catch(err => console.log("Audio play failed:", err));

        // Show toast
        toast.success(notification.message || "New notification received", {
          duration: 4000,
          position: "top-right",
        });

        // Refetch notification list to update counter and dropdown
        if (refetchNotifications) {
          refetchNotifications();
        }
      };

      socket.on("notification", handleNotification);

      return () => {
        console.log("Removing notification listener from Nav");
        socket.off("notification", handleNotification);
      };
    }
  }, [socket, refetchNotifications]);

  const logOutHandler = async () => {
    try {
      await logout({}).unwrap();
      dispatch(userLogout());
      dispatch(apiSlice.util.resetApiState());
    } catch (error) {
      dispatch(userLogout());
      dispatch(apiSlice.util.resetApiState());
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Logged out successfully");
      window.location.href = "/login";
    }
  }, [isSuccess]);

  const userMenuItems: MenuProps['items'] = [
    {
      key: "userInfo",
      label: (
        <div className="px-1 py-2 border-b border-gray-100 min-w-[200px]">
          <div className="flex items-center space-x-3">
            <Avatar 
              style={{ backgroundColor: '#f6ffed', color: '#52c41a' }}
              className="font-bold"
            >
              {user?.firstname?.[0]?.toUpperCase()}
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate m-0">
                {user?.firstname} {user?.lastname}
              </p>
              <p className="text-xs text-gray-600 truncate m-0">
                {user?.email || "No email provided"}
              </p>
            </div>
          </div>
        </div>
      ),
      disabled: true,
      className: "!cursor-default !bg-transparent pointer-events-none"
    },
    {
      key: "changePassword",
      icon: <Key size={14} />,
      label: "Change Password",
      onClick: () => setChangePsd(true),
    },
    {
      type: 'divider',
    },
    ...(user
      ? [
          {
            key: "logout",
            icon: <LogOut size={14} />,
            label: "Logout",
            danger: true,
            onClick: logOutHandler,
          },
        ]
      : [
          {
            key: "login",
            icon: <LogIn size={14} />,
            label: <Link to="/login">Login</Link>,
          },
        ]),
  ];

  const notificationItems: MenuProps['items'] = (notificationData?.data?.unread?.length > 0 
    ? notificationData.data.unread.slice(0, 5).map((notification: any) => ({
        key: notification._id,
        label: (
          <div className="py-2 max-w-[300px]">
            <p className="font-semibold text-sm line-clamp-2 m-0 text-wrap">
              {notification.message}
            </p>
            <span className="text-[10px] text-gray-500">
              {formatDistanceToNow(new Date(notification?.created_at), { addSuffix: true })}
            </span>
          </div>
        ),
      }))
    : [{
        key: 'no-notifications',
        label: <div className="py-4 text-center text-gray-500">No new notifications</div>,
        disabled: true
      }]) as MenuProps['items'];

  if (notificationItems) {
    notificationItems.push({
      type: 'divider',
    });
    
    notificationItems.push({
      key: 'view-all',
      label: (
        <Link to="/notifications" className="text-blue-500 text-center block w-full text-xs font-medium py-1">
          View All Notifications
        </Link>
      ),
    });
  }

  return (
    <nav className="ms-auto pr-3 flex items-center">
      <div className="flex items-center space-x-2">
        {/* Notifications */}
        <Dropdown
          menu={{ items: notificationItems }}
          trigger={['click']}
          placement="bottomRight"
          overlayClassName="min-w-[320px]"
        >
          <Badge
            count={notificationData?.data?.unread?.length || 0}
            size="small"
            offset={[-4, 4]}
            className="cursor-pointer"
          >
            <Button
              type="text"
              icon={<Bell size={18} className="text-white" />}
              className="hover:!bg-white/10 flex items-center justify-center border-none !p-1.5 pointer-events-none"
            />
          </Badge>
        </Dropdown>

        {/* User Dropdown */}
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          trigger={['click']}
          overlayClassName="min-w-[240px]"
        >
          <Button
            type="text"
            className="h-auto py-1 px-1.5 hover:!bg-white/10 transition-colors duration-200 rounded-lg flex items-center border-none"
          >
            <Space size={8}>
              <Avatar
                size={28}
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}
                className="font-semibold text-xs text-white"
              >
                {user?.firstname?.[0]?.toUpperCase()}
              </Avatar>
              <div className="hidden md:flex flex-col items-start text-left leading-tight">
                <span className="text-xs font-semibold text-white">
                  Hi, {user?.firstname}
                </span>
              </div>
              <ChevronDown size={12} className="text-white/70" />
            </Space>
          </Button>
        </Dropdown>
      </div>
    </nav>
  );
};

export default Nav;
