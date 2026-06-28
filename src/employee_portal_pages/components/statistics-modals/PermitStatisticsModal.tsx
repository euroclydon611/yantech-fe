import React, { useState, useMemo } from "react";
import {
  Modal,
  Card,
  Row,
  Col,
  Typography,
  Table,
  Empty,
  Spin,
  DatePicker,
  Select,
  Input,
  Button,
  Badge,
} from "antd";
import {
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  AlertOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useFetchPermitsStatisticsQuery } from "@/redux/features/employee-portal-api/authoirzations/main";
import { useEntityFullListQuery } from "@/redux/features/sections/entityApi";
import {
  issuedPermitsStatusOptions,
  issuedPermitTypes,
} from "@/employee_portal_pages/lib/helpers";
import { Dayjs } from "dayjs";
import { useDebounce } from "@/employee_portal_pages/lib/debounce";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface PermitStatisticsModalProps {
  open: boolean;
  onClose: () => void;
}

const PermitStatisticsModal: React.FC<PermitStatisticsModalProps> = ({
  open,
  onClose,
}) => {
  const { data: entitiesResponse } = useEntityFullListQuery({});
  const entities = entitiesResponse?.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [permitType, setPermitType] = useState("all");
  const [assigningEntity, setAssigningEntity] = useState("all");
  const [expiringInDays, setExpiringInDays] = useState(null);
  const [dateFilterType, setDateFilterType] = useState("issueDate");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);

  const startDateVal = dateRange?.[0]?.format("YYYY-MM-DD") || "";
  const endDateVal = dateRange?.[1]?.format("YYYY-MM-DD") || "";

  // Map dates based on filter type
  const startDate = dateFilterType === "createdAt" ? startDateVal : "";
  const endDate = dateFilterType === "createdAt" ? endDateVal : "";
  const issueDateStart = dateFilterType === "issueDate" ? startDateVal : "";
  const issueDateEnd = dateFilterType === "issueDate" ? endDateVal : "";
  const expiryDateStart = dateFilterType === "expiryDate" ? startDateVal : "";
  const expiryDateEnd = dateFilterType === "expiryDate" ? endDateVal : "";

  const handleRangeChange = (dates: any) => {
    setDateRange(dates);
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: permitStatus, isLoading } = useFetchPermitsStatisticsQuery({
    searchTerm: debouncedSearchTerm,
    permitType: permitType === "all" ? "" : permitType,
    status: status === "all" ? "" : status,
    startDate,
    endDate,
    assigningEntity: assigningEntity === "all" ? "" : assigningEntity,
    expiringInDays,
    issueDateStart,
    issueDateEnd,
    expiryDateStart,
    expiryDateEnd,
  });

  const filterOptions = useMemo(
    () => ({
      statusOptions: [
        { label: "All Statuses", value: "all" },
        ...issuedPermitsStatusOptions.map((status) => ({
          label: status
            .replace("_", " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          value: status,
        })),
      ],
      permitTypeOptions: [
        { label: "All Permit Types", value: "all" },
        ...issuedPermitTypes.map((type) => ({
          label: type
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          value: type,
        })),
      ],
      entityOptions: [
        { label: "All Entities", value: "all" },
        ...entities.map((entity: any) => ({
          label: entity.name,
          value: entity.id,
        })),
      ],
    }),
    [entities]
  );

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatus("all");
    setPermitType("all");
    setAssigningEntity("all");
    setExpiringInDays("");
    setDateFilterType("issueDate");
    setDateRange([null, null]);
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FileTextOutlined className="text-blue-600" />
          <span>Permits Statistics</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width="100vw"
      wrapClassName="permit-statistics-modal-wrap"
      style={{ top: 0, left: 0, right: 0, bottom: 0, margin: 0 }}
      bodyStyle={{
        height: "calc(100vh - 109px)",
        overflowY: "auto",
        padding: "24px",
      }}
      className="permit-statistics-modal"
    >
      <Spin spinning={isLoading}>
        <div className="space-y-6">
          {/* Filters Section */}
          <Card
            bodyStyle={{ padding: "20px" }}
            className="mb-4 shadow-sm border-0"
          >
            <div className="space-y-4">
              {/* Row 1: Search and Status */}
              <Row gutter={[16, 16]}>
                <Col xs={24} md={10}>
                  <Input
                    placeholder="Search by Permit No, Company or Holder Name..."
                    prefix={<SearchOutlined className="text-gray-400" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    allowClear
                    className="w-full h-10 rounded-lg"
                  />
                </Col>
                <Col xs={24} sm={12} md={7}>
                  <Select
                    className="w-full h-10"
                    placeholder="Filter by Status"
                    value={status}
                    onChange={setStatus}
                    options={filterOptions.statusOptions}
                  />
                </Col>
                <Col xs={24} sm={12} md={7}>
                  <Select
                    className="w-full h-10"
                    placeholder="Expiring In"
                    value={expiringInDays}
                    onChange={setExpiringInDays}
                    options={[
                      {
                        label: "Urgent",
                        options: [
                          { label: "7 Days", value: "7" },
                          { label: "14 Days", value: "14" },
                        ],
                      },
                      {
                        label: "Standard",
                        options: [
                          { label: "30 Days", value: "30" },
                          { label: "60 Days", value: "60" },
                          { label: "90 Days", value: "90" },
                        ],
                      },
                      {
                        label: "Long Term",
                        options: [
                          { label: "120 Days", value: "120" },
                          { label: "6 Months", value: "180" },
                          { label: "1 Year", value: "365" },
                        ],
                      },
                    ]}
                  />
                </Col>
              </Row>

              {/* Row 2: Date Filters */}
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={12} md={7}>
                  <Select
                    value={dateFilterType}
                    onChange={setDateFilterType}
                    className="w-full h-10"
                    options={[
                      { label: "Issue Date", value: "issueDate" },
                      { label: "Expiry Date", value: "expiryDate" },
                      { label: "Creation Date", value: "createdAt" },
                    ]}
                  />
                </Col>
                <Col xs={24} sm={12} md={10}>
                  <RangePicker
                    className="w-full h-10"
                    value={dateRange}
                    onChange={handleRangeChange}
                  />
                </Col>
                <Col xs={24} md={7}>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={clearAllFilters}
                    className="w-full h-10 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Reset Filters
                  </Button>
                </Col>
              </Row>

              {/* Row 3: Entity and Type */}
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={12}>
                  <Select
                    showSearch
                    className="w-full h-10"
                    placeholder="Assigning Entity"
                    value={assigningEntity}
                    onChange={setAssigningEntity}
                    options={filterOptions.entityOptions}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                </Col>
                <Col xs={24} sm={12} md={12}>
                  <Select
                    showSearch
                    className="w-full h-10"
                    placeholder="Permit Type"
                    value={permitType}
                    onChange={setPermitType}
                    options={filterOptions.permitTypeOptions}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                </Col>
              </Row>
            </div>
          </Card>

          {/* Permits Overview Section */}
          <div>
            <Title level={4} className="mb-4">
              Permits Overview
            </Title>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={12} md={8} lg={6}>
                <Card
                  className="shadow-sm hover:shadow-md transition-shadow duration-200"
                  bodyStyle={{ padding: "16px" }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Text
                        className="text-gray-600 block"
                        style={{ fontSize: "12px", marginBottom: "4px" }}
                      >
                        Total Permits
                      </Text>
                      <div
                        className="font-bold"
                        style={{ fontSize: "24px", color: "#1890ff" }}
                      >
                        {permitStatus?.data?.totalPermits ?? 0}
                      </div>
                    </div>
                    <FileTextOutlined
                      style={{
                        fontSize: "24px",
                        color: "#1890ff",
                        opacity: 0.2,
                      }}
                    />
                  </div>
                </Card>
              </Col>
              <Col xs={12} sm={12} md={8} lg={6}>
                <Card
                  className="shadow-sm hover:shadow-md transition-shadow duration-200"
                  bodyStyle={{ padding: "16px" }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Text
                        className="text-gray-600 block"
                        style={{ fontSize: "12px", marginBottom: "4px" }}
                      >
                        New Permits
                      </Text>
                      <div
                        className="font-bold"
                        style={{ fontSize: "24px", color: "#52c41a" }}
                      >
                        {permitStatus?.data?.totalNewPermits ?? 0}
                      </div>
                    </div>
                    <CheckCircleOutlined
                      style={{
                        fontSize: "24px",
                        color: "#52c41a",
                        opacity: 0.2,
                      }}
                    />
                  </div>
                </Card>
              </Col>
              <Col xs={12} sm={12} md={8} lg={6}>
                <Card
                  className="shadow-sm hover:shadow-md transition-shadow duration-200"
                  bodyStyle={{ padding: "16px" }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Text
                        className="text-gray-600 block"
                        style={{ fontSize: "12px", marginBottom: "4px" }}
                      >
                        Renewal Permits
                      </Text>
                      <div
                        className="font-bold"
                        style={{ fontSize: "24px", color: "#faad14" }}
                      >
                        {permitStatus?.data?.totalRenewalPermits ?? 0}
                      </div>
                    </div>
                    <ClockCircleOutlined
                      style={{
                        fontSize: "24px",
                        color: "#faad14",
                        opacity: 0.2,
                      }}
                    />
                  </div>
                </Card>
              </Col>
              <Col xs={12} sm={12} md={8} lg={6}>
                <Card
                  className="shadow-sm hover:shadow-md transition-shadow duration-200"
                  bodyStyle={{ padding: "16px" }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Text
                        className="text-gray-600 block"
                        style={{ fontSize: "12px", marginBottom: "4px" }}
                      >
                        Expiring Soon
                      </Text>
                      <div
                        className="font-bold"
                        style={{ fontSize: "24px", color: "#fa541c" }}
                      >
                        {permitStatus?.data?.permitsExpiringSoon ?? 0}
                      </div>
                    </div>
                    <AlertOutlined
                      style={{
                        fontSize: "24px",
                        color: "#fa541c",
                        opacity: 0.2,
                      }}
                    />
                  </div>
                </Card>
              </Col>
              <Col xs={12} sm={12} md={8} lg={6}>
                <Card
                  className="shadow-sm hover:shadow-md transition-shadow duration-200"
                  bodyStyle={{ padding: "16px" }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Text
                        className="text-gray-600 block"
                        style={{ fontSize: "12px", marginBottom: "4px" }}
                      >
                        Expired Permits
                      </Text>
                      <div
                        className="font-bold"
                        style={{ fontSize: "24px", color: "#ff4d4f" }}
                      >
                        {permitStatus?.data?.permitsExpired ?? 0}
                      </div>
                    </div>
                    <AlertOutlined
                      style={{
                        fontSize: "24px",
                        color: "#ff4d4f",
                        opacity: 0.2,
                      }}
                    />
                  </div>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Permits by Department */}
          {permitStatus?.data?.permitsByDepartment &&
            permitStatus.data.permitsByDepartment.length > 0 && (
              <div>
                <Card className="shadow-sm" bodyStyle={{ padding: "20px" }}>
                  <Title level={4} className="mb-4">
                    Permits by Department
                  </Title>
                  <Table
                    columns={[
                      {
                        title: "Department",
                        dataIndex: "departmentName",
                        key: "departmentName",
                        render: (text) => <Text>{text}</Text>,
                      },
                      {
                        title: "Count",
                        dataIndex: "count",
                        key: "count",
                        width: "20%",
                        render: (count) => (
                          <Text strong style={{ color: "#1890ff" }}>
                            {count}
                          </Text>
                        ),
                      },
                    ]}
                    dataSource={permitStatus.data.permitsByDepartment}
                    pagination={false}
                    size="middle"
                    locale={{ emptyText: <Empty description="No permits" /> }}
                  />
                </Card>
              </div>
            )}

          {/* Permits by Type */}
          {permitStatus?.data?.permitsByType &&
            Object.keys(permitStatus.data.permitsByType).length > 0 && (
              <div>
                <Card className="shadow-sm" bodyStyle={{ padding: "20px" }}>
                  <Title level={4} className="mb-4">
                    Permits by Type
                  </Title>
                  <Table
                    columns={[
                      {
                        title: "Permit Type",
                        dataIndex: "type",
                        key: "type",
                        render: (text) => (
                          <Text>{text.replace(/_/g, " ")}</Text>
                        ),
                      },
                      {
                        title: "Count",
                        dataIndex: "count",
                        key: "count",
                        width: "20%",
                        render: (count) => (
                          <Text strong style={{ color: "#52c41a" }}>
                            {count}
                          </Text>
                        ),
                      },
                    ]}
                    dataSource={Object.entries(
                      permitStatus.data.permitsByType
                    ).map(([type, count]) => ({
                      key: type,
                      type,
                      count,
                    }))}
                    pagination={false}
                    size="middle"
                    locale={{ emptyText: <Empty description="No permits" /> }}
                  />
                </Card>
              </div>
            )}

          {/* Status Breakdown */}
          {permitStatus?.data?.statusBreakdown &&
            Object.keys(permitStatus.data.statusBreakdown).length > 0 && (
              <div>
                <Card className="shadow-sm" bodyStyle={{ padding: "20px" }}>
                  <Title level={4} className="mb-4">
                    Permits by Status
                  </Title>
                  <Table
                    columns={[
                      {
                        title: "Status",
                        dataIndex: "status",
                        key: "status",
                        render: (text) => <Text>{text}</Text>,
                      },
                      {
                        title: "Count",
                        dataIndex: "count",
                        key: "count",
                        width: "20%",
                        render: (count) => (
                          <Text strong style={{ color: "#722ed1" }}>
                            {count}
                          </Text>
                        ),
                      },
                    ]}
                    dataSource={Object.entries(
                      permitStatus.data.statusBreakdown
                    ).map(([status, count]) => ({
                      key: status,
                      status,
                      count,
                    }))}
                    pagination={false}
                    size="middle"
                    locale={{ emptyText: <Empty description="No data" /> }}
                  />
                </Card>
              </div>
            )}
        </div>
      </Spin>

      <style>{`
        .permit-statistics-modal-wrap {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
          z-index: 1000 !important;
        }

        .permit-statistics-modal-wrap .ant-modal {
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          max-width: none !important;
          margin: 0 !important;
        }

        .permit-statistics-modal-wrap .ant-modal-content {
          height: 100vh !important;
          display: flex !important;
          flex-direction: column !important;
        }

        .permit-statistics-modal-wrap .ant-modal-header {
          flex-shrink: 0 !important;
        }

        .permit-statistics-modal-wrap .ant-modal-body {
          flex: 1 !important;
          overflow-y: auto !important;
          height: calc(100vh - 109px) !important;
        }

        .permit-statistics-modal-wrap .ant-modal-close {
          position: sticky !important;
          top: 0 !important;
        }
      `}</style>
    </Modal>
  );
};

export default PermitStatisticsModal;
