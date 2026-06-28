import { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Spin,
  Empty,
  Tag,
  Tooltip,
  Popconfirm,
  Avatar,
  Drawer,
  Badge,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserSwitchOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  CrownOutlined,
  ReloadOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Breadcrumb } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  useGetSubDivisionsQuery,
  useCreateSubDivisionMutation,
  useUpdateSubDivisionMutation,
  useChangeSubDivisionHeadMutation,
  useAddSubDivisionMembersMutation,
  useRemoveSubDivisionMemberMutation,
  useDeleteSubDivisionMutation,
} from "@/redux/features/employee-portal-api/subdivisionApi";
import { useEntitySubordinateStaffsQuery } from "@/redux/features/employee-portal-api/entityApi";
import Swal from "sweetalert2";

const { Option } = Select;

function initials(emp: any) {
  return `${emp?.firstname?.[0] || ""}${emp?.lastname?.[0] || ""}`.toUpperCase();
}

function fullName(emp: any) {
  if (!emp) return "—";
  return `${emp.firstname} ${emp.lastname}`;
}

export default function SubDivisionsPage() {
  const { employee } = useSelector((state: RootState) => state.employee_auth);

  const { data: divisionsData, isLoading, refetch } = useGetSubDivisionsQuery();
  const { data: staffData } = useEntitySubordinateStaffsQuery({
    page: 1,
    limit: 200,
    searchTerm: "",
    entity_id: employee?.entity_id || employee?.entity?._id,
  });

  const [createDivision, { isLoading: creating }] = useCreateSubDivisionMutation();
  const [updateDivision, { isLoading: updating }] = useUpdateSubDivisionMutation();
  const [changeHead, { isLoading: changingHead }] = useChangeSubDivisionHeadMutation();
  const [addMembers, { isLoading: addingMembers }] = useAddSubDivisionMembersMutation();
  const [removeMember] = useRemoveSubDivisionMemberMutation();
  const [deleteDivision] = useDeleteSubDivisionMutation();

  const divisions: any[] = divisionsData?.data || [];
  const allStaff: any[] = staffData?.data || staffData?.employees || [];

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [detailTarget, setDetailTarget] = useState<any>(null);
  const [changeHeadTarget, setChangeHeadTarget] = useState<any>(null);
  const [addMembersTarget, setAddMembersTarget] = useState<any>(null);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [headForm] = Form.useForm();
  const [membersForm] = Form.useForm();

  const handleCreate = async (values: any) => {
    try {
      const res = await createDivision({
        name: values.name,
        description: values.description,
        headId: values.headId,
        memberIds: values.memberIds || [],
      }).unwrap();
      if (res.success) {
        Swal.fire({ icon: "success", title: "Sub-division created", timer: 1800, showConfirmButton: false });
        setCreateOpen(false);
        createForm.resetFields();
        refetch();
      }
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Error", text: err?.data?.error || "Failed to create sub-division." });
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      await updateDivision({ id: editTarget._id, name: values.name, description: values.description }).unwrap();
      Swal.fire({ icon: "success", title: "Updated", timer: 1500, showConfirmButton: false });
      setEditTarget(null);
      editForm.resetFields();
      refetch();
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Error", text: err?.data?.error || "Failed to update." });
    }
  };

  const handleChangeHead = async (values: any) => {
    try {
      await changeHead({ id: changeHeadTarget._id, headId: values.headId }).unwrap();
      Swal.fire({ icon: "success", title: "Group head updated", timer: 1500, showConfirmButton: false });
      setChangeHeadTarget(null);
      headForm.resetFields();
      refetch();
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Error", text: err?.data?.error || "Failed to change head." });
    }
  };

  const handleAddMembers = async (values: any) => {
    try {
      await addMembers({ id: addMembersTarget._id, memberIds: values.memberIds }).unwrap();
      Swal.fire({ icon: "success", title: "Members added", timer: 1500, showConfirmButton: false });
      setAddMembersTarget(null);
      membersForm.resetFields();
      refetch();
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Error", text: err?.data?.error || "Failed to add members." });
    }
  };

  const handleRemoveMember = async (divisionId: string, memberId: string) => {
    try {
      await removeMember({ id: divisionId, memberId }).unwrap();
      Swal.fire({ icon: "success", title: "Member removed", timer: 1500, showConfirmButton: false });
      refetch();
      if (detailTarget?._id === divisionId) {
        const updated = divisions.find((d) => d._id === divisionId);
        setDetailTarget(updated ? { ...updated, members: updated.members.filter((m: any) => m._id !== memberId) } : null);
      }
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Error", text: err?.data?.error || "Failed to remove member." });
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Sub-division?",
      text: "This sub-division will be permanently removed. This cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      confirmButtonColor: "#d33",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteDivision(id).unwrap();
      Swal.fire({ icon: "success", title: "Deleted", timer: 1500, showConfirmButton: false });
      refetch();
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Error", text: err?.data?.error || "Failed to delete." });
    }
  };

  const pageHeader = (
    <div className="subdivisions-page-root flex flex-col">
      {/* ── BREADCRUMB ── */}
      <div className="px-4 pt-3 pb-1 border-b border-gray-100 bg-white">
        <Breadcrumb
          items={[
            { href: "#", title: <><HomeOutlined /><span>Home</span></> },
            { title: "Personal" },
            { title: <span className="text-green-700 font-medium">Sub-divisions</span> },
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
            <h1 className="text-sm font-semibold text-gray-800 leading-tight truncate">Sub-divisions</h1>
            <p className="text-[11px] text-gray-500 leading-tight">
              {(employee as any)?.entity?.name || "Your entity"} &mdash; Manage working groups and members
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-md px-2.5 py-1">
            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            <span className="text-[11px] font-semibold text-green-800">{divisions.length}</span>
            <span className="text-[10px] text-green-700">Total</span>
          </div>
          <Button icon={<ReloadOutlined />} onClick={refetch} size="small">Refresh</Button>
          {employee?.is_head && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateOpen(true)}
              size="small"
              className="!bg-[#0D4A2A] hover:!bg-[#0a3a21] !border-none"
            >
              New Sub-division
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  if (!employee?.is_head) {
    return (
      <>
        {pageHeader}
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 bg-gray-50 flex-1" style={{ minHeight: "calc(100vh - 140px)" }}>
          <TeamOutlined className="text-5xl mb-4" />
          <p className="text-lg font-semibold">Access Restricted</p>
          <p className="text-sm">Only department heads can manage sub-divisions.</p>
        </div>
        <style>{`.subdivisions-page-root { display: contents; }`}</style>
      </>
    );
  }

  return (
    <>
      {pageHeader}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50" style={{ minHeight: "calc(100vh - 140px)" }}>
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spin />
          </div>
        ) : divisions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <TeamOutlined className="text-5xl text-gray-300 mb-4" />
            <p className="text-base font-semibold text-gray-600">No sub-divisions yet</p>
            <p className="text-sm text-gray-400 mb-6">Create your first working group to get started.</p>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateOpen(true)}
              className="!bg-[#0D4A2A] !border-none"
            >
              Create Sub-division
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {divisions.map((div: any) => (
              <div
                key={div._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="bg-[#0D4A2A] px-5 py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-bold text-sm leading-tight">{div.name}</h3>
                      {div.description && (
                        <p className="text-green-300/80 text-[11px] mt-0.5 line-clamp-1">{div.description}</p>
                      )}
                    </div>
                    <Badge count={div.members?.length || 0} color="#16a34a" showZero>
                      <TeamOutlined className="text-white text-base" />
                    </Badge>
                  </div>
                </div>

                <div className="px-5 py-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Avatar size={30} className="!bg-amber-500 flex-shrink-0 text-[11px] font-bold">
                      {initials(div.head)}
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider leading-none mb-0.5">
                        Group Head
                      </p>
                      <p className="text-xs font-semibold text-gray-800 truncate">{fullName(div.head)}</p>
                    </div>
                    <CrownOutlined className="text-amber-500 ml-auto flex-shrink-0" />
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Members</p>
                    <div className="flex flex-wrap gap-1">
                      {div.members?.slice(0, 5).map((m: any) => (
                        <Tag key={m._id} className="!text-[10px] !px-1.5 !py-0 !rounded-full !border-gray-200">
                          {initials(m)}
                        </Tag>
                      ))}
                      {div.members?.length > 5 && (
                        <Tag className="!text-[10px] !px-1.5 !py-0 !rounded-full !bg-gray-100 !border-gray-200 !text-gray-500">
                          +{div.members.length - 5}
                        </Tag>
                      )}
                      {(!div.members || div.members.length === 0) && (
                        <span className="text-[11px] text-gray-400 italic">No members yet</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-4 flex items-center gap-2 border-t border-gray-100 pt-3">
                  <Button
                    size="small"
                    icon={<TeamOutlined />}
                    onClick={() => setDetailTarget(div)}
                    className="flex-1 rounded-lg text-[11px]"
                  >
                    Manage
                  </Button>
                  <Tooltip title="Edit details">
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditTarget(div);
                        editForm.setFieldsValue({ name: div.name, description: div.description });
                      }}
                      className="rounded-lg"
                    />
                  </Tooltip>
                  <Tooltip title="Delete">
                    <Button
                      size="small"
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => handleDelete(div._id)}
                      className="rounded-lg"
                    />
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onCancel={() => { setCreateOpen(false); createForm.resetFields(); }}
        title={<span className="font-bold text-[#0D4A2A]">Create Sub-division</span>}
        footer={null}
        width={520}
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreate} className="mt-4">
          <Form.Item name="name" label="Group Name" rules={[{ required: true, message: "Group name is required." }]}>
            <Input placeholder="e.g. Mining & Quarry Unit" className="rounded-lg" />
          </Form.Item>
          <Form.Item name="description" label="Description (optional)">
            <Input.TextArea rows={2} placeholder="Brief description of this group's function" className="rounded-lg" />
          </Form.Item>
          <Form.Item name="headId" label="Group Head" rules={[{ required: true, message: "Please select a group head." }]}>
            <Select
              showSearch
              placeholder="Select group head"
              filterOption={(input, option) =>
                String(option?.children || "").toLowerCase().includes(input.toLowerCase())
              }
              className="rounded-lg"
            >
              {allStaff.map((s: any) => (
                <Option key={s._id} value={s._id}>
                  {fullName(s)} — {s.grade || s.staff_id}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="memberIds" label="Initial Members (optional)">
            <Select
              mode="multiple"
              showSearch
              placeholder="Select members"
              filterOption={(input, option) =>
                String(option?.children || "").toLowerCase().includes(input.toLowerCase())
              }
            >
              {allStaff.map((s: any) => (
                <Option key={s._id} value={s._id}>
                  {fullName(s)} — {s.grade || s.staff_id}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={() => { setCreateOpen(false); createForm.resetFields(); }}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={creating}
              className="!bg-[#0D4A2A] !border-none"
            >
              Create
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editTarget}
        onCancel={() => { setEditTarget(null); editForm.resetFields(); }}
        title={<span className="font-bold text-[#0D4A2A]">Edit Sub-division</span>}
        footer={null}
        width={460}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate} className="mt-4">
          <Form.Item name="name" label="Group Name" rules={[{ required: true }]}>
            <Input className="rounded-lg" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} className="rounded-lg" />
          </Form.Item>
          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={() => { setEditTarget(null); editForm.resetFields(); }}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={updating} className="!bg-[#0D4A2A] !border-none">
              Save
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Change Head Modal */}
      <Modal
        open={!!changeHeadTarget}
        onCancel={() => { setChangeHeadTarget(null); headForm.resetFields(); }}
        title={<span className="font-bold text-[#0D4A2A]">Change Group Head</span>}
        footer={null}
        width={420}
      >
        <Form form={headForm} layout="vertical" onFinish={handleChangeHead} className="mt-4">
          <Form.Item name="headId" label="New Group Head" rules={[{ required: true, message: "Please select new head." }]}>
            <Select
              showSearch
              placeholder="Select new group head"
              filterOption={(input, option) =>
                String(option?.children || "").toLowerCase().includes(input.toLowerCase())
              }
            >
              {(changeHeadTarget?.members || []).map((s: any) => (
                <Option key={s._id} value={s._id}>
                  {fullName(s)} — {s.grade || s.staff_id}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={() => { setChangeHeadTarget(null); headForm.resetFields(); }}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={changingHead} className="!bg-[#0D4A2A] !border-none">
              Confirm
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Add Members Modal */}
      <Modal
        open={!!addMembersTarget}
        onCancel={() => { setAddMembersTarget(null); membersForm.resetFields(); }}
        title={<span className="font-bold text-[#0D4A2A]">Add Members</span>}
        footer={null}
        width={480}
      >
        <Form form={membersForm} layout="vertical" onFinish={handleAddMembers} className="mt-4">
          <Form.Item name="memberIds" label="Select Staff to Add" rules={[{ required: true, message: "Select at least one member." }]}>
            <Select
              mode="multiple"
              showSearch
              placeholder="Search and select staff"
              filterOption={(input, option) =>
                String(option?.children || "").toLowerCase().includes(input.toLowerCase())
              }
            >
              {allStaff
                .filter((s: any) => !(addMembersTarget?.members || []).some((m: any) => m._id === s._id))
                .map((s: any) => (
                  <Option key={s._id} value={s._id}>
                    {fullName(s)} — {s.grade || s.staff_id}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={() => { setAddMembersTarget(null); membersForm.resetFields(); }}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={addingMembers} className="!bg-[#0D4A2A] !border-none">
              Add Members
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Detail / Manage Drawer */}
      <Drawer
        open={!!detailTarget}
        onClose={() => setDetailTarget(null)}
        width={460}
        title={
          <div className="flex items-center gap-2">
            <TeamOutlined className="text-[#0D4A2A]" />
            <span className="font-bold text-gray-800">{detailTarget?.name}</span>
          </div>
        }
        extra={
          <div className="flex gap-2">
            <Tooltip title="Add members">
              <Button
                size="small"
                icon={<UserAddOutlined />}
                onClick={() => { setAddMembersTarget(detailTarget); }}
                className="!text-[#0D4A2A] !border-[#0D4A2A] rounded-lg"
              >
                Add Members
              </Button>
            </Tooltip>
            <Tooltip title="Change head">
              <Button
                size="small"
                icon={<UserSwitchOutlined />}
                onClick={() => { setChangeHeadTarget(detailTarget); }}
                className="rounded-lg"
              >
                Change Head
              </Button>
            </Tooltip>
          </div>
        }
      >
        {detailTarget && (
          <div className="space-y-5">
            {detailTarget.description && (
              <p className="text-sm text-gray-500 bg-gray-50 rounded-xl px-3 py-2">{detailTarget.description}</p>
            )}

            {/* Group Head */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Group Head</p>
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <Avatar size={36} className="!bg-amber-500 font-bold text-sm">
                  {initials(detailTarget.head)}
                </Avatar>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{fullName(detailTarget.head)}</p>
                  <p className="text-[11px] text-gray-500">{detailTarget.head?.grade} · {detailTarget.head?.staff_id}</p>
                </div>
                <CrownOutlined className="text-amber-500 ml-auto text-base" />
              </div>
            </div>

            {/* Members */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Members ({detailTarget.members?.length || 0})
              </p>
              {(!detailTarget.members || detailTarget.members.length === 0) ? (
                <Empty description="No members yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <div className="space-y-2">
                  {detailTarget.members.map((m: any) => {
                    const isHead = String(m._id) === String(detailTarget.head?._id);
                    return (
                      <div
                        key={m._id}
                        className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-xs"
                      >
                        <Avatar size={30} className="!bg-[#0D4A2A]/20 !text-[#0D4A2A] text-[11px] font-bold flex-shrink-0">
                          {initials(m)}
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">{fullName(m)}</p>
                          <p className="text-[10px] text-gray-400 truncate">{m.grade} · {m.staff_id}</p>
                        </div>
                        {isHead && <Tag color="gold" className="!text-[10px]">Head</Tag>}
                        {!isHead && (
                          <Popconfirm
                            title="Remove this member?"
                            onConfirm={() => handleRemoveMember(detailTarget._id, m._id)}
                            okText="Remove"
                            okButtonProps={{ danger: true }}
                          >
                            <Tooltip title="Remove member">
                              <Button size="small" icon={<UserDeleteOutlined />} danger type="text" className="flex-shrink-0" />
                            </Tooltip>
                          </Popconfirm>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
      </div>
      <style>{`.subdivisions-page-root { display: contents; }`}</style>
    </>
  );
}
