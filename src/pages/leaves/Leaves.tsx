import { useState, useEffect } from "react";
import { Tabs } from "antd";
import Pending_leaves from "./Pending_leaves";
import Approved_leaves from "./Approved_leaves";
import Rejected_leaves from "./Rejected_leaves";
import { PageTitle } from "../../utils/PageTitle";

const Leaves = () => {
  const [activeKey, setActiveKey] = useState("pending");

  useEffect(() => {
    const titles: Record<string, string> = {
      pending: "Pending Leaves | HR",
      approved: "Approved Leaves | HR",
      rejected: "Rejected Leaves | HR",
    };
    PageTitle(titles[activeKey] || "Leave Management | HR");
  }, [activeKey]);

  const items = [
    {
      key: "pending",
      label: "Pending Leaves",
      children: <Pending_leaves />,
    },
    {
      key: "approved",
      label: "Approved Leaves",
      children: <Approved_leaves />,
    },
    {
      key: "rejected",
      label: "Rejected Leaves",
      children: <Rejected_leaves />,
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-[18px] mb-4 font-medium text-gray-800">
        Leave Management
      </h1>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          items={items}
          destroyInactiveTabPane={true}
        />
      </div>
    </div>
  );
};

export default Leaves;
