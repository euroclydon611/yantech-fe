import { FaLandmarkFlag, FaRankingStar, FaUserShield } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { AiFillBank } from "react-icons/ai";
import { PageTitle } from "../utils/PageTitle";
import { useDashboardDataQuery } from "../redux/features/dashboard/dashboardApi";
import { Link } from "react-router-dom";
import ApexCharts from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Spin } from "antd";
import { usePrivileges } from "../hooks/usePrivileges";
import { useState, useEffect } from "react";

const GSF_COLORS = [
  "#F5A623", "#0A1628", "#1A3A6B", "#0D2244",
  "#F7B84B", "#2A5298", "#E8951C", "#1B2E55",
  "#FFD166", "#3B6DBF", "#F4A261", "#0F3A7A",
  "#FBBF24", "#4A80CC", "#F59E0B", "#1E4080",
];

const Dashboard = () => {
  PageTitle("Dashboard | YANTEC Engineering ERP");

  const {
    hasEntitiesAccess,
    hasBankViewAccess,
    hasBranchViewAccess,
    hasRankAccess,
    hasEmployeeViewAccess,
    userAdmin,
  } = usePrivileges();

  const { data, isLoading } = useDashboardDataQuery(
    {},
    { refetchOnReconnect: true, refetchOnMountOrArgChange: true, refetchOnFocus: true }
  );

  const genderChartOptions: ApexOptions = {
    series: data?.polarDataSet?.series,
    labels: data?.polarDataSet?.labels,
    chart: { type: "polarArea", width: "100%", height: 300, toolbar: { show: false } },
    legend: { position: "bottom", fontSize: "11px" },
    dataLabels: { enabled: true, style: { fontSize: "10px" } },
    title: {
      text: "Staff Gender Distribution",
      style: { fontSize: "12px", fontWeight: "600", color: "#374151" },
    },
    responsive: [{ breakpoint: 480, options: { chart: { width: "100%" }, legend: { position: "bottom" } } }],
    colors: GSF_COLORS,
  };

  const rankLabels = (data?.donutDataSet?.labels ?? []).map((l: any) => l ?? "Unknown");
  const rankSeries = data?.donutDataSet?.series ?? [];

  const combined = rankLabels.map((label: string, i: number) => ({
    label,
    value: rankSeries[i] ?? 0,
  })).sort((a: any, b: any) => b.value - a.value);

  const TOP_N = 15;
  const topItems = combined.slice(0, TOP_N);
  const othersValue = combined.slice(TOP_N).reduce((sum: number, x: any) => sum + x.value, 0);
  if (othersValue > 0) topItems.push({ label: "Others", value: othersValue });

  const rankChartOptions: ApexOptions = {
    series: [{ name: "Staff", data: topItems.map((x: any) => x.value) }],
    chart: { type: "bar", width: "100%", toolbar: { show: false }, fontFamily: "Inter, sans-serif" },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "65%",
        borderRadius: 3,
        distributed: true,
      },
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: "9px", colors: ["#fff"] },
      formatter: (val: number) => val > 0 ? val.toString() : "",
    },
    xaxis: {
      categories: topItems.map((x: any) => x.label),
      labels: { style: { fontSize: "9px", colors: "#6b7280" } },
    },
    yaxis: { labels: { style: { fontSize: "9px", colors: "#374151" }, maxWidth: 180 } },
    legend: { show: false },
    grid: { borderColor: "#f3f4f6", strokeDashArray: 3 },
    tooltip: { y: { formatter: (v: number) => `${v} staff` } },
    colors: GSF_COLORS,
  };

  const statCards = [
    {
      id: "entities",
      label: "Departments",
      sub: "Registered entities",
      icon: FaLandmarkFlag,
      value: data?.entities || 0,
      link: "/entities",
      access: hasEntitiesAccess,
      accent: "#0A1628",
      lightBg: "#eef2fb",
    },
    {
      id: "banks",
      label: "Banks",
      sub: "Financial institutions",
      icon: AiFillBank,
      value: data?.banks || 0,
      link: "/banks",
      access: hasBankViewAccess,
      accent: "#F5A623",
      lightBg: "#fff8ec",
    },
    {
      id: "branches",
      label: "Bank Branches",
      sub: "Across all banks",
      icon: AiFillBank,
      value: data?.branches || 0,
      link: "/branches",
      access: hasBranchViewAccess,
      accent: "#F5A623",
      lightBg: "#fff8ec",
    },
    {
      id: "ranks",
      label: "Grades & Ranks",
      sub: "Staff classifications",
      icon: FaRankingStar,
      value: data?.grades || 0,
      link: "/ranks",
      access: hasRankAccess,
      accent: "#1A3A6B",
      lightBg: "#eef2fb",
    },
    {
      id: "employees",
      label: "Staff Members",
      sub: "Active employees",
      icon: FaUserFriends,
      value: data?.employees || 0,
      link: "/employees",
      access: hasEmployeeViewAccess,
      accent: "#0A1628",
      lightBg: "#eef2fb",
    },
    {
      id: "users",
      label: "System Users",
      sub: "Platform accounts",
      icon: FaUserShield,
      value: data?.users || 0,
      link: "/users",
      access: userAdmin,
      accent: "#0D2244",
      lightBg: "#f4f7fc",
    },
  ];

  const visibleCards = statCards.filter((c) => c.access);

  return (
    <div className="min-h-screen" style={{ background: "#f4f5f7" }}>

      <div className="px-4 py-5 space-y-5">

        {/* ── Stat Cards ── */}
        {visibleCards.length > 0 && (
          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 px-0.5">
              Overview
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
              {visibleCards.map((card) => (
                <Link
                  key={card.id}
                  to={card.link}
                  className="group bg-white rounded-xl border border-gray-100 p-3.5 flex flex-col gap-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  style={{ borderTop: `3px solid ${card.accent}` }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: card.lightBg }}
                    >
                      <card.icon size={16} style={{ color: card.accent }} />
                    </div>
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: card.lightBg, color: card.accent }}
                    >
                      TOTAL
                    </span>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-gray-900 leading-none">
                      {card.value.toLocaleString()}
                    </p>
                    <p className="text-[11px] font-semibold text-gray-700 mt-1">{card.label}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">{card.sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Charts ── */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-gray-100">
            <Spin size="large" />
          </div>
        ) : data ? (
          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 px-0.5">
              Analytics
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* Gender Distribution */}
              {hasEmployeeViewAccess && (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div
                    className="px-4 py-3 flex items-center gap-2"
                    style={{ borderBottom: "2px solid #0A1628" }}
                  >
                    <div className="w-1.5 h-4 rounded-full" style={{ background: "#0A1628" }} />
                    <h3 className="text-xs font-bold text-gray-800">Gender Distribution</h3>
                  </div>
                  <div className="p-3">
                    <ApexCharts
                      options={genderChartOptions}
                      series={genderChartOptions.series}
                      type="polarArea"
                      height={280}
                    />
                  </div>
                </div>
              )}

              {/* Rank Distribution */}
              {(hasEmployeeViewAccess || hasRankAccess) && (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div
                    className="px-4 py-3 flex items-center gap-2"
                    style={{ borderBottom: "2px solid #F5A623" }}
                  >
                    <div className="w-1.5 h-4 rounded-full" style={{ background: "#F5A623" }} />
                    <h3 className="text-xs font-bold text-gray-800">Staff by Grade</h3>
                  </div>
                  <div className="p-3">
                    <ApexCharts
                      options={rankChartOptions}
                      series={rankChartOptions.series}
                      type="bar"
                      height={topItems.length * 26 + 40}
                    />
                  </div>
                </div>
              )}

            </div>
          </section>
        ) : null}

      </div>
    </div>
  );
};

export default Dashboard;
