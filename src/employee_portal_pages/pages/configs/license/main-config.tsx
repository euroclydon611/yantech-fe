import { Breadcrumb } from "antd";
import { SettingOutlined, HomeOutlined } from "@ant-design/icons";
import { PageTitle } from "@/utils/PageTitle";
import LicenseBaseFeesConfigs from "./license-base-fees-configs";
import LicenseLocationConfigs from "./license-location-configs";
import LicenseScaleConfigs from "./license-scale-configs";

const MainLicenseConfig = () => {
  PageTitle("License Fee Configurations | EPA Ghana");

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 48px)" }}>

      {/* ── BREADCRUMB ── */}
      <div className="px-4 pt-3 pb-1 border-b border-gray-100 bg-white">
        <Breadcrumb
          items={[
            { href: "#", title: <><HomeOutlined /><span>Home</span></> },
            { title: "Licensing MGT" },
            { title: <span className="text-green-700 font-medium">Configuration</span> },
          ]}
          className="text-xs"
        />
      </div>

      {/* ── PAGE HEADER ── */}
      <div className="px-4 py-2 bg-white border-b border-gray-200 flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-md bg-green-700 flex items-center justify-center">
          <SettingOutlined className="text-white text-sm" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-gray-800 leading-tight">License Configuration</h1>
          <p className="text-[11px] text-gray-500 leading-tight">
            Manage base fees, scale factors &amp; location multipliers for licenses
          </p>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="flex-1 px-4 py-4 space-y-6 overflow-auto">
        <LicenseBaseFeesConfigs />
        <LicenseScaleConfigs />
        <LicenseLocationConfigs />
      </div>
    </div>
  );
};

export default MainLicenseConfig;
