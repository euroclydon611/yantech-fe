import { useState } from "react";
import { Tabs, Empty, Spin, Badge, Popover } from "antd";
import {
  useEmployeeNotificationListQuery,
  useReadEmployeeNotificationMutation,
} from "../../redux/features/employee-portal-api/notificationApi";
import {
  Bell,
  CheckCircle,
  Clock,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import PageLayout from "../components/layout/PageLayout";

interface Notification {
  _id: string;
  message: string;
  created_at: string;
  status: "read" | "unread";
  type?: string;
  resource_id?: string;
}

const NotificationHub = () => {
  const [activeTab, setActiveTab] = useState<"unread" | "read">("unread");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const {
    data: notificationData,
    isLoading,
    isFetching,
    refetch,
  } = useEmployeeNotificationListQuery({});

  const [readNotification] = useReadEmployeeNotificationMutation();

  const unreadNotifications = notificationData?.data?.unread || [];
  const readNotifications = notificationData?.data?.read || [];
  const unreadCount = notificationData?.stats?.unreadCount || 0;

  const handleMarkAsRead = async (e: any, notificationId: string) => {
    e.stopPropagation();
    try {
      setIsTransitioning(true);
      await readNotification({ id: notificationId });
      await refetch();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    } finally {
      setIsTransitioning(false);
    }
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gray-100 p-6 rounded-full mb-6">
        <Bell className="w-12 h-12 text-gray-400" />
      </div>
      <p className="text-gray-600 text-lg font-medium mb-2">
        {activeTab === "unread"
          ? "No unread notifications"
          : "No read notifications"}
      </p>
      <p className="text-gray-500 text-sm text-center max-w-sm">
        {activeTab === "unread"
          ? "You're all caught up! Check back later for new updates."
          : "Your read notifications appear here."}
      </p>
    </div>
  );

  const renderNotificationCard = (notification: Notification) => (
    <div
      key={notification._id}
      className={`group relative p-4 rounded-lg border transition-all duration-300 hover:shadow-md hover:border-green-400 ${
        notification.status === "unread"
          ? "bg-gradient-to-r from-green-50 to-white border-green-200 shadow-sm"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Status Indicator */}
        <div className="flex-shrink-0 pt-1">
          {notification.status === "unread" ? (
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm"></div>
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm ${
              notification.status === "unread"
                ? "font-semibold text-gray-900"
                : "font-normal text-gray-800"
            } leading-relaxed break-words`}
          >
            {notification.message}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(notification.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>

        {/* Actions */}
        {notification.status === "unread" && (
          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => handleMarkAsRead(e, notification._id)}
              disabled={isTransitioning}
              className="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Mark as read"
            >
              <CheckCircle className="w-4 h-4 text-green-600" />
            </button>
          </div>
        )}
      </div>

    </div>
  );

  const tabItems = [
    {
      key: "unread",
      label: (
        <span className="flex items-center gap-2">
          <span>Inbox</span>
          {unreadCount > 0 && (
            <Badge
              count={unreadCount}
              style={{
                backgroundColor: "#10b981",
                fontSize: "11px",
                padding: "0 6px",
              }}
            />
          )}
        </span>
      ),
      children: isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spin size="large" />
        </div>
      ) : unreadNotifications.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="space-y-3 p-4 md:p-6">
          {unreadNotifications.map((notification) =>
            renderNotificationCard(notification)
          )}
        </div>
      ),
    },
    {
      key: "read",
      label: (
        <span className="flex items-center gap-2">
          <span>Archive</span>
          <span className="text-xs text-gray-500">
            ({readNotifications.length})
          </span>
        </span>
      ),
      children: isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spin size="large" />
        </div>
      ) : readNotifications.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="space-y-3 p-4 md:p-6">
          {readNotifications.map((notification) =>
            renderNotificationCard(notification)
          )}
        </div>
      ),
    },
  ];

  return (
    <PageLayout
      title="Notifications"
      description="Stay updated with all your important alerts and messages"
    >
      <div className="p-2 md:p-4 lg:p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[70vh]">
          {/* Stats Header */}
          <div className="px-4 md:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white flex-shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-100 rounded-lg">
                  <Bell className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Notification Center</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {unreadCount} unread notification
                    {unreadCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              {isFetching && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Spin size="small" />
                  <span>Refreshing...</span>
                </div>
              )}
            </div>
          </div>

          {/* Scrollable Tabs Container */}
          <div className="px-0 flex-1 overflow-y-auto">
            <Tabs
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key as "unread" | "read")}
              items={tabItems}
              tabBarStyle={{
                padding: "0 16px",
                marginBottom: 0,
                borderBottom: "1px solid #f0f0f0",
                position: "sticky",
                top: 0,
                backgroundColor: "white",
                zIndex: 10,
              }}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            💡 <strong>Tip:</strong> Unread notifications stay in your Inbox.
            Once you mark them as read, they move to your Archive.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotificationHub;