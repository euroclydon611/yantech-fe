import { useState, useCallback } from "react";
import { Breadcrumb, Pagination, Tag, Tooltip, Spin } from "antd";
import { HomeOutlined, FileTextOutlined, ExpandOutlined, CloseOutlined } from "@ant-design/icons";
import { AiOutlineFilePdf, AiOutlineSearch } from "react-icons/ai";
import { formatNumber } from "@/utils/helperFunction";
import { useGetMyPayslipsListQuery } from "@/redux/features/employee-portal-api/payslip";
import axios from "axios";
import Swal from "sweetalert2";

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const getCurrentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
};

const base64ToBlobUrl = (base64: string): string => {
  const base64Data = base64.includes(",") ? base64.split(",")[1] : base64;
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Uint8Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  return URL.createObjectURL(new Blob([byteNumbers], { type: "application/pdf" }));
};

const fetchPdfBlobUrl = async (url: string, params: object): Promise<string | null> => {
  try {
    const response = await axios.get(url, { params, withCredentials: true });
    const documentUrl = response?.data?.document_url;

    if (documentUrl) {
      // Fetch the external URL (e.g. S3) as binary and convert to a local blob URL
      // so the iframe can display it regardless of Content-Disposition or X-Frame-Options headers.
      try {
        const fileResponse = await axios.get(documentUrl, { responseType: "arraybuffer" });
        const blob = new Blob([fileResponse.data], { type: "application/pdf" });
        return URL.createObjectURL(blob);
      } catch {
        // If cross-origin fetch fails, fall back to direct URL (Full button still works)
        return documentUrl;
      }
    }

    const fileBase64 = response?.data?.file;
    if (!fileBase64 || typeof fileBase64 !== "string") return null;
    return base64ToBlobUrl(fileBase64);
  } catch (error: any) {
    Swal.fire({
      title: "Oops...",
      text: error?.response?.data?.error || "Something went wrong while fetching the payslip.",
      icon: "error",
      confirmButtonColor: "#15803d",
    });
    return null;
  }
};

const PayslipsPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [searchQuery, setSearchQuery] = useState("");
  const [accumulationStartMonth, setAccumulationStartMonth] = useState(getCurrentMonth());

  const [panelOpen, setPanelOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [activeSlip, setActiveSlip] = useState<any>(null);

  const { data, isLoading, isFetching } = useGetMyPayslipsListQuery({ page, limit, searchQuery });

  const buildParams = useCallback((payslip: any) => {
    const monthNo = MONTH_NAMES.findIndex(
      (m) => m.toLowerCase() === payslip.pay_month?.toLowerCase()
    ) + 1;
    const monthNoStr = monthNo.toString().padStart(2, "0");
    return {
      month: payslip.pay_month,
      year: String(payslip.year),
      forecast: payslip.forecast ? "1" : "0",
      staff_id: payslip.staff_id,
      startDate: `${accumulationStartMonth.split("-")[1]}/${accumulationStartMonth.split("-")[0]}`,
      endDate: `${monthNoStr}/${payslip.year}`,
      currency: "GHS",
    };
  }, [accumulationStartMonth]);

  const handlePreviewPaySlip = async (payslip: any) => {
    setActiveSlip(payslip);
    setPanelOpen(true);
    setPdfUrl(null);
    setPdfLoading(true);
    const url = `${import.meta.env.VITE_PUBLIC_SERVER_URI_HR}/reports/view-pay-slip-pdf`;
    const blobUrl = await fetchPdfBlobUrl(url, buildParams(payslip));
    setPdfUrl(blobUrl);
    setPdfLoading(false);
  };

  const handleClosePanel = () => {
    setPanelOpen(false);
    setActiveSlip(null);
    setPdfUrl(null);
  };

  const handleOpenNewTab = () => {
    if (pdfUrl) window.open(pdfUrl, "_blank");
  };

  const payslips = data?.data || [];
  const totalCount = data?.totalCount || 0;

  const panelTitle = activeSlip
    ? `${activeSlip.pay_month ? activeSlip.pay_month.charAt(0).toUpperCase() + activeSlip.pay_month.slice(1) : ""} ${activeSlip.year}`
    : "Payslip";

  return (
    <div className="payslips-root">

      {/* TOP BAR (breadcrumb + header + filters) */}
      <div className="payslips-topbar">
        <div className="px-4 pt-3 pb-1 border-b border-gray-100 bg-white">
          <Breadcrumb
            items={[
              { href: "#", title: <><HomeOutlined /><span>Home</span></> },
              { title: "Personal" },
              { title: <span className="text-green-700 font-medium">My Payslips</span> },
            ]}
            className="text-xs"
          />
        </div>

        <div className="px-4 py-2 bg-white border-b border-gray-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-green-700 flex items-center justify-center flex-shrink-0">
              <FileTextOutlined className="text-white text-sm" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-800 leading-tight">My Payslips</h1>
              <p className="text-[11px] text-gray-500 leading-tight">View and download your payslips</p>
            </div>
          </div>
          {totalCount > 0 && (
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-md px-2.5 py-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[11px] font-semibold text-green-800">{totalCount}</span>
              <span className="text-[10px] text-green-700">Payslips</span>
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex flex-wrap items-end gap-3">
          {/* Accumulation Start (for PDF) — hidden for now
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-gray-500 font-medium">Accumulation Start (for PDF)</span>
            <input
              type="month"
              className="text-xs px-2 py-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-green-400"
              value={accumulationStartMonth}
              onChange={(e) => setAccumulationStartMonth(e.target.value)}
            />
          </div>
          */}
          <div className="flex flex-col gap-0.5 ml-auto w-48">
            <span className="text-[10px] text-gray-500 font-medium">Search</span>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                placeholder="Search month or year..."
                className="w-full text-xs px-2 py-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-green-400 pr-7"
              />
              <AiOutlineSearch size={14} className="absolute right-2 top-1.5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* SPLIT CONTENT AREA */}
      <div className="payslips-body">

        {/* LEFT — TABLE */}
        <div className={`payslips-table-pane ${panelOpen ? "panel-open" : ""}`}>
          <div className="overflow-auto h-full">
            <table className="table-auto w-full bg-white text-xs">
              <thead className="sticky top-0 z-10 bg-slate-100">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600 border-b-2 border-gray-200 w-8">#</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600 border-b-2 border-gray-200">Pay Period</th>
                  <th className="px-3 py-2 text-center font-semibold text-gray-600 border-b-2 border-gray-200">Status</th>
                  {!panelOpen && <>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600 border-b-2 border-gray-200">Basic</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600 border-b-2 border-gray-200">Gross</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600 border-b-2 border-gray-200">Deductions</th>
                  </>}
                  <th className="px-3 py-2 text-right font-semibold text-gray-600 border-b-2 border-gray-200">Net</th>
                  <th className="px-3 py-2 text-center font-semibold text-gray-600 border-b-2 border-gray-200">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-gray-400 text-xs">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                        Loading payslips...
                      </div>
                    </td>
                  </tr>
                ) : payslips.length > 0 ? (
                  payslips.map((slip: any, index: number) => {
                    const isActive = activeSlip && slip.pay_month === activeSlip.pay_month && slip.year === activeSlip.year && slip.forecast === activeSlip.forecast;
                    return (
                      <tr
                        key={`${slip.pay_month}-${slip.year}-${slip.forecast}`}
                        className={`border-b border-gray-100 transition-colors cursor-pointer
                          ${isActive ? "bg-green-50 border-l-2 border-l-green-600" : index % 2 === 0 ? "bg-white" : "bg-gray-50/60"}
                          hover:bg-green-50`}
                        onClick={() => handlePreviewPaySlip(slip)}
                      >
                        <td className="px-3 py-2 text-center text-gray-500">{(page - 1) * limit + index + 1}</td>
                        <td className="px-3 py-2 font-medium text-gray-800">
                          {slip.pay_month ? `${slip.pay_month.charAt(0).toUpperCase() + slip.pay_month.slice(1)}, ${slip.year}` : `${slip.year}`}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {slip.forecast
                            ? <Tag color="orange" className="text-[10px] m-0">DRAFT</Tag>
                            : <Tag color="green" className="text-[10px] m-0">FINALIZED</Tag>
                          }
                        </td>
                        {!panelOpen && <>
                          <td className="px-3 py-2 text-right text-gray-600 tabular-nums">{formatNumber(slip.basic_salary) || "—"}</td>
                          <td className="px-3 py-2 text-right text-gray-700 tabular-nums">{formatNumber(slip.total_earnings) || "—"}</td>
                          <td className="px-3 py-2 text-right text-red-600 tabular-nums">{formatNumber(slip.total_deductions) || "—"}</td>
                        </>}
                        <td className="px-3 py-2 text-right font-semibold text-green-700 tabular-nums">{formatNumber(slip.net_amount) || "—"}</td>
                        <td className="px-3 py-2 text-center">
                          <Tooltip title="Preview payslip">
                            <button
                              onClick={(e) => { e.stopPropagation(); handlePreviewPaySlip(slip); }}
                              className={`inline-flex items-center gap-1 border px-2.5 py-1 rounded-full text-[11px] transition-all duration-200
                                ${isActive
                                  ? "bg-green-600 border-green-600 text-white"
                                  : "border-green-500 text-green-600 hover:bg-green-500 hover:text-white"}`}
                            >
                              <AiOutlineFilePdf size={12} />
                              View
                            </button>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-400 text-xs">
                      <div className="flex flex-col items-center gap-2">
                        <FileTextOutlined className="text-3xl text-gray-300" />
                        <span>No payslips found</span>
                        {searchQuery && <span className="text-[10px]">Try clearing your search</span>}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="px-4 py-2 border-t border-gray-200 bg-white flex items-center justify-between gap-2 flex-shrink-0">
            <span className="text-[11px] text-gray-500">
              {totalCount > 0
                ? `Showing ${Math.min((page - 1) * limit + 1, totalCount)}–${Math.min(page * limit, totalCount)} of ${totalCount}`
                : "No payslips"}
            </span>
            {totalCount > limit && (
              <Pagination
                current={page}
                pageSize={limit}
                total={totalCount}
                onChange={(p) => setPage(p)}
                showSizeChanger={false}
                size="small"
                className="payslips-pagination"
              />
            )}
          </div>
        </div>

        {/* RIGHT — PDF PANEL */}
        <div className={`payslips-pdf-panel ${panelOpen ? "panel-visible" : ""}`}>
          {/* Panel header */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-white flex-shrink-0">
            <AiOutlineFilePdf size={15} className="text-green-700 flex-shrink-0" />
            <span className="text-xs font-semibold text-gray-800 truncate flex-1">{panelTitle}</span>
            {activeSlip && (
              <Tag color={activeSlip.forecast ? "orange" : "green"} className="text-[10px] m-0 flex-shrink-0">
                {activeSlip.forecast ? "DRAFT" : "FINALIZED"}
              </Tag>
            )}
            <Tooltip title="Open full screen in new tab">
              <button
                onClick={handleOpenNewTab}
                disabled={!pdfUrl || pdfLoading}
                className="flex items-center gap-1 text-[11px] text-green-700 border border-green-500 hover:bg-green-600 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed px-2 py-0.5 rounded transition-all"
              >
                <ExpandOutlined style={{ fontSize: 11 }} />
                Full
              </button>
            </Tooltip>
            <button
              onClick={handleClosePanel}
              className="ml-1 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <CloseOutlined style={{ fontSize: 13 }} />
            </button>
          </div>

          {/* Panel body */}
          <div className="flex-1 overflow-hidden bg-gray-200">
            {pdfLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500 text-xs">
                <Spin size="large" />
                <span>Loading payslip...</span>
              </div>
            ) : pdfUrl ? (
              <iframe
                src={pdfUrl}
                title="Payslip Preview"
                className="w-full h-full border-0"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400 text-xs">
                <AiOutlineFilePdf size={36} className="text-gray-300" />
                <span>Payslip could not be loaded.</span>
              </div>
            )}
          </div>
        </div>

      </div>

      <style>{`
        .payslips-root {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 48px);
          overflow: hidden;
        }
        .payslips-topbar { flex-shrink: 0; }
        .payslips-body {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        /* TABLE PANE */
        .payslips-table-pane {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
          overflow: hidden;
          transition: flex 0.3s ease;
          background: white;
        }

        /* PDF PANEL */
        .payslips-pdf-panel {
          display: flex;
          flex-direction: column;
          width: 0;
          overflow: hidden;
          border-left: 0px solid #e5e7eb;
          transition: width 0.3s ease, border-left 0.3s ease;
          flex-shrink: 0;
          background: white;
        }
        .payslips-pdf-panel.panel-visible {
          width: 640px;
          border-left: 1px solid #e5e7eb;
        }

        .payslips-pagination .ant-pagination-item-active { border-color: #15803d; background-color: #15803d; }
        .payslips-pagination .ant-pagination-item-active a { color: #fff; }
        .payslips-pagination .ant-pagination-item-active:hover { border-color: #166534; background-color: #166534; }
      `}</style>
    </div>
  );
};

export default PayslipsPage;
