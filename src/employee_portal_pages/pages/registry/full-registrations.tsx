import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Pagination,
  Select,
  Input,
  Button,
  Tag,
  Tooltip,
  Spin,
  Empty,
  Table,
  Row,
  Col,
  Modal,
  Upload,
  Form,
  DatePicker,
  message,
  Breadcrumb,
  Space,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  CalendarOutlined,
  FolderOpenOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  FilterOutlined,
  InboxOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { PageTitle } from "@/utils/PageTitle";
import { formatDate2 } from "@/utils/helperFunction";
import {
  useFetchRegisteredProductsQuery,
  useImportRegisteredProductsFileMutation,
  useCreateRegisteredProductMutation,
  useUpdateRegisteredProductMutation,
  useDeleteRegisteredProductMutation,
} from "@/redux/features/employee-portal-api/authoirzations/fre-pa";
import Swal from "sweetalert2";
import { useDebounce } from "@/employee_portal_pages/lib/debounce";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

const registrationTypeOptions = [
  { label: "All Types", value: "" },
  { label: "FRE", value: "FRE" },
  { label: "PA", value: "PA" },
  { label: "PCL", value: "PCL" },
];

const statusOptions = [
  { label: "All", value: "" },
  { label: "Active", value: "active" },
  { label: "Expired", value: "expired" },
];

const registrationTypeColors: Record<string, string> = {
  FRE: "green",
  PA: "blue",
  PCL: "orange",
};

const EMPTY_FORM = {
  productName: "",
  fullRegistrationNumber: "",
  registrationType: "FRE",
  issuanceDate: null as any,
  expiryDate: null as any,
  concentrationOfActiveIngredient: "",
  hazardClass: "",
  uses: "",
  localDistributor: "",
  company: "",
};

