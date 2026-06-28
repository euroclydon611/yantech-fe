import { useState, useEffect } from "react";
import { PageTitle } from "../../utils/PageTitle";
import {
  useYelClientListMutation,
  useYelClientCreateMutation,
  useYelClientUpdateMutation,
  useYelClientDeleteMutation,
} from "../../redux/features/yel/yelApi";
import { Table, Input, Button, Modal, Form, Select, Pagination, Tag, Drawer, Descriptions } from "antd";
import { LiaPlusSquareSolid } from "react-icons/lia";
import { FaEdit, FaEye } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { AiOutlineSearch } from "react-icons/ai";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const { Option } = Select;

const YELClients = () => {
  PageTitle("Clients | YANTEC ERP");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [viewTarget, setViewTarget] = useState<any>(null);
  const [form] = Form.useForm();

  const [fetchList, { data, isLoading }] = useYelClientListMutation();
  const [createClient, { isLoading: creating }] = useYelClientCreateMutation();
  const [updateClient, { isLoading: updating }] = useYelClientUpdateMutation();
  const [deleteClient] = useYelClientDeleteMutation();

  const load = () => fetchList({ page, limit, searchQuery });

  useEffect(() => { load(); }, [page, searchQuery]);

  const openCreate = () => { setEditTarget(null); form.resetFields(); setModalOpen(true); };
  const openEdit = (record: any) => { setEditTarget(record); form.setFieldsValue(record); setModalOpen(true); };

  const handleSubmit = async (values: any) => {
    try {
      if (editTarget) {
        await updateClient({ id: editTarget._id, body: values }).unwrap();
        toast.success("Client updated");
      } else {
        await createClient(values).unwrap();
        toast.success("Client created");
      }
      setModalOpen(false);
      load();
    } catch (err: any) {
      toast.error(err?.data?.error || err?.data?.message || "Error occurred");
    }
  };

  const handleDelete = async (record: any) => {
    const res = await Swal.fire({
      title: "Delete Client",
      text: `Delete "${record.name}"? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b6a66",
      confirmButtonText: "Delete",
    });
    if (!res.isConfirmed) return;
    try {
      await deleteClient(record._id).unwrap();
      toast.success("Client deleted");
      load();
    } catch (err: any) {
      toast.error(err?.data?.error || "Delete failed");
    }
  };

  const columns = [
    { title: "#", render: (_: any, __: any, i: number) => (page - 1) * limit + i + 1, width: 50 },
    { title: "Company Name", dataIndex: "name", key: "name", render: (v: string) => <span className="font-semibold">{v}</span> },
    { title: "Contact Person", dataIndex: "contactPerson", key: "contactPerson" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "City", dataIndex: "city", key: "city" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (v: string) => (
        <Tag color={v === "active" ? "green" : "default"}>{v?.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <button onClick={() => setViewTarget(record)} className="text-green-500 hover:text-green-700">
            <FaEye size={14} />
          </button>
          <button onClick={() => openEdit(record)} className="text-blue-500 hover:text-blue-700">
            <FaEdit size={14} />
          </button>
          <button onClick={() => handleDelete(record)} className="text-red-500 hover:text-red-700">
            <AiFillDelete size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold" style={{ color: "#0A1628" }}>Clients</h1>
          <p className="text-xs text-gray-400">Manage YANTEC Engineering clients</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-xs font-bold uppercase tracking-wider"
          style={{ background: "linear-gradient(135deg, #0A1628, #1A3A6B)" }}
        >
          <LiaPlusSquareSolid size={16} /> Add Client
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1 max-w-xs">
            <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search clients…"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#F5A623]"
            />
          </div>
        </div>

        <Table
          dataSource={data?.data ?? []}
          columns={columns}
          rowKey="_id"
          loading={isLoading}
          pagination={false}
          size="small"
          className="text-xs"
        />
        <div className="flex justify-end mt-3">
          <Pagination
            current={page}
            pageSize={limit}
            total={data?.totalCount ?? 0}
            onChange={setPage}
            size="small"
            showTotal={(t) => `${t} clients`}
          />
        </div>
      </div>

      <Drawer
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
        title={<span className="font-bold text-sm">Client Details</span>}
        width={480}
        destroyOnClose
      >
        {viewTarget && (
          <Descriptions column={1} size="small" bordered labelStyle={{ fontWeight: 600, color: "#6b7280", width: 140 }}>
            <Descriptions.Item label="Company Name">{viewTarget.name || "—"}</Descriptions.Item>
            <Descriptions.Item label="Contact Person">{viewTarget.contactPerson || "—"}</Descriptions.Item>
            <Descriptions.Item label="Email">{viewTarget.email || "—"}</Descriptions.Item>
            <Descriptions.Item label="Phone">{viewTarget.phone || "—"}</Descriptions.Item>
            <Descriptions.Item label="City">{viewTarget.city || "—"}</Descriptions.Item>
            <Descriptions.Item label="TIN">{viewTarget.tin || "—"}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={viewTarget.status === "active" ? "green" : "default"}>
                {viewTarget.status?.toUpperCase() || "—"}
              </Tag>
            </Descriptions.Item>
            {viewTarget.address && (
              <Descriptions.Item label="Address">{viewTarget.address}</Descriptions.Item>
            )}
            {viewTarget.notes && (
              <Descriptions.Item label="Notes">{viewTarget.notes}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Drawer>

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        title={<span className="font-bold text-sm">{editTarget ? "Edit Client" : "New Client"}</span>}
        footer={null}
        width={560}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-2">
          <div className="grid grid-cols-2 gap-x-3">
            <Form.Item label="Company Name" name="name" rules={[{ required: true }]}>
              <Input placeholder="ACME Ltd" />
            </Form.Item>
            <Form.Item label="Contact Person" name="contactPerson" rules={[{ required: true }]}>
              <Input placeholder="John Doe" />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input type="email" placeholder="info@company.com" />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
              <Input placeholder="0244000000" />
            </Form.Item>
            <Form.Item label="City" name="city">
              <Input placeholder="Takoradi" />
            </Form.Item>
            <Form.Item label="TIN" name="tin">
              <Input placeholder="C0012345678" />
            </Form.Item>
            <Form.Item label="Status" name="status" initialValue="active" className="col-span-2">
              <Select>
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Address" name="address" className="col-span-2">
              <Input.TextArea rows={2} placeholder="P.O. Box …" />
            </Form.Item>
            <Form.Item label="Notes" name="notes" className="col-span-2">
              <Input.TextArea rows={2} />
            </Form.Item>
          </div>
          <div className="flex justify-end gap-2 mt-1">
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={creating || updating}
              style={{ background: "#0A1628" }}
            >
              {editTarget ? "Save Changes" : "Create Client"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default YELClients;
