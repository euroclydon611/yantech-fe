import React from "react";
import { Modal } from "antd";
import { SafetyCertificateOutlined } from "@ant-design/icons";

interface Props {
  open: boolean;
  permitNumber: string;
}

const PermitSigningProgressModal: React.FC<Props> = ({ open, permitNumber }) => {
  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      maskClosable={false}
      width={400}
      centered
      styles={{
        mask: { backdropFilter: "blur(4px)", backgroundColor: "rgba(0,0,0,0.55)" },
        content: { borderRadius: 16, padding: 0, overflow: "hidden" },
      }}
    >
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 60%, #388e3c 100%)", padding: "22px 28px 18px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <SafetyCertificateOutlined style={{ color: "#fff", fontSize: 20 }} />
        </div>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Signing Permit</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 2 }}>{permitNumber}</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "32px 28px 28px", background: "#fff", textAlign: "center" }}>
        {/* EPA spinning logo */}
        <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 24px" }}>
          {/* outer ring */}
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: "50%",
            border: "3px solid #e5e7eb",
            borderTopColor: "#1b5e20",
            animation: "epa-spin 1s linear infinite",
          }} />
          {/* inner ring slower */}
          <div style={{
            position: "absolute", inset: 8,
            borderRadius: "50%",
            border: "2px solid #f3f4f6",
            borderBottomColor: "#43a047",
            animation: "epa-spin-rev 1.5s linear infinite",
          }} />
          {/* center dot */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#1b5e20", animation: "epa-pulse 1.5s ease-in-out infinite" }} />
          </div>
        </div>

        <style>{`
          @keyframes epa-spin { to { transform: rotate(360deg); } }
          @keyframes epa-spin-rev { to { transform: rotate(-360deg); } }
          @keyframes epa-pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.4); opacity: 0.6; }
          }
          @keyframes epa-dot-bounce {
            0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
            40% { transform: translateY(-6px); opacity: 1; }
          }
        `}</style>

        <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", marginBottom: 8 }}>
          Processing signature...
        </div>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 20, lineHeight: 1.6 }}>
          Generating signed document and uploading<br />to secure storage. This may take a moment.
        </div>

        {/* animated dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              width: 7, height: 7,
              borderRadius: "50%",
              background: "#1b5e20",
              animation: `epa-dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>

        <div style={{ marginTop: 24, padding: "10px 14px", background: "#f0fdf4", borderRadius: 8, border: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>🔒</span>
          <span style={{ fontSize: 11, color: "#166534", lineHeight: 1.5 }}>
            Please do not close this window. The permit is being processed securely.
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default PermitSigningProgressModal;
