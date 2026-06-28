import { useState, Fragment } from "react";
import Loader from "../components/Loader";
import {
  useEmployeeNotificationListQuery,
  useReadEmployeeNotificationMutation,
} from "../redux/features/employee-portal-api/notificationApi";
import {
  MdOutlineMarkEmailUnread,
  MdOutlineMarkEmailRead,
  MdNotificationsActive,
} from "react-icons/md";
import { formatDistanceToNow } from "date-fns";
import { Dialog, Transition } from "@headlessui/react";
import useNotifications from "@/hooks/useNotification";

const Notifications = () => {
  const {
    data: notificationData,
    isLoading: notificationLoading,
    refetch,
  } = useEmployeeNotificationListQuery({});

  // const { enableNotifications, fcmToken } = useNotifications();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isUnreadView, setIsUnreadView] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const [readNotification] = useReadEmployeeNotificationMutation();

  const handleReadNotification = async (notification: any) => {
    await readNotification({ id: notification });
    refetch();
  };

  const openNotificationModal = (notification: any) => {
    setSelectedNotification(notification);
    setIsOpen(true);
  };

  const closeNotificationModal = async () => {
    if (selectedNotification?.status === "unread") {
      await handleReadNotification(selectedNotification._id);
    }
    setIsOpen(false);
  };

  if (notificationLoading) {
    return <Loader />;
  }

  const messagesToShow = isUnreadView
    ? notificationData?.data?.unread
    : notificationData?.data?.read;

  return (
    <>
      <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-md">
        <section className="mb-4">
          <h3 className="text-2xl font-semibold text-gray-800">
            Notifications
          </h3>
        </section>

        <section className="flex gap-4 mb-6">
          <button
            onClick={() => setIsUnreadView(true)}
            className={`${
              isUnreadView
                ? "text-green-700 border-b-4 border-green-700"
                : "text-gray-500"
            } text-lg font-semibold pb-2 transition-colors duration-300`}
          >
            Unread
          </button>
          <button
            onClick={() => setIsUnreadView(false)}
            className={`${
              !isUnreadView
                ? "text-green-700 border-b-4 border-green-700"
                : "text-gray-500"
            } text-lg font-semibold pb-2 transition-colors duration-300`}
          >
            Read
          </button>
        </section>

        <section className="space-y-4">
          {messagesToShow && messagesToShow.length > 0 ? (
            messagesToShow.map((notification: any, i: number) => (
              <div
                key={notification?._id}
                className={`p-4 rounded-lg shadow-sm border ${
                  notification?.status === "unread"
                    ? "bg-gray-50 font-medium"
                    : "bg-white"
                } flex justify-between items-center hover:shadow-md transition-shadow duration-300 cursor-pointer`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => openNotificationModal(notification)}
              >
                <div className="flex flex-col gap-1">
                  <p className="text-base text-gray-700 line-clamp-2">
                    {notification?.message}
                  </p>
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(notification?.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                {hoveredIndex === i && (
                  <div className="flex gap-3 items-center">
                    {notification?.status === "unread" && (
                      <MdOutlineMarkEmailRead
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReadNotification(notification._id);
                        }}
                        size={24}
                        title="Mark as read"
                        className="text-gray-500 hover:text-green-600 transition-colors duration-300 cursor-pointer"
                      />
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No notifications available.
            </p>
          )}
        </section>
      </div>

      {/* Notification Popup */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={closeNotificationModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Notification Details
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {selectedNotification?.message}
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={closeNotificationModal}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Notifications;
