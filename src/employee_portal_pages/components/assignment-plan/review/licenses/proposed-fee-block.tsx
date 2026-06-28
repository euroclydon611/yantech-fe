import { useMemo } from "react";
import { 
  CalculatorOutlined, 
  InfoCircleOutlined, 
  WarningOutlined,
  DollarCircleOutlined,
  CheckCircleOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import { useFetchBaseFeesQuery } from "@/redux/features/employee-portal-api/application/fees-config";
import { Spin, Tag } from "antd";
import { normalizeText } from "@/utils/helperFunction";
import { useFetchAssignmentByApplicationQuery } from "@/redux/features/employee-portal-api/application/assignment";

const InfoDetail = ({ label, value, icon, color = "blue" }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
      {icon}
      {label}
    </span>
    <div className={`text-sm font-bold text-slate-800`}>
      {value || <span className="text-slate-400 italic font-normal">N/A</span>}
    </div>
  </div>
);

const ProposedFeeBlock = ({ blockTitle = "Proposed Fee Calculation", application }) => {
  const { data: assignmentData } = useFetchAssignmentByApplicationQuery(
    { id: application._id ?? "" },
    { skip: !application._id }
  );

  const {
    data: feesResponse,
    isLoading: isLoadingFees,
    isFetching: isFetchingFees,
  } = useFetchBaseFeesQuery(
    {
      page: 1,
      limit: 1000,
      searchTerm: "",
      sortOrder: "asc",
      sortField: "name",
      type: "license",
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const business_scales = feesResponse?.business_scales || [];
  const business_locations = feesResponse?.business_locations || [];

  const getScaleMultiplier = (scaleName) => {
    if (!scaleName || business_scales.length === 0) return 1;
    const normalizedScaleName = scaleName.toLowerCase().trim();
    let scale = business_scales.find(s => s.name.toLowerCase().trim() === normalizedScaleName);
    if (!scale) {
      scale = business_scales.find(s => s.name.toLowerCase().includes(normalizedScaleName) || normalizedScaleName.includes(s.name.toLowerCase()));
    }
    if (!scale) return 1;
    return parseFloat(scale.multiplier?.$numberDecimal ?? scale.multiplier ?? 1);
  };

  const getLocationSurcharge = (locationName) => {
    if (!locationName || business_locations.length === 0) return 0;
    const normalizedLocationName = locationName.toLowerCase().trim();
    let location = business_locations.find(l => l.name.toLowerCase().trim() === normalizedLocationName);
    if (!location) {
      location = business_locations.find(l => l.name.toLowerCase().includes(normalizedLocationName) || normalizedLocationName.includes(l.name.toLowerCase()));
    }
    if (!location) return 0;
    return location.surcharge || 0;
  };

  const getScaleDescription = (scaleName) => {
    if (!scaleName) return "Unknown";
    const normalizedScaleName = scaleName.toLowerCase().trim();
    const scale = business_scales.find(s => s.name.toLowerCase().trim() === normalizedScaleName);
    return scale ? scale.description : scaleName.charAt(0).toUpperCase() + scaleName.slice(1);
  };

  const getLocationDescription = (locationName) => {
    if (!locationName) return "Unknown";
    const normalizedLocationName = locationName.toLowerCase().trim();
    const location = business_locations.find(l => l.name.toLowerCase().trim() === normalizedLocationName);
    return location ? location.description : locationName;
  };

  const feeCalculations = useMemo(() => {
    const baseFee = application?.answers?.processingFee?.totalAmount || 0;
    const scaleMultiplier = getScaleMultiplier(application?.scale);
    const locationSurcharge = getLocationSurcharge(application?.location);
    const scaleAdjustedFee = baseFee * scaleMultiplier;
    const proposedFee = scaleAdjustedFee + locationSurcharge;
    const remainingLicenseFee = proposedFee - baseFee;

    return { baseFee, scaleMultiplier, locationSurcharge, scaleAdjustedFee, proposedFee, remainingLicenseFee };
  }, [application?.answers?.processingFee?.totalAmount, application?.scale, application?.location, business_scales, business_locations]);

  const formatCurrency = (amount) => {
    return amount.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (isLoadingFees || isFetchingFees) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center justify-center gap-4 shadow-sm mb-8">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        <span className="text-sm font-medium text-slate-500 italic">Calculating proposed fees...</span>
      </div>
    );
  }

  if (!application?.scale || !application?.location) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
          <div className="p-2 bg-slate-200 rounded-lg">
            <CalculatorOutlined className="text-slate-600 text-lg" />
          </div>
          <h3 className="text-base font-bold text-slate-800 m-0 leading-tight">{blockTitle}</h3>
        </div>
        <div className="p-12 flex flex-col items-center text-center">
          <div className="p-4 bg-amber-50 rounded-full mb-4">
            <WarningOutlined className="text-3xl text-amber-500" />
          </div>
          <h4 className="text-base font-bold text-slate-800 m-0">Incomplete Information</h4>
          <p className="text-sm text-slate-500 mt-2 max-w-xs leading-relaxed">
            Business Scale and Location Tier must be configured in the section above to calculate the proposed fee.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8 transition-all hover:shadow-md">
      {/* Header section with professional styling */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <DollarCircleOutlined className="text-blue-600 text-lg" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 m-0 leading-tight">
              {blockTitle}
            </h3>
            <p className="text-[10px] text-slate-500 m-0 mt-0.5 font-bold uppercase tracking-wider">
              Fee Determination Matrix
            </p>
          </div>
        </div>
        <Tag color="blue" icon={<CheckCircleOutlined />} className="m-0 border-none font-bold text-[10px] uppercase px-3 py-0.5 rounded-full">
          Live Calculation
        </Tag>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <InfoDetail 
            label="Base Fee (Processing)" 
            icon={<CalculatorOutlined className="text-blue-400" />}
            value={`GH₵ ${formatCurrency(feeCalculations.baseFee)}`}
          />
          <InfoDetail 
            label="Business Scale Multiplier" 
            icon={<DollarCircleOutlined className="text-indigo-400" />}
            value={`${feeCalculations.scaleMultiplier}x (${getScaleDescription(application?.scale)})`}
          />
          <InfoDetail 
            label="Location Surcharge" 
            icon={<DollarCircleOutlined className="text-emerald-400" />}
            value={`GH₵ ${formatCurrency(feeCalculations.locationSurcharge)} (${normalizeText(getLocationDescription(application?.location))})`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                Scale-Adjusted Amount
              </span>
              <span className="text-xs font-medium text-slate-500 italic">
                (Base × Multiplier)
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-bold text-slate-400">GH₵</span>
              <span className="text-2xl font-bold text-slate-800">
                {formatCurrency(feeCalculations.scaleAdjustedFee)}
              </span>
            </div>
          </div>

          <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest">
                Proposed Standard Fee
              </span>
              <span className="text-xs font-medium text-indigo-400 italic">
                (Adjusted + Surcharge)
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-bold text-indigo-400">GH₵</span>
              <span className="text-2xl font-bold text-indigo-900">
                {formatCurrency(feeCalculations.proposedFee)}
              </span>
            </div>
          </div>
        </div>

        {/* Highlight Card for Remaining Fee */}
        <div className="mt-8 relative overflow-hidden bg-slate-900 rounded-2xl p-8 shadow-lg group">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 transition-transform group-hover:scale-125 duration-700" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-indigo-400 font-extrabold text-[10px] uppercase tracking-[0.2em]">
                <CalculatorOutlined />
                Remaining Issuance Liability
              </div>
              <h4 className="text-white text-lg font-bold m-0 leading-tight">
                Net License Issuance Fee
              </h4>
              <p className="text-slate-400 text-xs mt-2 max-w-sm leading-relaxed">
                This amount represents the final balance due for license issuance after deducting the already paid processing fee.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end">
              <div className="flex items-baseline gap-3">
                <span className="text-indigo-400 text-lg font-bold">GH₵</span>
                <span className="text-5xl font-extrabold text-white tracking-tight">
                  {formatCurrency(feeCalculations.remainingLicenseFee)}
                </span>
              </div>
              <Tag className="mt-4 bg-white/10 border-white/20 text-white font-bold rounded-full px-4 py-1 border-none shadow-sm">
                Balance Outstanding
              </Tag>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-start gap-3 p-4 bg-amber-50/50 rounded-xl border border-amber-100">
          <InfoCircleOutlined className="text-amber-500 mt-1" />
          <div className="text-xs text-amber-800 leading-relaxed">
            <span className="font-bold uppercase tracking-tight">Regulatory Note:</span> These calculations are based on standard schedule parameters for the selected business scale and location tier. Final assessment may be subject to executive review and specific ancillary charges where applicable.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposedFeeBlock;
