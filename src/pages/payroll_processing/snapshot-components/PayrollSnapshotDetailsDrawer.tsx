import { FC } from "react";
import {
  Drawer,
  Card,
  Descriptions,
  Row,
  Col,
  Divider,
  Tag,
  Skeleton,
  Empty,
} from "antd";
import {
  capitalizeFirstLetter,
  formatDate2,
  formatNumber,
  normalizeText,
} from "@/utils/helperFunction";

interface EmployeeData {
  staff_id: string;
  full_name: string;
  grade_name: string;
  notch?: string;
  status_name: string;
  effective_date_of_last_promotion?: string;
  employment_type: string;
  gra_position?: string;
  pay_type: string;
  entity_name: string;
  pay_month?: string;
  year?: number;
  total_months_ran?: number;
  hourly_rate?: number;
  total_hours_worked?: number;
  overtime_hours_worked?: number;
  default_salary: number;
  basic_salary: number;
  total_earnings: number;
  total_deductions: number;
  total_exemptions?: number;
  gross_salary: number;
  net_amount: number;
  taxable_income: number;
  income_tax: number;
  employee_ssnit_contribution: number;
  ssnit_tier2_contribution: number;
  ssnit_tier3_contribution: number;
  snnit_tier_3_employer: number;
  tier_3_taxable: number;
  exemptions?: Array<{
    name: string;
    type?: string;
    amount: number;
    month_year?: string;
  }>;
  payslip?: Array<{
    name: string;
    type: "Earning" | "Deduction";
    amount: number;
    hours?: number;
    days?: number;
    rate?: number;
    month_year?: string;
  }>;
}

interface PayrollSnapshotDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  record: EmployeeData | null;
  loading?: boolean;
}

