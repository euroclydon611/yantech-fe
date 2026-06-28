import { Link } from "react-router-dom";
import { Button } from "antd";
import { Menu } from "lucide-react";
import Nav from "./Nav";
import { useState, useEffect } from "react";

const Header = ({
  sidebarOpen,
  setSidebarOpen,
  changPsd,
  setChangePsd,
}: any) => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = now.toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

  return (
    <header
      id="header"
      className="fixed top-0 left-0 right-0 z-50 shadow-lg"
      style={{ background: "#0A1628", borderBottom: "1px solid rgba(245,166,35,0.25)" }}
    >
      <div className="flex items-center justify-between h-12">
        {/* Left — Logo + Brand + Toggle */}
        <div className="flex items-center gap-2.5 px-3 h-full min-[1200px]:w-44">
          <Link
            to="/"
            className="flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0"
          >
            <img
              src="/images/logo.png"
              alt="YANTEC Engineering"
              className="h-7 object-contain"
            />
          </Link>

          {sidebarOpen && (
            <div className="hidden min-[1200px]:flex flex-col leading-none flex-1 min-w-0">
              <span
                className="text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap"
                style={{ color: "#F5A623" }}
              >
                YANTEC
              </span>
              <span
                className="text-[9px] font-semibold uppercase tracking-widest"
                style={{ color: "rgba(245,166,35,0.70)" }}
              >
                Engineering
              </span>
            </div>
          )}

          <Button
            type="text"
            icon={<Menu size={18} />}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="!text-white/70 hover:!text-white hover:!bg-white/10 flex items-center justify-center !p-1 ml-auto"
          />
        </div>

        {/* Centre — Live date & time */}
        <div className="hidden sm:flex flex-col items-center leading-none">
          <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: "rgba(245,166,35,0.70)" }}>
            {dateStr}
          </span>
          <span className="text-sm font-extrabold tabular-nums tracking-wide" style={{ color: "#F5A623" }}>
            {timeStr}
          </span>
        </div>

        {/* Right — Nav actions */}
        <Nav changPsd={changPsd} setChangePsd={setChangePsd} />
      </div>
    </header>
  );
};

export default Header;
