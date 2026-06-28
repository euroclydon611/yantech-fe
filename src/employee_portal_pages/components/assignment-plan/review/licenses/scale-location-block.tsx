import React, { useState, useEffect } from "react";
import { Alert, Radio, Spin, Tag } from "antd";
import { 
  EnvironmentOutlined, 
  BlockOutlined, 
  InfoCircleOutlined,
  LoadingOutlined 
} from "@ant-design/icons";
import { showSuccess, showError } from "@/lib/alert";
import { useFetchAssignmentByApplicationQuery } from "@/redux/features/employee-portal-api/application/assignment";
import { useUpdateScaleAndLocationMutation } from "@/redux/features/employee-portal-api/application/application";
import { useFetchBaseFeesQuery } from "@/redux/features/employee-portal-api/application/fees-config";
import { capitalizeFirstLetter } from "@/utils/helperFunction";

interface ScaleLocationBlockProps {
  applicationId: any;
  initialScale?: string;
  initialLocation?: string;
  blockTitle?: string;
  showAlert?: boolean;
  applicationType?: string;
  onSaveSuccess?: () => void;
}

export const ScaleLocationBlock: React.FC<ScaleLocationBlockProps> = ({
  applicationId,
  initialScale = "",
  initialLocation = "",
  blockTitle = "Scale & Location Configuration",
  showAlert = true,
  applicationType = "license",
  onSaveSuccess,
}) => {
  const { data: assignmentData } = useFetchAssignmentByApplicationQuery(
    { id: applicationId ?? "" },
    { skip: !applicationId }
  );

  const {
    data: feesResponse,
    isLoading: isLoadingFees,
  } = useFetchBaseFeesQuery(
    {
      page: 1,
      limit: 25,
      type: "license",
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const business_scales = feesResponse?.business_scales || [];
  const business_locations = feesResponse?.business_locations || [];

  const [updateScaleAndLocation, { isLoading: isUpdatingScaleLocation }] =
    useUpdateScaleAndLocationMutation();
  const [scaleValue, setScaleValue] = useState(initialScale);
  const [locationValue, setLocationValue] = useState(initialLocation);
  const [isInitialized, setIsInitialized] = useState(false);

  const autoSaveScaleLocation = async (
    newScale: string,
    newLocation: string
  ) => {
    try {
      const payload = {
        applicationType,
        id: applicationId,
        scale: newScale,
        location: newLocation,
      };

      await updateScaleAndLocation({
        payload,
      }).unwrap();

      showSuccess("Configuration updated successfully");
      onSaveSuccess?.();
    } catch (error) {
      showError("Failed to update configuration. Please try again.");
      console.error("Failed to update scale and location:", error);
    }
  };

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      return;
    }

    if (scaleValue || locationValue) {
      autoSaveScaleLocation(scaleValue, locationValue);
    }
  }, [scaleValue, locationValue]);

  if (isLoadingFees) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center justify-center gap-4 shadow-sm mb-8">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        <span className="text-sm font-medium text-slate-500 italic">Loading configuration options...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8 transition-all hover:shadow-md">
      {/* Header section with professional styling */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <BlockOutlined className="text-indigo-600 text-lg" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 m-0 leading-tight">
              {blockTitle}
            </h3>
            <p className="text-[10px] text-slate-500 m-0 mt-0.5 font-bold uppercase tracking-wider">
              Fee Parameter Configuration
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isUpdatingScaleLocation ? (
            <Tag color="processing" icon={<LoadingOutlined spin />} className="m-0 border-none font-bold text-[10px] uppercase px-3 py-0.5 rounded-full">
              Saving Changes
            </Tag>
          ) : (
            <Tag color="success" className="m-0 border-none font-bold text-[10px] uppercase px-3 py-0.5 rounded-full">
              Synced
            </Tag>
          )}
        </div>
      </div>

      <div className="p-6">
        {showAlert && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 items-start">
            <InfoCircleOutlined className="text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-blue-900 m-0">Required Configuration</p>
              <p className="text-xs text-blue-700 m-0 mt-0.5 leading-relaxed">
                Both Business Scale and Location Tier selections are essential for accurate fee calculation and the licensing process.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Business Scale Selection */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <BlockOutlined className="text-xs" />
                Select Business Scale
              </span>
            </div>

            <Radio.Group
              value={scaleValue}
              onChange={(e) => setScaleValue(e.target.value)}
              className="w-full flex flex-col gap-3"
            >
              {business_scales &&
                business_scales?.map((scale, i) => (
                  <label 
                    key={i} 
                    className={`
                      relative flex items-start p-4 rounded-xl border transition-all cursor-pointer
                      ${scaleValue === scale.name 
                        ? 'border-indigo-500 bg-indigo-50/30 ring-1 ring-indigo-500' 
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'}
                    `}
                  >
                    <Radio value={scale.name} className="mt-1" />
                    <div className="ml-3">
                      <p className={`text-sm font-bold m-0 ${scaleValue === scale.name ? 'text-indigo-900' : 'text-slate-800'}`}>
                        {capitalizeFirstLetter(scale?.name)}
                      </p>
                      <p className="text-xs text-slate-500 m-0 mt-1 leading-relaxed">
                        {scale?.description}
                      </p>
                    </div>
                  </label>
                ))}
            </Radio.Group>
          </div>

          {/* Location Tier Selection */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <EnvironmentOutlined className="text-xs" />
                Select Location Tier
              </span>
            </div>

            <Radio.Group
              value={locationValue}
              onChange={(e) => setLocationValue(e.target.value)}
              className="w-full flex flex-col gap-3"
            >
              {business_locations &&
                business_locations?.map((location, i) => (
                  <label 
                    key={i}
                    className={`
                      relative flex items-start p-4 rounded-xl border transition-all cursor-pointer
                      ${locationValue === location.name 
                        ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500' 
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'}
                    `}
                  >
                    <Radio value={location.name} className="mt-1" />
                    <div className="ml-3">
                      <p className={`text-sm font-bold m-0 ${locationValue === location.name ? 'text-emerald-900' : 'text-slate-800'}`}>
                        {location.description}
                      </p>
                      <p className="text-xs text-slate-500 m-0 mt-1 leading-relaxed">
                        {location.sub_description}
                      </p>
                    </div>
                  </label>
                ))}
            </Radio.Group>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScaleLocationBlock;
