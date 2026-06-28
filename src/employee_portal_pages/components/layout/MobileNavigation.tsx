import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { User, Calendar, FileText, Settings } from "lucide-react";

export default function MobileNavigation() {
  const location = useLocation();

  const navItems = [
    {
      path: "/employee-portal/profile",
      label: "Profile",
      icon: <User className="text-xl" />,
    },
    {
      path: "/employee-portal/leave",
      label: "Leave",
      icon: <Calendar className="text-xl" />,
    },
    // {
    //   path: "/employee-portal/documents",
    //   label: "Docs",
    //   icon: <FileText className="text-xl" />,
    // },
    {
      path: "/employee-portal/settings",
      label: "Settings",
      icon: <Settings className="text-xl" />,
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center py-3",
              location.pathname === item.path
                ? "text-primary-600"
                : "text-gray-500"
            )}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
