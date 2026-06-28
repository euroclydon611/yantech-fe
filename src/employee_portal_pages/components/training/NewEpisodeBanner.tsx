import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { PlayCircleFilled, CloseOutlined } from "@ant-design/icons";
import { useGetLatestEpisodeQuery } from "@/redux/features/employee-portal-api/videoApi";
import { useState } from "react";
import dayjs from "dayjs";

const DISMISSED_KEY = "ep_banner_dismissed";

function getDismissedId(): string | null {
  return localStorage.getItem(DISMISSED_KEY);
}

export default function NewEpisodeBanner() {
  const navigate = useNavigate();
  const { data } = useGetLatestEpisodeQuery();
  const latest = data?.data;

  const [dismissed, setDismissed] = useState<string | null>(getDismissedId);

  if (!latest || latest.status !== "published") return null;
  if (dismissed === latest._id) return null;

  // Only show banner for 7 days after publish
  const daysSince = (Date.now() - new Date(latest.publishedAt!).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSince >= 7) return null;

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, latest._id);
    setDismissed(latest._id);
  };

  return (
    <div
      className="relative flex items-center gap-3 px-4 py-3 rounded-xl mb-4 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #052e16 0%, #14532d 60%, #166534 100%)",
        border: "1px solid #166534",
      }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 80% 50%, #fbbf24 0%, transparent 60%)",
        }}
      />

      {/* Icon */}
      <div
        className="relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: "rgba(251, 191, 36, 0.2)", border: "2px solid #fbbf24" }}
      >
        <PlayCircleFilled style={{ fontSize: 20, color: "#fbbf24" }} />
      </div>

      {/* Text */}
      <div className="relative flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-widest"
            style={{ background: "#fbbf24", color: "#1a1a1a" }}
          >
            NEW
          </span>
          <span className="text-[10px] text-yellow-300 font-semibold">Training Series</span>
        </div>
        <p className="text-white font-bold text-sm leading-tight m-0 truncate">
          Ep. {latest.episodeNumber} — {latest.title}
        </p>
        <p className="text-green-300 text-[10px] m-0">
          Published {dayjs(latest.publishedAt).format("DD MMM YYYY")}
        </p>
      </div>

      {/* CTA */}
      <div className="relative flex-shrink-0 flex items-center gap-2">
        <Button
          size="small"
          icon={<PlayCircleFilled />}
          onClick={() => navigate("/employee-portal/training-series")}
          className="!bg-yellow-400 !text-black !border-none !font-bold hover:!bg-yellow-300 !text-[10px]"
        >
          Watch Now
        </Button>
        <button
          onClick={handleDismiss}
          className="text-green-400 hover:text-white transition-colors"
          title="Dismiss"
        >
          <CloseOutlined style={{ fontSize: 12 }} />
        </button>
      </div>
    </div>
  );
}
