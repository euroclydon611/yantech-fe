import React, { useEffect, useState } from "react";
import {
  useTaxReliefListQuery,
  useTaxReliefUpdateMutation,
} from "../../../redux/features/configurations/taxApi";
import { toast } from "react-hot-toast";
import { PageTitle } from "../../../utils/PageTitle";
import PageLayout from "../../../components/PageLayout";
import { Table } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

interface TableData {
  name: string;
  amount: number;
}

const TaxRelief: React.FC = () => {
  PageTitle("Tax Relief config | Payroll");

  const { privileges } = useSelector((state: RootState) => state.auth);
  const hasCreateAccess = privileges?.includes("PAYROLL_TAX_RELIEF_CREATE");
  const hasEditAccess = privileges?.includes("PAYROLL_TAX_RELIEF_EDIT");
  const hasDeleteAccess = privileges?.includes("PAYROLL_TAX_RELIEF_DELETE");

  const [tableData, setTableData] = useState<TableData[]>([
    { name: "", amount: 0 },
  ]);
  const { data: taxData, isLoading: isTaxDataLoading } = useTaxReliefListQuery(
    {}
  );
  const [updateTax] = useTaxReliefUpdateMutation();

  useEffect(() => {
    if (taxData?.data) {
      setTableData([...taxData.data]);
    }
  }, [taxData]);

  const handleAddRow = () => {
    setTableData((prevData) => [...prevData, { name: "", amount: 0 }]);
  };

  const handleRemoveRow = (index: number) => {
    setTableData((prevData) => {
      const updatedData = [...prevData];
      updatedData.splice(index, 1);
      return updatedData;
    });
  };

  const handleChange = (
    index: number,
    key: keyof TableData,
    value: string | number
  ) => {
    setTableData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = { ...updatedData[index], [key]: value };
      return updatedData;
    });
  };

  const handleSubmit = async () => {
    try {
      await updateTax({ tax_exemptions: tableData })
        .unwrap()
        .then((res) => {
          toast.success(res?.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // if (isTaxDataLoading) {
  //   return <Loader />;
  // }

  return (
    <>
      <PageLayout
        title="Tax Relief Configuration"
        subtitle="Configure tax relief thresholds and amounts"
        breadcrumbs={[{ label: "Payroll" }, { label: "Configs" }, { label: "Tax Relief" }]}
      />
      <div className="p-4">
        <div className="table-wrapper max-h-[50vh] overflow-y-auto bg-white rounded-sm shadow-sm mt-6">
          <Table
            columns={[
              {
                title: "No",
                key: "no",
                width: 60,
                render: (_text, _record, index) => index + 1,
                onCell: () => ({ style: { fontSize: "11px" } }),
              },
              {
                title: "Name",
                key: "name",
                width: 200,
                render: (_text, _record, index) => (
                  <input
                    type="text"
                    value={tableData[index]?.name || ""}
                    placeholder="Enter the relief name"
                    onChange={(e) =>
                      handleChange(index, "name", e.target.value)
                    }
                    disabled={!hasEditAccess}
                    className="border w-[100%] border-gray-300 rounded-md shadow-md placeholder-[#8391a2] focus:ring-[0.3px] p-1 pl-2 focus:ring-gray-300 focus:border-gray-500 text-[11px]"
                  />
                ),
              },
              {
                title: "Amount",
                key: "amount",
                width: 150,
                render: (_text, _record, index) => (
                  <input
                    type="number"
                    value={tableData[index]?.amount || 0}
                    placeholder="Enter the amount"
                    onChange={(e) =>
                      handleChange(index, "amount", e.target.valueAsNumber)
                    }
                    disabled={!hasEditAccess}
                    className="border w-[100%] border-gray-300 rounded-md shadow-md placeholder-[#8391a2] focus:ring-[0.3px] p-1 pl-2 focus:ring-gray-300 focus:border-gray-500 text-[11px]"
                  />
                ),
              },
              {
                title: "Action",
                key: "action",
                width: 120,
                align: "center" as const,
                render: (_text, _record, index) => (
                  <div className="flex gap-x-2 justify-center">
                    {index === tableData.length - 1 ? (
                      <>
                        {index !== 0 && hasDeleteAccess && (
                          <button
                            className="bg-red-500 text-white px-3 py-[4px] rounded-sm text-[11px]"
                            onClick={() => handleRemoveRow(index)}
                          >
                            -
                          </button>
                        )}
                        {hasCreateAccess && (
                          <button
                            className="bg-green-700 text-white px-3 py-[4px] rounded-sm text-[11px]"
                            onClick={handleAddRow}
                          >
                            +
                          </button>
                        )}
                      </>
                    ) : (
                      hasDeleteAccess && (
                        <button
                          className="bg-red-500 text-white px-3 py-[4px] rounded-sm text-[11px]"
                          onClick={() => handleRemoveRow(index)}
                        >
                          -
                        </button>
                      )
                    )}
                  </div>
                ),
              },
            ]}
            dataSource={tableData}
            rowKey={(_, index) => index}
            pagination={false}
            size="small"
            locale={{ emptyText: "No data" }}
            scroll={{ x: 900 }}
          />
        </div>
        <div className="w-full flex justify-center mt-4">
          {hasEditAccess && (
            <button
              className="bg-green-700 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-800"
              onClick={handleSubmit}
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
      <br />
      <br />
    </>
  );
};

export default TaxRelief;
