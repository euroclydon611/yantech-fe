import React, { useEffect, useState } from "react";
import Loader from "../../../components/Loader";
import { toast } from "react-hot-toast";
import {
  useSsnitEmployerListQuery,
  useSsnitEmployeeListQuery,
  useSsnitEmployeeUpdateMutation,
  useSsnitEmployerUpdateMutation,

  //tier 1 and tier 2
  useSsnitTier1ListQuery,
  useSsnitTier2ListQuery,
  useSsnitTier1UpdateMutation,
  useSsnitTier2UpdateMutation,
} from "../../../redux/features/configurations/ssnitApi";
import { PageTitle } from "../../../utils/PageTitle";
import PageLayout from "../../../components/PageLayout";
import ContributionCeiling from "./ContributionCeiling";
import { Table, Button, Tooltip } from "antd";
import { HistoryOutlined } from "@ant-design/icons";
import RecordHistoryDrawer from "../../settings/RecordHistoryDrawer";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

interface TableData {
  contribution_name: string;
  rate: number;
  effective_date: string;
}

const SsnitConfiguration: React.FC = () => {
  PageTitle("SSNIT config | Payroll");
  const { privileges } = useSelector((state: RootState) => state.auth);
  const hasCreateAccess = privileges?.includes("PAYROLL_SSNIT_CREATE");
  const hasEditAccess = privileges?.includes("PAYROLL_SSNIT_EDIT");
  const hasDeleteAccess = privileges?.includes("PAYROLL_SSNIT_DELETE");

  const [tableDataEmployer, setTableDataEmployer] = useState<TableData[]>([
    { contribution_name: "", rate: 0, effective_date: "" },
  ]);
  const [tableDataEmployee, setTableDataEmployee] = useState<TableData[]>([
    { contribution_name: "", rate: 0, effective_date: "" },
  ]);
  const [tableDataTier1, setTableDataTier1] = useState<TableData[]>([
    { contribution_name: "", rate: 0, effective_date: "" },
  ]);
  const [tableDataTier2, setTableDataTier2] = useState<TableData[]>([
    { contribution_name: "", rate: 0, effective_date: "" },
  ]);
  const { data: employerData, isLoading: isEmployerDataLoading } =
    useSsnitEmployerListQuery({});
  const { data: employeeData, isLoading: isEmployeeDataLoading } =
    useSsnitEmployeeListQuery({});

  const { data: tier1Data, isLoading: isTier1DataLoading } =
    useSsnitTier1ListQuery({});
  const { data: tier2Data, isLoading: isTier2DataLoading } =
    useSsnitTier2ListQuery({});

  const [updateEmployer] = useSsnitEmployerUpdateMutation();
  const [updateEmployee] = useSsnitEmployeeUpdateMutation();

  const [updateTier1] = useSsnitTier1UpdateMutation();
  const [updateTier2] = useSsnitTier2UpdateMutation();

  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    if (employerData?.data) {
      setTableDataEmployer([...employerData?.data]);
    }
    if (employeeData?.data) {
      setTableDataEmployee([...employeeData?.data]);
    }
    if (tier1Data?.data) {
      setTableDataTier1([...tier1Data?.data]);
    }
    if (tier2Data?.data) {
      setTableDataTier2([...tier2Data?.data]);
    }
  }, [employerData, employeeData, tier1Data, tier2Data]);

  const handleAddRowEmployer = () => {
    setTableDataEmployer((prevData) => [
      ...prevData,
      { contribution_name: "", rate: 0, effective_date: "" },
    ]);
  };
  const handleAddRowEmployee = () => {
    setTableDataEmployee((prevData) => [
      ...prevData,
      { contribution_name: "", rate: 0, effective_date: "" },
    ]);
  };

  const handleRemoveRowEmployer = (index: number) => {
    setTableDataEmployer((prevData) => {
      const updatedData = [...prevData];
      updatedData.splice(index, 1);
      return updatedData;
    });
  };
  const handleRemoveRowEmployee = (index: number) => {
    setTableDataEmployee((prevData) => {
      const updatedData = [...prevData];
      updatedData.splice(index, 1);
      return updatedData;
    });
  };

  const handleAddRowTier1 = () => {
    setTableDataTier1((prevData) => [
      ...prevData,
      { contribution_name: "", rate: 0, effective_date: "" },
    ]);
  };
  const handleAddRowTier2 = () => {
    setTableDataTier2((prevData) => [
      ...prevData,
      { contribution_name: "", rate: 0, effective_date: "" },
    ]);
  };

  const handleRemoveRowTier1 = (index: number) => {
    setTableDataTier1((prevData) => {
      const updatedData = [...prevData];
      updatedData.splice(index, 1);
      return updatedData;
    });
  };
  const handleRemoveRowTier2 = (index: number) => {
    setTableDataTier2((prevData) => {
      const updatedData = [...prevData];
      updatedData.splice(index, 1);
      return updatedData;
    });
  };

  const handleChangeEmployer = (
    index: number,
    key: keyof TableData,
    value: string | number
  ) => {
    setTableDataEmployer((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = { ...updatedData[index], [key]: value };
      return updatedData;
    });
  };
  const handleChangeEmployee = (
    index: number,
    key: keyof TableData,
    value: string | number
  ) => {
    setTableDataEmployee((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = { ...updatedData[index], [key]: value };
      return updatedData;
    });
  };

  const handleChangeTier1 = (
    index: number,
    key: keyof TableData,
    value: string | number
  ) => {
    setTableDataTier1((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = { ...updatedData[index], [key]: value };
      return updatedData;
    });
  };
  const handleChangeTier2 = (
    index: number,
    key: keyof TableData,
    value: string | number
  ) => {
    setTableDataTier2((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = { ...updatedData[index], [key]: value };
      return updatedData;
    });
  };

  const handleSubmitEmployer = async () => {
    try {
      await updateEmployer({ data: tableDataEmployer })
        .unwrap()
        .then((res) => {
          toast.success(res?.message);
        });
    } catch (error) {
      toast.error("Make sure you fill all the available fields");
    }
  };
  const handleSubmitEmployee = async () => {
    try {
      await updateEmployee({ data: tableDataEmployee })
        .unwrap()
        .then((res) => {
          toast.success(res?.message);
        });
    } catch (error) {
      toast.error("Make sure you fill all the available fields");
    }
  };

  const handleSubmitTier1 = async () => {
    try {
      await updateTier1({ data: tableDataTier1 })
        .unwrap()
        .then((res) => {
          toast.success(res?.message);
        });
    } catch (error) {
      toast.error("Make sure you fill all the available fields");
    }
  };
  const handleSubmitTier2 = async () => {
    try {
      await updateTier2({ data: tableDataTier2 })
        .unwrap()
        .then((res) => {
          toast.success(res?.message);
        });
    } catch (error) {
      toast.error("Make sure you fill all the available fields");
    }
  };

  // if (
  //   isEmployerDataLoading ||
  //   isEmployeeDataLoading ||
  //   isTier1DataLoading ||
  //   isTier2DataLoading
  // ) {
  //   return <Loader />;
  // }

  return (
    <div className="text-black">
      <PageLayout
        title="SSNIT / Other Contributions"
        subtitle="Configure SSNIT employer and employee contribution rates"
        breadcrumbs={[{ label: "Payroll" }, { label: "Configs" }, { label: "SSNIT/Other" }]}
        actions={
          <Tooltip title={(employeeData as any)?.configId ? "View Change History" : "No history available"}>
            <Button
              icon={<HistoryOutlined />}
              onClick={() => setHistoryOpen(true)}
              disabled={!(employeeData as any)?.configId}
              className="flex items-center gap-2 text-orange-600 border-orange-200 hover:text-orange-700 hover:border-orange-300 hover:bg-orange-50"
            >
              History
            </Button>
          </Tooltip>
        }
      />

      <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
        <div className="w-full lg:w-1/2">
          <div className="max-h-[30vh] p-3 overflow-y-auto bg-white rounded-sm shadow-sm">
            <h1 className="text-[18px] font-bold p-2">
              Employer SSF Contributions
            </h1>
            <Table
              columns={[
                {
                  title: "No",
                  key: "no",
                  width: 10,
                  render: (_text, _record, index) => index + 1,
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Contribution Type",
                  key: "contribution_name",
                  width: 120,
                  render: (_text, _record, index) => (
                    <input
                      type="text"
                      value={tableDataEmployer[index]?.contribution_name || ""}
                      placeholder="Enter the contribution type"
                      onChange={(e) =>
                        handleChangeEmployer(
                          index,
                          "contribution_name",
                          e.target.value
                        )
                      }
                      disabled={!hasEditAccess}
                      className="border w-[100%] border-gray-300 rounded-md shadow-md placeholder-[#8391a2] focus:ring-[0.3px] p-1 pl-2 focus:ring-gray-300 focus:border-gray-500 text-[11px]"
                    />
                  ),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Contribution Rate",
                  key: "rate",
                  width: 130,
                  render: (_text, _record, index) => (
                    <input
                      type="number"
                      value={tableDataEmployer[index]?.rate === 0 ? "" : tableDataEmployer[index]?.rate || ""}
                      placeholder="Enter the rate"
                      onChange={(e) =>
                        handleChangeEmployer(index, "rate", e.target.value)
                      }
                      disabled={!hasEditAccess}
                      className="border w-[100%] border-gray-300 rounded-md shadow-md placeholder-[#8391a2] focus:ring-[0.3px] p-1 pl-2 focus:ring-gray-300 focus:border-gray-500 text-[11px]"
                    />
                  ),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
              ]}
              dataSource={tableDataEmployer}
              rowKey={(_, index) => index}
              pagination={false}
              size="small"
              locale={{ emptyText: "No data" }}
            />
            <div className="w-full flex justify-center mt-4">
              {hasEditAccess && (
                <button
                  className="bg-green-700 text-white px-3 py-2 rounded-sm shadow-md hover:bg-green-800"
                  onClick={handleSubmitEmployer}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <div className="max-h-[30vh] p-3 overflow-y-auto bg-white rounded-sm shadow-sm">
            <h1 className="text-[18px] font-bold p-2">
              Employee SSF Contributions
            </h1>
            <Table
              columns={[
                {
                  title: "No",
                  key: "no",
                  width: 10,
                  render: (_text, _record, index) => index + 1,
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Contribution Type",
                  key: "contribution_name",
                  width: 120,
                  render: (_text, _record, index) => (
                    <input
                      type="text"
                      value={tableDataEmployee[index]?.contribution_name || ""}
                      placeholder="Enter the contribution type"
                      onChange={(e) =>
                        handleChangeEmployee(
                          index,
                          "contribution_name",
                          e.target.value
                        )
                      }
                      disabled={!hasEditAccess}
                      className="border w-[100%] border-gray-300 rounded-md shadow-md placeholder-[#8391a2] focus:ring-[0.3px] p-1 pl-2 focus:ring-gray-300 focus:border-gray-500 text-[11px]"
                    />
                  ),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Contribution Rate",
                  key: "rate",
                  width: 130,
                  render: (_text, _record, index) => (
                    <input
                      type="number"
                      value={tableDataEmployee[index]?.rate === 0 ? "" : tableDataEmployee[index]?.rate || ""}
                      placeholder="Enter the rate"
                      onChange={(e) =>
                        handleChangeEmployee(index, "rate", e.target.value)
                      }
                      disabled={!hasEditAccess}
                      className="border w-[100%] border-gray-300 rounded-md shadow-md placeholder-[#8391a2] focus:ring-[0.3px] p-1 pl-2 focus:ring-gray-300 focus:border-gray-500 text-[11px]"
                    />
                  ),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
              ]}
              dataSource={tableDataEmployee}
              rowKey={(_, index) => index}
              pagination={false}
              size="small"
              locale={{ emptyText: "No data" }}
            />
            <div className="w-full flex justify-center mt-4">
              {hasEditAccess && (
                <button
                  className="bg-green-700 text-white px-3 py-2 rounded-sm shadow-md hover:bg-green-800"
                  onClick={handleSubmitEmployee}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ======================================================== */}
      <br />
      <br />
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
        <div className="w-full lg:w-1/2">
          <div className="max-h-[30vh] p-3 overflow-y-auto bg-white rounded-sm shadow-sm">
            <h1 className="text-[18px] font-bold p-2">Tier 1</h1>
            <Table
              columns={[
                {
                  title: "No",
                  key: "no",
                  width: 10,
                  render: (_text, _record, index) => index + 1,
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Contribution Type",
                  key: "contribution_name",
                  width: 120,
                  render: (_text, _record, index) => (
                    <input
                      type="text"
                      value={tableDataTier1[index]?.contribution_name || ""}
                      placeholder="Enter the contribution type"
                      onChange={(e) =>
                        handleChangeTier1(
                          index,
                          "contribution_name",
                          e.target.value
                        )
                      }
                      disabled={!hasEditAccess}
                      className="border w-[100%] border-gray-300 rounded-md shadow-md placeholder-[#8391a2] focus:ring-[0.3px] p-1 pl-2 focus:ring-gray-300 focus:border-gray-500 text-[11px]"
                    />
                  ),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Contribution Rate",
                  key: "rate",
                  width: 130,
                  render: (_text, _record, index) => (
                    <input
                      type="number"
                      value={tableDataTier1[index]?.rate === 0 ? "" : tableDataTier1[index]?.rate || ""}
                      placeholder="Enter the rate"
                      onChange={(e) =>
                        handleChangeTier1(index, "rate", e.target.value)
                      }
                      disabled={!hasEditAccess}
                      className="border w-[100%] border-gray-300 rounded-md shadow-md placeholder-[#8391a2] focus:ring-[0.3px] p-1 pl-2 focus:ring-gray-300 focus:border-gray-500 text-[11px]"
                    />
                  ),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
              ]}
              dataSource={tableDataTier1}
              rowKey={(_, index) => index}
              pagination={false}
              size="small"
              locale={{ emptyText: "No data" }}
            />
            <div className="w-full flex justify-center mt-4">
              {hasEditAccess && (
                <button
                  className="bg-green-700 text-white px-3 py-2 rounded-sm shadow-md hover:bg-green-800"
                  onClick={handleSubmitTier1}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <div className="max-h-[30vh] p-3 overflow-y-auto bg-white rounded-sm shadow-sm">
            <h1 className="text-[18px] font-bold p-2">Tier2</h1>
            <Table
              columns={[
                {
                  title: "No",
                  key: "no",
                  width: 10,
                  render: (_text, _record, index) => index + 1,
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Contribution Type",
                  key: "contribution_name",
                  width: 120,
                  render: (_text, _record, index) => (
                    <input
                      type="text"
                      value={tableDataTier2[index]?.contribution_name || ""}
                      placeholder="Enter the contribution type"
                      onChange={(e) =>
                        handleChangeTier2(
                          index,
                          "contribution_name",
                          e.target.value
                        )
                      }
                      disabled={!hasEditAccess}
                      className="border w-[100%] border-gray-300 rounded-md shadow-md placeholder-[#8391a2] focus:ring-[0.3px] p-1 pl-2 focus:ring-gray-300 focus:border-gray-500 text-[11px]"
                    />
                  ),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
                {
                  title: "Contribution Rate",
                  key: "rate",
                  width: 130,
                  render: (_text, _record, index) => (
                    <input
                      type="number"
                      value={tableDataTier2[index]?.rate === 0 ? "" : tableDataTier2[index]?.rate || ""}
                      placeholder="Enter the rate"
                      onChange={(e) =>
                        handleChangeTier2(index, "rate", e.target.value)
                      }
                      disabled={!hasEditAccess}
                      className="border w-[100%] border-gray-300 rounded-md shadow-md placeholder-[#8391a2] focus:ring-[0.3px] p-1 pl-2 focus:ring-gray-300 focus:border-gray-500 text-[11px]"
                    />
                  ),
                  onCell: () => ({ style: { fontSize: "11px" } }),
                },
              ]}
              dataSource={tableDataTier2}
              rowKey={(_, index) => index}
              pagination={false}
              size="small"
              locale={{ emptyText: "No data" }}
            />
            <div className="w-full flex justify-center mt-4">
              {hasEditAccess && (
                <button
                  className="bg-green-700 text-white px-3 py-2 rounded-sm shadow-md hover:bg-green-800"
                  onClick={handleSubmitTier2}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      <ContributionCeiling />
      <RecordHistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        modelName="Config"
        recordId={(employeeData as any)?.configId || ""}
        recordName="SSNIT Configuration"
      />
    </div>
  );
};

export default SsnitConfiguration;