const FullRegistrations = () => {
  PageTitle("Registered Products | IPMS EPA Ghana");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("productName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [status, setStatus] = useState("");
  const [registrationType, setRegistrationType] = useState("");
  const [hazardClass, setHazardClass] = useState("");
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  const [form] = Form.useForm();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const debouncedHazardClass = useDebounce(hazardClass, 500);

  const {
    data: productsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useFetchRegisteredProductsQuery(
    {
      page,
      limit,
      searchTerm: debouncedSearchTerm,
      sortField,
      sortOrder,
      status,
      registrationType,
      hazardClass: debouncedHazardClass,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [importFile, { data: importData, isSuccess: importSuccess, isLoading: isImporting, error: importError }] =
    useImportRegisteredProductsFileMutation();
  const [createProduct, { isLoading: isCreating }] = useCreateRegisteredProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateRegisteredProductMutation();
  const [deleteProduct] = useDeleteRegisteredProductMutation();

  const products = productsResponse?.data || [];
  const paginationInfo = productsResponse?.pagination;

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

  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setStatus("");
    setRegistrationType("");
    setHazardClass("");
    setSortField("productName");
    setSortOrder("asc");
    setPage(1);
  }, []);

  const openCreateModal = () => {
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue(EMPTY_FORM);
    setFormModalVisible(true);
  };

  const openEditModal = (record: any) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      issuanceDate: record.issuanceDate ? dayjs(record.issuanceDate) : null,
      expiryDate: record.expiryDate ? dayjs(record.expiryDate) : null,
    });
    setFormModalVisible(true);
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        issuanceDate: values.issuanceDate ? values.issuanceDate.format("YYYY-MM-DD") : null,
        expiryDate: values.expiryDate ? values.expiryDate.format("YYYY-MM-DD") : null,
      };

      if (editingRecord) {
        await updateProduct({ id: editingRecord._id, ...payload }).unwrap();
        message.success("Product updated successfully.");
      } else {
        await createProduct(payload).unwrap();
        message.success("Product created successfully.");
      }

      setFormModalVisible(false);
      setEditingRecord(null);
      form.resetFields();
      refetch();
    } catch (err: any) {
      const msg = err?.data?.error || err?.data?.message || "Operation failed.";
      Swal.fire({ title: "Error", text: msg, icon: "error", confirmButtonColor: "#727cf5" });
    }
  };

  const handleDelete = (record: any) => {
    Swal.fire({
      title: "Delete Product?",
      html: `This will permanently delete <strong>${record.productName}</strong> (${record.fullRegistrationNumber}).`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6c757d",
    }).then(async ({ isConfirmed }) => {
      if (!isConfirmed) return;
      try {
        await deleteProduct(record._id).unwrap();
        message.success("Product deleted.");
        refetch();
      } catch (err: any) {
        Swal.fire({
          title: "Delete Failed",
          text: err?.data?.error || "Could not delete product.",
          icon: "error",
          confirmButtonColor: "#727cf5",
        });
      }
    });
  };

  const SortIndicator = ({ field }) => {
    if (sortField !== field) return <SortAscendingOutlined className="text-gray-400 ml-1" />;
    return sortOrder === "asc" ? (
      <SortAscendingOutlined className="text-blue-600 ml-1" />
    ) : (
      <SortDescendingOutlined className="text-blue-600 ml-1" />
    );
  };

  const tableColumns = useMemo(
    () => [
      {
        title: "#",
        key: "index",
        width: 40,
        fixed: "left",
        render: (_, __, index) => (
          <span className="text-gray-500 font-mono text-[10px]">
            {(page - 1) * limit + index + 1}
          </span>
        ),
      },
      {
        title: (
          <div className="flex items-center cursor-pointer hover:text-blue-600 transition-colors text-xs" onClick={() => handleSort("productName")}>
            <span>Trade Name</span>
            <SortIndicator field="productName" />
          </div>
        ),
        dataIndex: "productName",
        key: "productName",
        width: 130,
        fixed: "left",
        render: (val) => <span className="font-mono text-[10px] font-semibold">{val || "N/A"}</span>,
      },
      {
        title: (
          <div className="flex items-center cursor-pointer hover:text-blue-600 transition-colors text-xs" onClick={() => handleSort("fullRegistrationNumber")}>
            <span>Reg. No.</span>
            <SortIndicator field="fullRegistrationNumber" />
          </div>
        ),
        dataIndex: "fullRegistrationNumber",
        key: "fullRegistrationNumber",
        width: 120,
        render: (val) => <span className="font-mono text-[10px] font-medium text-blue-600">{val || "N/A"}</span>,
      },
      {
        title: "Type",
        dataIndex: "registrationType",
        key: "registrationType",
        width: 60,
        render: (val) => (
          <Tag color={registrationTypeColors[val] || "default"} className="text-[10px] font-mono">
            {val || "FRE"}
          </Tag>
        ),
      },
      {
        title: (
          <div className="flex items-center cursor-pointer hover:text-blue-600 transition-colors text-xs" onClick={() => handleSort("issuanceDate")}>
            <span>Date of Issue</span>
            <SortIndicator field="issuanceDate" />
          </div>
        ),
        dataIndex: "issuanceDate",
        key: "issuanceDate",
        width: 100,
        render: (val) => (
          <div className="flex items-center space-x-1">
            <CalendarOutlined className="text-gray-400 text-xs" />
            <span className="text-[10px] text-gray-600 font-mono">{formatDate2(val)}</span>
          </div>
        ),
      },
      {
        title: (
          <div className="flex items-center cursor-pointer hover:text-blue-600 transition-colors text-xs" onClick={() => handleSort("expiryDate")}>
            <span>Date of Expiry</span>
            <SortIndicator field="expiryDate" />
          </div>
        ),
        dataIndex: "expiryDate",
        key: "expiryDate",
        width: 100,
        render: (val) => {
          const isExpired = val && new Date(val) < new Date();
          return (
            <div className="flex items-center space-x-1">
              <CalendarOutlined className={`text-xs ${isExpired ? "text-red-400" : "text-gray-400"}`} />
              <span className={`text-[10px] font-mono ${isExpired ? "text-red-500 font-semibold" : "text-gray-600"}`}>
                {formatDate2(val)}
              </span>
            </div>
          );
        },
      },
      {
        title: "Concentration of Active Ingredient",
        dataIndex: "concentrationOfActiveIngredient",
        key: "concentrationOfActiveIngredient",
        width: 200,
        render: (val) => <span className="text-[10px] text-gray-700">{val || "—"}</span>,
      },
      {
        title: (
          <div className="flex items-center cursor-pointer hover:text-blue-600 transition-colors text-xs" onClick={() => handleSort("hazardClass")}>
            <span>Hazard Class</span>
            <SortIndicator field="hazardClass" />
          </div>
        ),
        dataIndex: "hazardClass",
        key: "hazardClass",
        width: 90,
        render: (val) => val ? <Tag className="text-[10px] font-mono">{val}</Tag> : <span className="text-gray-400 text-[10px]">—</span>,
      },
      {
        title: "Uses",
        dataIndex: "uses",
        key: "uses",
        width: 220,
        render: (val) => (
          <Tooltip title={val}>
            <span className="text-[10px] text-gray-700 line-clamp-2">{val || "—"}</span>
          </Tooltip>
        ),
      },
      {
        title: (
          <div className="flex items-center cursor-pointer hover:text-blue-600 transition-colors text-xs" onClick={() => handleSort("localDistributor")}>
            <span>Local Distributor</span>
            <SortIndicator field="localDistributor" />
          </div>
        ),
        dataIndex: "localDistributor",
        key: "localDistributor",
        width: 160,
        render: (val) => <span className="text-[10px] text-gray-700">{val || "—"}</span>,
      },
      {
        title: "Actions",
        key: "actions",
        width: 90,
        fixed: "right",
        render: (_, record) => (
          <Space size={4}>
            <Tooltip title="Edit">
              <Button
                icon={<EditOutlined />}
                size="small"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                onClick={() => openEditModal(record)}
              />
            </Tooltip>
            {/* <Tooltip title="Delete">
              <Button
                icon={<DeleteOutlined />}
                size="small"
                danger
                onClick={() => handleDelete(record)}
              />
            </Tooltip> */}
          </Space>
        ),
      },
    ],
    [page, limit, sortField, sortOrder, handleSort]
  );

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (status) count++;
    if (registrationType) count++;
    if (hazardClass) count++;
    return count;
  }, [searchTerm, status, registrationType, hazardClass]);

  useEffect(() => {
    if (importSuccess) {
      const msg = importData?.message || "Import Completed";
      const { totalRecords, insertedRecords, updatedRecords, failedRecords, invalidLines = [] } = importData || {};
      const failedMessage = invalidLines
        .map(
          (item: any) =>
            `<strong>Line ${item.line}</strong>: ${item.reason}<br/><strong>Missing:</strong> ${item.missingFields?.join(", ") || "N/A"}`
        )
        .join("<br><hr>");

      Swal.fire({
        title: msg,
        icon: "success",
        html: `
          <strong>Total:</strong> ${totalRecords}<br><br>
          <strong>Inserted:</strong> ${insertedRecords}<br>
          <strong>Updated:</strong> ${updatedRecords || 0}<br>
          <strong>Failed:</strong> ${failedRecords}<br><br>
          ${failedMessage || ""}
        `,
        confirmButtonColor: "#2E7D32",
      }).then(() => {
        refetch();
        setUploadModalVisible(false);
      });
    }

    if (importError) {
      const err = importError as any;
      Swal.fire({
        title: "Import Failed",
        text: err?.data?.error || err?.data?.message || "Something went wrong!",
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
    }
  }, [importSuccess, importError]);

  return (
    <>
      <div className="reg-products-page-root flex flex-col">

        {/* ── BREADCRUMB ── */}
        <div className="px-4 pt-3 pb-1 border-b border-gray-100 bg-white">
          <Breadcrumb
            items={[
              { href: "#", title: <><HomeOutlined /><span>Home</span></> },
              { title: "Product Registration" },
              { title: <span className="text-green-700 font-medium">Registered Products</span> },
            ]}
            className="text-xs"
          />
        </div>

        {/* ── PAGE HEADER ── */}
        <div className="px-4 py-2 bg-white border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-8 h-8 rounded-md bg-green-700 flex items-center justify-center">
              <MedicineBoxOutlined className="text-white text-sm" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-gray-800 leading-tight truncate">Registered Products</h1>
              <p className="text-[11px] text-gray-500 leading-tight">
                Legacy registered products (FRE, PA, PCL) issued outside the system
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-md px-2.5 py-1">
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              <span className="text-[11px] font-semibold text-green-800">{paginationInfo?.total ?? 0}</span>
              <span className="text-[10px] text-green-700">Total</span>
            </div>
            <Button size="small" onClick={() => setUploadModalVisible(true)} disabled={isImporting}
              className="border-green-600 text-green-700 hover:!bg-green-50 text-[11px]">
              Import
            </Button>
            <Button type="primary" size="small" icon={<PlusOutlined />} onClick={openCreateModal}
              className="bg-green-600 hover:!bg-green-700 border-green-600 text-[11px]">
              Add Product
            </Button>
            <Tooltip title="Refresh">
              <Button size="small" icon={<ReloadOutlined />} onClick={refetch} loading={isFetching} />
            </Tooltip>
          </div>
        </div>

        {/* ── FILTER TOOLBAR ── */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <Row gutter={[8, 8]} align="middle">
            <Col xs={24} sm={12} md={7} lg={6} xl={5}>
              <Input prefix={<SearchOutlined className="text-gray-400 text-xs" />} placeholder="Search name, reg. no., distributor…"
                value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} allowClear size="small" />
            </Col>
            <Col xs={12} sm={6} md={3} lg={3} xl={3}>
              <Select value={registrationType} onChange={(v) => { setRegistrationType(v); setPage(1); }}
                className="w-full" size="small" placeholder="Type" options={registrationTypeOptions} />
            </Col>
            <Col xs={12} sm={6} md={3} lg={3} xl={2}>
              <Select value={status} onChange={(v) => { setStatus(v); setPage(1); }}
                className="w-full" size="small" placeholder="Status" options={statusOptions} />
            </Col>
            <Col xs={12} sm={6} md={4} lg={3} xl={3}>
              <Input placeholder="Hazard class…" value={hazardClass} size="small"
                onChange={(e) => { setHazardClass(e.target.value); setPage(1); }} allowClear />
            </Col>
            {activeFiltersCount > 0 && (
              <Col flex="none">
                <Button size="small" type="link" onClick={clearAllFilters} className="text-red-500 hover:text-red-700 px-1 text-[11px]">Clear filters</Button>
              </Col>
            )}
          </Row>
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {searchTerm && <Tag closable onClose={() => setSearchTerm("")} color="blue" className="text-[10px] leading-tight m-0">Search: "{searchTerm}"</Tag>}
              {registrationType && <Tag closable onClose={() => setRegistrationType("")} color="green" className="text-[10px] leading-tight m-0">Type: {registrationType}</Tag>}
              {status && <Tag closable onClose={() => setStatus("")} color="orange" className="text-[10px] leading-tight m-0">Status: {status}</Tag>}
              {hazardClass && <Tag closable onClose={() => setHazardClass("")} color="red" className="text-[10px] leading-tight m-0">Hazard: {hazardClass}</Tag>}
            </div>
          )}
        </div>

        {/* ── TABLE ── */}
        <div className="flex-1 overflow-hidden px-4 pt-2 pb-0 bg-white">
          <Spin spinning={isLoading || isFetching}>
            <Table
              columns={tableColumns as any}
              dataSource={products}
              rowKey="_id"
              pagination={false}
              size="small"
              scroll={{ x: 1400, y: "calc(100vh - 260px)" }}
              className="reg-products-table"
              rowClassName={(_, index) => `transition-colors duration-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/60"}`}
              onChange={(_, __, sorter: any) => {
                if (sorter?.field) { setSortField(sorter.field); setSortOrder(sorter.order === "ascend" ? "asc" : "desc"); setPage(1); }
              }}
              locale={{
                emptyText: (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                    <div className="py-4">
                      <p className="text-gray-500 text-sm">{activeFiltersCount > 0 ? "No products match the current filters." : "No registered products found."}</p>
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
              ? `Showing ${Math.min((page - 1) * limit + 1, paginationInfo.total)}–${Math.min(page * limit, paginationInfo.total)} of ${paginationInfo.total} products`
              : "No products"}
          </span>
          {paginationInfo && paginationInfo.total > 0 && (
            <Pagination current={page} pageSize={limit} total={paginationInfo.total}
              onChange={(p, l) => { setPage(p); if (l) setLimit(l); }}
              showSizeChanger showQuickJumper size="small" className="reg-products-pagination" />
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        title={editingRecord ? `Edit — ${editingRecord.productName}` : "Add Registered Product"}
        open={formModalVisible}
        onCancel={() => { setFormModalVisible(false); setEditingRecord(null); form.resetFields(); }}
        width={720}
        footer={[
          <Button key="cancel" onClick={() => { setFormModalVisible(false); setEditingRecord(null); form.resetFields(); }}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isCreating || isUpdating}
            onClick={handleFormSubmit}
            className="bg-green-600 hover:!bg-green-700 !border-green-600"
          >
            {editingRecord ? "Save Changes" : "Create Product"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" size="small" className="mt-4">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Trade Name" name="productName" rules={[{ required: true, message: "Trade name is required" }]}>
                <Input placeholder="e.g. Abamet" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Registration No." name="fullRegistrationNumber" rules={[{ required: true, message: "Registration number is required" }]}>
                <Input placeholder="e.g. FRE/2699/2597G" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Registration Type" name="registrationType" rules={[{ required: true }]}>
                <Select>
                  <Option value="FRE">FRE</Option>
                  <Option value="PA">PA</Option>
                  <Option value="PCL">PCL</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Date of Issue" name="issuanceDate">
                <DatePicker className="w-full" format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Date of Expiry" name="expiryDate">
                <DatePicker className="w-full" format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item label="Concentration of Active Ingredient" name="concentrationOfActiveIngredient">
                <Input placeholder="e.g. Abamectin (18g/l)" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Hazard Class" name="hazardClass">
                <Input placeholder="e.g. II" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Uses" name="uses">
            <TextArea rows={3} placeholder="Describe uses of the product..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Local Distributor" name="localDistributor">
                <Input placeholder="e.g. Rainbow AgroSciences, Tema" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Company" name="company">
                <Input placeholder="e.g. Adama West Africa Limited" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Import Modal */}
      <Modal
        title="Import Registered Products"
        open={uploadModalVisible}
        onCancel={() => { setUploadModalVisible(false); setExcelFile(null); }}
        footer={[
          <Button key="cancel" onClick={() => { setUploadModalVisible(false); setExcelFile(null); }}>
            Cancel
          </Button>,
          <Button
            key="import"
            type="primary"
            disabled={!excelFile || isImporting}
            loading={isImporting}
            onClick={() => {
              if (excelFile) {
                importFile({ file: excelFile });
                setExcelFile(null);
              }
            }}
            className="bg-green-600 hover:!bg-green-700 !border-green-600"
          >
            Import Data
          </Button>,
        ]}
        width={600}
      >
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <InboxOutlined className="text-blue-600" />
            Upload Excel / CSV File
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            Expected columns: <strong>Trade Name</strong>, <strong>Registration No</strong>, Registration Type, Date of Issue, Date of Expiry, Concentration of Active Ingredient, Hazard Class, Uses, Local Distributor.
          </p>
        </div>

        <Upload.Dragger
          name="file"
          multiple={false}
          accept=".xlsx,.xls,.csv"
          beforeUpload={(file) => {
            const isExcel =
              file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
              file.type === "application/vnd.ms-excel" ||
              file.name.endsWith(".csv");
            if (!isExcel) {
              message.error("Only Excel or CSV files are accepted.");
              return Upload.LIST_IGNORE;
            }
            setExcelFile(file as any);
            return false;
          }}
          onRemove={() => setExcelFile(null)}
          fileList={excelFile ? [excelFile as any] : []}
        >
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Single file upload (.xlsx, .xls, .csv)</p>
        </Upload.Dragger>
      </Modal>

      <style>{`
        .reg-products-page-root { min-height: calc(100vh - 48px); display: flex; flex-direction: column; }
        .reg-products-table .ant-table-thead > tr > th { background: #f1f5f9; font-weight: 600; font-size: 11px; color: #374151; border-bottom: 2px solid #e2e8f0; white-space: nowrap; }
        .reg-products-table .ant-table-tbody > tr > td { border-bottom: 1px solid #f1f5f9; font-size: 11px; }
        .reg-products-table .ant-table-tbody > tr:hover > td { background-color: #f0fdf4 !important; }
        .reg-products-table .ant-table-body { overflow-y: auto !important; }
        .reg-products-table .ant-table-cell-fix-right { background: #fff; }
        .reg-products-table tr.bg-gray-50\/60 .ant-table-cell-fix-right { background: #f9fafb; }
        .reg-products-table .ant-table-thead .ant-table-cell-fix-right { background: #f1f5f9 !important; }
        .reg-products-pagination .ant-pagination-item-active { border-color: #15803d; background-color: #15803d; }
        .reg-products-pagination .ant-pagination-item-active a { color: #fff; }
        .reg-products-pagination .ant-pagination-item-active:hover { border-color: #166534; background-color: #166534; }
      `}</style>
    </>
  );
};

export default FullRegistrations;
