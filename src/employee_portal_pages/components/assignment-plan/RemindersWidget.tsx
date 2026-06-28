import React, { useState, useEffect, useRef, useMemo } from "react";
import { Badge, Button, Drawer, Tag, Tooltip, notification } from "antd";
import {
  WarningOutlined,
  EyeOutlined,
  CloseOutlined,
  ShareAltOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  ReloadOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useGetAssignmentRemindersQuery } from "@/redux/features/employee-portal-api/application/assignment";
import { CATEGORY_CONFIG, AlertCategory } from "./AttentionPanel";

const REMINDER_INTERVAL_MS = 12 * 60 * 1000;
const INITIAL_DELAY_MS = 6000;

interface RemindersWidgetProps {
  onSearchApp: (appCode: string) => void;
}

const categoryIcon: Record<AlertCategory, React.ReactNode> = {
  active_blocker:        <StopOutlined />,
  report_pending_review: <FileTextOutlined />,
  stale_delegation:      <ShareAltOutlined />,
  unattended:            <ClockCircleOutlined />,
  officer_overdue:       <ClockCircleOutlined />,
};

const RemindersWidget: React.FC<RemindersWidgetProps> = ({ onSearchApp }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifApi, contextHolder] = notification.useNotification();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cycleIndexRef = useRef(0);
  const shownOnMountRef = useRef(false);

  const { data, isLoading, refetch } = useGetAssignmentRemindersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 15 * 60 * 1000,
  });

  const alerts: any[] = data?.data || [];

  const byCategory = useMemo(
    () =>
      Object.fromEntries(
        (Object.keys(CATEGORY_CONFIG) as AlertCategory[]).map((cat) => [
          cat,
          alerts.filter((a) => a.category === cat),
        ])
      ) as Record<AlertCategory, any[]>,
    [alerts]
  );

  const categoriesWithAlerts = useMemo(
    () => (Object.keys(CATEGORY_CONFIG) as AlertCategory[]).filter((cat) => byCategory[cat].length > 0),
    [byCategory]
  );

  const fireToast = (cat: AlertCategory) => {
    const cfg = CATEGORY_CONFIG[cat];
    const items = byCategory[cat];
    if (!items?.length) return;
    const topItem = items[0];

    notifApi.warning({
      key: `reminder-${cat}`,
      message: (
        <span className="font-bold" style={{ color: cfg.color }}>
          {cfg.label} — Action Required
        </span>
      ),
      description: (
        <div className="flex flex-col gap-1 mt-1">
          <p className="text-xs text-gray-600 m-0">{cfg.description}</p>
          <div className="mt-1.5 p-2 bg-gray-50 rounded text-xs">
            <span className="font-mono font-bold text-gray-800">{topItem.appCode}</span>
            <span className="text-gray-500 ml-2">{topItem.applicantName}</span>
            <span className="ml-2 text-gray-400">({topItem.ageDays}d ago)</span>
          </div>
          {items.length > 1 && (
            <p className="text-[11px] text-gray-400 m-0">+{items.length - 1} more in this category</p>
          )}
          <button
            onClick={() => { notification.destroy(`reminder-${cat}`); setDrawerOpen(true); }}
            className="mt-1 text-xs text-blue-600 hover:underline text-left font-semibold"
          >
            View all reminders →
          </button>
        </div>
      ),
      placement: "topRight",
      duration: 12,
      icon: <span style={{ color: cfg.color }}>{categoryIcon[cat]}</span>,
      style: { borderLeft: `4px solid ${cfg.color}` },
    });
  };

  useEffect(() => {
    if (!alerts.length || shownOnMountRef.current || isLoading) return;
    const timer = setTimeout(() => {
      shownOnMountRef.current = true;
      const topCat = categoriesWithAlerts[0];
      if (topCat) fireToast(topCat);
      cycleIndexRef.current = 1;
    }, INITIAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isLoading, alerts.length > 0]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!categoriesWithAlerts.length) return;
    intervalRef.current = setInterval(() => {
      const idx = cycleIndexRef.current % categoriesWithAlerts.length;
      fireToast(categoriesWithAlerts[idx]);
      cycleIndexRef.current = idx + 1;
    }, REMINDER_INTERVAL_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [categoriesWithAlerts.length]);

  if (isLoading || !alerts.length) return null;

  return (
    <>
      {contextHolder}

      <div className="fixed bottom-8 right-8 z-[999]" style={{ pointerEvents: "auto" }}>
        <Tooltip title={`${alerts.length} item${alerts.length !== 1 ? "s" : ""} need your attention`} placement="left">
          <Badge count={alerts.length} overflowCount={99} offset={[-4, 4]} style={{ backgroundColor: "#dc2626" }}>
            <button
              onClick={() => setDrawerOpen(true)}
              className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)" }}
            >
              <span
                className="absolute inset-0 rounded-full animate-ping opacity-30"
                style={{ background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)" }}
              />
              <WarningOutlined className="text-xl relative z-10" />
            </button>
          </Badge>
        </Tooltip>
      </div>

      <Drawer
        title={
          <div className="flex items-center gap-2">
            <WarningOutlined className="text-orange-500" />
            <span className="font-bold text-gray-900">Attention Required</span>
            <Badge count={alerts.length} overflowCount={99} style={{ backgroundColor: "#ea580c", marginLeft: 6 }} />
            <Button
              size="small"
              type="text"
              icon={<ReloadOutlined />}
              onClick={() => refetch()}
              className="ml-auto !text-gray-400"
              title="Refresh reminders"
            />
          </div>
        }
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={480}
        closeIcon={<CloseOutlined />}
        styles={{ body: { padding: "16px", background: "#f9fafb" } }}
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap gap-2">
            {categoriesWithAlerts.map((cat) => {
              const cfg = CATEGORY_CONFIG[cat];
              return (
                <Tooltip key={cat} title={cfg.description}>
                  <Tag
                    icon={categoryIcon[cat]}
                    className="!text-[11px] !font-semibold cursor-help !px-2 !py-0.5"
                    style={{ color: cfg.color, borderColor: cfg.color, background: `${cfg.color}15` }}
                  >
                    {cfg.label} · {byCategory[cat].length}
                  </Tag>
                </Tooltip>
              );
            })}
          </div>

          {categoriesWithAlerts.map((cat) => {
            const cfg = CATEGORY_CONFIG[cat];
            const items = byCategory[cat];
            return (
              <div key={cat}>
                <div
                  className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider mb-2 pb-1 border-b"
                  style={{ color: cfg.color, borderColor: `${cfg.color}40` }}
                >
                  {categoryIcon[cat]}
                  <span>{cfg.label}</span>
                  <span className="ml-1 text-gray-400 font-normal normal-case tracking-normal">
                    — {cfg.description}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {items.map((alert: any, i: number) => (
                    <div
                      key={`${alert.assignmentId}-${i}`}
                      className="flex items-center justify-between gap-3 bg-white border rounded-xl px-3 py-2.5 hover:shadow-sm transition-shadow group"
                      style={{ borderColor: `${cfg.color}30` }}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="w-1 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-gray-900 font-mono">{alert.appCode}</span>
                            <span className="text-xs text-gray-600 truncate max-w-[180px]">{alert.applicantName}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5 truncate">{alert.detail}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Tag
                          className="!text-[10px] !m-0 !font-semibold"
                          color={alert.ageDays >= 14 ? "red" : alert.ageDays >= 7 ? "orange" : "gold"}
                        >
                          {alert.ageDays}d
                        </Tag>
                        <Tooltip title={`Search for ${alert.appCode}`}>
                          <Button
                            type="text"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => { setDrawerOpen(false); onSearchApp(alert.appCode); }}
                            className="!text-blue-500 hover:!text-blue-700"
                          />
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <p className="text-[10px] text-gray-400 italic text-center mt-2">
            Covers all applications in your department · auto-refreshes every 15 min
          </p>
        </div>
      </Drawer>
    </>
  );
};

export default RemindersWidget;
