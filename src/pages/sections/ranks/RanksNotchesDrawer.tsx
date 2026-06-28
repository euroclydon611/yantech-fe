import { Drawer } from "antd";
import { formatNumber } from "../../../utils/helperFunction";

interface RanksNotchesDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedRankNotches: any;
}

const RanksNotchesDrawer = ({
  open,
  onClose,
  selectedRankNotches,
}: RanksNotchesDrawerProps) => {
  return (
    <Drawer
      title={`Notches - ${selectedRankNotches?.name}`}
      onClose={onClose}
      open={open}
      width={700}
    >
      <div className="space-y-6">
        {selectedRankNotches?.notches &&
        Object.entries(selectedRankNotches.notches).length > 0 ? (
          Object.entries(selectedRankNotches.notches).map(
            ([notchKey, notchData]: any) => (
              <div
                key={notchKey}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-3 capitalize">
                  {notchKey.replace(/_/g, " ")}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Basic Salary
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatNumber(notchData.basic_salary)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Hourly Rate
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatNumber(notchData.hourly_rate) || 0.00}
                    </p>
                  </div>
                </div>
                <div className="mt-3 border-t border-gray-300 pt-3 hidden">
                  <p className="text-sm text-gray-600 font-medium mb-2">
                    Allowances ({notchData.allowance_names?.length || 0})
                  </p>
                  {notchData.allowance_names &&
                  notchData.allowance_names.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {notchData.allowance_names.map(
                        (id: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded"
                          >
                            {id}
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No allowances</p>
                  )}
                </div>
                <div className="mt-3 hidden">
                  <p className="text-sm text-gray-600 font-medium mb-2">
                    Deductions ({notchData.deduction_names?.length || 0})
                  </p>
                  {notchData.deduction_names &&
                  notchData.deduction_names.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {notchData.deduction_names.map(
                        (id: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded"
                          >
                            {id}
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No deductions</p>
                  )}
                </div>
              </div>
            )
          )
        ) : (
          <p className="text-gray-500 text-center py-8">No notches available</p>
        )}
      </div>
    </Drawer>
  );
};

export default RanksNotchesDrawer;
