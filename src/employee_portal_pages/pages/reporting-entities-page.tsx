import { Breadcrumb, Button, Tooltip } from "antd";
import { HomeOutlined, ApartmentOutlined, ReloadOutlined } from "@ant-design/icons";
import SubordinateEntities from "../components/profile/SubordinateEntities";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

export default function ReportingEntitiesPage() {
  const { employee } = useSelector((state: RootState) => state.employee_auth);

  return (
    <div className="reporting-page-root flex flex-col">

      {/* ── BREADCRUMB ── */}
      <div className="px-4 pt-3 pb-1 border-b border-gray-100 bg-white">
        <Breadcrumb
          items={[
            { href: "#", title: <><HomeOutlined /><span>Home</span></> },
            { title: "Personal" },
            { title: <span className="text-green-700 font-medium">Reporting Entities</span> },
          ]}
          className="text-xs"
        />
      </div>

      {/* ── PAGE HEADER ── */}
      <div className="px-4 py-2 bg-white border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-md bg-green-700 flex items-center justify-center">
            <ApartmentOutlined className="text-white text-sm" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-gray-800 leading-tight truncate">Reporting Entities</h1>
            <p className="text-[11px] text-gray-500 leading-tight">View and manage entities reporting to you</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-md px-2.5 py-1">
            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            <span className="text-[11px] font-semibold text-green-800 truncate max-w-[160px]">
              {(employee as any)?.entity?.name || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="flex-1 flex flex-col overflow-auto bg-white">
        <SubordinateEntities employee={employee} />
      </div>

      <style>{`
        .reporting-page-root { min-height: calc(100vh - 48px); display: flex; flex-direction: column; }
      `}</style>
    </div>
  );
}