const PayrollSnapshotDetailsDrawer: FC<PayrollSnapshotDetailsDrawerProps> = ({
  open,
  onClose,
  record,
  loading = false,
}) => {
  return (
    <Drawer
      title={
        loading
          ? "Loading Details..."
          : `Payroll Snapshot Details - ${record?.full_name || ""}`
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={"60%"}
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 15 }} />
      ) : record ? (
        <div>
          <Card title="Employee Information" style={{ marginBottom: "20px" }}>
            <Descriptions column={2} size="small" bordered>
              <Descriptions.Item label="Staff ID">
                {record.staff_id}
              </Descriptions.Item>
              <Descriptions.Item label="Full Name">
                {record.full_name}
              </Descriptions.Item>
              <Descriptions.Item label="Grade">
                {record.grade_name}
              </Descriptions.Item>
              <Descriptions.Item label="Notch">
                {record.notch || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {record.status_name}
              </Descriptions.Item>
              <Descriptions.Item label="Last Promotion Date">
                {record.effective_date_of_last_promotion
                  ? formatDate2(record.effective_date_of_last_promotion)
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Employment Type">
                {capitalizeFirstLetter(record.employment_type)}
              </Descriptions.Item>
              <Descriptions.Item label="Position">
                {capitalizeFirstLetter(record.gra_position)}
              </Descriptions.Item>
              <Descriptions.Item label="Pay Type">
                {record.pay_type}
              </Descriptions.Item>
              <Descriptions.Item label="Entity">
                {record.entity_name}
              </Descriptions.Item>
              <Descriptions.Item label="Salary Review Period">
                {record.pay_month?.toUpperCase()} {record.year}
              </Descriptions.Item>
              <Descriptions.Item label="Months Ran">
                {record.total_months_ran || 1}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Salary Summary" style={{ marginBottom: "20px" }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div
                  style={{
                    padding: "10px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4px",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Default Salary
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                    {formatNumber(record.default_salary) || "0.00"}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div
                  style={{
                    padding: "10px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4px",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Basic Salary
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                    {formatNumber(record.basic_salary) || "0.00"}
                  </div>
                </div>
              </Col>

              {record.pay_type?.toLowerCase().trim() === "clock_in" && (
                <>
                  <Col span={8}>
                    <div
                      style={{
                        padding: "10px",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "4px",
                      }}
                    >
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        Hourly Rate
                      </div>
                      <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                        {formatNumber(record.hourly_rate) || "0.00"}
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div
                      style={{
                        padding: "10px",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "4px",
                      }}
                    >
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        Hrs Worked
                      </div>
                      <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                        {record.total_hours_worked || 0}
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div
                      style={{
                        padding: "10px",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "4px",
                      }}
                    >
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        Overtime Hrs
                      </div>
                      <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                        {record.overtime_hours_worked || 0}
                      </div>
                    </div>
                  </Col>
                </>
              )}
            </Row>
          </Card>

          {record.payslip &&
            record.payslip.filter((item: any) => item.type === "Earning")
              .length > 0 && (
              <Card
                title="Employee Earnings"
                style={{ marginBottom: "20px" }}
              >
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{ width: "100%", borderCollapse: "collapse" }}
                  >
                    <thead>
                      <tr
                        style={{
                          borderTop: "1px solid #333",
                          borderBottom: "1px solid #333",
                        }}
                      >
                        <th
                          style={{
                            textAlign: "left",
                            padding: "8px",
                            fontWeight: "bold",
                            fontSize: "12px",
                          }}
                        >
                          PERIOD
                        </th>
                        <th
                          style={{
                            textAlign: "left",
                            padding: "8px",
                            fontWeight: "bold",
                            fontSize: "12px",
                          }}
                        >
                          EARNING
                        </th>
                        <th
                          style={{
                            textAlign: "right",
                            padding: "8px",
                            fontWeight: "bold",
                            fontSize: "12px",
                          }}
                        >
                          HOURS/DAYS
                        </th>
                        <th
                          style={{
                            textAlign: "right",
                            padding: "8px",
                            fontWeight: "bold",
                            fontSize: "12px",
                          }}
                        >
                          RATE
                        </th>
                        <th
                          style={{
                            textAlign: "right",
                            padding: "8px",
                            fontWeight: "bold",
                            fontSize: "12px",
                          }}
                        >
                          AMOUNT
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {record.payslip
                        .filter((item: any) => item.type === "Earning")
                        .map((earning: any, idx: number) => (
                          <tr
                            key={idx}
                            style={{ borderBottom: "1px solid #eee" }}
                          >
                            <td
                              style={{ padding: "8px", fontSize: "12px" }}
                            >
                              {earning.month_year || "-"}
                            </td>
                            <td
                              style={{ padding: "8px", fontSize: "12px" }}
                            >
                              {earning.name}
                            </td>
                            <td
                              style={{
                                textAlign: "right",
                                padding: "8px",
                                fontSize: "12px",
                              }}
                            >
                              {earning.hours || earning.days || "-"}
                            </td>
                            <td
                              style={{
                                textAlign: "right",
                                padding: "8px",
                                fontSize: "12px",
                              }}
                            >
                              {earning.rate
                                ? formatNumber(earning.rate)
                                : "-"}
                            </td>
                            <td
                              style={{
                                textAlign: "right",
                                padding: "8px",
                                fontSize: "12px",
                                fontWeight: "bold",
                              }}
                            >
                              {formatNumber(earning.amount) || "0.00"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <Divider style={{ margin: "12px 0" }} />
                <Row justify="space-between" style={{ paddingTop: "8px" }}>
                  <Col>
                    <span style={{ fontWeight: "bold" }}>GROSS SALARY</span>
                  </Col>
                  <Col>
                    <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                      {formatNumber(record.total_earnings) || "0.00"}
                    </span>
                  </Col>
                </Row>
              </Card>
            )}

          {record.payslip &&
            record.payslip.filter((item: any) => item.type === "Deduction")
              .length > 0 && (
              <Card
                title="Employee Deductions"
                style={{ marginBottom: "20px" }}
              >
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{ width: "100%", borderCollapse: "collapse" }}
                  >
                    <thead>
                      <tr
                        style={{
                          borderTop: "1px solid #333",
                          borderBottom: "1px solid #333",
                        }}
                      >
                        <th
                          style={{
                            textAlign: "left",
                            padding: "8px",
                            fontWeight: "bold",
                            fontSize: "12px",
                            width: "20%",
                          }}
                        >
                          PERIOD
                        </th>
                        <th
                          style={{
                            textAlign: "left",
                            padding: "8px",
                            fontWeight: "bold",
                            fontSize: "12px",
                            width: "30%",
                          }}
                        >
                          DEDUCTION
                        </th>
                        <th
                          style={{
                            textAlign: "right",
                            padding: "8px",
                            fontWeight: "bold",
                            fontSize: "12px",
                            width: "30%",
                          }}
                        >
                          AMOUNT
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {record.payslip
                        .filter((item: any) => item.type === "Deduction")
                        .map((deduction: any, idx: number) => (
                          <tr
                            key={idx}
                            style={{ borderBottom: "1px solid #eee" }}
                          >
                            <td
                              style={{ padding: "8px", fontSize: "12px" }}
                            >
                              {deduction.month_year || "-"}
                            </td>
                            <td
                              style={{ padding: "8px", fontSize: "12px" }}
                            >
                              {deduction.name}
                            </td>
                            <td
                              style={{
                                textAlign: "right",
                                padding: "8px",
                                fontSize: "12px",
                                fontWeight: "bold",
                              }}
                            >
                              {formatNumber(deduction.amount) || "0.00"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <Divider style={{ margin: "12px 0" }} />
                <Row justify="space-between" style={{ paddingTop: "8px" }}>
                  <Col>
                    <span style={{ fontWeight: "bold" }}>
                      TOTAL DEDUCTION
                    </span>
                  </Col>
                  <Col>
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: "#d9534f",
                      }}
                    >
                      {formatNumber(record.total_deductions) || "0.00"}
                    </span>
                  </Col>
                </Row>
              </Card>
            )}

          <Card
            title="Taxes & Contributions"
            style={{ marginBottom: "20px" }}
          >
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="Taxable Income">
                {formatNumber(record.taxable_income) || "0.00"}
              </Descriptions.Item>
              <Descriptions.Item label="Income Tax">
                {formatNumber(record.income_tax) || "0.00"}
              </Descriptions.Item>
              <Descriptions.Item label="SSNIT Employee Contribution">
                {formatNumber(record.employee_ssnit_contribution) || "0.00"}
              </Descriptions.Item>
              {/* <Descriptions.Item label="SSNIT Tier 2">
                {formatNumber(record.ssnit_tier2_contribution) || "0.00"}
              </Descriptions.Item> */}
              <Descriptions.Item label="SSNIT Tier 3">
                {formatNumber(record.ssnit_tier3_contribution + record?.tier_3_taxable) || "0.00"}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {record.exemptions && record.exemptions.length > 0 && (
            <Card
              title="Personal Tax Relief"
              style={{ marginBottom: "20px" }}
            >
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{ width: "100%", borderCollapse: "collapse" }}
                >
                  <thead>
                    <tr
                      style={{
                        borderTop: "1px solid #333",
                        borderBottom: "1px solid #333",
                      }}
                    >
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        PERIOD
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        Name
                      </th>
                      <th
                        style={{
                          textAlign: "right",
                          padding: "8px",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        TYPE
                      </th>
                      <th
                        style={{
                          textAlign: "right",
                          padding: "8px",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        AMOUNT
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.exemptions.map((exemption: any, idx: number) => (
                      <tr
                        key={idx}
                        style={{ borderBottom: "1px solid #eee" }}
                      >
                        <td style={{ padding: "8px", fontSize: "12px" }}>
                          {exemption.month_year || "-"}
                        </td>
                        <td style={{ padding: "8px", fontSize: "12px" }}>
                          {exemption.name}
                        </td>
                        <td
                          style={{
                            textAlign: "right",
                            padding: "8px",
                            fontSize: "12px",
                          }}
                        >
                          <Tag color="blue">
                            {normalizeText(exemption.type) || "Relief"}
                          </Tag>
                        </td>
                        <td
                          style={{
                            textAlign: "right",
                            padding: "8px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {formatNumber(exemption.amount) || "0.00"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Divider style={{ margin: "12px 0" }} />
              <Row justify="space-between" style={{ paddingTop: "8px" }}>
                <Col>
                  <span style={{ fontWeight: "bold" }}>
                    TOTAL EXEMPTIONS
                  </span>
                </Col>
                <Col>
                  <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    {formatNumber(record.total_exemptions) || "0.00"}
                  </span>
                </Col>
              </Row>
            </Card>
          )}

          <Card
            style={{
              marginBottom: "20px",
              backgroundColor: "#f5f5f5",
              border: "2px solid #333",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr
                    style={{
                      borderTop: "2px solid #333",
                      borderBottom: "2px solid #333",
                    }}
                  >
                    <td
                      style={{
                        width: "18%",
                        fontWeight: "bold",
                        textAlign: "left",
                        padding: "8px",
                        fontSize: "12px",
                      }}
                    >
                      GROSS SALARY
                    </td>
                    <td
                      style={{
                        width: "22%",
                        textAlign: "right",
                        fontWeight: "bold",
                        padding: "8px",
                        fontSize: "12px",
                      }}
                    >
                      {formatNumber(record.gross_salary) || "0.00"}
                    </td>
                    <td
                      style={{
                        width: "15%",
                        fontWeight: "bold",
                        textAlign: "left",
                        paddingLeft: "20px",
                        padding: "8px",
                        fontSize: "12px",
                      }}
                    >
                      TOTAL DEDUCTION
                    </td>
                    <td style={{ width: "5%", padding: "8px" }}></td>
                    <td
                      style={{
                        textAlign: "right",
                        fontWeight: "bold",
                        padding: "8px",
                        fontSize: "12px",
                        color: "#d9534f",
                      }}
                    >
                      {formatNumber(record.total_deductions) || "0.00"}
                    </td>
                  </tr>
                  <tr
                    style={{
                      borderTop: "2px solid #333",
                      borderBottom: "2px solid #333",
                      backgroundColor: "#000",
                      color: "#fff",
                    }}
                  >
                    <td
                      style={{
                        width: "18%",
                        fontWeight: "bold",
                        textAlign: "left",
                        padding: "8px",
                        fontSize: "12px",
                      }}
                    >
                      NET SALARY
                    </td>
                    <td
                      style={{
                        width: "22%",
                        textAlign: "right",
                        fontWeight: "bold",
                        padding: "8px",
                        fontSize: "12px",
                      }}
                    >
                      {formatNumber(record.net_amount) || "0.00"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
        <Empty description="No payroll snapshot data found for this period" />
      )}
    </Drawer>
  );
};

export default PayrollSnapshotDetailsDrawer;
