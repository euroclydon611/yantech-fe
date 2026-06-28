import React, { useState } from "react";
import { useIdleTimer } from "react-idle-timer";
import { Modal, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useEmployeeLogoutMutation } from "../../../redux/features/employee-portal-api/authApi";

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const COUNTDOWN_DURATION = 60 * 1000;

export const SessionTimeout = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logout] = useEmployeeLogoutMutation();

  const handleLogout = async () => {
    setIsModalOpen(false);
    try {
      await logout({}).unwrap();

      navigate("/employee");
    } catch (error) {
      console.error("Failed to log out:", error);
      navigate("/employee");
    }
  };

  const handleStayLoggedIn = () => {
    setIsModalOpen(false);

    idleTimer.reset();
  };

  const onIdle = () => {
    setIsModalOpen(true);
  };

  const idleTimer = useIdleTimer({
    onIdle,
    timeout: INACTIVITY_TIMEOUT,
    throttle: 500,
  });

  // timer can remain paused while the modal is open.
  const modalCountdownTimer = useIdleTimer({
    timeout: COUNTDOWN_DURATION,
    onIdle: handleLogout,
    onActive: handleStayLoggedIn,
    disabled: !isModalOpen,
  });

  return (
    <Modal
      title="Session Timeout Warning"
      open={isModalOpen}
      onOk={handleStayLoggedIn}
      onCancel={handleLogout}
      closable={false}
      keyboard={false}
      footer={[
        <Button key="logout" type="default" onClick={handleLogout}>
          Log Out Now
        </Button>,
        <Button
          key="stay"
          type="primary"
          onClick={handleStayLoggedIn}
          className="!bg-[#1A7544] hover:!bg-[#1A7544]"
        >
          Stay Logged In (
          {Math.ceil(modalCountdownTimer.getRemainingTime() / 1000)}s)
        </Button>,
      ]}
    >
      <p>
        You've been inactive for a while. For your security, you will be
        automatically logged out in a moment.
      </p>
    </Modal>
  );
};
