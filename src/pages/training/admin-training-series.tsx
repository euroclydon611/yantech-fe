import { useState, useRef } from "react";
import {
  Card, Button, Table, Tag, Modal, Form, Input, InputNumber, Select,
  Upload, Progress, message, Space, Popconfirm, Typography, Tooltip,
} from "antd";
import {
  PlusOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined,
  UploadOutlined, CheckCircleOutlined, LockOutlined,
} from "@ant-design/icons";
import type { VideoEpisode } from "@/redux/features/employee-portal-api/videoApi";
import {
  useAdminListEpisodesQuery,
  useAdminGetPresignedUploadUrlMutation,
  useAdminGetThumbnailPresignedUrlMutation,
  useAdminCreateEpisodeMutation,
  useAdminUpdateEpisodeMutation,
  useAdminDeleteEpisodeMutation,
} from "@/redux/features/revenue/adminVideoApi";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const { TextArea } = Input;

type UploadState = { progress: number; status: "idle" | "uploading" | "done" | "error" };

async function uploadToS3(presignedUrl: string, file: File, onProgress: (pct: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    });
    xhr.addEventListener("load", () => (xhr.status < 300 ? resolve() : reject(new Error(`S3 upload failed: ${xhr.status}`))));
    xhr.addEventListener("error", () => reject(new Error("S3 upload network error")));
    xhr.open("PUT", presignedUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
}

function formatDuration(seconds?: number): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AdminTrainingSeriesPage() {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<VideoEpisode | null>(null);
  const [saving, setSaving] = useState(false);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [videoUpload, setVideoUpload] = useState<UploadState>({ progress: 0, status: "idle" });
  const [thumbUpload, setThumbUpload] = useState<UploadState>({ progress: 0, status: "idle" });

  const [pendingVideoMeta, setPendingVideoMeta] = useState<{ s3Key: string; playbackUrl: string } | null>(null);
  const [pendingThumbMeta, setPendingThumbMeta] = useState<{ s3Key: string; thumbnailUrl: string } | null>(null);

  const { data, isLoading, refetch } = useAdminListEpisodesQuery({});
  const episodes: VideoEpisode[] = data?.data || [];

  const [getPresignedUrl] = useAdminGetPresignedUploadUrlMutation();
  const [getThumbnailPresignedUrl] = useAdminGetThumbnailPresignedUrlMutation();
  const [createEpisode] = useAdminCreateEpisodeMutation();
  const [updateEpisode] = useAdminUpdateEpisodeMutation();
  const [deleteEpisode] = useAdminDeleteEpisodeMutation();

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setVideoFile(null);
    setThumbFile(null);
    setPendingVideoMeta(null);
    setPendingThumbMeta(null);
    setVideoUpload({ progress: 0, status: "idle" });
    setThumbUpload({ progress: 0, status: "idle" });
    setModalOpen(true);
  };

  const openEdit = (ep: VideoEpisode) => {
    setEditing(ep);
    form.setFieldsValue({
      title: ep.title,
      description: ep.description,
      episodeNumber: ep.episodeNumber,
      duration: ep.duration,
      status: ep.status,
    });
    setVideoFile(null);
    setThumbFile(null);
    setPendingVideoMeta(null);
    setPendingThumbMeta(null);
    setVideoUpload({ progress: 0, status: "idle" });
    setThumbUpload({ progress: 0, status: "idle" });
    setModalOpen(true);
  };

  const handleVideoSelect = (file: File) => {
    setVideoFile(file);
    setPendingVideoMeta(null);
    return false; // prevent ant Upload auto-upload
  };

  const handleThumbSelect = (file: File) => {
    setThumbFile(file);
    setPendingThumbMeta(null);
    return false;
  };

  const uploadVideoToS3 = async (epNum: number) => {
    if (!videoFile) return null;
    setVideoUpload({ progress: 0, status: "uploading" });
    try {
      const res = await getPresignedUrl({
        filename: videoFile.name,
        contentType: videoFile.type || "video/mp4",
        episodeNumber: epNum,
      }).unwrap();
      await uploadToS3(res.presignedUrl, videoFile, (pct) =>
        setVideoUpload({ progress: pct, status: "uploading" })
      );
      setVideoUpload({ progress: 100, status: "done" });
      setPendingVideoMeta({ s3Key: res.s3Key, playbackUrl: res.playbackUrl });
      return { s3Key: res.s3Key, playbackUrl: res.playbackUrl };
    } catch (err: any) {
      setVideoUpload({ progress: 0, status: "error" });
      throw err;
    }
  };

  const uploadThumbToS3 = async (epNum: number) => {
    if (!thumbFile) return null;
    setThumbUpload({ progress: 0, status: "uploading" });
    try {
      const res = await getThumbnailPresignedUrl({
        filename: thumbFile.name,
        contentType: thumbFile.type || "image/jpeg",
        episodeNumber: epNum,
      }).unwrap();
      await uploadToS3(res.presignedUrl, thumbFile, (pct) =>
        setThumbUpload({ progress: pct, status: "uploading" })
      );
      setThumbUpload({ progress: 100, status: "done" });
      setPendingThumbMeta({ s3Key: res.s3Key, thumbnailUrl: res.thumbnailUrl });
      return { s3Key: res.s3Key, thumbnailUrl: res.thumbnailUrl };
    } catch (err: any) {
      setThumbUpload({ progress: 0, status: "error" });
      throw err;
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const [videoMeta, thumbMeta] = await Promise.all([
        videoFile ? uploadVideoToS3(values.episodeNumber) : Promise.resolve(null),
        thumbFile ? uploadThumbToS3(values.episodeNumber) : Promise.resolve(null),
      ]);

      const payload: Partial<VideoEpisode> = {
        title: values.title,
        description: values.description,
        episodeNumber: values.episodeNumber,
        duration: values.duration,
        status: values.status,
        ...(videoMeta ? { s3Key: videoMeta.s3Key, cloudfrontUrl: videoMeta.playbackUrl } : {}),
        ...(thumbMeta ? { thumbnailS3Key: thumbMeta.s3Key, thumbnailUrl: thumbMeta.thumbnailUrl } : {}),
      };

      if (editing) {
        await updateEpisode({ id: editing._id, ...payload }).unwrap();
        message.success("Episode updated");
      } else {
        await createEpisode(payload).unwrap();
        message.success("Episode created");
      }

      setModalOpen(false);
    } catch (err: any) {
      if (err?.data?.message) message.error(err.data.message);
      else if (err?.message) message.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEpisode(id).unwrap();
      message.success("Episode deleted");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to delete");
    }
  };

  const columns = [
    {
      title: "EP",
      dataIndex: "episodeNumber",
      width: 50,
      render: (n: number) => <Text strong>#{n}</Text>,
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (t: string, ep: VideoEpisode) => (
        <div>
          <Text strong>{t}</Text>
          {ep.description && (
            <p className="text-xs text-gray-400 m-0 line-clamp-1">{ep.description}</p>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 110,
      render: (s: string) =>
        s === "published" ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>Published</Tag>
        ) : (
          <Tag color="default" icon={<LockOutlined />}>Coming Soon</Tag>
        ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      width: 80,
      render: (d?: number) => <Text className="text-xs">{formatDuration(d) || "—"}</Text>,
    },
    {
      title: "Published",
      dataIndex: "publishedAt",
      width: 110,
      render: (d?: string) => (
        <Text className="text-xs">{d ? dayjs(d).format("DD MMM YYYY") : "—"}</Text>
      ),
    },
    {
      title: "Notified",
      dataIndex: "notificationSent",
      width: 80,
      render: (b: boolean) => (
        <Tag color={b ? "green" : "default"}>{b ? "Yes" : "No"}</Tag>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 90,
      render: (_: any, ep: VideoEpisode) => (
        <Space size={4}>
          <Tooltip title="Edit">
            <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(ep)} />
          </Tooltip>
          <Popconfirm
            title="Delete this episode?"
            onConfirm={() => handleDelete(ep._id)}
            okType="danger"
          >
            <Tooltip title="Delete">
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
            style={{ background: "linear-gradient(135deg, #006400, #15803d)" }}
          >
            <PlayCircleOutlined style={{ fontSize: 20, color: "#fbbf24" }} />
          </div>
          <div>
            <Title level={4} className="!mb-0 !font-bold">Training Series Management</Title>
            <Text className="text-gray-500 text-xs">Upload and manage staff training episodes</Text>
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={openCreate}
          className="!bg-green-700 !border-green-700 hover:!bg-green-600 shadow-sm w-full sm:w-auto"
        >
          New Episode
        </Button>
      </div>

      <Card className="shadow-sm border-gray-100 overflow-hidden" styles={{ body: { padding: 0 } }}>
        <Table
          dataSource={episodes}
          columns={columns}
          rowKey="_id"
          loading={isLoading}
          size="middle"
          scroll={{ x: 800 }}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            className: "px-4" 
          }}
        />
      </Card>

      {/* Create / Edit modal */}
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        title={
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <div className="p-1.5 bg-green-50 rounded-lg">
              <PlusOutlined className="text-green-700" />
            </div>
            <span className="font-bold text-gray-800">
              {editing ? `Edit Episode #${editing.episodeNumber}` : "Create New Episode"}
            </span>
          </div>
        }
        onOk={handleSave}
        okText={saving ? "Saving..." : editing ? "Save Changes" : "Create Episode"}
        okButtonProps={{ 
          size: "large", 
          className: "!bg-green-700 !border-green-700 hover:!bg-green-600 px-8 font-bold" 
        }}
        cancelButtonProps={{ size: "large" }}
        confirmLoading={saving}
        width={650}
        destroyOnClose
        centered
        maskClosable={false}
      >
        <Form 
          form={form} 
          layout="vertical" 
          size="middle" 
          className="mt-6 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar"
        >
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item name="episodeNumber" label="Episode Number" rules={[{ required: true }]}>
              <InputNumber min={1} className="w-full" disabled={!!editing} />
            </Form.Item>
            <Form.Item name="duration" label="Duration (seconds)">
              <InputNumber min={1} className="w-full" placeholder="e.g. 3600" />
            </Form.Item>
          </div>

          <Form.Item name="title" label="Title" rules={[{ required: true, message: "Title is required" }]}>
            <Input placeholder="Episode title" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Brief description of this episode..." />
          </Form.Item>

          <Form.Item name="status" label="Status" initialValue="coming_soon" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "coming_soon", label: "Coming Soon (not yet visible to staff)" },
                { value: "published", label: "Published (visible + sends notifications)" },
              ]}
            />
          </Form.Item>

          {/* Video upload */}
          <Form.Item label="Video File (MP4)">
            <Upload
              accept="video/*"
              maxCount={1}
              beforeUpload={handleVideoSelect}
              onRemove={() => { setVideoFile(null); setPendingVideoMeta(null); }}
              fileList={videoFile ? [{ uid: "-1", name: videoFile.name, status: "done" }] : []}
            >
              <Button icon={<UploadOutlined />} size="small">
                {editing?.s3Key ? "Replace Video" : "Select Video"}
              </Button>
            </Upload>
            {videoFile && videoUpload.status !== "idle" && (
              <Progress
                percent={videoUpload.progress}
                status={videoUpload.status === "error" ? "exception" : videoUpload.status === "done" ? "success" : "active"}
                size="small"
                className="mt-1"
              />
            )}
            {editing?.cloudfrontUrl && !videoFile && (
              <p className="text-xs text-green-600 mt-1">✓ Video already uploaded</p>
            )}
          </Form.Item>

          {/* Thumbnail upload */}
          <Form.Item label="Thumbnail Image (optional)">
            <Upload
              accept="image/*"
              maxCount={1}
              beforeUpload={handleThumbSelect}
              onRemove={() => { setThumbFile(null); setPendingThumbMeta(null); }}
              fileList={thumbFile ? [{ uid: "-1", name: thumbFile.name, status: "done" }] : []}
            >
              <Button icon={<UploadOutlined />} size="small">
                {editing?.thumbnailS3Key ? "Replace Thumbnail" : "Select Thumbnail"}
              </Button>
            </Upload>
            {thumbFile && thumbUpload.status !== "idle" && (
              <Progress
                percent={thumbUpload.progress}
                status={thumbUpload.status === "error" ? "exception" : thumbUpload.status === "done" ? "success" : "active"}
                size="small"
                className="mt-1"
              />
            )}
            {editing?.thumbnailUrl && !thumbFile && (
              <div className="mt-1">
                <img src={editing.thumbnailUrl} alt="thumb" className="h-12 rounded border border-gray-200" />
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
