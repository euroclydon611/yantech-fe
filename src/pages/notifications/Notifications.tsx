import { useState, useMemo } from "react";
import {
  Card,
  Tabs,
  List,
  Typography,
  Button,
  Flex,
  Badge,
  Empty,
  Modal,
  Popconfirm,
  Space,
} from "antd";
import {
  BellOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  MailOutlined,
  MessageOutlined,
  ReadOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import {
  useNotificationListQuery,
  useReadNotificationMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} from "../../redux/features/users/notificationApi";
import { formatDistanceToNow } from "date-fns";
import Loader from "../../components/Loader";

const { Title, Text, Paragraph } = Typography;

// Helper to get styled AntD icons (No changes here)
const getNotificationIcon = (message: string) => {
  const lowerCaseMessage = message.toLowerCase();
  const iconStyle = { fontSize: 24, flexShrink: 0 };

  if (
    lowerCaseMessage.includes("approved") ||
    lowerCaseMessage.includes("finalized")
  ) {
    return <CheckCircleOutlined style={{ ...iconStyle, color: "#52c41a" }} />;
  }
  if (lowerCaseMessage.includes("project")) {
    return <MessageOutlined style={{ ...iconStyle, color: "#1677ff" }} />;
  }
  if (lowerCaseMessage.includes("invoice")) {
    return <MailOutlined style={{ ...iconStyle, color: "#722ed1" }} />;
  }
  if (
    lowerCaseMessage.includes("goods") ||
    lowerCaseMessage.includes("purchase")
  ) {
    return <ShoppingOutlined style={{ ...iconStyle, color: "#eb2f96" }} />;
  }
  return <MailOutlined style={{ ...iconStyle, color: "#8c8c8c" }} />;
};


const Notifications = () => {
  const {
    data: notificationData,
    isLoading,
    refetch,
  } = useNotificationListQuery({});
  const [readNotification] = useReadNotificationMutation();
  const [markAllAsRead, { isLoading: isMarkingAllRead }] =
    useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const [activeTab, setActiveTab] = useState("unread");
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const { unreadCount, readMessages, unreadMessages } = useMemo(() => {
    const unread = notificationData?.data?.unread || [];
    const read = notificationData?.data?.read || [];
    return {
      unreadCount: unread.length,
      unreadMessages: unread,
      readMessages: read,
    };
  }, [notificationData]);

  const handleReadNotification = async (notificationId: string) => {
    await readNotification({ id: notificationId }).unwrap();
    refetch();
  };
  const handleMarkAllRead = async () => {
    if (unreadCount > 0) {
      await markAllAsRead({}).unwrap();
      refetch();
    }
  };
  const handleDeleteNotification = async (notificationId: string) => {
    await deleteNotification({ id: notificationId }).unwrap();
    refetch();
  };

  const openModal = (notification: any) => {
    setSelectedNotification(notification);
    if (notification.status === "unread") {
      handleReadNotification(notification._id);
    }
  };
  const closeModal = () => setSelectedNotification(null);

  if (isLoading) {
    return <Loader />;
  }
  
  // No changes to the render item logic
  const renderNotificationItem = (item: any) => (
    <List.Item
      style={{ padding: "16px 8px", borderBottom: "1px solid #f0f0f0" }}
    >
      <Flex gap="middle" align="start">
        {getNotificationIcon(item.message)}
        <Flex vertical style={{ width: "100%" }}>
          <Paragraph
            style={{
              marginBottom: 8,
              fontWeight: item.status === "unread" ? 500 : 400,
              cursor: "pointer",
            }}
            onClick={() => openModal(item)}
          >
            {item.message}
          </Paragraph>
          <Text type="secondary" style={{ marginBottom: 12, fontSize: 12 }}>
            {formatDistanceToNow(new Date(item.created_at), {
              addSuffix: true,
            })}
          </Text>
          <Flex gap="middle">
            {item.status === "unread" && (
              <Button
                type="text"
                size="small"
                icon={<ReadOutlined />}
                onClick={() => handleReadNotification(item._id)}
                style={{ padding: 0, height: "auto" }}
              >
                Mark as read
              </Button>
            )}
            <Popconfirm
              title="Delete this notification?"
              description="This action is permanent."
              onConfirm={() => handleDeleteNotification(item._id)}
              okText="Delete"
              cancelText="Cancel"
              // For a delete action, letting AntD's "danger" prop handle the button style is best
              okButtonProps={{ danger: true }} 
            >
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                style={{ padding: 0, height: "auto" }}
              >
                Delete
              </Button>
            </Popconfirm>
          </Flex>
        </Flex>
      </Flex>
    </List.Item>
  );

  const cardTitle = (
    <Flex align="center" gap="middle">
      <BellOutlined style={{ fontSize: 24, color: "#1677ff" }} />
      <Title level={4} style={{ margin: 0 }}>
        Notifications
      </Title>
    </Flex>
  );

  const cardExtra = activeTab === "unread" && unreadCount > 0 && (
    <Button type="link" onClick={handleMarkAllRead} loading={isMarkingAllRead}>
      Mark all as read
    </Button>
  );

  return (
    <>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* --- CHANGE 1: REMOVED complex flexbox styling from Card --- */}
        <Card title={cardTitle} extra={cardExtra}>
          {/* --- CHANGE 2: REMOVED complex flexbox styling from Tabs --- */}
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <Tabs.TabPane
              tab={
                <Space>
                  Unread
                  <Badge count={unreadCount} />
                </Space>
              }
              key="unread"
            >
              {/* --- CHANGE 3: WRAPPED the list in a div with a calculated height --- */}
              <div
                style={{
                  height: 'calc(100vh - 300px)', // Adjust the '300px' value as needed
                  overflowY: 'auto',
                  paddingRight: '12px' // Add padding to prevent scrollbar from overlapping content
                }}
              >
                {unreadMessages.length > 0 ? (
                  <List
                    dataSource={unreadMessages}
                    renderItem={renderNotificationItem}
                  />
                ) : (
                  <Empty
                    description="You're all caught up!"
                    style={{ paddingTop: "4rem" }}
                  />
                )}
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Read" key="read">
               {/* --- Also applied the same wrapper here for consistency --- */}
              <div
                style={{
                  height: 'calc(100vh - 300px)', // Adjust the '300px' value as needed
                  overflowY: 'auto',
                  paddingRight: '12px'
                }}
              >
                {readMessages.length > 0 ? (
                  <List
                    dataSource={readMessages}
                    renderItem={renderNotificationItem}
                  />
                ) : (
                  <Empty
                    description="No read notifications yet."
                    style={{ paddingTop: "4rem" }}
                  />
                )}
              </div>
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </div>

      <Modal
        title="Notification Details"
        open={!!selectedNotification}
        onCancel={closeModal}
        footer={[
          // Use AntD's danger prop for cleaner styling
          <Button key="close" danger onClick={closeModal}>
            Close
          </Button>,
        ]}
      >
        {selectedNotification && (
          <>
            <Paragraph>{selectedNotification.message}</Paragraph>
            <Text type="secondary">
              Received:{" "}
              {formatDistanceToNow(new Date(selectedNotification.created_at), {
                addSuffix: true,
              })}
            </Text>
          </>
        )}
      </Modal>
    </>
  );
};

export default Notifications;