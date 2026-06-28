import { useState, useMemo, useCallback } from "react";
import {
  Pagination,
  Input,
  Select,
  Button,
  Breadcrumb,
  Tag,
  Badge,
  Tooltip,
  Spin,
  Empty,
  Space,
  Table,
  Row,
  Col,
  Descriptions,
  Drawer,
} from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { PageTitle } from "@/utils/PageTitle";
import { useDebounce } from "@/employee_portal_pages/lib/debounce";
import {
  formatDate2,
  formatDate4,
  normalizeText,
} from "@/utils/helperFunction";
import { useFetchRegisteredClientsQuery } from "@/redux/features/employee-portal-api/general";
import type { IEpaClient } from "@/employee_portal_pages/types/client";

const RegisteredClients = () => {
  PageTitle("Registered Clients | EPA Ghana");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<IEpaClient | null>(null);
  const [userType, setUserType] = useState("all");

  // Debounced search term for API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: clientsResponse,
    isLoading: isLoadingClients,
    isFetching: isFetchingClients,
    refetch,
  } = useFetchRegisteredClientsQuery(
    {
      page,
      limit,
      searchTerm: debouncedSearchTerm,
      sortField,
      sortOrder,
      startDate: "",
      endDate: "",
      status: userType === "all" ? "" : userType,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const clients = clientsResponse?.data || [];
  const paginationInfo = clientsResponse?.pagination;

  // Sorting handlers
  const handleSort = useCallback(
    (field) => {
      if (sortField === field) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortOrder("asc");
      }
      setPage(1);
    },
    [sortField, sortOrder]
  );

  // Filter handlers
  const handleFilterChange = useCallback((filterType, value) => {
    if (filterType === "search") {
      setSearchTerm(value);
      setPage(1);
    } else if (filterType === "userType") {
      setUserType(value);
      setPage(1);
    }
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setUserType("all");
    setPage(1);
  }, []);

  // Handle view details
  const handleViewDetails = useCallback((record: IEpaClient) => {
    setSelectedClient(record);
    setViewDrawerOpen(true);
  }, []);

  // Get client display name
  const getClientName = (client: IEpaClient): string => {
    if (client.userType === "organization") {
      return client.organizationName || "N/A";
    } else if (client.userType === "government") {
      return client.agencyName || "N/A";
    } else {
      return `${client.firstName} ${client.lastName}`.trim() || "N/A";
    }
  };

  // Sort indicator component
  const SortIndicator = ({ field }) => {
    if (sortField !== field) {
      return <SortAscendingOutlined className="text-gray-400 ml-1" />;
    }
    return sortOrder === "asc" ? (
      <SortAscendingOutlined className="text-blue-600 ml-1" />
    ) : (
      <SortDescendingOutlined className="text-blue-600 ml-1" />
    );
  };

  // Get user type color
  const getUserTypeColor = (userType: string) => {
    const colorMap = {
      individual: "blue",
      organization: "green",
      government: "orange",
      agent: "purple",
    };
    return colorMap[userType] || "default";
  };

  // Memoized table columns
  const tableColumns = useMemo(
    () => [
      {
        title: "#",
        key: "index",
        width: 50,
        fixed: "left",
        render: (_, __, index) => (
          <span className="text-gray-500 font-mono text-xs">
            {(page - 1) * limit + index + 1}
          </span>
        ),
      },
      {
        title: (
          <div
            className="flex items-center cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => handleSort("firstName")}
          >
            <span>Name</span>
            <SortIndicator field="firstName" />
          </div>
        ),
        dataIndex: "firstName",
        key: "name",
        width: 180,
        sorter: true,
        sortOrder: sortField === "firstName" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        render: (_, record: IEpaClient) => {
          const name = getClientName(record);
          return (
            <Tooltip title={name}>
              <span className="text-xs font-medium text-gray-800 truncate block">
                {name}
              </span>
            </Tooltip>
          );
        },
      },
      {
        title: "Client ID",
        dataIndex: "clientId",
        key: "clientId",
        width: 140,
        render: (clientId) => (
          <Tooltip title={clientId}>
            <span className="text-xs font-mono text-gray-600 truncate block">
              {clientId || "N/A"}
            </span>
          </Tooltip>
        ),
      },
      {
        title: (
          <div
            className="flex items-center cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => handleSort("userType")}
          >
            <span>Type</span>
            <SortIndicator field="userType" />
          </div>
        ),
        dataIndex: "userType",
        key: "userType",
        width: 120,
        sorter: true,
        sortOrder: sortField === "userType" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
        render: (userType) => (
          <Tag color={getUserTypeColor(userType)} className="text-xs">
            {normalizeText(userType)}
          </Tag>
        ),
      },
      {
        title: (
          <div className="flex items-center">
            <MailOutlined className="mr-1" />
            Email
          </div>
        ),
        dataIndex: "email",
        key: "email",
        width: 160,
        render: (email) => (
          <Tooltip title={email}>
            <span className="text-xs text-gray-600 truncate block">
              {email || "N/A"}
            </span>
          </Tooltip>
        ),
      },
      {
        title: (
          <div className="flex items-center">
            <PhoneOutlined className="mr-1" />
            Phone
          </div>
        ),
        dataIndex: "phone",
        key: "phone",
        width: 140,
        render: (phone) => (
          <span className="text-xs text-gray-600">{phone || "N/A"}</span>
        ),
      },
      {
        title: (
          <div className="flex items-center">
            <EnvironmentOutlined className="mr-1" />
            Location
          </div>
        ),
        key: "location",
        width: 150,
        render: (_, record: IEpaClient) => {
          const location =
            record.address?.city || record.address?.region || "N/A";
          return (
            <Tooltip title={location}>
              <span className="text-xs text-gray-600 truncate block">
                {location}
              </span>
            </Tooltip>
          );
        },
      },
      //   {
      //     title: "Contact Method",
      //     dataIndex: "preferredContactMethod",
      //     key: "preferredContactMethod",
      //     width: 130,
      //     render: (method) => (
      //       <Tag
      //         color={method === "email" ? "blue" : method === "sms" ? "green" : "default"}
      //         className="text-xs"
      //       >
      //         {method ? normalizeText(method) : "Not Set"}
      //       </Tag>
      //     ),
      //   },
      {
        title: "Actions",
        key: "actions",
        width: 80,
        align: "center",
        render: (_, record: IEpaClient) => (
          <Space size="small">
            <Tooltip title="View Details">
              <Button
                icon={<EyeOutlined />}
                size="small"
                type="default"
                onClick={() => handleViewDetails(record)}
                className="hover:bg-blue-50 hover:border-blue-300"
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [page, limit, sortField, sortOrder, handleSort, handleViewDetails]
  );

  // Memoized active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (userType !== "all") count++;
    return count;
  }, [searchTerm, userType]);

  return (
    <>
      {/* View Details Drawer */}
      <Drawer
        title="Client Details"
        onClose={() => setViewDrawerOpen(false)}
        open={viewDrawerOpen}
        width={500}
        bodyStyle={{ padding: "24px" }}
      >
        {selectedClient && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                Basic Information
              </h3>
              <Descriptions
                column={1}
                size="small"
                bordered
                items={[
                  {
                    label: "Client ID",
                    children: (
                      <span className="font-mono text-xs">
                        {selectedClient.clientId || "N/A"}
                      </span>
                    ),
                  },
                  {
                    label: "Client Type",
                    children: (
                      <Tag color={getUserTypeColor(selectedClient.userType)}>
                        {normalizeText(selectedClient.userType)}
                      </Tag>
                    ),
                  },
                  {
                    label:
                      selectedClient.userType === "organization"
                        ? "Organization Name"
                        : selectedClient.userType === "government"
                        ? "Agency Name"
                        : "Name",
                    children: <span>{getClientName(selectedClient)}</span>,
                  },
                ]}
              />
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                Contact Information
              </h3>
              <Descriptions
                column={1}
                size="small"
                bordered
                items={[
                  {
                    label: "Email",
                    children: (
                      <a href={`mailto:${selectedClient.email}`}>
                        {selectedClient.email || "N/A"}
                      </a>
                    ),
                  },
                  {
                    label: "Phone",
                    children: (
                      <a href={`tel:${selectedClient.phone}`}>
                        {selectedClient.phone || "N/A"}
                      </a>
                    ),
                  },
                  //   {
                  //     label: "Preferred Contact Method",
                  //     children: (
                  //       <Tag
                  //         color={
                  //           selectedClient.preferredContactMethod === "email"
                  //             ? "blue"
                  //             : "green"
                  //         }
                  //       >
                  //         {normalizeText(
                  //           selectedClient.preferredContactMethod || "Not Set"
                  //         )}
                  //       </Tag>
                  //     ),
                  //   },
                ]}
              />
            </div>

            {/* Address Information */}
            {selectedClient.address && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Address Information
                </h3>
                <Descriptions
                  column={1}
                  size="small"
                  bordered
                  items={[
                    {
                      label: "Region",
                      children:
                        normalizeText(selectedClient.address.region) || "N/A",
                    },
                    {
                      label: "District",
                      children:
                        normalizeText(selectedClient.address.district) || "N/A",
                    },
                    {
                      label: "City",
                      children: selectedClient.address.city || "N/A",
                    },
                    {
                      label: "Street Address",
                      children: selectedClient.address.address || "N/A",
                    },
                    {
                      label: "GPS Address",
                      children: selectedClient.address.gps || "N/A",
                    },
                  ]}
                />
              </div>
            )}

            {/* Individual/Agent Specific Information */}
            {(selectedClient.userType === "individual" ||
              selectedClient.userType === "agent") && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Personal Information
                </h3>
                <Descriptions
                  column={1}
                  size="small"
                  bordered
                  items={[
                    {
                      label: "Nationality",
                      children: selectedClient.nationality || "N/A",
                    },
                    {
                      label: "National ID Number",
                      children: selectedClient.nationalIdNumber || "N/A",
                    },
                    {
                      label: "TIN",
                      children: selectedClient.tin || "N/A",
                    },
                  ]}
                />
              </div>
            )}

            {/* Organization Specific Information */}
            {selectedClient.userType === "organization" && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Organization Information
                </h3>
                <Descriptions
                  column={1}
                  size="small"
                  bordered
                  items={[
                    {
                      label: "Registration Number",
                      children: selectedClient.registrationNumber || "N/A",
                    },
                    {
                      label: "Date of Incorporation",
                      children:
                        formatDate2(selectedClient.dateOfIncorporation) ||
                        "N/A",
                    },
                    {
                      label: "Company Type",
                      children: selectedClient.companyType || "N/A",
                    },
                    {
                      label: "Industry Sector",
                      children: selectedClient.industrySector || "N/A",
                    },
                    {
                      label: "Company TIN",
                      children: selectedClient.companyTIN || "N/A",
                    },
                  ]}
                />
              </div>
            )}

            {/* Government Specific Information */}
            {selectedClient.userType === "government" && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Government Agency Information
                </h3>
                <Descriptions
                  column={1}
                  size="small"
                  bordered
                  items={[
                    {
                      label: "Agency Acronym",
                      children: selectedClient.agencyAcronym || "N/A",
                    },
                    {
                      label: "Type of Institution",
                      children: selectedClient.institutionType || "N/A",
                    },
                    {
                      label: "Jurisdiction Level",
                      children: selectedClient.jurisdictionLevel || "N/A",
                    },
                    {
                      label: "Sector",
                      children: selectedClient.sector || "N/A",
                    },
                  ]}
                />
              </div>
            )}

            {/* Account Status & System Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                Account Status & System Information
              </h3>
              <Descriptions
                column={1}
                size="small"
                bordered
                items={[
                  {
                    label: "Is Verified",
                    children: (
                      <Badge
                        status={
                          selectedClient.isVerified ? "success" : "default"
                        }
                        text={
                          selectedClient.isVerified
                            ? "Verified"
                            : "Not Verified"
                        }
                      />
                    ),
                  },
                  {
                    label: "Is Active",
                    children: (
                      <Badge
                        status={selectedClient.isActive ? "success" : "error"}
                        text={selectedClient.isActive ? "Active" : "Inactive"}
                      />
                    ),
                  },
                  {
                    label: "Created At",
                    children:
                      formatDate4(selectedClient.createdAt.toString()) || "N/A",
                  },
                  {
                    label: "Updated At",
                    children:
                      formatDate4(selectedClient.updatedAt.toString()) || "N/A",
                  },
                ]}
              />
            </div>
          </div>
        )}
      </Drawer>

      <div className="clients-page-root flex flex-col">

        {/* ── BREADCRUMB ── */}
        <div className="px-4 pt-3 pb-1 border-b border-gray-100 bg-white">
          <Breadcrumb
            items={[
              { href: "#", title: <><HomeOutlined /><span>Home</span></> },
              { title: "Finance" },
              { title: <span className="text-green-700 font-medium">Registered Clients</span> },
            ]}
            className="text-xs"
          />
        </div>

        {/* ── PAGE HEADER ── */}
        <div className="px-4 py-2 bg-white border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-8 h-8 rounded-md bg-green-700 flex items-center justify-center">
              <TeamOutlined className="text-white text-sm" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-gray-800 leading-tight truncate">Registered Clients</h1>
              <p className="text-[11px] text-gray-500 leading-tight">View and manage all registered clients</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-md px-2.5 py-1">
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              <span className="text-[11px] font-semibold text-green-800">{paginationInfo?.total ?? 0}</span>
              <span className="text-[10px] text-green-700">Total</span>
            </div>
            <Tooltip title="Refresh">
              <Button size="small" icon={<ReloadOutlined />} onClick={refetch} loading={isFetchingClients} />
            </Tooltip>
          </div>
        </div>

        {/* ── FILTER TOOLBAR ── */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <Row gutter={[8, 8]} align="middle">
            <Col xs={24} sm={12} md={8} lg={6} xl={5}>
              <Input
                prefix={<SearchOutlined className="text-gray-400 text-xs" />}
                placeholder="Search by name, email, phone…"
                value={searchTerm}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                allowClear
                size="small"
                className="rounded"
              />
            </Col>
            <Col xs={12} sm={6} md={4} lg={3} xl={3}>
              <Select
                value={userType}
                onChange={(v) => handleFilterChange("userType", v)}
                className="w-full"
                size="small"
                placeholder="Client Type"
                options={[
                  { label: "All Types", value: "all" },
                  { label: "Individual", value: "individual" },
                  { label: "Organization", value: "organization" },
                  { label: "Government", value: "government" },
                  { label: "Agent", value: "agent" },
                ]}
              />
            </Col>
            {activeFiltersCount > 0 && (
              <Col flex="none">
                <Button size="small" type="link" onClick={clearAllFilters} className="text-red-500 hover:text-red-700 px-1 text-[11px]">
                  Clear filters
                </Button>
              </Col>
            )}
          </Row>
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {searchTerm && <Tag closable onClose={() => handleFilterChange("search", "")} color="blue" className="text-[10px] leading-tight m-0">Search: "{searchTerm}"</Tag>}
              {userType !== "all" && <Tag closable onClose={() => handleFilterChange("userType", "all")} color="green" className="text-[10px] leading-tight m-0">Type: {userType.charAt(0).toUpperCase() + userType.slice(1)}</Tag>}
            </div>
          )}
        </div>

        {/* ── TABLE ── */}
        <div className="flex-1 overflow-hidden px-4 pt-2 pb-0 bg-white">
          <Spin spinning={isLoadingClients || isFetchingClients}>
            <Table
              columns={tableColumns as any}
              dataSource={clients}
              rowKey="_id"
              pagination={false}
              size="small"
              scroll={{ x: 1200, y: "calc(100vh - 260px)" }}
              className="clients-table"
              rowClassName={(_, index) =>
                `transition-colors duration-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/60"}`
              }
              onChange={(_, __, sorter: any) => {
                if (sorter?.field) {
                  setSortField(sorter.field);
                  setSortOrder(sorter.order === "ascend" ? "asc" : sorter.order === "descend" ? "desc" : "asc");
                  setPage(1);
                }
              }}
              locale={{
                emptyText: (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                    <div className="py-4">
                      <p className="text-gray-500 text-sm">{searchTerm ? "No clients match your search." : "No clients found."}</p>
                      {activeFiltersCount > 0 && <Button type="link" size="small" onClick={clearAllFilters}>Clear filters</Button>}
                    </div>
                  } />
                ),
              }}
            />
          </Spin>
        </div>

        {/* ── FOOTER / PAGINATION ── */}
        <div className="px-4 py-2 border-t border-gray-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-[11px] text-gray-500">
            {paginationInfo && paginationInfo.total > 0
              ? `Showing ${Math.min((page - 1) * limit + 1, paginationInfo.total)}–${Math.min(page * limit, paginationInfo.total)} of ${paginationInfo.total} clients`
              : "No clients"}
          </span>
          {paginationInfo && paginationInfo.total > 0 && (
            <Pagination
              current={page}
              pageSize={limit}
              total={paginationInfo.total}
              onChange={(p, l) => { setPage(p); if (l) setLimit(l); }}
              showSizeChanger
              showQuickJumper
              size="small"
              className="clients-pagination"
            />
          )}
        </div>
      </div>
      <style>{`
        .clients-page-root { min-height: calc(100vh - 48px); display: flex; flex-direction: column; }
        .clients-table .ant-table-thead > tr > th { background: #f1f5f9; font-weight: 600; font-size: 11px; color: #374151; border-bottom: 2px solid #e2e8f0; white-space: nowrap; }
        .clients-table .ant-table-tbody > tr > td { border-bottom: 1px solid #f1f5f9; font-size: 11px; }
        .clients-table .ant-table-tbody > tr:hover > td { background-color: #f0fdf4 !important; }
        .clients-table .ant-table-body { overflow-y: auto !important; }
        .clients-table .ant-table-cell-fix-right { background: #fff; }
        .clients-table tr.bg-gray-50\/60 .ant-table-cell-fix-right { background: #f9fafb; }
        .clients-table .ant-table-thead .ant-table-cell-fix-right { background: #f1f5f9 !important; }
        .clients-pagination .ant-pagination-item-active { border-color: #15803d; background-color: #15803d; }
        .clients-pagination .ant-pagination-item-active a { color: #fff; }
        .clients-pagination .ant-pagination-item-active:hover { border-color: #166534; background-color: #166534; }
      `}</style>
    </>
  );
};

export default RegisteredClients;
