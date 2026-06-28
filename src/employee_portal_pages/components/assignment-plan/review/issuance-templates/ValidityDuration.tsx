import React, { useMemo } from "react";
import { Form } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface ValidityDurationProps {
  form: any;
  issueDateName?: string;
  expiryDateName?: string;
}

const ValidityDuration: React.FC<ValidityDurationProps> = ({
  form,
  issueDateName = "issueDate",
  expiryDateName = "expiryDate",
}) => {
  const issueDate = Form.useWatch(issueDateName, form);
  const expiryDate = Form.useWatch(expiryDateName, form);

  const durationText = useMemo(() => {
    if (!issueDate || !expiryDate) return null;
    const s = dayjs(issueDate).startOf("day");
    const e = dayjs(expiryDate).startOf("day").add(1, "day");

    if (e.isBefore(s)) return "Invalid duration";

    const years = e.diff(s, "year");
    const sAfterYears = s.add(years, "year");
    const months = e.diff(sAfterYears, "month");
    const sAfterMonths = sAfterYears.add(months, "month");
    const days = e.diff(sAfterMonths, "day");

    const weeks = Math.floor(days / 7);
    const remDays = days % 7;

    const parts = [];
    if (years > 0) parts.push(`${years} year${years > 1 ? "s" : ""}`);
    if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);
    if (weeks > 0) parts.push(`${weeks} week${weeks > 1 ? "s" : ""}`);
    if (remDays > 0) parts.push(`${remDays} day${remDays > 1 ? "s" : ""}`);

    return parts.length > 0 ? parts.join(", ") : "0 days";
  }, [issueDate, expiryDate]);

  if (!durationText) return null;

  return (
    <div className="flex justify-center -mt-2 mb-2">
      <div className="bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-lg flex items-center gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-blue-500" />
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.15em]">
            Permit Validity
          </span>
        </div>
        <div className="h-4 w-px bg-blue-200" />
        <span className="text-sm font-bold text-blue-900">
          {durationText}
        </span>
      </div>
    </div>
  );
};

export default ValidityDuration;
