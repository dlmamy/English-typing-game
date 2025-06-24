import React from "react";

function RewardModal({ open, onClose, score }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{ background: "#fff", padding: 40, borderRadius: 10, textAlign: "center" }}>
        <h2>奖励！</h2>
        <p>本轮得分：{score}</p>
        <button onClick={onClose}>关闭</button>
      </div>
    </div>
  );
}

export default RewardModal; 